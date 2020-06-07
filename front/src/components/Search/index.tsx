import React, { useState } from 'react';

const Search = ({
  setShouldRefresh,
}: {
  setShouldRefresh: (shouldRefresh: boolean) => void;
}) => {
  const [searchedArtists, setSearchedArtists] = useState([]);

  const searchArtists = async (query: string) => {
    if (query.length > 1) {
      const result = await fetch(
        `http://0.0.0.0:8000/search?artist=${query.replace(/s/, '+')}`
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
      setShouldRefresh(true);
    } catch (e) {
      console.log('Cannot add artist');
    }
  };

  return (
    <div>
      <input onChange={(e) => searchArtists(e.target.value)}></input>
      <div>
        {searchedArtists.length > 0 &&
          searchedArtists.map((artist: any) => (
            <div onClick={() => addArtist(artist.id)} key={artist.id}>
              {artist.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
