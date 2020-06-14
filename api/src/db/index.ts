import { Pool } from "https://deno.land/x/postgres/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const pool = new Pool(
  {
    user: config().PGUSER,
    database: config().PGDATABASE,
  },
  1,
);

export const query = (text: string, args: Array<string> = []) =>
  pool.query({ text, args });
