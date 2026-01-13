
import React from 'react';
import { MagnifyingGlassIcon } from '../icons';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-text-secondary" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-background border border-text-secondary/50 rounded-md py-2 pl-10 pr-4 text-text-main placeholder-text-secondary focus:ring-primary focus:border-primary"
      />
    </div>
  );
};
