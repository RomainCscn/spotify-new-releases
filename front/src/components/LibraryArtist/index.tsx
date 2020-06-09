import React, { useState } from 'react';

import './styles.css';

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
  const [showOverlay, setShowOverlay] = useState(false);

  const deleteArtist = async (event: any) => {
    event.preventDefault();
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

  const handleOver = () => {
    setShowOverlay(true);
  };

  const handleOut = () => {
    setShowOverlay(false);
  };

  return (
    <div className='pr-4 mb-4 w-1/6'>
      <a
        onMouseEnter={handleOver}
        onMouseLeave={handleOut}
        className='grid hover:text-teal-200'
        href={lastAlbum.url}
      >
        <img
          className='library-album-image'
          src={lastAlbum.image}
          alt={lastAlbum.name}
        />
        {showOverlay && (
          <div className='bg-black bg-opacity-75 p-4 flex justify-center items-center library-album-image-overlay'>
            <div
              className='cursor-pointer text-gray-100 hover:text-red-500'
              onClick={deleteArtist}
            >
              Remove
            </div>
          </div>
        )}
      </a>
      <a className='grid hover:text-teal-200' href={lastAlbum.url}>
        <div className='my-1 font-semibold'>{lastAlbum.name}</div>
      </a>
      <a className='hover:text-teal-200' href={url}>
        <div className='mb-1 font-thin'>{name}</div>
      </a>
    </div>
  );
};
