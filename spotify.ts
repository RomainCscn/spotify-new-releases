import { config } from "https://deno.land/x/dotenv/mod.ts";

interface Token {
  access_token: string;
}

export interface Artist {
  id: string;
  name: string;
  url: string;
}

export interface Album {
  id: string;
  artists: Array<Artist>;
  name: string;
  releaseDate: string;
  url: string;
}

const getToken = async (): Promise<string> => {
  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: data,
    method: "POST",
    headers: {
      Authorization: `Basic ${config().SPOTIFY_BASIC_AUTH}`,
    },
  });

  const { access_token: token }: Token = await response.json();

  return token;
};

export const getArtistLastAlbum = async (artistId: string): Promise<Album> => {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?limit=1&include_groups=album&country=fr`,
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    },
  );

  const albums = await res.json();
  const {
    id,
    name,
    release_date: releaseDate,
    artists,
    external_urls: externalUrls,
  } = albums.items[0];

  return {
    artists: artists.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      url: artist.external_urls.spotify,
    })),
    id,
    name,
    releaseDate,
    url: externalUrls.spotify,
  };
};
