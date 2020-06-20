import { config } from "https://deno.land/x/dotenv/mod.ts";

export const sendNotification = async (data: string) =>
  fetch(config().IFTTT_URL, {
    body: JSON.stringify({ value1: data }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
