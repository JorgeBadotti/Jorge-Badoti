
import React from 'react';
import { Product } from '../types';
import { CheckCircleIcon } from './icons';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onSelect }) => {
  return (
    <div
      className={`relative group bg-background rounded-lg overflow-hidden shadow-lg transition-all duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-primary' : 'ring-2 ring-transparent'}`}
      onClick={() => onSelect(product.id)}
    >
      <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover group-hover:opacity-80 transition-opacity" />
      
      {isSelected && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <CheckCircleIcon className="w-10 h-10 text-primary" />
        </div>
      )}

      <div className="p-2">
        <p className="text-xs font-medium text-text-main truncate">{product.name}</p>
        <p className="text-xs text-text-secondary">{product.brand}</p>
      </div>
    </div>
  );
};
