
import React from 'react';
import { WardrobeItem } from '../types';
import { HeartIcon, TrashIcon, CheckCircleIcon } from './icons';

interface WardrobeCardProps {
  item: WardrobeItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

export const WardrobeCard: React.FC<WardrobeCardProps> = ({ item, isSelected, onSelect, onFavorite, onRemove }) => {
  return (
    <div 
        className={`relative group bg-surface rounded-lg overflow-hidden shadow-lg transition-all duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-primary' : 'ring-2 ring-transparent'}`}
        onClick={() => onSelect(item.id)}
    >
      <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity" />
      
      {isSelected && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-primary" />
        </div>
      )}

      <div className="p-3">
        <p className="text-sm font-medium text-text-main truncate">{item.name}</p>
        <p className="text-xs text-text-secondary">{item.category}</p>
      </div>

      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onFavorite(item.id); }} className="p-1.5 bg-background/50 rounded-full text-text-main hover:text-red-500 backdrop-blur-sm transition-colors">
          <HeartIcon className="w-5 h-5" solid={item.isFavorite} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} className="p-1.5 bg-background/50 rounded-full text-text-main hover:text-primary backdrop-blur-sm transition-colors">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
