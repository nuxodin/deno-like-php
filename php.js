import {getContext} from "https://raw.githubusercontent.com/nuxodin/nux/master/context/context.js";
import {stat} from "https://raw.githubusercontent.com/nuxodin/nux/master/util/nuxo.js";

export default class likePHP {
    constructor(options){
        this.documentRoot = options.documentRoot;
    }
    run(denoRequest){
        return new Promise(async (resolve, reject) => {
            const ctx = getContext(denoRequest);

            let pathUrl = (this.documentRoot + ctx.in.url.pathname).replace(/\?.*/, ''); // todo:security
            let path = pathUrl.replace(/^file:\/\/\//,'');
            let fileInfo = await stat(path);
            if (fileInfo && fileInfo.isDirectory) {
                path = path+'/index.js';
                pathUrl = pathUrl+'/index.js'; // todo:security
                fileInfo = await stat(path);
            }
            if (!fileInfo) {
                denoRequest.respond({body:'not found'});
                //ctx.respond({body:'not found'});
                resolve();
                return;
            }

            const workerPath = new URL("worker.js", import.meta.url).href;
            const worker = new Worker(workerPath, {type:'module', deno:false});

            worker.addEventListener('error', function(e){
                console.log(e)
            })

            // recreate context
            let context = ctx;
            for (let [name, value] of ctx.in.headers) {
                context.in.headers[name] = value;
            }

            worker.postMessage({
                documentRoot:this.documentRoot,
                path: pathUrl,
                modified: fileInfo.mtime,
                context,
            });
            worker.onmessage = function(e) {
                e.data.headers.forEach(function([name, value]){
                    ctx.out.headers.set(name, value)
                });
                ctx.out.body = e.data.body;
                resolve();
                denoRequest.respond(ctx.out)
                worker.terminate();
            }
        })
    }
}
