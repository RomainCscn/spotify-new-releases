import {
  Application,
  Router,
  RouterContext,
  helpers,
} from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import {
  addNewArtist,
  checkAllNewRelease,
  getAllArtistsAndLastRelease,
} from "./artist.ts";

import { getSearchedArtists } from "./spotify.ts";

const router = new Router();

router
  .post("/artist", async (context: RouterContext) => {
    let {
      value: { id },
    } = await context.request.body();
    try {
      await addNewArtist(id);
      context.response.status = 200;
    } catch (e) {
      context.response.status = 400;
      context.response.body = { message: e.message };
    }
  })
  .get("/new-releases", async (context: RouterContext) => {
    try {
      context.response.body = await checkAllNewRelease();
    } catch (e) {
      context.response.status = 400;
      context.response.body = { message: e.message };
    }
  })
  .get("/artists", async (context: RouterContext) => {
    try {
      const artists = await getAllArtistsAndLastRelease();
      context.response.body = artists;
    } catch (e) {
      context.response.status = 400;
      context.response.body = { message: e.message };
    }
  })
  .get("/search", async (context: RouterContext) => {
    try {
      const artists = await getSearchedArtists(
        helpers.getQuery(context).artist,
      );
      context.response.body = artists;
    } catch (e) {
      context.response.status = 400;
      context.response.body = { message: e.message };
    }
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server ready");
await app.listen({ port: 8000 });
