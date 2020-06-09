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
    <div className='mr-4 mb-4 w-1/5'>
      <a className='hover:text-teal-200' href={lastAlbum.url}>
        <img
          className='mr-2'
          width='200'
          src={lastAlbum.image}
          alt={lastAlbum.name}
        />
        <div className='my-1 font-semibold'>{lastAlbum.name}</div>
      </a>
      <a className='hover:text-teal-200' href={url}>
        <div className='mb-1 font-thin'>{name}</div>
      </a>
      <div className='cursor-pointer hover:text-red-500' onClick={deleteArtist}>
        Remove
      </div>
    </div>
  );
};
