wafs
====

WAFS is an experiment to enable embedding static assets in Web Assembly modules to enable application developers to package and ship their web applications in one file.

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