import React from 'react';
import { ArrowRight, Shirt } from 'lucide-react';
import { useStore } from '../context/useStore';

export const Hero: React.FC = () => {
  const { setActiveType } = useStore();

  const handleScroll = (type: 'all' | 'brand' | 'closet') => {
    setActiveType(type);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ 
      padding: '4.5rem 1.25rem 3.5rem', 
      textAlign: 'center',
      borderBottom: '1px solid var(--border-medium)',
      background: '#ffffff'
    }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        
        {/* Minimal Country Tag */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          fontSize: '0.72rem', 
          fontWeight: 800, 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase', 
          color: 'var(--text-secondary)',
          marginBottom: '1rem' 
        }}>
          <span>GHANA</span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span>STREETWEAR & ARCHIVE</span>
        </div>

        {/* Minimal High-Fashion Title */}
        <h1 className="font-brand" style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', 
          fontWeight: 900, 
          letterSpacing: '-0.03em', 
          lineHeight: 1.05, 
          color: '#090d16',
          marginBottom: '1.25rem' 
        }}>
          STYLE WAVE
        </h1>

        {/* Short, Refined Slogan */}
        <p style={{ 
          fontSize: '1rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '480px', 
          margin: '0 auto 2.25rem',
          lineHeight: 1.5
        }}>
          Official brand collections and 1-of-1 pieces from the creator's closet vault.
        </p>

        {/* Minimalist CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => handleScroll('brand')}
          >
            <span>Shop Brand</span>
            <ArrowRight size={15} />
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => handleScroll('closet')}
          >
            <Shirt size={15} />
            <span>Closet Vault</span>
          </button>
        </div>

      </div>
    </section>
  );
};
