import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  ShoppingBag, 
  Heart, 
  Eye, 
  PlusCircle, 
  Shirt, 
  Tag, 
  MessageCircle, 
  CheckCircle2, 
  Sliders, 
  LogOut,
  Trash2
} from 'lucide-react';
import { useStore } from '../context/useStore';

export const DashboardModal: React.FC = () => {
  const { 
    isDashboardOpen, 
    setIsDashboardOpen, 
    orders, 
    products, 
    analytics, 
    totalSaves, 
    formatCurrency, 
    merchantConfig, 
    setIsPostModalOpen,
    setIsSettingsModalOpen,
    logoutOwner,
    updateOrderStatus,
    deleteProduct
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');

  if (!isDashboardOpen) return null;

  // Compute metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const brandProducts = products.filter(p => p.type === 'brand');
  const closetProducts = products.filter(p => p.type === 'closet');
  
  // Calculate conversion rate
  const conversionRate = analytics.totalVisits > 0 
    ? ((orders.length / analytics.totalVisits) * 100).toFixed(1) 
    : '0.0';

  // Sort products by saves for the "Most Desired" list
  const mostSavedProducts = [...products]
    .sort((a, b) => (b.savesCount || 0) - (a.savesCount || 0))
    .slice(0, 5);

  return (
    <div className="modal-overlay" onClick={() => setIsDashboardOpen(false)}>
      <div 
        className="modal-content dashboard-modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '920px', padding: '2rem', maxHeight: '90vh' }}
      >
        {/* Top Header */}
        <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="dashboard-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-brand" style={{ fontSize: '1.65rem', fontWeight: 900, color: '#090d16' }}>
                CREATOR DASHBOARD
              </h2>
              <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
                AUTHENTICATED
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time analytics for <strong>{merchantConfig.brandName}</strong> ({merchantConfig.location}).
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => {
                setIsDashboardOpen(false);
                setIsPostModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <PlusCircle size={15} />
              <span>+ Post Drop</span>
            </button>

            <button
              onClick={() => {
                setIsDashboardOpen(false);
                setIsSettingsModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              title="Store settings"
            >
              <Sliders size={15} />
            </button>

            <button
              onClick={logoutOwner}
              className="btn btn-ghost btn-sm"
              title="Lock / Logout creator mode"
              style={{ color: '#e11d48' }}
            >
              <LogOut size={15} />
            </button>

            <button 
              onClick={() => setIsDashboardOpen(false)}
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: '50%', padding: '0.4rem' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="dashboard-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className="dashboard-tab"
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === 'overview' ? '#090d16' : 'transparent',
              color: activeTab === 'overview' ? '#ffffff' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="dashboard-tab"
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === 'orders' ? '#090d16' : 'transparent',
              color: activeTab === 'orders' ? '#ffffff' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Yebeck Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className="dashboard-tab"
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === 'inventory' ? '#090d16' : 'transparent',
              color: activeTab === 'inventory' ? '#ffffff' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Inventory ({products.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* KPI Cards Grid */}
            <div className="dashboard-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              
              {/* Revenue */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Gross Revenue</span>
                  <TrendingUp size={16} color="#059669" />
                </div>
                <div className="font-brand" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#090d16' }}>
                  {formatCurrency(totalRevenue)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  From {orders.length} orders
                </div>
              </div>

              {/* Total Orders */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Orders Placed</span>
                  <ShoppingBag size={16} color="#0284c7" />
                </div>
                <div className="font-brand" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#090d16' }}>
                  {orders.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  via Yebeck.com
                </div>
              </div>

              {/* Customer Saves */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Customer Saves</span>
                  <Heart size={16} color="#e11d48" />
                </div>
                <div className="font-brand" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#090d16' }}>
                  {totalSaves}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Wishlist engagements
                </div>
              </div>

              {/* Store Visits */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Visits</span>
                  <Eye size={16} color="#b45309" />
                </div>
                <div className="font-brand" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#090d16' }}>
                  {analytics.totalVisits}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {analytics.uniqueVisitors} unique • {conversionRate}% conv.
                </div>
              </div>

            </div>

            {/* Split Breakdown & Most Wanted Pieces */}
            <div className="dashboard-breakdown-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              
              {/* Catalog Split Card */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#090d16', marginBottom: '1rem', textTransform: 'uppercase' }}>
                  Inventory Split
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                        <Tag size={14} color="#0284c7" />
                        Official Brand Collection
                      </span>
                      <strong>{brandProducts.length} items</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(brandProducts.length / products.length) * 100}%`, height: '100%', background: '#090d16' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                        <Shirt size={14} color="#b45309" />
                        Creator's Closet Vault
                      </span>
                      <strong>{closetProducts.length} items</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(closetProducts.length / products.length) * 100}%`, height: '100%', background: '#b45309' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  💡 <strong>Insight:</strong> Closet vault drops typically create high urgency and social buzz. Keep dropping 1-of-1 archive items to maintain collector interest!
                </div>
              </div>

              {/* Most Saved / Desired Items */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#090d16', marginBottom: '1rem', textTransform: 'uppercase' }}>
                  Top Saved Pieces (Demand)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {mostSavedProducts.map((p, idx) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{idx + 1}</span>
                        <img src={p.images[0]} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#090d16' }}>{p.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatCurrency(p.price)}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#e11d48', fontWeight: 700, fontSize: '0.8rem' }}>
                        <Heart size={13} fill="#e11d48" />
                        <span>{p.savesCount || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {orders.length} total orders recorded via Yebeck.
              </span>
            </div>

            {orders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '440px', overflowY: 'auto' }}>
                {orders.map(order => {
                  const customerPhoneClean = order.customer.phone.replace(/[^0-9]/g, '');
                  return (
                    <div 
                      key={order.orderId}
                      style={{ 
                        background: '#f8fafc', 
                        border: '1px solid var(--border-medium)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-medium)', paddingBottom: '0.6rem' }}>
                        <div>
                          <span className="font-brand" style={{ fontWeight: 800, color: '#090d16', fontSize: '1.05rem' }}>
                            #{order.orderId}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: order.status === 'confirmed' ? '#dcfce7' : '#e0f2fe',
                          color: order.status === 'confirmed' ? '#15803d' : '#0369a1'
                        }}>
                          {order.status === 'confirmed' ? '✓ Paid & Confirmed' : '⚡ Yebeck Gateway'}
                        </span>
                      </div>

                      <div className="dashboard-order-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                        <div>
                          <strong>{order.customer.fullName}</strong>
                          <div style={{ color: '#0284c7' }}>📞 {order.customer.phone}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-secondary)' }}>{order.customer.address}, {order.customer.city}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Region: {order.customer.region}</div>
                        </div>
                      </div>

                      <div className="dashboard-order-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-medium)', paddingTop: '0.6rem' }}>
                        <span className="font-brand" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#090d16' }}>
                          Total: {formatCurrency(order.total)}
                        </span>

                        <div className="dashboard-order-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                          <a
                            href={`https://wa.me/${customerPhoneClean}?text=Hello%20${encodeURIComponent(order.customer.fullName)},%20this%20is%20${encodeURIComponent(merchantConfig.brandName)}!%20Confirming%20your%20order%20%23${order.orderId}...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#15803d' }}
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => updateOrderStatus(order.orderId, order.status === 'confirmed' ? 'pending_payment' : 'confirmed')}
                            className="btn btn-primary btn-sm"
                          >
                            <CheckCircle2 size={14} />
                            <span>{order.status === 'confirmed' ? 'Mark Pending' : 'Mark Paid'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No orders yet. Orders from Yebeck checkout will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVENTORY */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="dashboard-inventory-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Managing {products.length} live listings.
              </span>
              <button
                onClick={() => {
                  setIsDashboardOpen(false);
                  setIsPostModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <PlusCircle size={15} />
                <span>+ Add Item</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '420px', overflowY: 'auto' }}>
              {products.map(p => (
                <div key={p.id} className="dashboard-inventory-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={p.images[0]} alt="" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#090d16' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.type === 'closet' ? '🧥 Closet' : '🏷️ Brand'} • {formatCurrency(p.price)} • {p.savesCount || 0} saves
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${p.isSoldOut ? 'badge-sold' : 'badge-subtle'}`}>
                      {p.isSoldOut ? 'Sold Out' : 'Active'}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${p.title}" from store?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="btn btn-ghost btn-sm"
                      title={`Delete ${p.title}`}
                      aria-label={`Delete ${p.title}`}
                      style={{ padding: '0.35rem', color: '#e11d48' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
