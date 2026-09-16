import React from 'react';
import {
  BookOpen,
  Laptop,
  Package,
  Shirt,
  PenTool,
  Home,
  Tag,
  MapPin,
  Clock,
  Eye,
  User,
} from 'lucide-react';

export const getCategoryIcon = (category, size = 18) => {
  switch (category) {
    case 'Textbooks':
      return <BookOpen size={size} />;
    case 'Electronics':
      return <Laptop size={size} />;
    case 'Furniture':
      return <Package size={size} />;
    case 'Clothing':
      return <Shirt size={size} />;
    case 'Stationery':
      return <PenTool size={size} />;
    case 'Housing / Sublet':
      return <Home size={size} />;
    default:
      return <Tag size={size} />;
  }
};

export const getConditionBadgeStyle = (condition) => {
  switch (condition) {
    case 'Brand New':
      return { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' };
    case 'Like New':
      return { background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' };
    case 'Good':
      return { background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)' };
    case 'Fair':
      return { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' };
    case 'Poor':
      return { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' };
    default:
      return { background: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.3)' };
  }
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const ListingCard = ({ listing, onSelect }) => {
  const {
    title,
    description,
    price,
    category,
    condition,
    seller,
    location,
    viewsCount,
    createdAt,
    status,
  } = listing;

  return (
    <div
      className="card listing-card"
      onClick={() => onSelect && onSelect(listing)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        padding: '1.25rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 24px -10px rgba(0, 0, 0, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top Banner Header: Category & Price */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.875rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              color: 'var(--primary-300)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
            }}
          >
            {getCategoryIcon(category, 14)}
            <span>{category}</span>
          </div>

          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: price === 0 ? 'var(--accent-emerald)' : 'var(--text-primary)',
            }}
          >
            {price === 0 ? 'Free' : `$${Number(price).toFixed(2)}`}
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            color: 'var(--slate-50)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </h3>

        {/* Description snippet */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--slate-400)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>
      </div>

      {/* Meta details & Footer */}
      <div>
        {/* Pills: Condition, Status, Location */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              fontSize: '0.725rem',
              fontWeight: 600,
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              ...getConditionBadgeStyle(condition),
            }}
          >
            {condition}
          </span>

          {status && status !== 'available' && (
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                textTransform: 'capitalize',
              }}
            >
              {status}
            </span>
          )}

          {location && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: 'var(--slate-400)',
              }}
            >
              <MapPin size={13} color="var(--slate-400)" />
              {location}
            </span>
          )}
        </div>

        {/* Bottom Seller info & Timestamp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.775rem',
            color: 'var(--slate-400)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-600), var(--accent-purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {seller?.name ? seller.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ fontWeight: 500, color: 'var(--slate-300)' }}>
              {seller?.name || 'Campus Student'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Eye size={13} /> {viewsCount || 0}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={13} /> {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
