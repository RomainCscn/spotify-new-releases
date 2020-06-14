import {
  Artist,
  ArtistAndLastAlbum,
  ArtistFromSpotify,
} from "../types/index.ts";

export const findArtistInAlbum = (
  id: string,
  artists: Array<ArtistFromSpotify>,
): Omit<Artist, "image"> => {
  const artist: ArtistFromSpotify | undefined = artists.find((artist) =>
    artist.id === id
  );
  if (!artist) throw Error("Artist not found in album");

  return {
    name: artist.name,
    id: artist.id,
    url: artist.external_urls.spotify,
  };
};

export const formatArtistAndAlbum = (row: string[]): ArtistAndLastAlbum => {
  return {
    id: row[0],
    name: row[1],
    url: row[2],
    image: row[3],
    lastAlbum: {
      id: row[4],
      name: row[5],
      url: row[6],
      releaseDate: row[7],
      image: row[8],
    },
  };
};
