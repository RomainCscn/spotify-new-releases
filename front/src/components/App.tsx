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
    <div>
      <Search setShouldRefresh={setShouldRefresh} />
      <div style={{ display: 'flex' }}>
        {libraryArtists.length > 0 &&
          libraryArtists.map((artist: Artist) => (
            <LibraryArtist artist={artist} />
          ))}
      </div>
    </div>
  );
};

export default App;
