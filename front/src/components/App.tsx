import React, { useEffect, useState } from 'react';

import { Artist, AlbumItem } from './Album';
import Search from './Search';

const App = () => {
  const [library, setLibrary] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const getArtists = async () => {
      const result = await fetch('http://0.0.0.0:8000/artists');
      setLibrary(await result.json());
      setShouldRefresh(false);
    };

    getArtists();
  }, [shouldRefresh]);

  return (
    <div className='container mx-auto'>
      <div className='text-2xl my-8'>
        Add artists to your collection to be informed when they release a new
        album
      </div>
      <Search className='mb-16' setShouldRefresh={setShouldRefresh} />
      <div>
        <div className='text-3xl mb-6'>Your library</div>
        <div className='flex flex-wrap'>
          {library.length > 0 &&
            library.map((artist: Artist) => (
              <AlbumItem setShouldRefresh={setShouldRefresh} artist={artist} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
