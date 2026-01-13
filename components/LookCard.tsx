
import React from 'react';
import { Look } from '../types';

interface LookCardProps {
  look: Look;
}

export const LookCard: React.FC<LookCardProps> = ({ look }) => {
  return (
    <div className="flex-shrink-0 w-24 group relative rounded-lg overflow-hidden">
      <img src={look.imageUrl} alt={look.name} className="w-full h-32 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <p className="absolute bottom-1 left-1.5 right-1.5 text-xs text-white font-medium truncate group-hover:whitespace-normal group-hover:line-clamp-2">
        {look.name}
      </p>
    </div>
  );
};
