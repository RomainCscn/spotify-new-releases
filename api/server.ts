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
} from "./artist.ts";
import { deleteArtist, getAllArtistsAndLastRelease } from "./queries.ts";
import { getSearchedArtists } from "./spotify.ts";

import { ArtistsSort } from "./types.ts";

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
      context.throw(400, e.message);
    }
  })
  .delete("/artist", async (context: RouterContext) => {
    let {
      value: { id },
    } = await context.request.body();
    try {
      await deleteArtist(id);
      context.response.status = 204;
    } catch (e) {
      context.throw(400, e.message);
    }
  })
  .get("/new-releases", async (context: RouterContext) => {
    try {
      context.response.body = await checkAllNewRelease();
    } catch (e) {
      context.throw(400, e.message);
    }
  })
  .get("/artists", async (context: RouterContext) => {
    try {
      const sort = <ArtistsSort> helpers.getQuery(context).sort;
      const artists = await getAllArtistsAndLastRelease(sort);
      context.response.body = artists;
    } catch (e) {
      context.throw(400, e.message);
    }
  })
  .get("/search", async (context: RouterContext) => {
    try {
      const artists = await getSearchedArtists(
        helpers.getQuery(context).artist,
      );
      context.response.body = artists;
    } catch (e) {
      context.throw(400, e.message);
    }
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server ready");
await app.listen({ port: 8000 });
