import React, { useEffect, useState } from 'react';

import { Artist, LibraryArtist } from './LibraryArtist';
import Search from './Search';

const App = () => {
  const [libraryArtists, setlibraryArtists] = useState([]);

  useEffect(() => {
    const getArtists = async () => {
      const result = await fetch('http://0.0.0.0:8000/artists');
      setlibraryArtists(await result.json());
    };

    getArtists();
  }, []);

  return (
    <div>
      <Search />
      {libraryArtists.length > 0 &&
        libraryArtists.map((artist: Artist) => (
          <LibraryArtist artist={artist} />
        ))}
    </div>
  );
};

export default App;
