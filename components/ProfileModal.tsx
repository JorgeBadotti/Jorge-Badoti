
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { ImageUploader } from './ImageUploader';
import { SelectionGrid } from './SelectionGrid';
import { PREDEFINED_MODELS, PERSONAL_STYLES, BODY_TYPES } from '../constants';
import { analyzeUserImage } from '../services/geminiService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    setProfile(initialProfile);
    setAnalysisError(null);
  }, [initialProfile, isOpen]);

  const handleImageSelect = (image: File | string) => {
    const baseProfileUpdate = {
        bodyType: '',
        measurements: { bust: 0, waist: 0, hips: 0, height: 0 },
    };
    setAnalysisError(null);

    if (typeof image === 'string') {
        setProfile(p => ({ ...p, ...baseProfileUpdate, baseImage: image }));
        setSelectedImageFile(null);
    } else {
        setSelectedImageFile(image);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(p => ({ ...p, ...baseProfileUpdate, baseImage: reader.result as string }));
        };
        reader.readAsDataURL(image);
    }
  };

  const runAIAnalysis = useCallback(async () => {
    const imageSource = selectedImageFile || profile.baseImage;
    if (!imageSource) return;

    setAnalysisError(null);
    setIsAnalyzing(true);
    try {
        let imageFileToAnalyze: File;
        if (selectedImageFile) {
            imageFileToAnalyze = selectedImageFile;
        } else {
            const response = await fetch(profile.baseImage);
            const blob = await response.blob();
            imageFileToAnalyze = new File([blob], "model_image.jpg", { type: blob.type });
        }
      
      const { bodyType, measurements } = await analyzeUserImage(imageFileToAnalyze);
      setProfile(p => ({ ...p, bodyType, measurements }));

    } catch (error) {
      console.error("Failed to analyze image:", error);
      setAnalysisError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [profile.baseImage, selectedImageFile]);
  
  useEffect(() => {
    if (profile.baseImage && !profile.bodyType) {
        runAIAnalysis();
    }
  }, [profile.baseImage, profile.bodyType, runAIAnalysis]);

  const isSaveDisabled = !profile.name || !profile.baseImage || !profile.personalStyle || !profile.bodyType;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Seu Perfil">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Seu Nome</label>
          <input
            type="text"
            id="name"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="w-full bg-background border border-text-secondary/50 rounded-md px-3 py-2 text-text-main focus:ring-primary focus:border-primary"
            placeholder="Como podemos te chamar?"
          />
        </div>
        
        <ImageUploader 
            onImageSelect={handleImageSelect} 
            currentImage={profile.baseImage}
            predefinedModels={PREDEFINED_MODELS}
        />
        
        <div className="relative p-4 border border-dashed border-text-secondary/50 rounded-lg">
            {isAnalyzing && (
                <div className="absolute inset-0 bg-surface/80 flex items-center justify-center z-10 rounded-lg">
                    <p className="text-primary animate-pulse">Analisando imagem com IA...</p>
                </div>
            )}
             {analysisError && !isAnalyzing && (
                <div className="absolute inset-0 bg-surface/90 flex flex-col items-center justify-center z-10 rounded-lg p-4 text-center">
                    <p className="text-red-400 mb-3">{analysisError}</p>
                    {analysisError.toLowerCase().includes('cota') && (
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline mb-3 text-sm"
                        >
                            Verificar Chave no Google AI Studio
                        </a>
                    )}
                    <Button onClick={runAIAnalysis} variant="secondary">Tentar Novamente</Button>
                </div>
            )}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isAnalyzing || analysisError ? 'blur-sm pointer-events-none' : ''}`}>
                <SelectionGrid items={BODY_TYPES} selectedId={profile.bodyType} onSelect={(id) => setProfile({ ...profile, bodyType: id })} title="Tipo de Corpo" />
                <div>
                    <h3 className="text-lg font-semibold text-text-main mb-3">Medidas (cm)</h3>
                    <div className="space-y-2">
                        {Object.entries(profile.measurements).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                            <label htmlFor={key} className="w-16 text-sm text-text-secondary capitalize">{key}</label>
                            <input
                            type="number"
                            id={key}
                            value={value}
                            onChange={e => setProfile({ ...profile, measurements: { ...profile.measurements, [key]: Number(e.target.value) } })}
                            className="flex-1 bg-background border border-text-secondary/50 rounded-md px-3 py-1 text-text-main focus:ring-primary focus:border-primary"
                            />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <SelectionGrid items={PERSONAL_STYLES} selectedId={profile.personalStyle} onSelect={(id) => setProfile({ ...profile, personalStyle: id })} title="Estilo Pessoal" />

        <div className="flex justify-end pt-4">
          <Button onClick={() => onSave(profile)} disabled={isSaveDisabled}>
            Salvar Perfil
          </Button>
        </div>
      </div>
    </Modal>
  );
};
