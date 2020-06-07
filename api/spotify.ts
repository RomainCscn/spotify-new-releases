import { config } from "https://deno.land/x/dotenv/mod.ts";
import { ArtistFromSpotify, Album, Image } from "./types.ts";
import { findArtistInAlbum } from "./utils.ts";

interface Token {
  access_token: string;
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

export const getArtistLastAlbum = async (
  artistId: string,
): Promise<Album> => {
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
    images,
  } = albums.items[0];

  return {
    id,
    name,
    image: images.sort((a: Image, b: Image) => b.height - a.height)[0].url,
    releaseDate,
    url: externalUrls.spotify,
    artist: findArtistInAlbum(artistId, artists),
  };
};

export const getArtistImages = async (
  artistId: string,
): Promise<Image[]> => {
  const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const artist: ArtistFromSpotify = await res.json();

  return artist.images;
};

export const getSearchedArtists = async (query: string) => {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    },
  );

  return res.json();
};
