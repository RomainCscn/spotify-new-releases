import React, { useState } from 'react';

import Overlay from '../Overlay';
import { Artist } from '../types';
import { deleteArtist } from '../utils';

const ArtistItem = ({
  artist,
  setShouldRefresh,
}: {
  artist: Artist;
  setShouldRefresh: (shouldRefresh: boolean) => void;
}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleOver = () => {
    setShowOverlay(true);
  };

  const handleOut = () => {
    setShowOverlay(false);
  };

  return (
    <div className='flex flex-col items-center mb-8 w-1/5'>
      <a
        className='grid text-center hover:text-teal-200'
        onMouseEnter={handleOver}
        onMouseLeave={handleOut}
        href={artist.url}
      >
        <img
          className='rounded-full w-32 h-32 object-cover library-album-image'
          src={artist.image}
          alt={artist.name}
        />
        {showOverlay && (
          <Overlay
            rounded
            deleteArtist={(event) =>
              deleteArtist(event, setShouldRefresh, artist.id)
            }
            releaseDate={artist.lastAlbum.releaseDate}
          />
        )}
        <div className='font-semibold mt-2'>{artist.name}</div>
      </a>
      <a className='hover:text-teal-200' href={artist.lastAlbum.url}>
        <div className='font-thin text-sm'>
          Last release: {artist.lastAlbum.releaseDate.split('T')[0]}
        </div>
      </a>
    </div>
  );
};

export default ArtistItem;
