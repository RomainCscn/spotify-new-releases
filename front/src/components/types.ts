type SpotifyContent = {
  id: string;
  image: string;
  name: string;
  url: string;
};

export enum View {
  ARTISTS = 'ARTISTS',
  ALBUMS = 'ALBUMS',
}

export type Artist = SpotifyContent & {
  lastAlbum: SpotifyContent & { releaseDate: string };
};

export enum ArtistsSort {
  ALBUM = '+album',
  ARTIST = '+artist',
  RELEASE_ASC = '+releaseDate',
  RELEASE_DESC = '-releaseDate',
}
