export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bangles' | 'bridal' | 'gifts';
  categoryLabel: string;
  images: string[];
  material: string;
  gemstone?: string;
  weight?: string;
  dimensions?: string;
  variants?: ProductVariant[];
  variantType?: 'ring_size' | 'chain_length' | 'metal_finish';
  stockStatus: 'in_stock' | 'low_stock' | 'made_to_order';
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  tags: string[];
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string; // unique cart entry key
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  materials: string[];
  stockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
}
