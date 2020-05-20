import React, { useEffect } from 'react';

const getArtists = async () => {
  const res = await fetch('http://0.0.0.0:8000/artists', { mode: 'cors' });
  console.log(await res.json());
};

const App = () => {
  useEffect(() => {
    getArtists();
  }, []);
  return <div className='App'></div>;
};

export default App;
