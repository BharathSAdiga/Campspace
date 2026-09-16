import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Eye,
  Mail,
  Phone,
  Building,
  CreditCard,
  CheckCircle,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { getCategoryIcon, getConditionBadgeStyle } from './ListingCard';
import { useAuth } from '../../context/AuthContext';

export const ListingDetailModal = ({
  listing,
  onClose,
  onStatusChange,
  onDelete,
}) => {
  const { user } = useAuth();

  if (!listing) return null;

  const isOwner = user && listing.seller && (
    (typeof listing.seller === 'string' && listing.seller === user._id) ||
    (listing.seller._id && listing.seller._id === user._id)
  );

  const formattedDate = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--slate-300)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
        >
          <X size={20} />
        </button>

        {/* Category & Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary-300)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            {getCategoryIcon(listing.category, 14)}
            {listing.category}
          </span>

          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              ...getConditionBadgeStyle(listing.condition),
            }}
          >
            {listing.condition}
          </span>

          {listing.status && listing.status !== 'available' && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                textTransform: 'capitalize',
              }}
            >
              {listing.status}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.75rem', lineHeight: 1.3, marginBottom: '0.75rem', color: 'var(--slate-50)' }}>
          {listing.title}
        </h2>

        {/* Price & Location Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: listing.price === 0 ? 'var(--accent-emerald)' : 'var(--primary-400)',
            }}
          >
            {listing.price === 0 ? 'Free Giveaway' : `$${Number(listing.price).toFixed(2)}`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--slate-400)' }}>
            {listing.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="var(--primary-400)" />
                {listing.location}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Eye size={15} />
              {listing.viewsCount || 0} views
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={15} />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Full Item Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-400)', marginBottom: '0.6rem' }}>
            Description
          </h4>
          <p style={{ fontSize: '0.975rem', color: 'var(--slate-200)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {listing.description}
          </p>
        </div>

        {/* Seller Info Card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-400)', marginBottom: '0.75rem' }}>
            Seller Verification & Contact
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-600), var(--accent-purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {listing.seller?.name ? listing.seller.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--slate-100)' }}>
                {listing.seller?.name || 'Verified Campus Student'}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--slate-400)' }}>
                {listing.seller?.department ? `${listing.seller.department}` : 'Verified Student'}
                {listing.seller?.campusId ? ` • ID: ${listing.seller.campusId}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
            {listing.seller?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-300)' }}>
                <Mail size={16} color="var(--primary-400)" />
                <span>{listing.seller.email}</span>
              </div>
            )}
            {listing.seller?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-300)' }}>
                <Phone size={16} color="var(--primary-400)" />
                <span>{listing.seller.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {isOwner ? (
            <>
              {listing.status === 'available' ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => onStatusChange && onStatusChange(listing._id, 'sold')}
                  style={{ flex: 1 }}
                >
                  <CheckCircle size={16} /> Mark as Sold
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => onStatusChange && onStatusChange(listing._id, 'available')}
                  style={{ flex: 1 }}
                >
                  Mark as Available
                </button>
              )}
              {onDelete && (
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(listing._id)}
                  style={{ padding: '0.6rem 1.25rem' }}
                >
                  Delete Listing
                </button>
              )}
            </>
          ) : (
            listing.seller?.email && (
              <a
                href={`mailto:${listing.seller.email}?subject=${encodeURIComponent(
                  `CampusConnect Marketplace: Regarding your listing "${listing.title}"`
                )}&body=${encodeURIComponent(
                  `Hi ${listing.seller.name},\n\nI saw your listing for "${listing.title}" on the CampusConnect Marketplace and I would like to inquire about purchasing it.\n\nBest regards,\n${user?.name || 'A student'}`
                )}`}
                className="btn btn-primary btn-block"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                }}
              >
                <Mail size={18} /> Contact Seller via Campus Email
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};
