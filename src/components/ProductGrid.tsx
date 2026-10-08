import React from 'react';
import { ArrowUpDown, PlusCircle, Shirt, Tag } from 'lucide-react';
import { useStore } from '../context/useStore';
import { ProductCard } from './ProductCard';
import type { ProductCategory, ProductType } from '../types';

export const ProductGrid: React.FC = () => {
  const { 
    filteredProducts, 
    products,
    activeType, 
    setActiveType, 
    activeCategory, 
    setActiveCategory,
    sortBy,
    setSortBy,
    searchQuery,
    openProtectedAction
  } = useStore();

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All', value: 'all' },
    { label: 'Hoodies', value: 'hoodies' },
    { label: 'Graphic Tees', value: 'tees' },
    { label: 'Jackets', value: 'jackets' },
    { label: 'Cargo & Pants', value: 'pants' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const brandCount = products.filter(p => p.type === 'brand').length;
  const closetCount = products.filter(p => p.type === 'closet').length;

  return (
    <section id="catalog-section" style={{ padding: '3rem 1.25rem 5rem', background: '#ffffff' }}>
      <div className="container">
        
        {/* Filter Navigation Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          <div className="catalog-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="font-brand" style={{ fontSize: '1.65rem', fontWeight: 900, color: '#090d16' }}>
                CURRENT DROPS
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available in Ghana
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Source Segmented Control */}
            <div className="catalog-source-tabs" style={{ 
              display: 'inline-flex', 
              background: '#f8fafc', 
              padding: '0.3rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-medium)',
              gap: '0.3rem'
            }}>
              <button 
                onClick={() => setActiveType('all')}
                style={{
                  background: activeType === 'all' ? '#090d16' : 'transparent',
                  color: activeType === 'all' ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.85rem',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                All ({products.length})
              </button>

              <button 
                onClick={() => setActiveType('brand' as ProductType)}
                style={{
                  background: activeType === 'brand' ? '#090d16' : 'transparent',
                  color: activeType === 'brand' ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.85rem',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s'
                }}
              >
                <Tag size={13} />
                <span>Brand ({brandCount})</span>
              </button>

              <button 
                onClick={() => setActiveType('closet' as ProductType)}
                style={{
                  background: activeType === 'closet' ? '#090d16' : 'transparent',
                  color: activeType === 'closet' ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.85rem',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s'
                }}
              >
                <Shirt size={13} />
                <span>Closet ({closetCount})</span>
              </button>
            </div>
          </div>

          {/* Sub Filters: Category Pills & Sort dropdown */}
          <div className="catalog-filters" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            
            {/* Category Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`pill-tab ${activeCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={14} color="var(--text-muted)" />
              <select 
                className="input-field"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                <option value="newest">Newest Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 1.5rem', 
            background: '#f8fafc', 
            border: '1px dashed var(--border-medium)', 
            borderRadius: 'var(--radius-lg)' 
          }}>
            <h3 className="font-brand" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#090d16', marginBottom: '0.5rem' }}>
              No pieces found
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', margin: '0 auto 1.5rem', fontSize: '0.85rem' }}>
              {searchQuery ? `No results for "${searchQuery}". Try a broader term.` : "Post an item to your closet to feature it here."}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => openProtectedAction('post')}
            >
              <PlusCircle size={15} />
              <span>+ Post to Closet</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
