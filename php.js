import {getContext} from "https://raw.githubusercontent.com/nuxodin/nux/master/request/context.js";
import {stat} from "https://raw.githubusercontent.com/nuxodin/nux/master/util/nuxo.js";

export default class likePHP {
    constructor(options){
        this.documentRoot = options.documentRoot;
    }
    run(denoRequest){
        return new Promise(async (resolve, reject) => {
            const ctx = getContext(denoRequest);

            let path = (this.documentRoot + ctx.in.url.pathname).replace(/\?.*/, ''); // todo:security
            console.log(path)
            path = path.replace(/^file:\/\/\//,'');
            let fileInfo = await stat(path);
            if (!fileInfo) {
                path = path+'/index.js';
                fileInfo = await stat(path);
            }
            if (!fileInfo) {
                denoRequest.respond({body:'not found'});
                //ctx.respond({body:'not found'});
                resolve();
                return;
            }

            const workerPath = import.meta.url + '/../worker.js';
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
                path: path,
                modified: fileInfo.modified,
                context,
            });
            worker.onmessage = function(e) {
                /*
                e.data.headers.forEach(function(header){
                    ctx.header[header[0]] = header[1];
                });
                ctx.respond(e.data);
                */
                resolve();
                worker.terminate();
            }
        })
    }
}
