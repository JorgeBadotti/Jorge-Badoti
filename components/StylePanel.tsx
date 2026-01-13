
import React, { useState } from 'react';
import { UserProfile, WardrobeItem, Product, Look, AppMode, GeneratedLook } from '../types';
import { Button } from './common/Button';
import { SparklesIcon } from './icons';
import { generateLookDescriptions, generateLookImage } from '../services/geminiService';

interface StylePanelProps {
  userProfile: UserProfile;
  wardrobe: WardrobeItem[];
  storeProducts: Product[];
  selectedWardrobeItems: string[];
  selectedStoreItems: string[];
  setGeneratedLooks: (looks: Look[] | null) => void;
  setGenerationState: (state: 'idle' | 'loading' | 'error' | 'reason') => void;
  setReason: (reason: string | null) => void;
  mode: AppMode;
}

export const StylePanel: React.FC<StylePanelProps> = ({
  userProfile,
  wardrobe,
  storeProducts,
  selectedWardrobeItems,
  selectedStoreItems,
  setGeneratedLooks,
  setGenerationState,
  setReason,
  mode,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerationState('loading');
    setGeneratedLooks(null);
    setReason(null);

    let itemsToUse: (WardrobeItem | Product)[] = [];

    // Lógica de Contexto para Geração
    if (selectedWardrobeItems.length > 0 || selectedStoreItems.length > 0) {
        itemsToUse = [
            ...wardrobe.filter(item => selectedWardrobeItems.includes(item.id)),
            ...storeProducts.filter(item => selectedStoreItems.includes(item.id))
        ];
    } else if (wardrobe.length > 0) {
        itemsToUse = wardrobe;
    } else {
        itemsToUse = storeProducts;
    }
    
    if (mode === AppMode.EStylist) {
        // Simulação: stylist usa o guarda-roupa do cliente (todo) + peças da loja selecionadas
        itemsToUse = [
            ...wardrobe,
            ...storeProducts.filter(item => selectedStoreItems.includes(item.id))
        ];
    }

    try {
      const { looks } = await generateLookDescriptions(userProfile, itemsToUse, prompt);
      
      if (looks) {
        const looksWithImages = await Promise.all(looks.map(async (lookDesc: GeneratedLook) => {
          const lookItemIds = lookDesc.items.map(i => i.id);
          const lookItems = itemsToUse.filter(item => lookItemIds.includes(item.id));
          const itemImages = lookItems.map(item => item.imageUrl);
          
          const imageUrl = await generateLookImage(userProfile.baseImage, itemImages, lookDesc.explanation);

          return {
            id: lookDesc.look_id,
            name: lookDesc.name,
            description: lookDesc.explanation,
            score: lookDesc.body_affinity_index,
            items: lookItems,
            imageUrl: imageUrl,
          };
        }));
        setGeneratedLooks(looksWithImages);
        setGenerationState('idle');
      }
    } catch (error) {
      console.error("Look generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      setReason(errorMessage);
      setGenerationState('reason');
    }
  };

  return (
    <div className="bg-surface rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-serif text-primary mb-4">Gerador de Looks</h2>
      <p className="text-sm text-text-secondary mb-2">Descreva a ocasião, o estilo ou o ambiente desejado para o seu look.</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: 'Um look casual para um brunch de domingo com amigos, com um toque de cor.'"
        className="w-full flex-grow bg-background border border-text-secondary/50 rounded-md p-3 text-text-main placeholder-text-secondary focus:ring-primary focus:border-primary resize-none"
      />
      <Button onClick={handleGenerate} className="mt-4" disabled={!prompt}>
        <SparklesIcon className="w-5 h-5" />
        Gerar Looks
      </Button>
    </div>
  );
};
