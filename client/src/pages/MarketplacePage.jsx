import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { marketplaceService } from '../services/marketplace.service';
import { ListingCard } from '../components/marketplace/ListingCard';
import { ListingFilterBar } from '../components/marketplace/ListingFilterBar';
import { ListingDetailModal } from '../components/marketplace/ListingDetailModal';
import { CreateListingModal } from '../components/marketplace/CreateListingModal';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';
import {
  ShoppingBag,
  PlusCircle,
  PackageSearch,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const MarketplacePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    condition: 'All',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modals state
  const [selectedListing, setSelectedListing] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch listings from backend
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await marketplaceService.getListings(filters);

      if (response.success && response.data) {
        setListings(response.data.listings || []);
        setPagination(response.data.pagination || {});
      }
    } catch (err) {
      setError(err.message || 'Failed to load marketplace listings.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset to page 1 on filter tweak
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      condition: 'All',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
    });
  };

  // Open item detail
  const handleSelectListing = async (listing) => {
    setSelectedListing(listing);
    // Refresh item details in modal to increment view count & get freshest seller data
    try {
      const resp = await marketplaceService.getListingById(listing._id);
      if (resp.success && resp.data?.listing) {
        setSelectedListing(resp.data.listing);
        // Also update view count in local list
        setListings((prev) =>
          prev.map((item) => (item._id === listing._id ? resp.data.listing : item))
        );
      }
    } catch {
      // Keep existing listing if network fails
    }
  };

  // Handle post item button
  const handlePostItemClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/marketplace', message: 'Please sign in to post an item for sale.' } });
      return;
    }
    setShowCreateModal(true);
  };

  // On item created
  const handleListingCreated = (newListing) => {
    setShowCreateModal(false);
    setListings((prev) => [newListing, ...prev]);
    setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
    setFeedback({
      type: 'success',
      message: `Your item "${newListing.title}" was published to the campus marketplace!`,
    });
    setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
  };

  // On status change (e.g. sold / available)
  const handleStatusChange = async (listingId, newStatus) => {
    try {
      const response = await marketplaceService.updateListing(listingId, { status: newStatus });
      if (response.success && response.data?.listing) {
        setSelectedListing(response.data.listing);
        setListings((prev) =>
          prev.map((item) => (item._id === listingId ? response.data.listing : item))
        );
        setFeedback({
          type: 'success',
          message: `Listing updated to '${newStatus}'.`,
        });
        setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update listing status.',
      });
    }
  };

  // On delete
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await marketplaceService.deleteListing(listingId);
      setSelectedListing(null);
      setListings((prev) => prev.filter((item) => item._id !== listingId));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      setFeedback({
        type: 'success',
        message: 'Listing removed successfully.',
      });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to delete listing.',
      });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        {/* Hero Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--primary-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Campus Trade & Goods
              </span>
            </div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Campus Marketplace</h1>
            <p style={{ color: 'var(--slate-400)', maxWidth: '600px' }}>
              Buy, sell, and trade textbooks, electronics, dorm essentials, and supplies safely with verified campus peers.
            </p>
          </div>

          <div>
            <button
              onClick={handlePostItemClick}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              <PlusCircle size={18} />
              <span>Post an Item</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback.message && (
          <Alert type={feedback.type} message={feedback.message} style={{ marginBottom: '1.5rem' }} />
        )}

        {/* Filter Bar */}
        <ListingFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={pagination.total || 0}
        />

        {/* Error Alert */}
        {error && <Alert type="error" message={error} style={{ marginBottom: '2rem' }} />}

        {/* Content State: Loading, Empty, or Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <Spinner size={36} />
          </div>
        ) : listings.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              maxWidth: '520px',
              margin: '2rem auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <PackageSearch size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Listings Found</h3>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              No campus items currently match your chosen search keywords or filter criteria.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                Reset Filters
              </button>
              <button onClick={handlePostItemClick} className="btn btn-primary btn-sm">
                Post New Item
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Listings Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem',
              }}
            >
              {listings.map((item) => (
                <ListingCard
                  key={item._id}
                  listing={item}
                  onSelect={handleSelectListing}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: '2rem',
                }}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => handleFilterChange('page', pagination.page - 1)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <span style={{ fontSize: '0.875rem', color: 'var(--slate-400)' }}>
                  Page <strong style={{ color: 'var(--slate-200)' }}>{pagination.page}</strong> of{' '}
                  <strong style={{ color: 'var(--slate-200)' }}>{pagination.totalPages}</strong>
                </span>

                <button
                  className="btn btn-secondary btn-sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handleFilterChange('page', pagination.page + 1)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Item Detail Modal */}
        {selectedListing && (
          <ListingDetailModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteListing}
          />
        )}

        {/* Create Listing Modal */}
        {showCreateModal && (
          <CreateListingModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleListingCreated}
          />
        )}
      </div>
    </div>
  );
};
