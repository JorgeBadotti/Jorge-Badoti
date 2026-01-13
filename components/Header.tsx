
import React from 'react';
import { AppMode } from '../types';
import { UserCircleIcon, SparklesIcon } from './icons';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, setMode, onProfileClick }) => {
  const switchBaseClasses = "relative w-48 h-10 flex items-center bg-surface rounded-full p-1 transition-colors duration-300";
  const switchButtonClasses = "w-1/2 rounded-full h-full flex items-center justify-center text-sm font-medium z-10 transition-colors";
  const switchIndicatorClasses = `absolute top-1 left-1 w-1/2 h-8 bg-primary rounded-full transition-transform duration-300 ease-in-out`;

  return (
    <header className="flex justify-between items-center p-4 border-b border-white/10 h-20">
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-serif text-text-main">e-Stylist</h1>
      </div>
      
      <div className={switchBaseClasses}>
        <div 
          className={`${switchIndicatorClasses} ${mode === AppMode.EStylist ? 'translate-x-full' : 'translate-x-0'}`}
        ></div>
        <button
          onClick={() => setMode(AppMode.Consumer)}
          className={`${switchButtonClasses} ${mode === AppMode.Consumer ? 'text-background' : 'text-text-secondary'}`}
        >
          Consumidor
        </button>
        <button
          onClick={() => setMode(AppMode.EStylist)}
          className={`${switchButtonClasses} ${mode === AppMode.EStylist ? 'text-background' : 'text-text-secondary'}`}
        >
          e-Stylist
        </button>
      </div>

      <button onClick={onProfileClick} className="flex items-center gap-2 text-text-secondary hover:text-text-main transition-colors">
        <UserCircleIcon className="w-8 h-8" />
      </button>
    </header>
  );
};
