import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Lookbook } from './components/Lookbook';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { PostClosetModal } from './components/PostClosetModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MerchantSettingsModal } from './components/MerchantSettingsModal';
import { AuthModal } from './components/AuthModal';
import { DashboardModal } from './components/DashboardModal';
import { Footer } from './components/Footer';

function AppContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <Lookbook />
        <ProductGrid />
      </main>
      <Footer />

      {/* Interactive Modals & Drawers */}
      <ProductModal />
      <PostClosetModal />
      <CartDrawer />
      <CheckoutModal />
      <MerchantSettingsModal />
      <AuthModal />
      <DashboardModal />
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
