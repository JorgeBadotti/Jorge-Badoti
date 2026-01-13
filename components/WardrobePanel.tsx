
import React, { useState, useMemo } from 'react';
import { WardrobeItem, ClothingCategory, Look } from '../types';
import { WardrobeCard } from './WardrobeCard';
import { LookCard } from './LookCard';
import { AddItemForm } from './AddItemForm';
import { Button } from './common/Button';
import { SearchInput } from './common/SearchInput';
import { Dropdown } from './common/Dropdown';
import { PlusIcon, ArrowsPointingOutIcon } from './icons';
import { FILTER_OPTIONS, CATEGORY_FILTERS, SORT_OPTIONS } from '../constants';

interface WardrobePanelProps {
  wardrobe: WardrobeItem[];
  setWardrobe: React.Dispatch<React.SetStateAction<WardrobeItem[]>>;
  savedLooks: Look[];
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onFullScreenToggle?: () => void;
  isFullScreen?: boolean;
}

export const WardrobePanel: React.FC<WardrobePanelProps> = ({ wardrobe, setWardrobe, savedLooks, selectedItems, onSelectItem, onFullScreenToggle, isFullScreen = false }) => {
  const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>(ClothingCategory.All);
  
  const [filters, setFilters] = useState({
    manualTechnique: '',
    fiberOrigin: '',
    itemStatus: '',
  });

  const [sort, setSort] = useState('relevance');

  const handleAddItems = (newItems: Omit<WardrobeItem, 'id' | 'isFavorite' | 'creationYear' | 'manualTechnique' | 'fiberOrigin' | 'itemStatus'>[]) => {
    const itemsToAdd: WardrobeItem[] = newItems.map(item => ({
      ...item,
      id: `w-${Date.now()}-${Math.random()}`,
      isFavorite: false,
      creationYear: new Date().getFullYear(),
      manualTechnique: 'Industrial',
      fiberOrigin: 'Sintética',
      itemStatus: 'Pronto',
    }));
    setWardrobe(prev => [...itemsToAdd, ...prev]);
  };

  const handleFavorite = (id: string) => {
    setWardrobe(w => w.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  };

  const handleRemove = (id: string) => {
    setWardrobe(w => w.filter(item => item.id !== id));
  };
  
  const filteredAndSortedWardrobe = useMemo(() => {
    let items = wardrobe
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(item => activeCategory === ClothingCategory.All || item.category === activeCategory)
      .filter(item => !filters.manualTechnique || item.manualTechnique === filters.manualTechnique)
      .filter(item => !filters.fiberOrigin || item.fiberOrigin === filters.fiberOrigin)
      .filter(item => !filters.itemStatus || item.itemStatus === filters.itemStatus);
    
    if (sort === 'relevance') {
      items.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    } else if (sort === 'newest') {
      items.sort((a, b) => b.creationYear - a.creationYear);
    } else if (sort === 'oldest') {
      items.sort((a, b) => a.creationYear - b.creationYear);
    }
    
    return items;
  }, [wardrobe, searchTerm, activeCategory, filters, sort]);

  return (
    <div className="bg-surface rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif text-primary">Guarda-Roupa</h2>
        <div className="flex gap-2">
            {!isFullScreen && onFullScreenToggle && (
                <Button onClick={onFullScreenToggle} variant="ghost" className="px-2" aria-label="Ver em tela cheia">
                    <ArrowsPointingOutIcon className="w-5 h-5" />
                </Button>
            )}
            <Button onClick={() => setAddItemModalOpen(true)} variant="secondary" className="px-2" aria-label="Adicionar item">
                <PlusIcon className="w-5 h-5" />
            </Button>
        </div>
      </div>
      
      {savedLooks.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Looks Salvos</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {savedLooks.map(look => <LookCard key={look.id} look={look} />)}
          </div>
        </div>
      )}

      <div className="space-y-3 mb-4">
        <SearchInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar por peça..." />
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
            <Dropdown label="Técnica" options={{'': 'Todas', ...FILTER_OPTIONS.manualTechnique.reduce((acc, v) => ({ ...acc, [v]: v }), {})}} selectedValue={filters.manualTechnique} onSelect={v => setFilters(f => ({...f, manualTechnique: v}))} />
            <Dropdown label="Origem" options={{'': 'Todas', ...FILTER_OPTIONS.fiberOrigin.reduce((acc, v) => ({ ...acc, [v]: v }), {})}} selectedValue={filters.fiberOrigin} onSelect={v => setFilters(f => ({...f, fiberOrigin: v}))} />
            <Dropdown label="Status" options={{'': 'Todos', ...FILTER_OPTIONS.itemStatus.reduce((acc, v) => ({ ...acc, [v]: v }), {})}} selectedValue={filters.itemStatus} onSelect={v => setFilters(f => ({...f, itemStatus: v}))} />
            <Dropdown label="Ordenar" options={SORT_OPTIONS} selectedValue={sort} onSelect={setSort} />
        </div>
      </div>

       <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 mb-2">
          {CATEGORY_FILTERS.map(category => (
            <button key={category} onClick={() => setActiveCategory(category)} className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${activeCategory === category ? 'bg-primary text-background font-semibold' : 'bg-background hover:bg-white/10'}`}>
              {category}
            </button>
          ))}
        </div>

      <div className={`flex-grow overflow-y-auto -mx-1 ${isFullScreen ? 'pr-2' : ''}`}>
        <div className={`grid ${isFullScreen ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : 'grid-cols-2'} gap-3 p-1`}>
          {filteredAndSortedWardrobe.map(item => (
            <WardrobeCard
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onSelect={onSelectItem}
              onFavorite={handleFavorite}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
      
      <AddItemForm
        isOpen={isAddItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        onAddItems={handleAddItems}
      />
    </div>
  );
};
