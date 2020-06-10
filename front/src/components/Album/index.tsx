import React, { useState } from 'react';

import Overlay from '../Overlay';
import { Artist } from '../types';
import { deleteArtist } from '../utils';

import './styles.css';

const AlbumItem = ({
  setShouldRefresh,
  artist: { id, name, url, lastAlbum },
}: {
  setShouldRefresh: (shouldRefresh: boolean) => void;
  artist: Artist;
}) => {
  const [showOverlay, setShowOverlay] = useState(false);

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
          <Overlay
            deleteArtist={(event) => deleteArtist(event, setShouldRefresh, id)}
            releaseDate={lastAlbum.releaseDate}
          />
        )}
        <div className='my-1 font-semibold'>{lastAlbum.name}</div>
      </a>
      <a className='hover:text-teal-200' href={url}>
        <div className='mb-1 font-thin'>{name}</div>
      </a>
    </div>
  );
};

export default AlbumItem;
