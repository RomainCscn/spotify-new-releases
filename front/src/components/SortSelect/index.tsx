import React, { ChangeEvent } from 'react';

import Select from '../common/Select';
import { ArtistsSort } from '../types';

const SortSelect = ({
  handleSortChange,
  sort,
}: {
  handleSortChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  sort: ArtistsSort;
}) => {
  return (
    <div>
      <div className='mb-1 text-gray-400'>Sort</div>
      <Select
        className='mr-2'
        name='sort'
        id='sort'
        value={sort}
        onChange={handleSortChange}
      >
        <option value={ArtistsSort.ALBUM}>Album</option>
        <option value={ArtistsSort.ARTIST}>Artist</option>
        <option value={ArtistsSort.RELEASE_DESC}>Newest release</option>
        <option value={ArtistsSort.RELEASE_ASC}>Oldest release</option>
      </Select>
    </div>
  );
};

export default SortSelect;
