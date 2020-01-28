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

onmessage = async function(e){
    let path = (e.data.documentRoot + e.data.request.url).replace(/\?.*/, '');

    const data = e.data;
    global.$_GET = data.request.__get;
    global.$_COOKIE = data.request.cookie;

    $_SERVER['DOCUMENT_ROOT']   = data.documentRoot;
    $_SERVER['HTTP_REFERER']    = data.request.header['referer'];
    $_SERVER['HTTP_USER_AGENT'] = data.request.header['user-agent'];
    $_SERVER['HTTP_HOST']       = data.request.header.host;
    $_SERVER['REQUEST_URI']     = data.request.url;
    $_SERVER['REMOTE_ADDR']     = data.request.conn.remoteAddr.hostname;

    var unique = Math.random() // todo timestamp
    try {
        await import(path+'?'+unique);
    } catch {
        try {
            console.log('not found'+path+' '+e.message);
            await import(path+'/index.js?'+unique);
        } catch(e) {
            console.log('not found'+path+' '+e.message);
        }
    }
    this.postMessage({
        body:output,
        headers:headers,
    });

}