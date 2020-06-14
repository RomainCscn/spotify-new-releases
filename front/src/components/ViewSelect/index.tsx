import React, { ChangeEvent } from 'react';

import Select from '../common/Select';
import { View } from '../types';

const ViewSelect = ({
  handleViewChange,
  view,
  className,
  isDefault,
}: {
  handleViewChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  view: View | undefined;
  className?: string;
  isDefault?: boolean;
}) => (
  <div className={className}>
    <div className='mb-1 text-gray-400'>{isDefault && 'Default '}View</div>
    <Select name='view' id='view' value={view} onChange={handleViewChange}>
      <option value={View.ALBUMS}>Albums</option>
      <option value={View.ARTISTS}>Artists</option>
    </Select>
  </div>
);

export default ViewSelect;
