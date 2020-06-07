import { Artist, ArtistFromSpotify } from "./types.ts";

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
