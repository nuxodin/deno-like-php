# ussage

waiting https://github.com/denoland/deno/issues/5215 to be fixed / clarified  

## main.js
```js
import {serve} from "https://deno.land/std@0.74.0/http/server.ts";
import likePHP from "https://raw.githack.com/nuxodin/deno-like-php/master/php.js";

const phplike = new likePHP({
	documentRoot:'/documentRoot/'
});

for await (let req of serve(":80")) {
  await phplike.run(req);
}
```

## index.js
```js
echo `Hallo: ${$_SERVER['HTTP_HOST']} jawohl ${time()}`;

echo `<ul>`;
for (var i in $_GET) {
    echo `<li>${i} ${$_GET[i]}</li>`;
}
echo `</ul>`;

echo `<ul>`;
for (var i in $_SERVER) {
    echo `<li>${i} ${$_SERVER[i]}</li>`;
}
echo `</ul>`;

```
