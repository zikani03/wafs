// tinygo wasm_exec.js minified
(()=>{if("undefined"!=typeof global);else if("undefined"!=typeof window)window.global=window;else if("undefined"!=typeof self)self.global=self;else throw Error("cannot export Go (neither global, window nor self is defined)");global.require||"undefined"==typeof require||(global.require=require),!global.fs&&global.require&&(global.fs=require("fs"));let e=()=>{let e=Error("not implemented");return e.code="ENOSYS",e};if(!global.fs){let t="";global.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(e,s){t+=n.decode(s);let i=t.lastIndexOf("\n");return -1!=i&&(console.log(t.substr(0,i)),t=t.substr(i+1)),s.length},write(t,s,i,n,r,l){if(0!==i||n!==s.length||null!==r){l(e());return}let o=this.writeSync(t,s);l(null,o)},chmod(t,s,i){i(e())},chown(t,s,i,n){n(e())},close(t,s){s(e())},fchmod(t,s,i){i(e())},fchown(t,s,i,n){n(e())},fstat(t,s){s(e())},fsync(e,t){t(null)},ftruncate(t,s,i){i(e())},lchown(t,s,i,n){n(e())},link(t,s,i){i(e())},lstat(t,s){s(e())},mkdir(t,s,i){i(e())},open(t,s,i,n){n(e())},read(t,s,i,n,r,l){l(e())},readdir(t,s){s(e())},readlink(t,s){s(e())},rename(t,s,i){i(e())},rmdir(t,s){s(e())},stat(t,s){s(e())},symlink(t,s,i){i(e())},truncate(t,s,i){i(e())},unlink(t,s){s(e())},utimes(t,s,i,n){n(e())}}}if(global.process||(global.process={getuid:()=>-1,getgid:()=>-1,geteuid:()=>-1,getegid:()=>-1,getgroups(){throw e()},pid:-1,ppid:-1,umask(){throw e()},cwd(){throw e()},chdir(){throw e()}}),!global.crypto){let s=require("crypto");global.crypto={getRandomValues(e){s.randomFillSync(e)}}}global.performance||(global.performance={now(){let[e,t]=process.hrtime();return 1e3*e+t/1e6}}),global.TextEncoder||(global.TextEncoder=require("util").TextEncoder),global.TextDecoder||(global.TextDecoder=require("util").TextDecoder);let i=new TextEncoder("utf-8"),n=new TextDecoder("utf-8");var r=[];if(global.Go=class{constructor(){this._callbackTimeouts=new Map,this._nextCallbackTimeoutID=1;let e=()=>new DataView(this._inst.exports.memory.buffer),t=(t,s)=>{e().setUint32(t+0,s,!0),e().setUint32(t+4,Math.floor(s/4294967296),!0)},s=t=>{let s=e().getFloat64(t,!0);if(0===s)return;if(!isNaN(s))return s;let i=e().getUint32(t,!0);return this._values[i]},l=(t,s)=>{if("number"==typeof s){if(isNaN(s)){e().setUint32(t+4,2146959360,!0),e().setUint32(t,0,!0);return}if(0===s){e().setUint32(t+4,2146959360,!0),e().setUint32(t,1,!0);return}e().setFloat64(t,s,!0);return}switch(s){case void 0:e().setFloat64(t,0,!0);return;case null:e().setUint32(t+4,2146959360,!0),e().setUint32(t,2,!0);return;case!0:e().setUint32(t+4,2146959360,!0),e().setUint32(t,3,!0);return;case!1:e().setUint32(t+4,2146959360,!0),e().setUint32(t,4,!0);return}let i=this._ids.get(s);void 0===i&&(void 0===(i=this._idPool.pop())&&(i=this._values.length),this._values[i]=s,this._goRefCounts[i]=0,this._ids.set(s,i)),this._goRefCounts[i]++;let n=1;switch(typeof s){case"string":n=2;break;case"symbol":n=3;break;case"function":n=4}e().setUint32(t+4,2146959360|n,!0),e().setUint32(t,i,!0)},o=(e,t,s)=>new Uint8Array(this._inst.exports.memory.buffer,e,t),a=(e,t,i)=>{let n=Array(t);for(let r=0;r<t;r++)n[r]=s(e+8*r);return n},c=(e,t)=>n.decode(new DataView(this._inst.exports.memory.buffer,e,t)),u=Date.now()-performance.now();this.importObject={wasi_snapshot_preview1:{fd_write:function(t,s,i,l){let o=0;if(1==t)for(let a=0;a<i;a++){let c=s+8*a,u=e().getUint32(c+0,!0),$=e().getUint32(c+4,!0);o+=$;for(let d=0;d<$;d++){let f=e().getUint8(u+d);if(13==f);else if(10==f){let h=n.decode(new Uint8Array(r));r=[],console.log(h)}else r.push(f)}}else console.error("invalid file descriptor:",t);return e().setUint32(l,o,!0),0},fd_close:()=>0,fd_fdstat_get:()=>0,fd_seek:()=>0,proc_exit(e){if(global.process)process.exit(e);else throw"trying to exit with code "+e},random_get:(e,t)=>(crypto.getRandomValues(o(e,t)),0)},env:{"runtime.ticks":()=>u+performance.now(),"runtime.sleepTicks":e=>{setTimeout(this._inst.exports.go_scheduler,e)},"syscall/js.finalizeRef"(e){console.error("syscall/js.finalizeRef not implemented")},"syscall/js.stringVal"(e,t,s){let i=c(t,s);l(e,i)},"syscall/js.valueGet"(e,t,i,n){let r=c(i,n),o=s(t),a=Reflect.get(o,r);l(e,a)},"syscall/js.valueSet"(e,t,i,n){let r=s(e),l=c(t,i),o=s(n);Reflect.set(r,l,o)},"syscall/js.valueDelete"(e,t,i){let n=s(e),r=c(t,i);Reflect.deleteProperty(n,r)},"syscall/js.valueIndex"(e,t,i){l(e,Reflect.get(s(t),i))},"syscall/js.valueSetIndex"(e,t,i){Reflect.set(s(e),t,s(i))},"syscall/js.valueCall"(t,i,n,r,o,u,$){let d=s(i),f=c(n,r),h=a(o,u,$);try{let g=Reflect.get(d,f);l(t,Reflect.apply(g,d,h)),e().setUint8(t+8,1)}catch(p){l(t,p),e().setUint8(t+8,0)}},"syscall/js.valueInvoke"(t,i,n,r,o){try{let c=s(i),u=a(n,r,o);l(t,Reflect.apply(c,void 0,u)),e().setUint8(t+8,1)}catch($){l(t,$),e().setUint8(t+8,0)}},"syscall/js.valueNew"(t,i,n,r,o){let c=s(i),u=a(n,r,o);try{l(t,Reflect.construct(c,u)),e().setUint8(t+8,1)}catch($){l(t,$),e().setUint8(t+8,0)}},"syscall/js.valueLength":e=>s(e).length,"syscall/js.valuePrepareString"(e,n){let r=String(s(n)),o=i.encode(r);l(e,o),t(e+8,o.length)},"syscall/js.valueLoadString"(e,t,i,n){let r=s(e);o(t,i,n).set(r)},"syscall/js.valueInstanceOf":(e,t)=>s(e) instanceof s(t),"syscall/js.copyBytesToGo"(i,n,r,l,a){let c=i+4,u=o(n,r),$=s(a);if(!($ instanceof Uint8Array||$ instanceof Uint8ClampedArray)){e().setUint8(c,0);return}let d=$.subarray(0,u.length);u.set(d),t(i,d.length),e().setUint8(c,1)},"syscall/js.copyBytesToJS"(i,n,r,l,a){let c=i+4,u=s(n),$=o(r,l);if(!(u instanceof Uint8Array||u instanceof Uint8ClampedArray)){e().setUint8(c,0);return}let d=$.subarray(0,u.length);u.set(d),t(i,d.length),e().setUint8(c,1)}}}}async run(e){for(this._inst=e,this._values=[NaN,0,null,!0,!1,global,this,],this._goRefCounts=[],this._ids=new Map,this._idPool=[],this.exited=!1,new DataView(this._inst.exports.memory.buffer);;){let t=new Promise(e=>{this._resolveCallbackPromise=()=>{if(this.exited)throw Error("bad callback: Go program has already exited");setTimeout(e,0)}});if(this._inst.exports._start(),this.exited)break;await t}}_resume(){if(this.exited)throw Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(e){let t=this;return function(){let s={id:e,this:this,args:arguments};return t._pendingEvent=s,t._resume(),s.result}}},global.require&&global.require.main===module&&global.process&&global.process.versions&&!global.process.versions.electron){3!=process.argv.length&&(console.error("usage: go_js_wasm_exec [wasm binary] [arguments]"),process.exit(1));let l=new Go;WebAssembly.instantiate(fs.readFileSync(process.argv[2]),l.importObject).then(e=>l.run(e.instance)).catch(e=>{console.error(e),process.exit(1)})}})();


