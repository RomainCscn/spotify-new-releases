import React, { useEffect, useState } from 'react';

import { Artist, LibraryArtist } from './LibraryArtist';
import Search from './Search';

const App = () => {
  const [libraryArtists, setlibraryArtists] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const getArtists = async () => {
      const result = await fetch('http://0.0.0.0:8000/artists');
      setlibraryArtists(await result.json());
      setShouldRefresh(false);
    };

    getArtists();
  }, [shouldRefresh]);

  return (
    <div className='container mx-auto'>
      <div className='text-2xl mb-8'>
        Add artists to your collection to be informed when they release a new
        album
      </div>
      <Search className='mb-16' setShouldRefresh={setShouldRefresh} />
      <div>
        <div className='text-xl'>Your library</div>
        {libraryArtists.length > 0 &&
          libraryArtists.map((artist: Artist) => (
            <LibraryArtist
              setShouldRefresh={setShouldRefresh}
              artist={artist}
            />
          ))}
      </div>
    </div>
  );
};

export default App;
