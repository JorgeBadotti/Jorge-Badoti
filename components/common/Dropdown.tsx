
import React from 'react';
import { ChevronDownIcon } from '../icons';

interface DropdownProps {
  options: { [key: string]: string };
  selectedValue: string;
  onSelect: (value: string) => void;
  label: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onSelect, label }) => {
  return (
    <div className="relative">
      <label className="text-xs text-text-secondary">{label}</label>
      <select
        value={selectedValue}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full appearance-none bg-background border border-text-secondary/50 rounded-md py-1.5 px-3 text-text-main text-sm focus:ring-primary focus:border-primary cursor-pointer"
      >
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key}>{value}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
        <ChevronDownIcon className="h-4 w-4 text-text-secondary" />
      </div>
    </div>
  );
};
