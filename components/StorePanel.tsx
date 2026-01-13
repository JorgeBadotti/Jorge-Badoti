
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SearchInput } from './common/SearchInput';

interface StorePanelProps {
  products: Product[];
  selectedItems: string[];
  onSelectItem: (id: string) => void;
}

export const StorePanel: React.FC<StorePanelProps> = ({ products, selectedItems, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="bg-surface rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-xl font-serif text-primary mb-2">Loja</h2>
      <div 
        className="w-full h-20 bg-cover bg-center rounded-md mb-4" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/storebanner/400/100')" }}
      ></div>
      
      <div className="mb-4">
        <SearchInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar na loja..." />
      </div>

      <div className="flex-grow overflow-y-auto -mx-1 pr-2">
        <div className="grid grid-cols-2 gap-3 p-1">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedItems.includes(product.id)}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
