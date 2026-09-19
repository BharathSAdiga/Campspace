import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Search,
  ArrowLeft,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Badge } from '../../components/common/Badge';

export const MarketplaceWishlistPage = () => {
  const { wishlistItems, isLoading, removeFromWishlist, refreshWishlist, isPending } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Filter out any invalid items (safe handling)
  const validProducts = useMemo(() => {
    return (wishlistItems || []).filter((item) => item && (item.id || item._id) && item.title);
  }, [wishlistItems]);

  // Extract available categories from saved items
  const categories = useMemo(() => {
    const set = new Set();
    validProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [validProducts]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return validProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [validProducts, searchQuery, selectedCategory]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem 1.5rem', maxWidth: '1200px' }}>
      {/* Top Navigation & Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/marketplace"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--liquid-glass-border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent-orange-subtle)',
                  border: '1px solid var(--accent-orange-border)',
                  color: 'var(--accent-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px var(--accent-orange-glow)',
                }}
              >
                <Heart size={20} fill="var(--accent-orange)" color="var(--accent-orange)" />
              </div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                My Saved Wishlist
              </h1>
              <span className="badge badge-orange" style={{ fontWeight: 700 }}>
                <span className="orange-dot" /> {validProducts.length} {validProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
              Quickly monitor, revisit, or purchase textbooks, electronics, and gear you've bookmarked.
            </p>
          </div>

          {/* Quick Action Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => refreshWishlist()}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backdropFilter: 'blur(12px)' }}
              title="Refresh wishlist"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <Link
              to="/marketplace"
              className="btn btn-liquid-orange btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ShoppingBag size={15} />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter Bar (Only show if user has saved items) */}
        {validProducts.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                flex: '1 1 280px',
                maxWidth: '400px',
              }}
            >
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Search saved items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{
                  paddingLeft: '2.25rem',
                  height: '38px',
                  fontSize: '0.875rem',
                  background: 'var(--liquid-glass-bg)',
                  borderColor: 'var(--liquid-glass-border)',
                }}
              />
            </div>

            {/* Category Filter Chips */}
            {categories.length > 2 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--liquid-glass-border)',
                        backgroundColor: isSelected ? 'var(--accent-orange)' : 'var(--liquid-glass-bg)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        boxShadow: isSelected ? '0 0 12px var(--accent-orange-glow)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading && validProducts.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <Spinner text="Loading your saved wishlist..." />
        </div>
      ) : validProducts.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon={<Heart size={28} color="var(--accent-orange)" fill="var(--accent-orange)" />}
          title="Your wishlist is empty"
          description="Explore the campus marketplace and tap the heart icon on any listing to save it here for quick access."
          action={
            <Link to="/marketplace" className="btn btn-liquid-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={16} />
              <span>Browse Marketplace</span>
            </Link>
          }
        />
      ) : filteredProducts.length === 0 ? (
        /* Filter/Search Yielded No Results */
        <div
          className="card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-lg, 12px)',
          }}
        >
          <Search size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            No matching saved items found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            We couldn't find any items matching "{searchQuery}" in your wishlist.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Saved Products Grid */
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredProducts.map((product) => {
              const pId = product.id || product._id;
              const pending = isPending(pId);

              return (
                <div key={pId} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  {/* Reusable ProductCard with overlay heart button */}
                  <ProductCard product={product} />

                  {/* Explicit Quick Remove Bar */}
                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>Status: <strong style={{ color: product.status === 'ACTIVE' ? 'var(--success-600)' : 'inherit' }}>{product.status || 'ACTIVE'}</strong></span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWishlist(pId);
                      }}
                      disabled={pending}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger-600, #333333)',
                        cursor: pending ? 'wait' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      title="Remove from saved items"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceWishlistPage;
