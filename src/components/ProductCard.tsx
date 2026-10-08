import React from 'react';
import { ShoppingBag, Eye, Check, Shirt, Trash2, Tag, Heart } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/useStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatCurrency, 
    addToCart, 
    setSelectedProductForModal,
    toggleSoldOut,
    deleteProduct,
    isWishlisted,
    toggleWishlist,
    isOwnerAuthenticated
  } = useStore();

  const saved = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isSoldOut) return;
    const defaultSize = product.sizes[0] || 'Standard';
    addToCart(product, defaultSize, 1);
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCardClick = () => {
    setSelectedProductForModal(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      
      {/* Image Container */}
      <div className="product-image-container">
        <img 
          src={product.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'} 
          alt={product.title} 
          className="product-image"
          loading="lazy"
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', zIndex: 5 }}>
          {product.type === 'brand' ? (
            <span className="badge badge-brand">
              <Tag size={10} />
              BRAND
            </span>
          ) : (
            <span className="badge badge-closet">
              <Shirt size={10} />
              CLOSET
            </span>
          )}

          {product.isSoldOut && (
            <span className="badge badge-sold">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Heart / Wishlist Save Button */}
        <button 
          onClick={handleSaveToggle}
          className={`btn-save ${saved ? 'saved' : ''}`}
          title={saved ? 'Remove from saved' : 'Save this piece'}
        >
          <Heart size={16} fill={saved ? '#e11d48' : 'none'} color={saved ? '#e11d48' : '#090d16'} />
        </button>

        {/* Hover Quick Actions */}
        <div className="product-card-overlay">
          <div style={{ width: '100%', display: 'flex', gap: '0.4rem' }}>
            <button 
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, padding: '0.45rem' }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProductForModal(product);
              }}
            >
              <Eye size={14} />
              <span>Details</span>
            </button>

            {!product.isSoldOut && (
              <button 
                className="btn btn-primary btn-sm"
                style={{ flex: 1, padding: '0.45rem' }}
                onClick={handleQuickAdd}
              >
                <ShoppingBag size={14} />
                <span>+ Bag</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category / Sizes / Saves indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{product.category}</span>
            <span>{product.sizes.join(' • ')}</span>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#090d16', lineHeight: 1.35, marginBottom: '0.5rem' }}>
            {product.title}
          </h3>
        </div>

        <div>
          {/* Price & Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="font-brand" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#090d16' }}>
              {formatCurrency(product.price)}
            </div>

            {/* Owner Controls (only visible when creator is authenticated) */}
            {isOwnerAuthenticated && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggleSoldOut(product.id)}
                  className="btn btn-ghost btn-sm"
                  title={product.isSoldOut ? "Mark as In Stock" : "Mark as Sold Out"}
                  style={{ padding: '0.3rem', color: product.isSoldOut ? '#059669' : 'var(--text-muted)' }}
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove "${product.title}" from store?`)) {
                      deleteProduct(product.id);
                    }
                  }}
                  className="btn btn-ghost btn-sm"
                  title="Delete item"
                  style={{ padding: '0.3rem', color: '#e11d48' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
