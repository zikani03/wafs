wafs
====

WAFS is an experiment to enable embedding static assets in Web Assembly modules to enable application developers to package and ship their web applications in one file.

> NOTE: Still experimental, not production ready, YMMV etc..

A Developer would upload their files to this service which then generates a WASM module. Then the developer uses the module somewhat like this

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WAFS</title>
</head>
<body>
    
    <div id="form-wrapper"></div>
    
    <!-- Get this from public/js directory -->
    <script src="js/wasmwebfs.js"></script>

    <script>
        loadWASMModule("/module.wasm").then(function(module) {
            // This reads the form.html file from the wasm module.wasm as a string
            document.getElementById('form-wrapper').innerHTML = module.readFileAsString("form.html")

            // this is a helper function that appends the contents read 
            // from the given file from the module to the document in a <script /> tag
            module.addScript("test.js")
        })
    </script>
</body>
</html>
```

## Prerequisites

- Go 1.19+
- TinyGo 0.28.1+ (we use TinyGo to build the wasm module)

## Building, Running

$
```
$ git clone https://github.com/zikani03/wafs.git

$ cd wafs

$ go build

$ ./wafs

┌───────────────────────────────────────────────────┐ 
 │                   Fiber v2.48.0                   │ 
 │               http://127.0.0.1:8000               │ 
 │       (bound on host 0.0.0.0 and port 8000)       │ 
 │                                                   │ 
 │ Handlers ............. 2  Processes ........... 1 │ 
 │ Prefork ....... Disabled  PID ............. 67152 │ 
 └───────────────────────────────────────────────────┘ 
```

This will start a web server at port 8000

Go to http://localhost:8000 in your browser, if it works you should be greated by a JavaScript `alert` and it should bring uo a basic HTML form which have been loaded from the [public/module.wasm](public/module.wasm) which contains the files in the [testdata/](testdata/) directory.

You can then use the upload functionality to generate your own WASM module which can be loaded with the supplied [script](public/js/wasmwebfs.js)


