import React from 'react';

type SpotifyContent = {
  id: string;
  image: string;
  name: string;
  url: string;
};

export type Artist = SpotifyContent & { lastAlbum: SpotifyContent };

export const LibraryArtist = ({
  setShouldRefresh,
  artist: { id, image, name, url, lastAlbum },
}: {
  setShouldRefresh: (shouldRefresh: boolean) => void;
  artist: Artist;
}) => {
  const deleteArtist = async () => {
    try {
      await fetch('http://0.0.0.0:8000/artist', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      setShouldRefresh(true);
    } catch (e) {
      console.log('Cannot delete artist');
    }
  };

  return (
    <div>
      <div onClick={() => deleteArtist()}>Remove</div>
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
};
