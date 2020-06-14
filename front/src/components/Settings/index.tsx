import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import SortSelect from '../SortSelect';
import ViewSelect from '../ViewSelect';
import { ArtistsSort, View } from '../types';
import Button from '../common/Button';

import { useLockBodyScroll, useOnClickOutside } from '../../utils/hooks';

const Settings = ({ hide }: { hide: () => void }) => {
  useLockBodyScroll();

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => hide());

  const [email, setEmail] = useState('');
  const [sort, setSort] = useState<ArtistsSort | undefined>();
  const [view, setView] = useState<View | undefined>();

  useEffect(() => {
    const getSettings = async () => {
      const response = await fetch(`http://0.0.0.0:8000/settings`);
      const {
        email: defaultEmail,
        sort: defaultSort,
        view: defaultView,
      }: {
        email: string;
        sort: ArtistsSort;
        view: View;
      } = await response.json();
      setEmail(defaultEmail);
      setSort(defaultSort);
      setView(defaultView);
    };

    getSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await fetch('http://0.0.0.0:8000/settings', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, sort, view }),
      });
      hide();
    } catch (e) {
      console.log('Cannot add artist');
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.currentTarget.value as ArtistsSort);
  };

  const handleViewChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setView(View[event.currentTarget.value as keyof typeof View]);
  };

  return (
    <div className='fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center'>
      <div className='fixed inset-0 transition-opacity'>
        <div className='absolute inset-0 bg-gray-700 opacity-75'></div>
      </div>
      <div
        ref={ref}
        className='bg-gray-800 rounded-lg p-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full'
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-headline'
      >
        <div className='text-2xl mb-8'>Settings</div>
        <div className='mb-4'>
          <div>Email</div>
          <input
            className='rounded-md h-10 w-full sm:w-3/4 outline-none px-2 bg-gray-600'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <SortSelect
          handleSortChange={handleSortChange}
          sort={sort}
          className='mb-4'
          isDefault
        />
        <ViewSelect
          handleViewChange={handleViewChange}
          view={view}
          className='mb-4'
          isDefault
        />
        <div className='flex justify-end'>
          <Button className='mr-4' isOutline onClick={hide}>
            Cancel
          </Button>
          <Button onClick={saveSettings}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
