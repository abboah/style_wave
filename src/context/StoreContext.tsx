import React, { useState, useEffect } from 'react';
import type { 
  Product, 
  CartItem, 
  ProductCategory, 
  ProductType, 
  MerchantConfig, 
  PlacedOrder,
  StoreAnalytics
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { StoreContext } from './storeContextInstance';

const DEFAULT_CONFIG: MerchantConfig = {
  brandName: 'STYLE WAVE',
  tagline: 'Brand Releases & Curated Closet Vault',
  location: 'Ghana',
  currencySymbol: 'GH₵',
  currencyCode: 'GHS',
  yebeckUrl: 'https://yebeck.com',
  yebeckMerchantId: 'stylewave',
  phoneWhatsApp: '+233 55 000 0000',
  instagram: '@stylewave.gh',
  adminPasscode: 'wave2026'
};

const DEFAULT_ANALYTICS: StoreAnalytics = {
  totalVisits: 168,
  uniqueVisitors: 114,
  lastVisitDate: new Date().toISOString()
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from LocalStorage or initial fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('stylewave_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Load cart from LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('stylewave_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    return [];
  });

  // Load config from LocalStorage
  const [merchantConfig, setMerchantConfig] = useState<MerchantConfig>(() => {
    try {
      const saved = localStorage.getItem('stylewave_config');
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load config from storage', e);
    }
    return DEFAULT_CONFIG;
  });

  // Load order history
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('stylewave_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load orders', e);
    }
    return [];
  });

  // Customer Wishlist / Saves
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stylewave_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
    return [];
  });

  // Store Analytics
  const [analytics, setAnalytics] = useState<StoreAnalytics>(() => {
    try {
      const saved = localStorage.getItem('stylewave_analytics');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load analytics', e);
    }
    return DEFAULT_ANALYTICS;
  });

  // Owner Authentication State
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('stylewave_owner_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingProtectedAction, setPendingProtectedAction] = useState<'post' | 'dashboard' | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Filter & Search states
  const [activeType, setActiveType] = useState<'all' | ProductType>('all');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Increment visit counter on session mount
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('stylewave_session_visited');
    if (!hasVisited) {
      sessionStorage.setItem('stylewave_session_visited', 'true');
      setAnalytics(prev => ({
        totalVisits: prev.totalVisits + 1,
        uniqueVisitors: prev.uniqueVisitors + 1,
        lastVisitDate: new Date().toISOString()
      }));
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('stylewave_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to persist products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('stylewave_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('stylewave_config', JSON.stringify(merchantConfig));
    } catch (e) {
      console.error('Failed to persist config', e);
    }
  }, [merchantConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('stylewave_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('stylewave_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('stylewave_analytics', JSON.stringify(analytics));
    } catch (e) {
      console.error('Failed to persist analytics', e);
    }
  }, [analytics]);

  // Auth methods
  const loginOwner = (passcode: string): boolean => {
    if (passcode.trim() === merchantConfig.adminPasscode.trim()) {
      setIsOwnerAuthenticated(true);
      try {
        sessionStorage.setItem('stylewave_owner_auth', 'true');
      } catch {}
      setIsAuthModalOpen(false);

      // Execute pending action if any
      if (pendingProtectedAction === 'post') {
        setIsPostModalOpen(true);
      } else if (pendingProtectedAction === 'dashboard') {
        setIsDashboardOpen(true);
      }
      setPendingProtectedAction(null);
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwnerAuthenticated(false);
    try {
      sessionStorage.removeItem('stylewave_owner_auth');
    } catch {}
    setIsPostModalOpen(false);
    setIsDashboardOpen(false);
  };

  const openProtectedAction = (action: 'post' | 'dashboard') => {
    if (isOwnerAuthenticated) {
      if (action === 'post') setIsPostModalOpen(true);
      if (action === 'dashboard') setIsDashboardOpen(true);
    } else {
      setPendingProtectedAction(action);
      setIsAuthModalOpen(true);
    }
  };

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const isSaved = prev.includes(productId);
      const next = isSaved ? prev.filter(id => id !== productId) : [...prev, productId];
      
      // Update savesCount on the product
      setProducts(prods => prods.map(p => {
        if (p.id === productId) {
          const currentSaves = p.savesCount || 0;
          return {
            ...p,
            savesCount: isSaved ? Math.max(0, currentSaves - 1) : currentSaves + 1
          };
        }
        return p;
      }));

      return next;
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const totalSaves = products.reduce((acc, p) => acc + (p.savesCount || 0), 0);

  // Product actions
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProd,
      id: `sw-${Date.now().toString(36)}`,
      savesCount: 0,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const toggleSoldOut = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isSoldOut: !p.isSoldOut } : p));
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  const updateMerchantConfig = (config: Partial<MerchantConfig>) => {
    setMerchantConfig(prev => ({ ...prev, ...config }));
  };

  const addOrder = (order: PlacedOrder) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: 'pending_payment' | 'confirmed') => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status } : o));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
  };

  const importProducts = (productsJson: string): boolean => {
    try {
      const parsed = JSON.parse(productsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setProducts(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid products JSON', e);
    }
    return false;
  };

  // Cart actions
  const addToCart = (product: Product, size: string, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, selectedSize: size, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === size) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const formatCurrency = (amount: number) => {
    return `${merchantConfig.currencySymbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Filtered & sorted products computation
  const filteredProducts = products.filter(product => {
    if (activeType !== 'all' && product.type !== activeType) {
      return false;
    }
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchTag = product.brandTag?.toLowerCase().includes(q);
      const matchCondition = product.condition?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag && !matchCondition) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <StoreContext.Provider
      value={{
        products,
        filteredProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleSoldOut,
        resetProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        merchantConfig,
        updateMerchantConfig,
        activeType,
        setActiveType,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        isPostModalOpen,
        setIsPostModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isDashboardOpen,
        setIsDashboardOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        isOwnerAuthenticated,
        loginOwner,
        logoutOwner,
        openProtectedAction,
        wishlist,
        toggleWishlist,
        isWishlisted,
        totalSaves,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        analytics,
        importProducts,
        formatCurrency,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
