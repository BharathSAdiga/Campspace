import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import { Badge } from '../common/Badge';
import { WishlistButton } from './WishlistButton';

export const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    id,
    _id,
    title,
    price,
    category,
    condition,
    location,
    status = 'ACTIVE',
    images = [],
    seller,
    createdAt,
  } = product;

  const productId = id || _id;
  const mainImage = images && images.length > 0 ? images[0] : null;

  const getConditionBadge = (cond) => {
    switch (cond) {
      case 'New':
        return <span className="badge-orange" style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.68rem', fontWeight: 800 }}>New</span>;
      case 'Like New':
        return <Badge variant="primary" size="sm">Like New</Badge>;
      case 'Good':
        return <Badge variant="default" size="sm">Good</Badge>;
      case 'Fair':
        return <Badge variant="warning" size="sm">Fair</Badge>;
      case 'Poor':
        return <Badge variant="danger" size="sm">Poor</Badge>;
      default:
        return <Badge variant="default" size="sm">{cond}</Badge>;
    }
  };

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'ACTIVE':
        return 'success';
      case 'SOLD':
        return 'default';
      case 'ARCHIVED':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Link
        to={`/marketplace/${productId}`}
        className="card liquid-glass-card product-card"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
        }}
      >
        {/* Image Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '65%', // 16:10 aspect ratio
            backgroundColor: 'var(--bg-subtle)',
            overflow: 'hidden',
            borderBottom: '1px solid var(--liquid-glass-border)',
          }}
        >
          {mainImage ? (
            <img
              src={mainImage}
              alt={title}
              loading="lazy"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.35s ease',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                gap: '0.35rem',
              }}
            >
              <ImageIcon size={32} strokeWidth={1.5} />
              <span style={{ fontSize: '0.75rem' }}>No photo available</span>
            </div>
          )}

          {/* Category Pill (Top-Left) */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 5 }}>
            <span
              className="liquid-glass-pill"
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.72rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              {category}
            </span>
          </div>

          {/* Wishlist Button (Top-Right) */}
          <div style={{ position: 'absolute', top: '0.65rem', right: '0.65rem', zIndex: 10 }}>
            <WishlistButton
              productId={productId}
              product={product}
              variant="icon"
              size="sm"
            />
          </div>

          {/* Status Badge (Bottom-Right if not active) */}
          {status && status !== 'ACTIVE' && (
            <div style={{ position: 'absolute', bottom: '0.65rem', right: '0.65rem', zIndex: 5 }}>
              <Badge variant={getStatusBadgeVariant(status)} size="sm">
                {status}
              </Badge>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            {/* Price & Condition */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '850', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                ${typeof price === 'number' ? price.toFixed(price % 1 === 0 ? 0 : 2) : price}
              </span>
              {getConditionBadge(condition)}
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                lineHeight: 1.35,
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={title}
            >
              {title}
            </h3>
          </div>

          {/* Footer: Location & Seller */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--liquid-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} style={{ flexShrink: 0, color: 'var(--accent-orange)' }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {location}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--btn-primary-bg)',
                    color: 'var(--btn-primary-text)',
                    border: '1px solid var(--liquid-glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                  }}
                >
                  {seller?.name ? seller.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>{seller?.name || 'Verified Student'}</span>
              </div>
              {createdAt && (
                <span>{new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
