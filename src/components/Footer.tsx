import React from 'react';
import { ShieldCheck, MessageCircle, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { useStore } from '../context/useStore';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const { merchantConfig, setActiveType, openProtectedAction, setIsSettingsModalOpen } = useStore();

  return (
    <footer style={{ background: '#f8fafc', borderTop: '1px solid var(--border-medium)', padding: '4rem 1.25rem 2rem', color: 'var(--text-secondary)' }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
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
              <span className="font-brand" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#090d16' }}>
                {merchantConfig.brandName}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Independent streetwear label and creator's personal closet archive based in {merchantConfig.location}.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#090d16', fontWeight: 600 }}>
              <MapPin size={15} />
              <span>Ghana • Worldwide Dispatch</span>
            </div>
          </div>

          {/* Collections & Drops */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#090d16', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Drops & Vault
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>
                <a href="#catalog-section" onClick={() => setActiveType('brand')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Brand Collection
                </a>
              </li>
              <li>
                <a href="#catalog-section" onClick={() => setActiveType('closet')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Creator's Closet Vault
                </a>
              </li>
              <li>
                <a href="#catalog-section" onClick={() => setActiveType('all')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  All Releases
                </a>
              </li>
              <li>
                <button 
                  onClick={() => openProtectedAction('post')} 
                  style={{ background: 'none', border: 'none', color: '#090d16', cursor: 'pointer', fontSize: '0.85rem', padding: 0, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                >
                  <Sparkles size={14} />
                  <span>+ Post Piece to Closet</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Yebeck Payment Portal */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#090d16', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Payments
            </h4>
            <div style={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <ShieldCheck size={16} color="#059669" />
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#090d16' }}>
                  Linked to Yebeck.com
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                All orders are processed securely via <strong>yebeck.com</strong> in Ghana Cedis ({merchantConfig.currencySymbol}).
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                <span className="badge badge-subtle" style={{ fontSize: '0.68rem' }}>MTN MoMo</span>
                <span className="badge badge-subtle" style={{ fontSize: '0.68rem' }}>Telecel Cash</span>
                <span className="badge badge-subtle" style={{ fontSize: '0.68rem' }}>AT Money</span>
                <span className="badge badge-subtle" style={{ fontSize: '0.68rem' }}>Bank Cards</span>
              </div>
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#090d16', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Contact & Creator
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <a 
                href={`https://wa.me/${merchantConfig.phoneWhatsApp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#15803d', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600 }}
              >
                <MessageCircle size={15} />
                <span>WhatsApp: {merchantConfig.phoneWhatsApp}</span>
              </a>

              <a 
                href={`https://instagram.com/${merchantConfig.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram: {merchantConfig.instagram}</span>
              </a>

              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', padding: 0, textAlign: 'left', marginTop: '0.35rem' }}
              >
                ⚙️ Merchant & Yebeck Settings
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>
            © {CURRENT_YEAR} {merchantConfig.brandName} • Ghana. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>Payments via <a href={merchantConfig.yebeckUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#090d16', fontWeight: 600, textDecoration: 'none' }}>yebeck.com <ExternalLink size={10} style={{ display: 'inline' }} /></a></span>
            <span>•</span>
            <span>Ghana Cedis ({merchantConfig.currencySymbol})</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
