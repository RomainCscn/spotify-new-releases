import React, { ChangeEvent, useEffect, useState } from 'react';

import AlbumItem from './Album';
import ArtistItem from './Artist';
import Search from './Search';

import { Artist, View } from './types';
import ViewSelect from './ViewSelect';

const App = () => {
  const [library, setLibrary] = useState([]);
  const [view, setView] = useState(View.ALBUMS);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const getArtists = async () => {
      const result = await fetch('http://0.0.0.0:8000/artists');
      setLibrary(await result.json());
      setShouldRefresh(false);
    };

    getArtists();
  }, [shouldRefresh]);

  const handleViewChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setView(View[event.currentTarget.value as keyof typeof View]);
  };

  console.log(view);

  return (
    <div className='container mx-auto'>
      <div className='text-2xl my-8'>
        Add artists to your collection to be informed when they release a new
        album
      </div>
      <Search className='mb-16' setShouldRefresh={setShouldRefresh} />
      <div>
        <div className='flex justify-between mb-6'>
          <div className='text-3xl'>Your library</div>
          <ViewSelect view={view} handleViewChange={handleViewChange} />
        </div>
        {view === View.ALBUMS && (
          <div className='flex flex-wrap'>
            {library.length > 0 &&
              library.map((artist: Artist) => (
                <AlbumItem
                  key={artist.id}
                  setShouldRefresh={setShouldRefresh}
                  artist={artist}
                />
              ))}
          </div>
        )}
        {view === View.ARTISTS && (
          <div className='flex flex-wrap'>
            {library.length > 0 &&
              library.map((artist: Artist) => (
                <ArtistItem
                  key={artist.id}
                  setShouldRefresh={setShouldRefresh}
                  artist={artist}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
