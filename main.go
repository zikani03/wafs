package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
)

var goTemplate = `
package main

import (
	"embed"
	"encoding/base64"
	"syscall/js"
)

//go:embed "assets"
var AssetsFS embed.FS

var done chan struct{}

func main() {
	js.Global().Set("wafs_ReadFileBase64", js.FuncOf(ReadFile))
	js.Global().Set("wafs_ReadFileString", js.FuncOf(ReadFileString))
	<-done
}

// ReadFile returns file content as base64 encoded string or string starting with "error:" on errors
func ReadFile(this js.Value, args []js.Value) interface{} {
	fileName := args[0].String()
	b, err := AssetsFS.ReadFile("assets/" + fileName)
	if err != nil {
		return "error: " + err.Error()
	}
	return base64.StdEncoding.EncodeToString(b)
}

func ReadFileString(this js.Value, args []js.Value) interface{} {
	fileName := args[0].String()
	b, err := AssetsFS.ReadFile("assets/" + fileName)
	if err != nil {
		return "error: " + err.Error()
	}
	return string(b)
}
`

var jsTemplate = `
const go = new Go(); // Defined in wasm_exec.js
const WASM_URL = 'module.wasm'; // TODO: get module name

function addScript(fileName) {
    var sel = document.createElement("script");
    let fileData = wafs_ReadFileString(fileName)
    sel.innerText = fileData;
    document.body.appendChild(sel)
}

function addImg(fileName, parentNode) {
    var sel = document.createElement("img");
    let fileData = wafs_ReadFileBas64(fileName)
    sel.setAttribute("src",  "data:application/octet-stream;base64," + fileData)
    if (parentNode) {
        parentNode.appendChild(sel)
    } else {
        document.body.appendChild(sel)
    }
}

var wasm;
if ('instantiateStreaming' in WebAssembly) {
    WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function (obj) {
        wasm = obj.instance;
        go.run(wasm);
    }).catch(err => {
        console.log(err)
    })
} else {
    fetch(WASM_URL).then(resp =>
        resp.arrayBuffer()
    ).then(bytes =>
        WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
            wasm = obj.instance;
            go.run(wasm);

        })
    ).catch(err => {
        console.log(err)
    })
}
`

// Basically this server does the following
// 1. Receieves a request containing files to process (multi-part request)
// 2. Puts those files into a directory <project>/assets
// 3. Creates a module main.go in <project> directory
// 4. Compiles the module using tinygo to create a wasm module <project.wasm>
// 5. Serves that wasm file back to the user as a download using content-disposition
// 5.1. Alternatively generates a page with instructions on how to use the wasm module.

// Notes: The generated wasm module comes with a javascript file, project.init.js
// that file does the following:
// 1. instantiates the Go wasm module if possible (wasm_exec.js is prepended to the file)
// 2. creates functions on the window object under window.ProjectName = { func: wasmFunc, }
// 3. Errors out if the above is not possible.
// 4. Provides "instantiation hooks" to allow user to do some actions onload and also
// 5. Provides a fetch override hook to allow overriding fetch behavior.
func main() {
	app := fiber.New()

	app.Post("/module", apiGenerateModule)
	app.Static("/", "./public")

	err := app.Listen(":8000")
	if err != nil {
		panic(err)
	}
}

func apiGenerateModule(c *fiber.Ctx) error {
	tmpDir, err := os.MkdirTemp(os.TempDir(), "wafs_")
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	for _, fileHeader := range form.File["files"] {
		err := c.SaveFile(fileHeader, filepath.Join(tmpDir, fileHeader.Filename))
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": err.Error(),
			})
		}
	}
	wafs := NewWAFSGenerator()

	moduleBytes, err := wafs.GenerateFrom(tmpDir, "module.wasm")
	if err != nil {
		panic(err)
	}

	c.Type(".wasm", "utf-8")
	_, err = c.Write(moduleBytes)
	return err
}

type WAFSGenerator struct{}

func NewWAFSGenerator() *WAFSGenerator {
	// TODO: check for go
	// TODO: Check for tiny go
	// TODO: check for other dependecies
	return &WAFSGenerator{}
}

// moveOrCopyFile moves or copies a file from src to dst.
// If src and dst files exist, and are the same, then return success.
// Attempt to move the file using os.Rename if the copyOnly flag is false
// Otherwise, we attempt to create a hard link between the two files.
func moveOrCopyFile(src, dst string) (err error) {
	fmt.Println("Moving from=", src, " to=", dst)
	sfi, err := os.Stat(src)
	if err != nil {
		return err
	}

	dfi, err := os.Stat(dst)
	if err != nil {
		if !os.IsNotExist(err) {
			return err
		}
	} else {
		if os.SameFile(sfi, dfi) {
			return
		}
	}

	if err = os.Link(src, dst); err == nil {
		return
	}
	return err
}

func (wafs *WAFSGenerator) GenerateFrom(directory, targetModule string) ([]byte, error) {

	tmpDir, err := os.MkdirTemp("./data/", "wafs-generated")
	if err != nil {
		return nil, err
	}

	err = os.WriteFile(filepath.Join(tmpDir, "main.go"), []byte(goTemplate), 0777)
	if err != nil {
		return nil, err
	}

	assetsDir := filepath.Join(tmpDir, "assets")

	os.MkdirAll(assetsDir, 0777)

	entries, err := os.ReadDir(directory)
	if err != nil {
		return nil, err
	}

	for _, e := range entries {
		// TODO: use MINIFY to minify the files https://github.com/tdewolff/minify
		err = moveOrCopyFile(filepath.Join(directory, e.Name()), filepath.Join(assetsDir, e.Name()))
		if err != nil {
			return nil, err
		}
	}

	cmd := exec.Command("tinygo", "build", "-o", filepath.Join(tmpDir, targetModule), "-target=wasm", filepath.Join(tmpDir, "main.go"))
	if err := cmd.Run(); err != nil {
		return nil, err
	}

	moduleBytes, err := os.ReadFile(filepath.Join(tmpDir, targetModule))
	if err != nil {
		return nil, err
	}

	return moduleBytes, nil
}
