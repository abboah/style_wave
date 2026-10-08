import { createContext } from 'react';
import type { 
  Product, 
  CartItem, 
  ProductCategory, 
  ProductType, 
  MerchantConfig, 
  PlacedOrder,
  StoreAnalytics
} from '../types';

export interface StoreContextType {
  products: Product[];
  filteredProducts: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleSoldOut: (id: string) => void;
  resetProducts: () => void;
  
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  merchantConfig: MerchantConfig;
  updateMerchantConfig: (config: Partial<MerchantConfig>) => void;

  activeType: 'all' | ProductType;
  setActiveType: (type: 'all' | ProductType) => void;
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'newest' | 'price-asc' | 'price-desc') => void;

  // Modals & Panels
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (p: Product | null) => void;

  // Creator Authentication
  isOwnerAuthenticated: boolean;
  loginOwner: (passcode: string) => boolean;
  logoutOwner: () => void;
  openProtectedAction: (action: 'post' | 'dashboard') => void;

  // Customer Wishlist / Saves
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  totalSaves: number;

  // Orders & Analytics
  orders: PlacedOrder[];
  addOrder: (order: PlacedOrder) => void;
  updateOrderStatus: (orderId: string, status: 'pending_payment' | 'confirmed') => void;
  deleteOrder: (orderId: string) => void;
  analytics: StoreAnalytics;
  importProducts: (productsJson: string) => boolean;
  formatCurrency: (amount: number) => string;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);