function loadWASMModule(moduleURL) {
    const go = new Go(); // Defined in wasm_exec.js
    const WASM_URL = moduleURL;
    
    let moduleFunctions = {
        readFileAsString: function(name) { 
            return wafs_ReadFileString(name)
        },
        
        readFileAsBytes: function(name) {
            return wafs_ReadFileBase64(name)
        },

        addScript: function(fileName) {
            var sel = document.createElement("script");
            let fileData = wafs_ReadFileString(fileName)
            sel.innerText = fileData;
            document.body.appendChild(sel)
        },

        addImg: function(fileName, parentNode) {
            var sel = document.createElement("img");
            let fileData = wafs_ReadFileBase64(fileName)
            sel.setAttribute("src",  "data:application/octet-stream;base64," + fileData)
            if (parentNode) {
                parentNode.appendChild(sel)
            } else {
                document.body.appendChild(sel)
            }
        }
    }
    
    
    var wasm;
    if ('instantiateStreaming' in WebAssembly) {
        return WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function (obj) {
            wasm = obj.instance;
            go.run(wasm);
        })
        .then(() => moduleFunctions)
        .catch(err => {
            console.log(err)
        })
    } else {
        return fetch(WASM_URL).then(resp =>
            resp.arrayBuffer()
        ).then(bytes =>
            WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
                wasm = obj.instance;
                go.run(wasm);
    
            })
        )
        .then(() => moduleFunctions)
        .catch(err => {
            console.log(err)
        })
    }
    
}