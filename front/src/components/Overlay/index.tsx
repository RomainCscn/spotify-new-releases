import React from 'react';

const Overlay = ({
  deleteArtist,
  releaseDate,
  rounded,
}: {
  deleteArtist: (event: any) => Promise<void>;
  releaseDate: string;
  rounded?: boolean;
}) => (
  <div
    className={`bg-black bg-opacity-75 p-4 flex flex-col items-end library-album-image-overlay ${
      rounded ? 'rounded-full justify-center items-center' : 'justify-between'
    }`}
  >
    {!rounded && (
      <div className='text-gray-100'>{releaseDate.split('T')[0]}</div>
    )}
    <div
      className='cursor-pointer text-gray-100 hover:text-red-500'
      onClick={deleteArtist}
    >
      Remove
    </div>
  </div>
);

export default Overlay;
