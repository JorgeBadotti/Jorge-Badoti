
import React from 'react';
import { Look } from '../types';
import { Button } from './common/Button';
import { BookmarkIcon } from './icons';

interface ResultsCarouselProps {
  looks: Look[];
  onSaveLook: (look: Look) => void;
}

export const ResultsCarousel: React.FC<ResultsCarouselProps> = ({ looks, onSaveLook }) => {
  if (!looks || looks.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-full p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {looks.map((look) => (
          <div key={look.id} className="bg-surface rounded-lg overflow-hidden flex flex-col shadow-lg">
            <img src={look.imageUrl} alt={look.name} className="w-full h-64 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-serif text-primary">{look.name}</h3>
              <p className="text-sm text-text-secondary flex-grow my-2 line-clamp-3">{look.description}</p>
              <div className="flex justify-between items-center mt-auto pt-2">
                <div className="text-xs font-bold text-primary">
                  AFINIDADE: {look.score.toFixed(1)} / 10.0
                </div>
                <Button onClick={() => onSaveLook(look)} variant="secondary" className="px-3 py-1.5">
                  <BookmarkIcon className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
