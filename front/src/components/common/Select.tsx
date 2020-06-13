import React from 'react';

const Select = ({
  children,
  className,
  ...props
}: {
  children: any;
  className?: string;
  [key: string]: any;
}) => (
  <select
    className={`appearance-none 
    bg-gray-900 
    border 
    border-gray-700 
    hover:border-gray-600 
    px-4 
    py-2 
    pr-8 
    rounded 
    shadow 
    leading-tight 
    focus:outline-none 
    focus:shadow-outline
    ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default Select;
