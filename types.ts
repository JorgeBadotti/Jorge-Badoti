
export enum AppMode {
  Consumer = 'Consumer',
  EStylist = 'e-Stylist',
}

export interface UserProfile {
  name: string;
  baseImage: string;
  personalStyle: string;
  bodyType: string;
  measurements: {
    bust: number;
    waist: number;
    hips: number;
    height: number;
  };
}

export enum ClothingCategory {
  Blusas = 'Blusas',
  Calcas = 'Calças',
  Camisas = 'Camisas',
  Camisetas = 'Camisetas',
  Polos = 'Polos',
  Regatas = 'Regatas',
  JaquetasECasacos = 'Jaquetas e Casacos',
  JeansESarja = 'Jeans e Sarja',
  Macacao = 'Macacão',
  Saias = 'Saias',
  Shorts = 'Shorts',
  Bermudas = 'Bermudas',
  Vestidos = 'Vestidos',
  Calcados = 'Calçados',
  Acessorios = 'Acessórios',
  All = 'Todas'
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: ClothingCategory;
  imageUrl: string;
  isFavorite: boolean;
  creationYear: number;
  manualTechnique: string;
  fiberOrigin: string;
  itemStatus: string;
}

export interface Product extends Omit<WardrobeItem, 'isFavorite' | 'creationYear' | 'manualTechnique' | 'fiberOrigin' | 'itemStatus'> {
  brand: string;
  price: number;
}

export interface Look {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  score: number;
  items: (WardrobeItem | Product)[];
}

export interface LookItemReference {
  id: string;
  name: string;
  source: 'closet' | 'store';
}

export interface GeneratedLook {
  look_id: string;
  name: string;
  explanation: string;
  items: LookItemReference[];
  body_affinity_index: number;
  status: string;
}
