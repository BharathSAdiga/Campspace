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
            ? '#fee2e2'
            : isHovered
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: isSaved
            ? '1px solid #fca5a5'
            : isHovered
            ? '1px solid rgba(176, 155, 126, 0.9)'
            : '1px solid rgba(216, 204, 184, 0.85)',
          boxShadow: isSaved
            ? '0 0 16px -2px rgba(244, 63, 94, 0.3)'
            : isHovered
            ? '0 4px 14px rgba(44, 36, 22, 0.12)'
            : '0 2px 8px rgba(44, 36, 22, 0.08)',
          cursor: pending ? 'wait' : 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered && !pending ? 'scale(1.08)' : 'scale(1)',
          color: isSaved ? '#333333' : '#666666',
          padding: 0,
          outline: 'none',
          ...style,
        }}
      >
        {pending ? (
          <Loader2 size={iconSize} className="animate-spin" style={{ color: '#333333' }} />
        ) : (
          <Heart
            size={iconSize}
            fill={isSaved ? '#333333' : 'none'}
            stroke={isSaved ? '#333333' : isHovered ? '#333333' : '#666666'}
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
        backgroundColor: isSaved ? '#fee2e2' : isHovered ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        color: isSaved ? '#333333' : 'var(--text-primary)',
        borderColor: isSaved ? '#fca5a5' : isHovered ? 'rgba(176, 155, 126, 0.85)' : 'var(--border-subtle)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 'var(--radius-md, 8px)',
        fontWeight: '600',
        fontSize: size === 'sm' ? '0.8125rem' : size === 'lg' ? '1rem' : '0.875rem',
        padding: size === 'sm' ? '0.4rem 0.75rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.6rem 1.15rem',
        transition: 'all 0.2s ease',
        cursor: pending ? 'wait' : 'pointer',
        boxShadow: isHovered ? '0 4px 14px rgba(44, 36, 22, 0.1)' : 'none',
        ...style,
      }}
    >
      {pending ? (
        <Loader2 size={iconSize} className="animate-spin" style={{ color: isSaved ? '#888888' : 'currentColor' }} />
      ) : (
        <Heart
          size={iconSize}
          fill={isSaved ? '#888888' : 'none'}
          stroke={isSaved ? '#888888' : 'currentColor'}
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
