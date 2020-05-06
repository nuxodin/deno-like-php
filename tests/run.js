import {serve} from "https://deno.land/std@v0.42.0/http/server.ts";
import likePHP from "../php.js";

let phplike = new likePHP({
	documentRoot: import.meta.url + '/../pub'
});

for await (let req of serve(":92")) {
	await phplike.run(req);
}
