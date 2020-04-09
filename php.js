import {Request as NuxRequest} from "https://raw.githubusercontent.com/nuxodin/nux_app/master/request.js";

/**
 * Create a instance
 * @param src the file/directory path.
 *            Note that if `src` is a directory it will copy everything inside
 *            of this directory, not the entire directory itself
 * @param dest the destination path. Note that if `src` is a file, `dest` cannot
 *             be a directory
 * @param options
 */
export default class likePHP {
    constructor(options){
        this.documentRoot = options.documentRoot;
    }
    run(denoRequest){
        return new Promise((resolve, reject) => {
            var req = new NuxRequest(denoRequest);
            //await req.initSession();
            const worker = new Worker(import.meta.url + '/../worker.js', {type:'module'});
            worker.postMessage({
                documentRoot:this.documentRoot,
                request:req,
            });
            worker.onmessage = function(e) {
                e.data.headers.forEach(function(header){
                    req.header[header[0]] = header[1];
                });
                req.respond(e.data);
                resolve()
            }
        })
    }
}
