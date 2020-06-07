import React from 'react';

type SpotifyContent = {
  image: string;
  name: string;
  url: string;
};

export type Artist = SpotifyContent & { lastAlbum: SpotifyContent };

export const LibraryArtist = ({
  artist: { image, name, url, lastAlbum },
}: {
  artist: Artist;
}) => (
  <div>
    <div>
      <img width='100' src={image} alt={name} />
      <a href={url}>{name}</a>
    </div>
    <div>
      <img width='100' src={lastAlbum.image} alt={lastAlbum.name} />
      <a href={lastAlbum.url}>{lastAlbum.name}</a>
    </div>
  </div>
);
