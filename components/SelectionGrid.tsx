
import React from 'react';
import { CheckCircleIcon } from './icons';

interface GridItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface SelectionGridProps {
  items: GridItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  title: string;
}

export const SelectionGrid: React.FC<SelectionGridProps> = ({ items, selectedId, onSelect, title }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-text-main mb-3">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="relative group rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
          >
            <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
            <p className="absolute bottom-2 left-2 text-sm font-medium text-white">{item.name}</p>
            {selectedId === item.id && (
              <>
                <div className="absolute inset-0 border-2 border-primary rounded-lg"></div>
                <CheckCircleIcon className="absolute top-2 right-2 w-6 h-6 text-primary bg-surface rounded-full" />
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
