import React, { ChangeEvent } from 'react';

import { View } from '../types';

const ViewSelect = ({
  handleViewChange,
  view,
}: {
  handleViewChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  view: View;
}) => (
  <select
    className='appearance-none bg-gray-900 border border-gray-700 hover:border-gray-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
    name='view'
    id='view'
    value={view}
    onChange={handleViewChange}
  >
    <option value={View.ALBUMS}>Albums</option>
    <option value={View.ARTISTS}>Artists</option>
  </select>
);

export default ViewSelect;
