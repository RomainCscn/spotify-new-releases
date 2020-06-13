export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Artist {
  id: string;
  name: string;
  url: string;
  image?: string;
}

export interface ArtistFromSpotify {
  id: string;
  name: string;
  external_urls: { spotify: string };
  images: Image[];
}

export interface Album {
  id: string;
  artist: Artist;
  name: string;
  releaseDate: string;
  url: string;
  image: string;
}

export interface DbAlbum extends Omit<Album, "artist"> {
  artist: string;
}

export interface ArtistAndLastAlbum {
  id: string;
  image: string;
  name: string;
  url: string;
  lastAlbum: Omit<Album, "artist">;
}

export type ArtistsSort =
  | "+album"
  | "-album"
  | "+artist"
  | "-artist"
  | "+releaseDate"
  | "-releaseDate";

export const sortType: Record<ArtistsSort, string> = {
  "+album": "lower(album.name) ASC",
  "-album": "lower(album.name) DESC",
  "+artist": "lower(artist.name) ASC",
  "-artist": "lower(artist.name) DESC",
  "+releaseDate": "album.release_date ASC",
  "-releaseDate": "album.release_date DESC",
};
