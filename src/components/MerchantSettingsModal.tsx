import React, { useState } from 'react';
import { X, Sliders, Save, RotateCcw, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/useStore';

export const MerchantSettingsModal: React.FC = () => {
  const { 
    isSettingsModalOpen, 
    setIsSettingsModalOpen, 
    merchantConfig, 
    updateMerchantConfig,
    resetProducts 
  } = useStore();

  const [brandName, setBrandName] = useState(merchantConfig.brandName);
  const [location, setLocation] = useState(merchantConfig.location);
  const [currencySymbol, setCurrencySymbol] = useState(merchantConfig.currencySymbol);
  const [yebeckUrl, setYebeckUrl] = useState(merchantConfig.yebeckUrl);
  const [yebeckMerchantId, setYebeckMerchantId] = useState(merchantConfig.yebeckMerchantId);
  const [phoneWhatsApp, setPhoneWhatsApp] = useState(merchantConfig.phoneWhatsApp);
  const [instagram, setInstagram] = useState(merchantConfig.instagram);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMerchantConfig({
      brandName: brandName.trim() || 'STYLE WAVE',
      location: location.trim() || 'Accra, Ghana',
      currencySymbol: currencySymbol.trim() || 'GH₵',
      yebeckUrl: yebeckUrl.trim() || 'https://yebeck.com',
      yebeckMerchantId: yebeckMerchantId.trim() || 'stylewave',
      phoneWhatsApp: phoneWhatsApp.trim() || '+233 55 000 0000',
      instagram: instagram.trim() || '@stylewave.gh'
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsModalOpen(false);
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '600px', padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 className="font-brand" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={20} color="var(--accent-cyan)" />
              <span>STORE & YEBECK SETTINGS</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Configure your brand details and Yebeck payment portal integration.
            </p>
          </div>

          <button 
            onClick={() => setIsSettingsModalOpen(false)}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', padding: '0.4rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Yebeck Payment Integration Section */}
          <div style={{ background: 'rgba(0, 242, 254, 0.06)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <ShieldCheck size={18} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                Yebeck Payment Link Configuration
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Yebeck Payment Portal URL *
                </label>
                <input 
                  type="url" 
                  className="input-field"
                  placeholder="https://yebeck.com"
                  value={yebeckUrl}
                  onChange={(e) => setYebeckUrl(e.target.value)}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  The website URL where customers complete payment (e.g. <code>https://yebeck.com</code> or your merchant checkout URL).
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Yebeck Merchant ID / Handle
                </label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. stylewave or your-merchant-code"
                  value={yebeckMerchantId}
                  onChange={(e) => setYebeckMerchantId(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Brand Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Brand Name
              </label>
              <input 
                type="text" 
                className="input-field"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Location / City
              </label>
              <input 
                type="text" 
                className="input-field"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Currency & WhatsApp */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Currency Symbol
              </label>
              <input 
                type="text" 
                className="input-field"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                WhatsApp Number (for orders)
              </label>
              <input 
                type="text" 
                className="input-field"
                placeholder="+233 55 123 4567"
                value={phoneWhatsApp}
                onChange={(e) => setPhoneWhatsApp(e.target.value)}
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Instagram Handle
            </label>
            <input 
              type="text" 
              className="input-field"
              placeholder="@stylewave.gh"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <button 
            type="submit" 
            className="btn btn-cyan btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <Save size={18} />
            <span>{savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>

          {/* Reset button */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset store catalog to the initial demo drops?')) {
                  resetProducts();
                  setIsSettingsModalOpen(false);
                }
              }}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset Store Catalog to Default Demo Drops</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
