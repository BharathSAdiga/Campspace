import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  Edit,
  AlertTriangle,
  Image as ImageIcon,
  User,
  Shield,
  Info,
} from 'lucide-react';
import productService from '../../services/product.service';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { WishlistButton } from '../../components/marketplace/WishlistButton';

export const MarketplaceDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Product could not be found.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const isOwner = Boolean(
    user &&
      product &&
      product.seller &&
      (product.seller.id === user.id ||
        product.seller._id === user.id ||
        product.seller === user.id ||
        user.role === 'admin')
  );

  const getConditionBadgeVariant = (cond) => {
    switch (cond) {
      case 'New':
        return 'success';
      case 'Like New':
        return 'primary';
      case 'Good':
        return 'default';
      case 'Fair':
        return 'warning';
      case 'Poor':
        return 'danger';
      default:
        return 'default';
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

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <Spinner text="Loading product details..." />
      </div>
    );
  }

  // 2. Error or Not Found State
  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <EmptyState
          title="Listing Not Found"
          description={error || "The marketplace listing you're looking for doesn't exist or has been removed."}
          action={
            <Link to="/marketplace" className="btn btn-primary">
              <ArrowLeft size={16} style={{ marginRight: '0.35rem' }} /> Back to Marketplace
            </Link>
          }
        />
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
  const currentImage = images[activeImageIndex] || null;
  const isSold = product.status === 'SOLD';
  const isArchived = product.status === 'ARCHIVED';

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Back to Marketplace Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/marketplace"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* SOLD / ARCHIVED Alert Notice */}
      {isSold && (
        <div
          className="alert alert-warning"
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>This item is SOLD.</strong> The seller has marked this listing as completed. It is no longer available for purchase.
          </div>
        </div>
      )}

      {isArchived && (
        <div
          className="alert alert-info"
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
          }}
        >
          <Info size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>This listing is ARCHIVED.</strong> This posting is currently not active in search results.
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Media & Photos Gallery */}
        <div>
          <div
            className="card"
            style={{
              padding: 0,
              overflow: 'hidden',
              backgroundColor: 'var(--bg-card-subtle)',
              position: 'relative',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '75%', // 4:3 Aspect Ratio
                overflow: 'hidden',
                backgroundColor: 'var(--bg-card-subtle)',
              }}
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
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
                    gap: '0.5rem',
                  }}
                >
                  <ImageIcon size={48} strokeWidth={1.25} />
                  <span style={{ fontSize: '0.875rem' }}>No photo available for this listing</span>
                </div>
              )}

              {/* Floating Wishlist Button */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
                <WishlistButton
                  productId={product.id || product._id}
                  product={product}
                  variant="icon"
                  size="md"
                />
              </div>

              {/* Status Badge in Photo */}
              {product.status && (
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 5 }}>
                  <Badge variant={getStatusBadgeVariant(product.status)} size="md">
                    {product.status}
                  </Badge>
                </div>
              )}

              {/* Category Pill in Photo */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 5 }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(216, 204, 184, 0.85)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.8125rem',
                    fontWeight: '700',
                    color: '#111111',
                    boxShadow: '0 4px 14px rgba(44, 36, 22, 0.08)',
                  }}
                >
                  {product.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip (if multiple images) */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  overflowX: 'auto',
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border:
                        activeImageIndex === idx
                          ? '2px solid #111111'
                          : '1px solid var(--border-subtle)',
                      boxShadow: activeImageIndex === idx ? '0 0 12px rgba(15, 23, 42, 0.25)' : 'none',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Safe Campus Meetup Tips */}
          <div
            className="card"
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              border: '1px solid var(--liquid-glass-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#111111',
                marginBottom: '0.5rem',
              }}
            >
              <ShieldCheck size={18} color="#111111" />
              <span>Campus Trading Safety</span>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.25rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <li>Meet in public campus areas (Student Center, Library, Dining Hall).</li>
              <li>Inspect physical textbooks, electronics, and devices in person before exchange.</li>
              <li>Communicate directly via verified campus email.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Listing Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111111' }}>
                ${typeof product.price === 'number' ? product.price.toFixed(product.price % 1 === 0 ? 0 : 2) : product.price}
              </span>
              <Badge variant={getConditionBadgeVariant(product.condition)} size="md">
                {product.condition}
              </Badge>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                • Listed {new Date(product.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                lineHeight: 1.3,
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              {product.title}
            </h1>

            {/* Quick Metadata Pill Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.75rem 0',
                borderTop: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Tag size={16} color="#111111" />
                <span>Category: <strong>{product.category}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} color="var(--text-muted)" />
                <span>Pickup: <strong>{product.location || 'Campus Pickup'}</strong></span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Description
            </h2>
            <div
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
              }}
            >
              {product.description}
            </div>
          </div>

          {/* Action Area */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {isOwner ? (
              /* Owner Actions */
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginBottom: '0.75rem',
                    color: 'var(--primary-700)',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                  }}
                >
                  <Shield size={16} />
                  <span>You own this listing</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Manage the price, description, condition, or mark this item as SOLD.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link
                    to={`/marketplace/${product.id || product._id}/edit`}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Edit size={16} />
                    <span>Edit Listing</span>
                  </Link>
                  <Link to="/marketplace" className="btn btn-secondary">
                    View Other Items
                  </Link>
                </div>
              </div>
            ) : (
              /* Buyer / Peer Actions */
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Interested in this item?
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Reach out directly to the verified student seller to ask questions or arrange a campus meetup.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Mailto Contact Button */}
                  <a
                    href={
                      isSold
                        ? undefined
                        : `mailto:${product.seller?.email}?subject=${encodeURIComponent(
                            `Inquiry about ${product.title} on Campspace`
                          )}&body=${encodeURIComponent(
                            `Hi ${product.seller?.name || 'Seller'},\n\nI saw your listing for "${product.title}" on Campspace and would like to arrange to buy it.\n\nAre you available to meet on campus?\n\nThanks!`
                          )}`
                    }
                    className={`btn ${isSold ? 'btn-secondary' : 'btn-primary'} btn-lg btn-block`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      opacity: isSold ? 0.65 : 1,
                      pointerEvents: isSold ? 'none' : 'auto',
                    }}
                  >
                    <Mail size={18} />
                    <span>{isSold ? 'Listing Sold' : 'Contact Seller via Email'}</span>
                  </a>

                  {/* Copy Email Button */}
                  {product.seller?.email && !isSold && (
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(product.seller?.email)}
                      className="btn btn-ghost btn-sm"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} color="var(--success-600)" />
                          <span style={{ color: 'var(--success-600)', fontWeight: '600' }}>
                            Email Copied to Clipboard!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Seller's Email ({product.seller.email})</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Save to Wishlist Full Action Button */}
                  <WishlistButton
                    productId={product.id || product._id}
                    product={product}
                    variant="button"
                    size="md"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Seller Information Card */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Seller Profile
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  flexShrink: 0,
                }}
              >
                {product.seller?.name ? product.seller.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {product.seller?.name || 'Campus Student'}
                  </span>
                  <Badge variant="default" size="sm">
                    {product.seller?.role || 'student'}
                  </Badge>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {product.seller?.email ? product.seller.email : 'Verified student account'}
                  {product.seller?.createdAt && (
                    <span> • Member since {new Date(product.seller.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceDetailPage;
