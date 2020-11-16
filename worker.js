var global = globalThis;

global.time = function(){
    return Math.round(Date.now()/1000);
}

global.$_SERVER = {};

var output = '';
global.echo = function(strings, ...values) {
    if (Array.isArray(strings)) {
        strings.forEach((part, i)=>{
            output += part + (values[i]??'');
        });
    } else {
        output += strings;
    }
}

var headers = [['content-type','text/html']];
global.header = function(str){
    headers.push(str.split(/:/));
}

global.sleep = function(seconds){
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}

/*
global.include = async function(path){
    lastReturn = null;
    try {
        await import(path);
    } catch(e) {
        console.log(e);
    }
    return lastReturn;
}
var lastReturn = null;
global.return = function(x){
    lastReturn = x;
    throw '';
}
*/


onmessage = (e)=>{

    const data = e.data;
    const ctx  = data.context;
    global.$_GET    = ctx.in.__get;
    global.$_COOKIE = ctx.cookies;

    $_SERVER['DOCUMENT_ROOT']   = data.documentRoot;
    $_SERVER['HTTP_REFERER']    = ctx.in.headers['referer'];
    $_SERVER['HTTP_USER_AGENT'] = ctx.in.headers['user-agent'];
    $_SERVER['HTTP_HOST']       = ctx.in.headers['host'];
    $_SERVER['REQUEST_URI']     = ctx.in.url;
    $_SERVER['REMOTE_ADDR']     = ctx.in.ip;

    import(e.data.path+'?'+e.data.modified).then( async (e)=>{
        globalThis.postMessage({
            body:output,
            headers:headers,
        });
    });

}