import { SmtpClient } from "https://deno.land/x/smtp@0f32c74d18d7d01239a8a5b94abd9410a08a1d46/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const client = new SmtpClient();

await client.connectTLS({
  hostname: config().MAIL_HOSTNAME,
  port: Number(config().MAIL_PORT),
  username: config().MAIL_USERNAME,
  password: config().MAIL_PASSWORD,
});

export const sendMail = async (subject: string, content: any) => {
  await client.send({
    from: config().MAIL_FROM,
    to: config().MAIL_TO,
    subject,
    content,
  });
};

const formatArtist = ({ artist, lastAlbum }: any) =>
  `
  <div style="background: #003533; border-radius: 16px; padding: 12px; margin-bottom: 24px; box-shadow: 0 12px 16px -15px rgba(0,0,0,0.3);">
    <a href="${artist.url}" style="display: flex; align-items: center; margin-bottom: 16px; color: #abd1c6; text-decoration: none;">
      <img src="${artist.image}" style="margin-right: 12px; border-radius: 100%" width="64px" height="64px"/>
      <div style="font-size: 1.25rem;">${artist.name}</div>
    </a>
    <a href="${lastAlbum.url}" style="display: flex; align-items: center; color: #abd1c6; text-decoration: none;">
      <img src="${lastAlbum.image}" style="margin-right: 12px;" width="64px" height="64px"/>
      <div>
        <div style="font-size: 1.25rem;">${lastAlbum.name}</div>
        <div style="margin-top: 12px;">${lastAlbum.releaseDate}</div>
      </div>
    </a>
  </div>
`;

export const formatMail = (artists: any) =>
  `<body style="background: #004643; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';"">
    ${artists.map((artist: any) => formatArtist(artist)).join("")}
    <div style="color: #abd1c6">Click on the artist / album to open in Spotify 🎧</div>
  </body>`;
