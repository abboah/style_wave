export type ProductCategory = 
  | 'all'
  | 'hoodies'
  | 'tees'
  | 'jackets'
  | 'pants'
  | 'accessories'
  | 'footwear';

export type ProductType = 'brand' | 'closet';

export type ProductCondition = 
  | 'Brand New' 
  | 'Like New' 
  | 'Gently Worn' 
  | 'Vintage Archive' 
  | 'Custom 1-of-1';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // In Ghana Cedis (GH₵)
  category: ProductCategory;
  type: ProductType; // 'brand' (official drop) or 'closet' (personal closet piece)
  condition?: ProductCondition;
  sizes: string[];
  images: string[];
  isSoldOut?: boolean;
  isFeatured?: boolean;
  brandTag?: string; // e.g. "FW26 Drop", "Archive Vault", "Ghana Exclusive"
  savesCount?: number; // Number of customer saves/wishlists
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface MerchantConfig {
  brandName: string;
  tagline: string;
  location: string;
  currencySymbol: string;
  currencyCode: string;
  yebeckUrl: string; // e.g. https://yebeck.com or custom merchant link
  yebeckMerchantId: string;
  phoneWhatsApp: string;
  instagram: string;
  adminPasscode: string; // Passcode protecting Closet posting and Analytics dashboard
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  notes: string;
}

export interface PlacedOrder {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: OrderCustomerInfo;
  paymentMethod: 'yebeck';
  status: 'pending_payment' | 'confirmed';
  createdAt: string;
}

export interface StoreAnalytics {
  totalVisits: number;
  uniqueVisitors: number;
  lastVisitDate: string;
}
