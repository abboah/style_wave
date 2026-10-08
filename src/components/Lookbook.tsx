import { ArrowRight, Camera } from 'lucide-react';
import { useStore } from '../context/useStore';

export const Lookbook: React.FC = () => {
  const { setActiveType, setActiveCategory } = useStore();

  const looks = [
    {
      id: 'look-1',
      title: 'French Terry Silhouette',
      subtitle: 'Heavyweight Hoodie • Boxy Cut',
      category: 'hoodies' as const,
      type: 'brand' as const,
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80',
      tag: 'FW26 Drop'
    },
    {
      id: 'look-2',
      title: 'Indigo Dye Archive 1-of-1',
      subtitle: 'Vintage Sourced • West African Indigo',
      category: 'jackets' as const,
      type: 'closet' as const,
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80',
      tag: 'Closet Vault'
    },
    {
      id: 'look-3',
      title: 'Accra Heavy Street Tee',
      subtitle: '260 GSM Combed Cotton • Screenprint',
      category: 'tees' as const,
      type: 'brand' as const,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80',
      tag: 'Core Essential'
    },
    {
      id: 'look-4',
      title: 'Moto Patina & Utility',
      subtitle: 'Archive Leather • Slate Ripstop',
      category: 'jackets' as const,
      type: 'closet' as const,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
      tag: 'Creator Vault'
    }
  ];

  const handleLookClick = (type: 'brand' | 'closet', category: any) => {
    setActiveType(type);
    setActiveCategory(category);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '3.5rem 1.25rem 2.5rem', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Camera size={14} />
              <span>EDITORIAL VISUALS</span>
            </div>
            <h2 className="font-brand" style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              ACCRA STREET LOOKBOOK
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '520px', marginTop: '0.35rem' }}>
              Styled street snapshots featuring official <strong>STYLE WAVE</strong> brand drops alongside pieces out of the creator's closet archive.
            </p>
          </div>

          <a 
            href="#catalog-section" 
            style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700 }}
          >
            <span>Browse Full Catalog</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {/* 4 Card Lookbook Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {looks.map((look) => (
            <div
              key={look.id}
              onClick={() => handleLookClick(look.type, look.category)}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                aspectRatio: '3 / 4',
                cursor: 'pointer',
                background: '#151922',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <img 
                src={look.image} 
                alt={look.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />

              {/* Tag Badge */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <span className={`badge ${look.type === 'brand' ? 'badge-brand' : 'badge-closet'}`}>
                  {look.tag}
                </span>
              </div>

              {/* Bottom Gradient Overlay & Details */}
              <div style={{
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(to top, rgba(10, 12, 16, 0.95) 0%, rgba(10, 12, 16, 0.4) 40%, transparent 70%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem'
              }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {look.subtitle}
                </div>
                <h3 className="font-brand" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0 0.5rem' }}>
                  {look.title}
                </h3>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#fff', fontSize: '0.78rem', fontWeight: 700 }}>
                  <span>Shop this look</span>
                  <ArrowRight size={13} color="var(--accent-cyan)" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
