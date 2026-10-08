import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Shirt } from 'lucide-react';
import { useStore } from '../context/useStore';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal, 
    cartCount,
    formatCurrency, 
    setIsCheckoutModalOpen
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--accent-cyan)" />
            <h2 className="font-brand" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              YOUR BAG
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          <button 
            onClick={() => setIsCartOpen(false)}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', padding: '0.4rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body: Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div 
                key={`${item.product.id}-${item.selectedSize}-${idx}`}
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '1rem', 
                  background: 'var(--bg-surface-elevated)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)' 
                }}
              >
                {/* Thumbnail */}
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.title} 
                  style={{ width: '70px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {item.product.title}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                        Size: {item.selectedSize}
                      </span>
                      {item.product.type === 'closet' && (
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Shirt size={12} />
                          Closet Piece
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
                    <span className="font-brand" style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--accent-cyan)' }}>
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.2rem 0.55rem', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.2rem 0.55rem', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
              <ShoppingBag size={40} color="var(--border-medium)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Your shopping bag is empty</div>
              <p style={{ fontSize: '0.82rem', maxWidth: '240px', margin: '0 auto 1.5rem' }}>
                Discover our latest brand releases or explore rare drops in the closet vault.
              </p>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer: Subtotal & Checkout */}
        {cart.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Subtotal:</span>
              <span className="font-brand" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(cartTotal)}
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} color="var(--accent-cyan)" />
              <span>Checkout connected to <strong>Yebeck</strong> (Ghana MoMo / Cards)</span>
            </div>

            <button 
              className="btn btn-cyan btn-lg"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
