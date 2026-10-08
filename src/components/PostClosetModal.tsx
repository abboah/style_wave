import React, { useState } from 'react';
import { 
  X, 
  Shirt, 
  Tag, 
  Upload, 
  PlusCircle, 
  Check, 
  Trash2, 
  RotateCcw, 
  Layers,
  Download,
  ShoppingBag,
  MessageCircle,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/useStore';
import type { ProductCategory, ProductCondition, ProductType } from '../types';

export const PostClosetModal: React.FC = () => {
  const { 
    isPostModalOpen, 
    setIsPostModalOpen, 
    addProduct, 
    products, 
    deleteProduct, 
    toggleSoldOut, 
    resetProducts,
    orders,
    updateOrderStatus,
    deleteOrder,
    importProducts,
    formatCurrency,
    merchantConfig
  } = useStore();

  const [activeTab, setActiveTab] = useState<'post' | 'manage' | 'orders'>('post');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ProductType>('closet'); // default to closet as requested
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<ProductCategory>('jackets');
  const [condition, setCondition] = useState<ProductCondition>('Vintage Archive');
  const [sizes, setSizes] = useState<string[]>(['M', 'L']);
  const [description, setDescription] = useState('');
  const [brandTag, setBrandTag] = useState("Creator's Closet Vault");
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  if (!isPostModalOpen) return null;

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', 'One Size'];
  
  const sampleClosetPhotos = [
    { label: 'Vintage Leather', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
    { label: 'Denim Jacket', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' },
    { label: 'Graphic Street Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
    { label: 'Oversized Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cargo Pants', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
    { label: 'Chunky Knitwear', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleSizeToggle = (sz: string) => {
    if (sizes.includes(sz)) {
      if (sizes.length > 1) {
        setSizes(sizes.filter(s => s !== sz));
      }
    } else {
      setSizes([...sizes, sz]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert('Please provide an item title and price.');
      return;
    }

    const finalImage = imagePreview || imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';

    setIsSubmitting(true);

    addProduct({
      title: title.trim(),
      description: description.trim() || `${type === 'closet' ? "From the creator's personal closet." : "Official STYLE WAVE release."} Handcrafted/curated in Accra.`,
      price: parseFloat(price) || 100,
      category,
      type,
      condition: type === 'closet' ? condition : 'Brand New',
      sizes: sizes.length ? sizes : ['Standard'],
      images: [finalImage],
      brandTag: brandTag.trim() || (type === 'closet' ? "Closet Drop" : "Brand Release"),
      isSoldOut: false,
      isFeatured: true
    });

    setIsSubmitting(false);
    setSuccessMessage(true);

    // Reset fields
    setTitle('');
    setPrice('');
    setDescription('');
    setImagePreview('');
    setImageUrl('');

    setTimeout(() => {
      setSuccessMessage(false);
      setActiveTab('manage');
    }, 1200);
  };

  const handleExportCatalog = () => {
    const jsonStr = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stylewave_inventory_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCatalog = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importProducts(content);
        if (success) {
          setImportNotice('Catalog successfully imported!');
        } else {
          setImportNotice('Failed to import: Invalid JSON catalog file.');
        }
        setTimeout(() => setImportNotice(null), 3000);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsPostModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '780px', padding: '1.75rem', maxHeight: '88vh' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 className="font-brand" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shirt size={22} color="var(--accent-cyan)" />
              <span>POST TO CLOSET & STORE</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Add a piece from your personal closet or release a new brand drop in Ghana Cedis ({merchantConfig.currencySymbol}).
            </p>
          </div>

          <button 
            onClick={() => setIsPostModalOpen(false)}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', padding: '0.4rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher: 3 Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-surface-elevated)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setActiveTab('post')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'post' ? '#ffffff' : 'transparent',
              color: activeTab === 'post' ? '#0a0c10' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <PlusCircle size={16} />
            <span>Post New Piece</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'manage' ? '#ffffff' : 'transparent',
              color: activeTab === 'manage' ? '#0a0c10' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Layers size={16} />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'orders' ? '#ffffff' : 'transparent',
              color: activeTab === 'orders' ? '#0a0c10' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <ShoppingBag size={16} />
            <span>Orders Received ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: POST FORM */}
        {activeTab === 'post' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Listing Type Toggle: Closet Piece vs Brand Collection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Item Source / Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setType('closet');
                    setBrandTag("Creator's Closet Vault");
                  }}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: type === 'closet' ? '2px solid var(--accent-gold)' : '1px solid var(--border-medium)',
                    background: type === 'closet' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-surface-elevated)',
                    color: type === 'closet' ? '#fbbf24' : 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.92rem' }}>
                    <Shirt size={18} />
                    <span>Personal Closet Piece</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.85 }}>
                    From your own wardrobe, archive, or vintage collection.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setType('brand');
                    setBrandTag("Official Brand Release");
                  }}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: type === 'brand' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
                    background: type === 'brand' ? 'rgba(0, 242, 254, 0.12)' : 'var(--bg-surface-elevated)',
                    color: type === 'brand' ? '#38bdf8' : 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.92rem' }}>
                    <Tag size={18} />
                    <span>Brand Collection Drop</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.85 }}>
                    New release under the {merchantConfig.brandName} label.
                  </div>
                </button>
              </div>
            </div>

            {/* Title & Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Item Title *
                </label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder={type === 'closet' ? 'e.g. Vintage Washed Moto Jacket' : 'e.g. Signature Heavy Boxy Tee'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Price ({merchantConfig.currencySymbol}) *
                </label>
                <input 
                  type="number" 
                  step="any"
                  className="input-field"
                  placeholder="e.g. 450"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Category & Condition */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Category
                </label>
                <select 
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                >
                  <option value="jackets">Jackets & Outerwear</option>
                  <option value="hoodies">Hoodies & Sweats</option>
                  <option value="tees">Graphic Tees & Tops</option>
                  <option value="pants">Cargo, Denim & Pants</option>
                  <option value="accessories">Accessories & Hats</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Condition / Status
                </label>
                <select 
                  className="input-field"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ProductCondition)}
                  disabled={type === 'brand'}
                >
                  <option value="Brand New">Brand New with Tags</option>
                  <option value="Like New">Like New (Worn Once/Twice)</option>
                  <option value="Gently Worn">Gently Worn</option>
                  <option value="Vintage Archive">Vintage Archive</option>
                  <option value="Custom 1-of-1">Custom 1-of-1 Piece</option>
                </select>
              </div>
            </div>

            {/* Available Sizes Multi-select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Available Sizes (Select all that apply)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {sizeOptions.map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSizeToggle(sz)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: sizes.includes(sz) ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      background: sizes.includes(sz) ? 'rgba(0, 242, 254, 0.2)' : 'var(--bg-surface-elevated)',
                      color: sizes.includes(sz) ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Selection: File Upload OR Web URL OR Preset */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Item Photo (Upload or Paste Link) *
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                {/* Upload from device */}
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  border: '1px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  <Upload size={22} color="var(--accent-cyan)" style={{ marginBottom: '0.4rem' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Upload Photo File</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>From Phone or Computer</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>

                {/* Paste Web Image URL */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <input 
                    type="url" 
                    className="input-field"
                    placeholder="Or paste image URL (https://...)"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview('');
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Direct photo link from Instagram, Pinterest or Imgur
                  </span>
                </div>
              </div>

              {/* Quick Preset Photos */}
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Or pick a photo placeholder:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                  {sampleClosetPhotos.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(sample.url);
                        setImagePreview('');
                      }}
                      style={{
                        padding: '0.3rem 0.6rem',
                        background: imageUrl === sample.url ? 'rgba(0, 242, 254, 0.2)' : 'var(--bg-surface-elevated)',
                        border: imageUrl === sample.url ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: imageUrl === sample.url ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Preview if loaded */}
              {(imagePreview || imageUrl) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <img 
                    src={imagePreview || imageUrl} 
                    alt="Preview" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                  />
                  <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={16} />
                    <span>Photo ready to publish!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Backstory */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Description & Closet Backstory
              </label>
              <textarea 
                className="input-field"
                placeholder={type === 'closet' ? "Tell buyers about this piece: How does it fit? When was it acquired? Any custom details?" : "Material specs, GSM weight, sizing fit notes, etc."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`btn ${successMessage ? 'btn-secondary' : 'btn-cyan'} btn-lg`}
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {successMessage ? (
                <>
                  <Check size={20} color="#10b981" />
                  <span>Posted to Storefront!</span>
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  <span>Publish Item to Store ({merchantConfig.currencySymbol})</span>
                </>
              )}
            </button>

          </form>
        )}

        {/* TAB 2: INVENTORY MANAGER */}
        {activeTab === 'manage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                You have <strong>{products.length} live items</strong> in your catalog.
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Export JSON Backup */}
                <button 
                  onClick={handleExportCatalog}
                  className="btn btn-secondary btn-sm"
                  title="Download a backup copy of your catalog as JSON"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
                >
                  <Download size={14} />
                  <span>Export Backup</span>
                </button>

                {/* Import JSON Backup */}
                <label 
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', cursor: 'pointer' }}
                  title="Upload a saved JSON catalog backup file"
                >
                  <Upload size={14} />
                  <span>Import JSON</span>
                  <input type="file" accept=".json" onChange={handleImportCatalog} style={{ display: 'none' }} />
                </label>

                {/* Reset to Default */}
                <button 
                  onClick={() => {
                    if (confirm('Reset catalog back to default demo drops?')) {
                      resetProducts();
                    }
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Demo</span>
                </button>
              </div>
            </div>

            {importNotice && (
              <div style={{ padding: '0.65rem 1rem', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--accent-cyan)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#fff' }}>
                {importNotice}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
              {products.map(prod => (
                <div 
                  key={prod.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0.85rem', 
                    background: 'var(--bg-surface-elevated)', 
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img 
                      src={prod.images[0]} 
                      alt="" 
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                        {prod.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: prod.type === 'closet' ? 'var(--accent-gold)' : 'var(--accent-cyan)', fontWeight: 700 }}>
                          {prod.type === 'closet' ? '🧥 Closet' : '🏷️ Brand'}
                        </span>
                        <span>•</span>
                        <span style={{ fontWeight: 800, color: '#fff' }}>{formatCurrency(prod.price)}</span>
                        <span>•</span>
                        <span>Sizes: {prod.sizes.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleSoldOut(prod.id)}
                      className={`btn btn-sm ${prod.isSoldOut ? 'btn-secondary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.76rem', color: prod.isSoldOut ? '#ef4444' : '#10b981' }}
                    >
                      {prod.isSoldOut ? 'Mark In Stock' : 'Mark Sold'}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(prod.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#ef4444', padding: '0.4rem' }}
                      title="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS RECEIVED (YEBECK CHECKOUTS) */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                  Customer Orders ({orders.length})
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Orders initiated by customers linking to <strong>yebeck.com</strong>.
                </p>
              </div>
            </div>

            {orders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '440px', overflowY: 'auto' }}>
                {orders.map(order => {
                  const customerPhoneClean = order.customer.phone.replace(/[^0-9]/g, '');
                  return (
                    <div 
                      key={order.orderId}
                      style={{ 
                        background: 'var(--bg-surface-elevated)', 
                        border: '1px solid var(--border-medium)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem'
                      }}
                    >
                      {/* Top Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span className="font-brand" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                            #{order.orderId}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: order.status === 'confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 242, 254, 0.12)',
                            color: order.status === 'confirmed' ? '#10b981' : '#38bdf8',
                            border: `1px solid ${order.status === 'confirmed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 242, 254, 0.25)'}`
                          }}>
                            {order.status === 'confirmed' ? '✓ Payment Confirmed' : '⚡ Yebeck Gateway Checkout'}
                          </span>

                          <button
                            onClick={() => deleteOrder(order.orderId)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#ef4444', padding: '0.25rem' }}
                            title="Delete order"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Customer Info & Address */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.82rem' }}>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Customer</div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{order.customer.fullName}</div>
                          <div style={{ color: 'var(--accent-cyan)' }}>📞 {order.customer.phone}</div>
                          {order.customer.email && <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{order.customer.email}</div>}
                        </div>

                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Delivery Area</div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{order.customer.address}</div>
                          <div style={{ color: 'var(--text-secondary)' }}>{order.customer.city}, {order.customer.region} (Ghana)</div>
                          {order.customer.notes && <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.75rem' }}>"{order.customer.notes}"</div>}
                        </div>
                      </div>

                      {/* Ordered Items */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Items Ordered:</div>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', marginBottom: '0.2rem' }}>
                            <span>• {it.product.title} (Size: <strong>{it.selectedSize}</strong>, Qty: {it.quantity})</span>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(it.product.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Action Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order Total (incl. delivery): </span>
                          <span className="font-brand" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                            {formatCurrency(order.total)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {/* WhatsApp Customer direct button */}
                          <a
                            href={`https://wa.me/${customerPhoneClean}?text=Hello%20${encodeURIComponent(order.customer.fullName)},%20this%20is%20${encodeURIComponent(merchantConfig.brandName)}!%20Regarding%20your%20order%20%23${order.orderId}%20for%20${order.total}%20GHS%20via%20Yebeck...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#25d366', background: 'rgba(37, 211, 102, 0.1)', borderColor: 'rgba(37, 211, 102, 0.3)' }}
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp Customer</span>
                          </a>

                          {/* Toggle Paid/Confirmed */}
                          <button
                            onClick={() => updateOrderStatus(order.orderId, order.status === 'confirmed' ? 'pending_payment' : 'confirmed')}
                            className={`btn btn-sm ${order.status === 'confirmed' ? 'btn-secondary' : 'btn-cyan'}`}
                          >
                            {order.status === 'confirmed' ? (
                              <span>Mark Pending</span>
                            ) : (
                              <>
                                <CheckCircle2 size={14} />
                                <span>Mark as Paid</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-medium)' }}>
                <FileText size={36} color="var(--border-medium)" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>No orders yet</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '360px', margin: '0 auto' }}>
                  When customers select items and proceed with checkout via <strong>yebeck.com</strong>, their order details and delivery info will show up here.
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
