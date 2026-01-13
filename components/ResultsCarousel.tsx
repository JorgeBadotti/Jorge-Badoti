
import React, { useState } from 'react';
import { Look } from '../types';
import { Button } from './common/Button';
import { BookmarkIcon } from './icons';

interface ResultsCarouselProps {
  looks: Look[];
  onSaveLook: (look: Look) => void;
}

export const ResultsCarousel: React.FC<ResultsCarouselProps> = ({ looks, onSaveLook }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % looks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + looks.length) % looks.length);
  };
  
  const currentLook = looks[currentIndex];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm h-96 perspective-1000">
        <div
          className="relative w-full h-full transform-style-preserve-3d transition-transform duration-700"
          style={{ transform: `rotateY(${currentIndex * -90}deg)` }}
        >
          {looks.map((look, index) => (
            <div
              key={look.id}
              className="absolute w-full h-full backface-hidden"
              style={{ transform: `rotateY(${index * 90}deg) translateZ(12rem)` }}
            >
              <img src={look.imageUrl} alt={look.name} className="w-full h-full object-cover rounded-lg shadow-2xl" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-8 mt-6 w-full">
        <button onClick={prevSlide} className="text-text-secondary hover:text-primary transition-colors p-2 rounded-full bg-surface">
          &lt;
        </button>
        <div className="text-center w-64">
            <h3 className="text-lg font-serif text-primary">{currentLook.name}</h3>
            <p className="text-sm text-text-secondary h-10 overflow-hidden">{currentLook.description}</p>
            <div className="mt-2 text-xs font-bold text-primary">AFINIDADE: {currentLook.score.toFixed(1)} / 10.0</div>
        </div>
        <button onClick={nextSlide} className="text-text-secondary hover:text-primary transition-colors p-2 rounded-full bg-surface">
          &gt;
        </button>
      </div>

      <Button onClick={() => onSaveLook(currentLook)} variant="secondary" className="mt-4">
          <BookmarkIcon className="w-5 h-5"/>
          Salvar Look
      </Button>
    </div>
  );
};
