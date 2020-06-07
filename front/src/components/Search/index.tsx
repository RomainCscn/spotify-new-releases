import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

const Artist = ({ addArtist, artist }: any) => (
  <div
    className='flex items-center cursor-pointer mb-2'
    onClick={() => addArtist(artist.id)}
    key={artist.id}
  >
    {artist.images.length > 0 ? (
      <img
        className='h-16 w-16 mr-2'
        alt={artist.name}
        src={artist.images[artist.images.length - 1].url}
      />
    ) : (
      <div className='h-16 w-16  mr-2 bg-gray-200'></div>
    )}
    {artist.name}
  </div>
);

const Search = ({
  setShouldRefresh,
}: {
  setShouldRefresh: (shouldRefresh: boolean) => void;
}) => {
  const [query, setQuery] = useState('');
  const [searchedArtists, setSearchedArtists] = useState([]);

  const searchArtists = async (query: string) => {
    if (query.length > 1) {
      const result = await fetch(
        `http://0.0.0.0:8000/search?artist=${query.replace(/\s+/g, '+')}`
      );
      const { artists } = await result.json();
      setSearchedArtists(artists.items);
    } else {
      setSearchedArtists([]);
    }
  };

  const addArtist = async (id: string) => {
    try {
      await fetch('http://0.0.0.0:8000/artist', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      setSearchedArtists([]);
      setQuery('');
      setShouldRefresh(true);
    } catch (e) {
      console.log('Cannot add artist');
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    searchArtists(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSearchedArtists([]);
      setQuery('');
    }
  };

  return (
    <div>
      <div className=''>Add an artist</div>
      <input
        className='border-gray-400 border-2 rounded-md h-10 outline-none px-2'
        onKeyDown={handleKeyDown}
        value={query}
        onChange={handleSearch}
      ></input>
      {searchedArtists.length > 0 && (
        <div className='absolute p-4 bg-gray-200'>
          {searchedArtists.map((artist: any) => (
            <Artist addArtist={addArtist} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
