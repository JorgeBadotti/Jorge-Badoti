
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WardrobePanel } from './components/WardrobePanel';
import { StylePanel } from './components/StylePanel';
import { MainPanel } from './components/MainPanel';
import { StorePanel } from './components/StorePanel';
import { ProfileModal } from './components/ProfileModal';
import { useUserProfile } from './hooks/useUserProfile';
import { AppMode, Look, WardrobeItem, Product, UserProfile } from './types';
import { MOCK_WARDROBE, MOCK_STORE_PRODUCTS, MOCK_SAVED_LOOKS } from './constants';
import { ArrowUturnLeftIcon } from './components/icons';

type GenerationState = 'idle' | 'loading' | 'error' | 'reason' | 'success';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.Consumer);
  const { userProfile, saveUserProfile, isProfileComplete } = useUserProfile();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(MOCK_WARDROBE);
  const [storeProducts] = useState<Product[]>(MOCK_STORE_PRODUCTS);
  const [savedLooks, setSavedLooks] = useState<Look[]>(MOCK_SAVED_LOOKS);
  
  const [selectedWardrobeItems, setSelectedWardrobeItems] = useState<string[]>([]);
  const [selectedStoreItems, setSelectedStoreItems] = useState<string[]>([]);
  
  const [generatedLooks, setGeneratedLooks] = useState<Look[] | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [reason, setReason] = useState<string | null>(null);

  const [isWardrobeFullScreen, setWardrobeFullScreen] = useState(false);

  useEffect(() => {
    if (!isProfileComplete) {
      setProfileModalOpen(true);
    }
  }, [isProfileComplete]);

  const handleProfileSave = (profile: UserProfile) => {
    saveUserProfile(profile);
    setProfileModalOpen(false);
  };

  const handleSaveLook = (look: Look) => {
    if (!savedLooks.find(l => l.id === look.id)) {
      setSavedLooks(prev => [...prev, look]);
    }
  };

  const toggleWardrobeItemSelection = (id: string) => {
    setSelectedWardrobeItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleStoreItemSelection = (id: string) => {
    setSelectedStoreItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background text-text-main font-sans flex flex-col">
      <Header 
        mode={mode} 
        setMode={setMode} 
        onProfileClick={() => setProfileModalOpen(true)}
      />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 h-[calc(100vh-80px)]">
        {isWardrobeFullScreen ? (
          <div className="col-span-12 relative h-full animate-fade-in">
             <button
              onClick={() => setWardrobeFullScreen(false)}
              className="absolute top-4 right-4 z-20 bg-surface/50 hover:bg-surface text-primary p-2 rounded-full transition-colors backdrop-blur-sm"
            >
              <ArrowUturnLeftIcon className="w-6 h-6" />
            </button>
            <WardrobePanel
              wardrobe={wardrobe}
              setWardrobe={setWardrobe}
              savedLooks={savedLooks}
              selectedItems={selectedWardrobeItems}
              onSelectItem={toggleWardrobeItemSelection}
              isFullScreen
            />
          </div>
        ) : (
          <>
            <div className="hidden lg:block lg:col-span-3 h-full">
              <WardrobePanel
                wardrobe={wardrobe}
                setWardrobe={setWardrobe}
                savedLooks={savedLooks}
                selectedItems={selectedWardrobeItems}
                onSelectItem={toggleWardrobeItemSelection}
                onFullScreenToggle={() => setWardrobeFullScreen(true)}
              />
            </div>
            <div className="lg:col-span-6 h-full flex flex-col gap-4">
              <MainPanel
                userProfile={userProfile}
                generatedLooks={generatedLooks}
                generationState={generationState}
                reason={reason}
                onSaveLook={handleSaveLook}
              />
            </div>
            <div className="lg:col-span-3 h-full flex flex-col gap-4">
              <StylePanel
                userProfile={userProfile}
                wardrobe={wardrobe}
                storeProducts={storeProducts}
                selectedWardrobeItems={selectedWardrobeItems}
                selectedStoreItems={selectedStoreItems}
                setGeneratedLooks={setGeneratedLooks}
                setGenerationState={setGenerationState}
                setReason={setReason}
                mode={mode}
              />
              <StorePanel
                products={storeProducts}
                selectedItems={selectedStoreItems}
                onSelectItem={toggleStoreItemSelection}
              />
            </div>
          </>
        )}
      </main>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => isProfileComplete && setProfileModalOpen(false)}
        onSave={handleProfileSave}
        initialProfile={userProfile}
      />
    </div>
  );
}
