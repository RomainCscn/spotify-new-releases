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
    <div className='bg-gray-200 mb-4'>
      <div className='flex items-center'>
        <a href={url}>
          <img className='mr-2' width='100' src={image} alt={name} />
          {name}
        </a>
      </div>
      <div className='flex items-center'>
        <a href={lastAlbum.url}>
          <img
            className='mr-2'
            width='100'
            src={lastAlbum.image}
            alt={lastAlbum.name}
          />
          {lastAlbum.name}
        </a>
      </div>
      <div className='cursor-pointer' onClick={deleteArtist}>
        Remove
      </div>
    </div>
  );
};
