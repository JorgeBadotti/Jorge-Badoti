
import { UserProfile, WardrobeItem, ClothingCategory, Product, Look } from './types';

export const PREDEFINED_MODELS = [
  { id: 'model1', name: 'Model 1', imageUrl: 'https://picsum.photos/seed/model1/400/600' },
  { id: 'model2', name: 'Model 2', imageUrl: 'https://picsum.photos/seed/model2/400/600' },
  { id: 'model3', name: 'Model 3', imageUrl: 'https://picsum.photos/seed/model3/400/600' },
  { id: 'model4', name: 'Model 4', imageUrl: 'https://picsum.photos/seed/model4/400/600' },
];

export const PERSONAL_STYLES = [
  { id: 'classic', name: 'Clássico', imageUrl: 'https://picsum.photos/seed/classic/200/200' },
  { id: 'boho', name: 'Boho', imageUrl: 'https://picsum.photos/seed/boho/200/200' },
  { id: 'minimalist', name: 'Minimalista', imageUrl: 'https://picsum.photos/seed/minimalist/200/200' },
  { id: 'streetwear', name: 'Streetwear', imageUrl: 'https://picsum.photos/seed/streetwear/200/200' },
];

export const BODY_TYPES = [
  { id: 'hourglass', name: 'Ampulheta', imageUrl: 'https://picsum.photos/seed/hourglass/200/200' },
  { id: 'rectangle', name: 'Retângulo', imageUrl: 'https://picsum.photos/seed/rectangle/200/200' },
  { id: 'pear', name: 'Pêra', imageUrl: 'https://picsum.photos/seed/pear/200/200' },
  { id: 'apple', name: 'Maçã', imageUrl: 'https://picsum.photos/seed/apple/200/200' },
];

export const MOCK_WARDROBE: WardrobeItem[] = [
  { id: 'w1', name: 'Camisa Branca de Linho', category: ClothingCategory.Camisas, imageUrl: 'https://picsum.photos/seed/w1/300/400', isFavorite: true, creationYear: 2023, manualTechnique: 'Alfaiataria', fiberOrigin: 'Orgânica', itemStatus: 'Pronto' },
  { id: 'w2', name: 'Calça Jeans Reta', category: ClothingCategory.JeansESarja, imageUrl: 'https://picsum.photos/seed/w2/300/400', isFavorite: false, creationYear: 2022, manualTechnique: 'Industrial', fiberOrigin: 'Reciclada', itemStatus: 'Legado' },
  { id: 'w3', name: 'Tênis de Couro Branco', category: ClothingCategory.Calcados, imageUrl: 'https://picsum.photos/seed/w3/300/400', isFavorite: true, creationYear: 2024, manualTechnique: 'Industrial', fiberOrigin: 'Sintética', itemStatus: 'Pronto' },
  { id: 'w4', name: 'Blazer Preto Estruturado', category: ClothingCategory.JaquetasECasacos, imageUrl: 'https://picsum.photos/seed/w4/300/400', isFavorite: false, creationYear: 2021, manualTechnique: 'Alfaiataria', fiberOrigin: 'Sintética', itemStatus: 'Legado' },
  { id: 'w5', name: 'Vestido Floral Midi', category: ClothingCategory.Vestidos, imageUrl: 'https://picsum.photos/seed/w5/300/400', isFavorite: true, creationYear: 2023, manualTechnique: 'Crochê', fiberOrigin: 'Orgânica', itemStatus: 'Em Processo' },
];

export const MOCK_STORE_PRODUCTS: Product[] = [
  { id: 's1', name: 'Bolsa Tote de Couro', category: ClothingCategory.Acessorios, imageUrl: 'https://picsum.photos/seed/s1/300/400', brand: 'Marca Famosa', price: 299.90 },
  { id: 's2', name: 'Saia Plissada Metálica', category: ClothingCategory.Saias, imageUrl: 'https://picsum.photos/seed/s2/300/400', brand: 'Designer Cool', price: 450.00 },
  { id: 's3', name: 'Bota Coturno Preta', category: ClothingCategory.Calcados, imageUrl: 'https://picsum.photos/seed/s3/300/400', brand: 'Marca Clássica', price: 699.90 },
  { id: 's4', name: 'Jaqueta Jeans Oversized', category: ClothingCategory.JaquetasECasacos, imageUrl: 'https://picsum.photos/seed/s4/300/400', brand: 'Marca Jovem', price: 349.90 },
];

export const MOCK_SAVED_LOOKS: Look[] = [
    { id: 'l1', name: 'Casual Chic de Verão', description: 'Um look leve e elegante para um passeio à tarde.', imageUrl: 'https://picsum.photos/seed/look1/400/600', score: 9.2, items: [MOCK_WARDROBE[0], MOCK_WARDROBE[1]] },
    { id: 'l2', name: 'Poder Executivo', description: 'Combinação clássica para reuniões de negócios.', imageUrl: 'https://picsum.photos/seed/look2/400/600', score: 9.5, items: [MOCK_WARDROBE[3], MOCK_WARDROBE[1]] },
];

export const FILTER_OPTIONS = {
  manualTechnique: ['Alfaiataria', 'Crochê', 'Industrial'],
  fiberOrigin: ['Orgânica', 'Reciclada', 'Sintética'],
  itemStatus: ['Legado', 'Em Processo', 'Pronto']
};

export const CATEGORY_FILTERS: ClothingCategory[] = [
  ClothingCategory.All,
  ClothingCategory.Blusas,
  ClothingCategory.Camisas,
  ClothingCategory.Camisetas,
  ClothingCategory.Polos,
  ClothingCategory.Regatas,
  ClothingCategory.Calcas,
  ClothingCategory.JeansESarja,
  ClothingCategory.Bermudas,
  ClothingCategory.Shorts,
  ClothingCategory.Saias,
  ClothingCategory.Vestidos,
  ClothingCategory.Macacao,
  ClothingCategory.JaquetasECasacos,
  ClothingCategory.Calcados,
  ClothingCategory.Acessorios,
];

export const SORT_OPTIONS = {
  relevance: 'Relevância Emocional',
  newest: 'Longevidade (Mais Novo)',
  oldest: 'Longevidade (Mais Antigo)'
};