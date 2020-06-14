import {
  Application,
  Router,
  RouterContext,
  helpers,
} from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import router from "./routes/index.ts";

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server ready");
await app.listen({ port: 8000 });
