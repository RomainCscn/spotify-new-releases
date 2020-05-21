import React, { useEffect, useState } from 'react';
import { Album, Artist } from '../../server/types';

const App = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const getArtists = async () => {
      const res = await fetch('http://0.0.0.0:8000/artists', { mode: 'cors' });
      setArtists(await res.json());
    };

    getArtists();
  }, []);

  return (
    <div className='App'>
      {artists.map((artist: Artist) => (
        <>
          <a href={artist.url}>{artist.name}</a>
          <img src={artist.image} alt={artist.name} />
        </>
      ))}
    </div>
  );
};

export default App;
