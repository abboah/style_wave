import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  MessageCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  CreditCard
} from 'lucide-react';
import { useStore } from '../context/useStore';
import type { PlacedOrder } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutModalOpen, 
    setIsCheckoutModalOpen, 
    cart, 
    cartTotal, 
    clearCart,
    formatCurrency, 
    merchantConfig,
    addOrder
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [notes, setNotes] = useState('');

  // Post-submission state
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const deliveryFee = deliveryMethod === 'standard' ? 35 : 60;
  const grandTotal = cartTotal + deliveryFee;

  const handlePayOnYebeck = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      alert('Please fill in your delivery details.');
      return;
    }

    const orderId = `SW-GH-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: PlacedOrder = {
      orderId,
      items: [...cart],
      subtotal: cartTotal,
      deliveryFee,
      total: grandTotal,
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        region: 'Ghana',
        notes: notes.trim()
      },
      paymentMethod: 'yebeck',
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    };

    addOrder(newOrder);
    setPlacedOrder(newOrder);
    clearCart();

    // Construct Yebeck payment link
    let targetUrl = merchantConfig.yebeckUrl || 'https://yebeck.com';
    const separator = targetUrl.includes('?') ? '&' : '?';
    const paymentUrl = `${targetUrl}${separator}merchant=${encodeURIComponent(merchantConfig.yebeckMerchantId)}&orderId=${orderId}&amount=${grandTotal}&currency=GHS`;

    // Open Yebeck in a new window
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppNotify = () => {
    if (!placedOrder) return;
    const phoneClean = merchantConfig.phoneWhatsApp.replace(/[^0-9]/g, '');
    const itemsList = placedOrder.items
      .map(i => `• ${i.product.title} (Size: ${i.selectedSize}, Qty: ${i.quantity})`)
      .join('%0A');
    
    const message = `Hello *${merchantConfig.brandName}*!%0A%0AI placed an order on your website linked with *Yebeck*:%0A%0A*Order ID:* ${placedOrder.orderId}%0A*Customer:* ${placedOrder.customer.fullName}%0A*Phone:* ${placedOrder.customer.phone}%0A*Delivery Location:* ${placedOrder.customer.address}, ${placedOrder.customer.city}, Ghana%0A%0A*Items:*%0A${itemsList}%0A%0A*Total:* ${merchantConfig.currencySymbol} ${placedOrder.total}%0A%0AInitiated payment via Yebeck.com!`;
    
    window.open(`https://wa.me/${phoneClean}?text=${message}`, '_blank');
  };

  const handleCopyOrderId = () => {
    if (!placedOrder) return;
    navigator.clipboard.writeText(placedOrder.orderId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '640px', padding: '1.75rem', maxHeight: '88vh' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="#090d16" />
              <h2 className="font-brand" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#090d16' }}>
                CHECKOUT VIA YEBECK
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Ghana Mobile Money (MTN MoMo, Telecel, AT) & Cards in Cedis ({merchantConfig.currencySymbol}).
            </p>
          </div>

          <button 
            onClick={() => setIsCheckoutModalOpen(false)}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', padding: '0.4rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {placedOrder ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 className="font-brand" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#090d16', marginBottom: '0.4rem' }}>
              Order Generated & Sent to Yebeck!
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              A new tab has opened to complete payment on <strong>yebeck.com</strong>. Save your order reference below.
            </p>

            {/* Order Reference Card */}
            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid var(--border-medium)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.25rem', 
              maxWidth: '420px', 
              margin: '0 auto 1.5rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Order Reference</span>
                <button 
                  onClick={handleCopyOrderId}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                >
                  {copiedRef ? <Check size={12} color="#15803d" /> : <Copy size={12} />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              
              <div className="font-brand" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#090d16', letterSpacing: '0.04em' }}>
                #{placedOrder.orderId}
              </div>

              <div style={{ borderTop: '1px solid var(--border-medium)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Amount:</span>
                <span style={{ fontWeight: 800, color: '#090d16' }}>{formatCurrency(placedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxWidth: '420px', margin: '0 auto' }}>
              <a 
                href={merchantConfig.yebeckUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary btn-lg"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={16} />
                <span>Return / Open Yebeck.com</span>
              </a>

              <button 
                onClick={handleWhatsAppNotify}
                className="btn btn-secondary btn-lg"
                style={{ color: '#15803d' }}
              >
                <MessageCircle size={16} />
                <span>Confirm via WhatsApp to Merchant</span>
              </button>

              <button 
                onClick={() => {
                  setPlacedOrder(null);
                  setIsCheckoutModalOpen(false);
                }}
                className="btn btn-ghost"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handlePayOnYebeck} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Notice */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.65rem', 
              padding: '0.75rem 0.95rem', 
              background: '#f8fafc', 
              border: '1px solid var(--border-medium)', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <ShieldCheck size={20} color="#059669" />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>Yebeck Payment Link:</strong> Secure checkout on <strong>yebeck.com</strong> via MTN MoMo, Telecel Cash, or Card in Ghana Cedis.
              </div>
            </div>

            {/* Customer Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                1. Delivery & Contact Details (Ghana)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="e.g. Kwame Mensah"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Phone / MoMo Number *
                  </label>
                  <input 
                    type="tel" 
                    className="input-field"
                    placeholder="e.g. 024 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    City / Town in Ghana *
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="e.g. Accra, Kumasi, Tema, Takoradi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Delivery Speed (Ghana) *
                  </label>
                  <select 
                    className="input-field"
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value as any)}
                  >
                    <option value="standard">Standard Delivery (GH₵ 35)</option>
                    <option value="express">Express Dispatch (GH₵ 60)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Street / Area / Delivery Address *
                </label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. Street name, area, house number or landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Email Address (Optional)
                  </label>
                  <input 
                    type="email" 
                    className="input-field"
                    placeholder="kwame@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Delivery Instructions (Optional)
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="e.g. Call before arrival"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Order Items Summary */}
            <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-medium)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Items in Bag ({cart.length})
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#090d16' }}>
                  {formatCurrency(cartTotal)}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '110px', overflowY: 'auto' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <span>{item.quantity}x {item.product.title} ({item.selectedSize})</span>
                    <span style={{ color: '#090d16', fontWeight: 600 }}>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '1px solid var(--border-medium)', marginTop: '0.65rem', paddingTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery ({deliveryMethod === 'standard' ? 'Standard' : 'Express'} Ghana):</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: '#090d16', marginTop: '0.2rem' }}>
                  <span>Total Due:</span>
                  <span className="font-brand">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <button 
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <span>Proceed to Pay on Yebeck.com</span>
                <ExternalLink size={16} />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
