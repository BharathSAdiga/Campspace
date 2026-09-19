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
            ? 'var(--accent-orange-subtle)'
            : isHovered
            ? 'var(--liquid-glass-bg-hover)'
            : 'var(--liquid-glass-bg)',
          backdropFilter: 'var(--liquid-glass-blur)',
          WebkitBackdropFilter: 'var(--liquid-glass-blur)',
          border: isSaved
            ? '1px solid var(--accent-orange-border)'
            : isHovered
            ? '1px solid var(--liquid-glass-border-hover)'
            : '1px solid var(--liquid-glass-border)',
          boxShadow: isHovered
            ? 'var(--liquid-glass-shadow-hover)'
            : 'var(--liquid-glass-shadow)',
          cursor: pending ? 'wait' : 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered && !pending ? 'scale(1.08)' : 'scale(1)',
          color: isSaved ? 'var(--accent-orange)' : 'var(--text-muted)',
          padding: 0,
          outline: 'none',
          ...style,
        }}
      >
        {pending ? (
          <Loader2 size={iconSize} className="animate-spin" style={{ color: 'var(--accent-orange)' }} />
        ) : (
          <Heart
            size={iconSize}
            fill={isSaved ? 'var(--accent-orange)' : 'none'}
            stroke={isSaved ? 'var(--accent-orange)' : isHovered ? 'var(--accent-orange)' : 'currentColor'}
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
        backgroundColor: isSaved ? 'var(--accent-orange-subtle)' : isHovered ? 'var(--liquid-glass-bg-hover)' : 'var(--liquid-glass-bg)',
        backdropFilter: 'var(--liquid-glass-blur)',
        WebkitBackdropFilter: 'var(--liquid-glass-blur)',
        color: isSaved ? 'var(--accent-orange)' : 'var(--text-primary)',
        borderColor: isSaved ? 'var(--accent-orange-border)' : isHovered ? 'var(--liquid-glass-border-hover)' : 'var(--liquid-glass-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 'var(--radius-md, 8px)',
        fontWeight: '600',
        fontSize: size === 'sm' ? '0.8125rem' : size === 'lg' ? '1rem' : '0.875rem',
        padding: size === 'sm' ? '0.4rem 0.75rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.6rem 1.15rem',
        transition: 'all 0.2s ease',
        cursor: pending ? 'wait' : 'pointer',
        boxShadow: isHovered ? 'var(--liquid-glass-shadow-hover)' : 'var(--liquid-glass-shadow)',
        ...style,
      }}
    >
      {pending ? (
        <Loader2 size={iconSize} className="animate-spin" style={{ color: isSaved ? 'var(--accent-orange)' : 'currentColor' }} />
      ) : (
        <Heart
          size={iconSize}
          fill={isSaved ? 'var(--accent-orange)' : 'none'}
          stroke={isSaved ? 'var(--accent-orange)' : 'currentColor'}
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
