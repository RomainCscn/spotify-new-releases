import React from 'react';
import classNames from 'classnames';

const Button = ({
  children,
  className,
  isOutline,
  ...props
}: {
  children: any;
  className?: string;
  isOutline?: boolean;
  [key: string]: any;
}) => (
  <div
    className={classNames(
      'cursor-pointer font-bold py-2 px-4 rounded',
      className,
      {
        'bg-green-200 hover:bg-green-400 text-green-800': !isOutline,
        'bg-transparent hover:bg-gray-500 text-gray-300 hover:text-white border border-gray-500 hover:border-transparent': isOutline,
      }
    )}
    {...props}
  >
    {children}
  </div>
);

export default Button;
