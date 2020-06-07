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
  image: string;
  name: string;
  url: string;
  lastAlbum: Pick<Album, "image" | "name" | "url">;
}
