import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

/**
 * Reusable Wishlist Toggle Button
 * Supports both round icon-only style (for ProductCard) and full labeled button style (for Product Details).
 * Handles authentication checks, optimistic updates, and disabled/loading states.
 */
export const WishlistButton = ({
  productId,
  product = null,
  variant = 'icon', // 'icon' | 'button'
  size = 'md', // 'sm' | 'md' | 'lg'
  showLabel = false,
  className = '',
  style = {},
}) => {
  const { isInWishlist, toggleWishlist, isPending } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const targetId = productId || product?.id || product?._id;
  const isSaved = isInWishlist(targetId);
  const pending = isPending(targetId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!targetId || pending) return;

    try {
      const result = await toggleWishlist(product || targetId);
      if (result?.requireAuth) {
        navigate('/login', { state: { from: location.pathname } });
      }
    } catch (err) {
      // Handled in context, error is logged
    }
  };

  // Icon sizing
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  // Icon-only floating round badge style (ProductCard)
  if (variant === 'icon') {
    const buttonDim = size === 'sm' ? '32px' : size === 'lg' ? '44px' : '38px';

    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        className={`wishlist-button-icon ${className}`}
        style={{
          width: buttonDim,
          height: buttonDim,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isSaved
            ? 'rgba(225, 29, 72, 0.22)'
            : isHovered
            ? 'rgba(30, 41, 59, 0.85)'
            : 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: isSaved
            ? '1px solid rgba(244, 63, 94, 0.45)'
            : isHovered
            ? '1px solid rgba(255, 255, 255, 0.28)'
            : '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: isSaved
            ? '0 0 16px -2px rgba(244, 63, 94, 0.45)'
            : isHovered
            ? '0 4px 14px rgba(0, 0, 0, 0.4)'
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
          cursor: pending ? 'wait' : 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered && !pending ? 'scale(1.08)' : 'scale(1)',
          color: isSaved ? '#fb7185' : '#94a3b8',
          padding: 0,
          outline: 'none',
          ...style,
        }}
      >
        {pending ? (
          <Loader2 size={iconSize} className="animate-spin" style={{ color: '#fb7185' }} />
        ) : (
          <Heart
            size={iconSize}
            fill={isSaved ? '#fb7185' : 'none'}
            stroke={isSaved ? '#fb7185' : isHovered ? '#fb7185' : '#94a3b8'}
            strokeWidth={isSaved ? 2 : 2.2}
            style={{
              transition: 'transform 0.2s ease, fill 0.2s ease, stroke 0.2s ease',
              transform: isSaved ? 'scale(1.05)' : 'none',
            }}
          />
        )}
      </button>
    );
  }

  // Full button style (for Product Details / action bars)
  const isFullButton = variant === 'button';
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        backgroundColor: isSaved ? 'rgba(225, 29, 72, 0.2)' : isHovered ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        color: isSaved ? '#fb7185' : 'var(--text-primary)',
        borderColor: isSaved ? 'rgba(244, 63, 94, 0.4)' : isHovered ? 'rgba(255, 255, 255, 0.25)' : 'var(--border-subtle)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 'var(--radius-md, 8px)',
        fontWeight: '600',
        fontSize: size === 'sm' ? '0.8125rem' : size === 'lg' ? '1rem' : '0.875rem',
        padding: size === 'sm' ? '0.4rem 0.75rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.6rem 1.15rem',
        transition: 'all 0.2s ease',
        cursor: pending ? 'wait' : 'pointer',
        boxShadow: isHovered ? '0 4px 14px rgba(0, 0, 0, 0.3)' : 'none',
        ...style,
      }}
    >
      {pending ? (
        <Loader2 size={iconSize} className="animate-spin" style={{ color: isSaved ? '#fb7185' : 'currentColor' }} />
      ) : (
        <Heart
          size={iconSize}
          fill={isSaved ? '#fb7185' : 'none'}
          stroke={isSaved ? '#fb7185' : 'currentColor'}
          strokeWidth={2}
          style={{
            transition: 'transform 0.2s ease',
            transform: isSaved ? 'scale(1.05)' : 'none',
          }}
        />
      )}
      <span>{isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
    </button>
  );
};

export default WishlistButton;
