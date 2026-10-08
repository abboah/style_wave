import { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Tag, Shirt, Check, Truck, Ruler } from 'lucide-react';
import { useStore } from '../context/useStore';
import type { Product } from '../types';

interface ProductModalContentProps {
  product: Product;
  onClose: () => void;
}

const ProductModalContent: React.FC<ProductModalContentProps> = ({ product, onClose }) => {
  const { formatCurrency, addToCart, merchantConfig } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    addToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1200);
  };

  return (
    <div 
      className="modal-content product-modal" 
      onClick={(e) => e.stopPropagation()} 
      style={{ maxWidth: '850px', padding: 0, overflow: 'hidden' }}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10,
          background: 'rgba(10, 12, 16, 0.75)',
          border: '1px solid var(--border-medium)',
          color: '#fff',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)'
        }}
      >
        <X size={18} />
      </button>

      <div className="product-modal-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        
        {/* Image Gallery Column */}
        <div style={{ background: '#0e1118', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden' }}>
            <img 
              src={product.images[selectedImageIndex] || product.images[0]} 
              alt={product.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {product.isSoldOut && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="badge badge-sold" style={{ fontSize: '1rem', padding: '0.5rem 1.25rem' }}>SOLD OUT</span>
              </div>
            )}
          </div>

          {/* Thumbnail switcher if multiple images */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', overflowX: 'auto', background: 'rgba(0,0,0,0.2)' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: selectedImageIndex === idx ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    padding: 0,
                    cursor: 'pointer',
                    background: '#151922'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Actions Column */}
        <div className="product-modal-details" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {product.type === 'brand' ? (
                <span className="badge badge-brand">
                  <Tag size={12} />
                  OFFICIAL BRAND DROP
                </span>
              ) : (
                <span className="badge badge-closet">
                  <Shirt size={12} />
                  CREATOR'S CLOSET VAULT
                </span>
              )}

              {product.condition && (
                <span className="badge badge-subtle">
                  Condition: {product.condition}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-brand" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
              {product.title}
            </h2>

            {/* Price in Cedis */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className="font-brand text-gradient-cyan" style={{ fontSize: '1.85rem', fontWeight: 900 }}>
                {formatCurrency(product.price)}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                (in Ghana Cedis)
              </span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Size Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    Select Size
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <Ruler size={13} />
                    <span>{showSizeGuide ? 'Hide Guide' : 'Size Guide'}</span>
                  </button>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                  Selected: {selectedSize}
                </span>
              </div>

              {/* Collapsible Size Guide Table */}
              {showSizeGuide && (
                <div style={{ 
                  background: 'var(--bg-surface-elevated)', 
                  border: '1px solid var(--border-medium)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '0.75rem', 
                  marginBottom: '0.75rem', 
                  fontSize: '0.75rem' 
                }}>
                  <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                    Measurement Chart (Inches)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>Size</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>Chest</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>Length</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>Fit</span>

                    <span>S</span><span>38"</span><span>27"</span><span>Relaxed</span>
                    <span>M</span><span>42"</span><span>28"</span><span>Boxy</span>
                    <span>L</span><span>46"</span><span>29"</span><span>Oversized</span>
                    <span>XL</span><span>50"</span><span>30"</span><span>Drop-shoulder</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem' }}>
                    💡 Pro tip: Take your usual size for standard streetwear drape, or size up for an exaggerated look.
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: selectedSize === size ? '2px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
                      background: selectedSize === size ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-surface-elevated)',
                      color: selectedSize === size ? '#ffffff' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            {!product.isSoldOut && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Quantity:
                </label>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)' }}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ background: 'none', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ background: 'none', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Add to Bag CTA & Payment Assurance */}
          <div>
            <button 
              className={`btn ${addedAnimation ? 'btn-secondary' : 'btn-cyan'} btn-lg`}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
              disabled={product.isSoldOut}
              onClick={handleAddToCart}
            >
              {product.isSoldOut ? (
                <span>Sold Out</span>
              ) : addedAnimation ? (
                <>
                  <Check size={20} color="#10b981" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  <span>Add to Bag • {formatCurrency(product.price * quantity)}</span>
                </>
              )}
            </button>

            {/* Yebeck & Delivery assurances */}
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={14} color="var(--accent-cyan)" />
                <span>Payments secured by <strong>Yebeck</strong> (Ghana MoMo / Cards)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={14} color="var(--accent-gold)" />
                <span>Dispatched from {merchantConfig.location} with tracking</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export const ProductModal: React.FC = () => {
  const { selectedProductForModal, setSelectedProductForModal } = useStore();

  if (!selectedProductForModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedProductForModal(null)}>
      <ProductModalContent 
        key={selectedProductForModal.id}
        product={selectedProductForModal} 
        onClose={() => setSelectedProductForModal(null)} 
      />
    </div>
  );
};
