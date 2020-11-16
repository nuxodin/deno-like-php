echo `Hallo: ${$_SERVER['HTTP_HOST']} jawohl ${time()}`;

// await import('./head.js');

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

echo `wait .1 seconds `;

await sleep(.1);

echo `<b>top!</b>`;
