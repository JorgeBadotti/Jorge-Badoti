
import React from 'react';
import { UserProfile, Look } from '../types';
import { ResultsCarousel } from './ResultsCarousel';
import { SparklesIcon } from './icons';

interface MainPanelProps {
  userProfile: UserProfile | null;
  generatedLooks: Look[] | null;
  generationState: 'idle' | 'loading' | 'error' | 'reason';
  reason: string | null;
  onSaveLook: (look: Look) => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({
  userProfile,
  generatedLooks,
  generationState,
  reason,
  onSaveLook,
}) => {
  const renderContent = () => {
    switch (generationState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full text-primary animate-fade-in">
            <SparklesIcon className="w-16 h-16 animate-pulse" />
            <p className="mt-4 text-lg font-serif">Gerando looks incríveis...</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full text-red-400 animate-fade-in">
            <p className="text-lg">Oops! Algo deu errado.</p>
            <p className="text-sm">Por favor, tente novamente mais tarde.</p>
          </div>
        );
      case 'reason':
        const isQuotaError = reason && reason.toLowerCase().includes('cota');
        return (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary text-center p-8 animate-fade-in">
            <p className={`text-lg ${isQuotaError ? 'text-red-400' : ''}`}>{reason}</p>
            {isQuotaError && (
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-primary hover:underline"
              >
                Verificar Status da Chave no Google AI Studio
              </a>
            )}
          </div>
        );
      case 'idle':
      default:
        if (generatedLooks && generatedLooks.length > 0) {
          return <ResultsCarousel looks={generatedLooks} onSaveLook={onSaveLook} />;
        }
        if (userProfile?.baseImage) {
          return (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in p-4">
               <img 
                 src={userProfile.baseImage} 
                 alt="Seu modelo" 
                 className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
               />
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary text-center p-8">
            <SparklesIcon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-serif text-primary mb-2">Bem-vindo ao e-Stylist</h2>
            <p>Complete seu perfil, adicione peças ao seu guarda-roupa e descreva uma ocasião para começar a criar!</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-surface rounded-lg w-full h-full flex items-center justify-center relative overflow-hidden">
        {renderContent()}
    </div>
  );
};
