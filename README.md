# deno-like-php
familiar environment for php people (for fun)

# ussage

## main.js
```js
import {serve} from "https://deno.land/std/http/server.ts";
import likePHP from "https://raw.githack.com/nuxodin/deno-like-php/master/php.js";

const phplike = new likePHP({
	documentRoot:'/documentRoot/'
});

for await (let req of serve(":91")) {
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
