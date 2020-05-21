import {
  Application,
  Router,
  RouterContext,
} from "https://deno.land/x/oak/mod.ts";

import {
  addNewArtist,
  checkAllNewRelease,
  getAllArtistsAndLastRelease,
} from "./artist.ts";

const router = new Router();

router
  .post("/artist", async (context: RouterContext) => {
    let {
      value: { id },
    } = await context.request.body();
    try {
      const artistAndLastAlbum = await addNewArtist(id);
      context.response.body = artistAndLastAlbum;
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
      context.response.headers.set(
        "Access-Control-Allow-Origin",
        "http://localhost:3000",
      );
      context.response.body = artists;
    } catch (e) {
      context.response.status = 400;
      context.response.body = { message: e.message };
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server ready");
await app.listen({ port: 8000 });
