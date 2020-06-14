import React, { ChangeEvent, useEffect, useState } from 'react';

import AlbumItem from './Album';
import ArtistItem from './Artist';
import Search from './Search';
import ViewSelect from './ViewSelect';
import SortSelect from './SortSelect';
import Settings from './Settings';

import { Artist, ArtistsSort, View } from './types';

const App = () => {
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [library, setLibrary] = useState([]);
  const [sort, setSort] = useState(ArtistsSort.ALBUM);
  const [view, setView] = useState(View.ALBUMS);
  const [shouldRefresh, setShouldRefresh] = useState(true);

  useEffect(() => {
    const getSettings = async () => {
      const response = await fetch(`http://0.0.0.0:8000/settings`);
      const { sort, view } = await response.json();
      setIsSettingsLoading(false);
      if (sort) setSort(sort);
      if (view) setView(view);
    };

    getSettings();
  }, []);

  useEffect(() => {
    const getArtists = async () => {
      const response = await fetch(`http://0.0.0.0:8000/artists?sort=${sort}`);
      setLibrary(await response.json());
      setShouldRefresh(false);
    };

    if (shouldRefresh) getArtists();
  }, [shouldRefresh, sort]);

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.currentTarget.value as ArtistsSort);
    setShouldRefresh(true);
  };

  const handleViewChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setView(View[event.currentTarget.value as keyof typeof View]);
  };

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mt-8 mb-4'>
        <div className='text-4xl font-bold'>Spotify Releases</div>
        <div
          className='cursor-pointer hover:text-gray-500'
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings
        </div>
      </div>
      <div className='text-xl mb-16'>
        Add artists to your collection to be informed when they release a new
        album.
      </div>
      <Search className='' setShouldRefresh={setShouldRefresh} />
      {!isSettingsLoading && (
        <div>
          <div className='flex items-end justify-between mb-6'>
            <div className='text-3xl'>Your library</div>
            <div className='flex'>
              <SortSelect sort={sort} handleSortChange={handleSortChange} />
              <ViewSelect view={view} handleViewChange={handleViewChange} />
            </div>
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
      )}
      {showSettings && <Settings hide={() => setShowSettings(false)} />}
    </div>
  );
};

export default App;
