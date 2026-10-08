import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../context/useStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginOwner } = useStore();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginOwner(passcode);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2500);
    } else {
      setPasscode('');
      setError(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '420px', padding: '2rem', textAlign: 'center' }}
      >
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          className="btn btn-ghost btn-sm"
          style={{ position: 'absolute', top: '1rem', right: '1rem', borderRadius: '50%', padding: '0.4rem' }}
        >
          <X size={18} />
        </button>

        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#f1f5f9', color: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <Lock size={24} />
        </div>

        <h3 className="font-brand" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#090d16', marginBottom: '0.4rem' }}>
          CREATOR ACCESS
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
          Enter the creator passcode to manage closet drops, track visitor analytics, and view private sales.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <KeyRound size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              className="input-field"
              placeholder="Enter Creator Passcode"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(false); }}
              autoFocus
              style={{ paddingLeft: '2.5rem', textAlign: 'left' }}
              required
            />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#dc2626', fontSize: '0.8rem' }}>
              <AlertCircle size={15} />
              <span>Incorrect passcode. Default is: <code>wave2026</code></span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>Unlock Dashboard</span>
            <ArrowRight size={17} />
          </button>

          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Passcode can be changed anytime in Store Settings.
          </span>
        </form>

      </div>
    </div>
  );
};
