import React, { useState } from 'react';
import { 
  ShoppingBag, 
  PlusCircle, 
  Sliders, 
  Search, 
  X, 
  Heart,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/useStore';

export const Navbar: React.FC = () => {
  const { 
    merchantConfig, 
    cartCount, 
    setIsCartOpen, 
    activeType,
    setActiveType,
    searchQuery,
    setSearchQuery,
    isOwnerAuthenticated,
    openProtectedAction,
    wishlist,
    setIsSettingsModalOpen
  } = useStore();

  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="site-header" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      background: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)', 
      borderBottom: '1px solid var(--border-medium)' 
    }}>
      {/* Minimal Top Notification Bar */}
      <div className="site-notice" style={{ 
        background: '#f8fafc', 
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.35rem 1rem', 
        fontSize: '0.72rem', 
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center',
        letterSpacing: '0.04em'
      }}>
        <span>📍 <strong>GHANA</strong></span>
        <span style={{ color: '#cbd5e1' }}>•</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <ShieldCheck size={12} color="#059669" />
          <span>SECURE GH₵ PAYMENTS VIA <strong>YEBECK</strong></span>
        </div>
        <span style={{ color: '#cbd5e1' }}>•</span>
        <span>BRAND RELEASES & CLOSET DROPS</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="site-nav container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div className="site-brand-group" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveType('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '6px', 
              background: '#090d16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12c1-3 4-5 8-5 4 0 7 3 9 7 1 2 2 3 3 3" />
                <path d="M2 17c1-3 4-5 8-5 4 0 7 3 9 7 1 2 2 3 3 3" />
              </svg>
            </div>
            <div>
              <div className="font-brand" style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#090d16', lineHeight: 1 }}>
                {merchantConfig.brandName}
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                GHANA
              </div>
            </div>
          </a>

          {/* Quick Collection Switcher */}
          <nav className="collection-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button 
              className={`pill-tab ${activeType === 'all' ? 'active' : ''}`}
              onClick={() => setActiveType('all')}
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
            >
              All Drops
            </button>
            <button 
              className={`pill-tab ${activeType === 'brand' ? 'active' : ''}`}
              onClick={() => setActiveType('brand')}
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
            >
              Brand
            </button>
            <button 
              className={`pill-tab ${activeType === 'closet' ? 'active' : ''}`}
              onClick={() => setActiveType('closet')}
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
            >
              Closet Vault
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="site-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* Search Bar */}
          {showSearchInput ? (
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '0.25rem 0.6rem', border: '1px solid var(--border-medium)', gap: '0.35rem' }}>
              <Search size={14} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search pieces..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#090d16', fontSize: '0.82rem', width: '150px' }}
              />
              <button 
                onClick={() => { setSearchQuery(''); setShowSearchInput(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowSearchInput(true)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.5rem' }}
              title="Search"
            >
              <Search size={17} />
            </button>
          )}

          {/* Saves Indicator */}
          {wishlist.length > 0 && (
            <button 
              onClick={() => {
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.5rem', position: 'relative' }}
              title="Saved items"
            >
              <Heart size={17} fill="#e11d48" color="#e11d48" />
              <span style={{ position: 'absolute', top: '1px', right: '1px', background: '#e11d48', color: '#fff', fontSize: '0.62rem', fontWeight: 800, width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishlist.length}
              </span>
            </button>
          )}

          {/* "+ Post Closet" Trigger (Protected by Passcode) */}
          <button 
            onClick={() => openProtectedAction('post')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Post a piece from closet"
          >
            <PlusCircle size={15} />
            <span>Post Closet</span>
          </button>

          {/* Creator Dashboard Button (Protected by Passcode) */}
          <button 
            onClick={() => openProtectedAction('dashboard')}
            className={`btn ${isOwnerAuthenticated ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Creator Analytics & Orders Dashboard"
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          {/* Settings */}
          <button 
            onClick={() => setIsSettingsModalOpen(true)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.5rem' }}
            title="Settings"
          >
            <Sliders size={17} />
          </button>

          {/* Cart Trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem' }}
          >
            <ShoppingBag size={16} />
            <span style={{ fontWeight: 700 }}>Bag</span>
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-5px', 
                right: '-5px', 
                background: '#e11d48', 
                color: '#fff', 
                fontWeight: 900, 
                fontSize: '0.68rem', 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
