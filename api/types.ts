export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Artist {
  id: string;
  name: string;
  url: string;
  image: string;
}

export interface Album {
  id: string;
  artists: Array<Artist>;
  name: string;
  releaseDate: string;
  url: string;
  image: string;
}

export interface ArtistAndLastAlbum {
  image: string;
  name: string;
  url: string;
  lastAlbum: Pick<Album, "image" | "name" | "url">;
}
