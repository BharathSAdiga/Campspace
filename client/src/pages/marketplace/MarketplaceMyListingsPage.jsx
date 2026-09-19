import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  RotateCcw,
  Tag,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import productService from '../../services/product.service';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Alert } from '../../components/common/Alert';

export const MarketplaceMyListingsPage = () => {
  const [products, setProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state per product ID
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const fetchMyListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.getMyListings({
        status: filterStatus,
      });
      setProducts(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your listings.');
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  // Handle status toggle (e.g. ACTIVE -> SOLD, SOLD -> ACTIVE)
  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'SOLD' ? 'ACTIVE' : 'SOLD';
    const prodId = product.id || product._id;
    setStatusUpdatingId(prodId);
    setSuccessMessage('');

    try {
      await productService.updateStatus(prodId, newStatus);
      setSuccessMessage(`Listing marked as ${newStatus}`);
      // Optimistically update local list
      setProducts((prev) =>
        prev.map((p) => ((p.id || p._id) === prodId ? { ...p, status: newStatus } : p))
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update listing status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Handle delete execution
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const prodId = deleteTarget.id || deleteTarget._id;
    setIsDeleting(true);

    try {
      await productService.deleteProduct(prodId);
      setSuccessMessage(`"${deleteTarget.title}" was successfully deleted`);
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== prodId));
      setDeleteTarget(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
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
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--accent-orange)',
                backgroundColor: 'var(--accent-orange-subtle)',
                border: '1px solid var(--accent-orange-border)',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 0 12px var(--accent-orange-glow)',
              }}
            >
              <span className="orange-dot" /> Seller Dashboard
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            My Marketplace Listings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem', margin: 0 }}>
            Manage, edit, mark sold, or remove your campus marketplace postings.
          </p>
        </div>

        <Link
          to="/marketplace/create"
          className="btn btn-liquid-orange"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={18} />
          <span>New Listing</span>
        </Link>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert type="success" message={successMessage} dismissible onDismiss={() => setSuccessMessage('')} />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert type="error" message={error} dismissible onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Status Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--liquid-glass-border)',
          paddingBottom: '0.5rem',
        }}
      >
        {[
          { id: 'ALL', label: 'All Items' },
          { id: 'ACTIVE', label: 'Active' },
          { id: 'SOLD', label: 'Sold' },
          { id: 'ARCHIVED', label: 'Archived' },
        ].map((tab) => {
          const isActive = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              style={{
                background: isActive ? 'var(--accent-orange)' : 'var(--liquid-glass-bg)',
                border: isActive ? '1px solid var(--accent-orange)' : '1px solid var(--liquid-glass-border)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '500',
                padding: '0.4rem 0.9rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                boxShadow: isActive ? '0 0 12px var(--accent-orange-glow)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content States */}
      {isLoading ? (
        <div style={{ padding: '4rem 0' }}>
          <Spinner text="Fetching your listings..." />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No Listings Found"
          description={
            filterStatus === 'ALL'
              ? "You haven't posted any items for sale yet. Create your first listing to start connecting with campus buyers!"
              : `You don't have any listings currently categorized as "${filterStatus.toLowerCase()}".`
          }
          icon={<Package size={32} />}
          action={
            <Link to="/marketplace/create" className="btn btn-liquid-orange">
              <Plus size={16} style={{ marginRight: '0.35rem' }} /> Create First Listing
            </Link>
          }
        />
      ) : (
        /* Listings Table / Cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.map((product) => {
            const prodId = product.id || product._id;
            const mainImg = product.images && product.images.length > 0 ? product.images[0] : null;
            const isSold = product.status === 'SOLD';
            const isUpdating = statusUpdatingId === prodId;

            return (
              <div
                key={prodId}
                className="card liquid-glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  background: 'var(--liquid-glass-bg)',
                  backdropFilter: 'var(--liquid-glass-blur)',
                  WebkitBackdropFilter: 'var(--liquid-glass-blur)',
                  border: '1px solid var(--liquid-glass-border)',
                  boxShadow: 'var(--liquid-glass-shadow)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'border-color 0.15s ease',
                }}
              >
                {/* Left: Thumbnail & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px', flex: 1 }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card-subtle)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {mainImg ? (
                      <img
                        src={mainImg}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Package size={24} color="var(--text-muted)" />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <Badge variant={getStatusBadgeVariant(product.status)} size="sm">
                        {product.status}
                      </Badge>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                        {product.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        • Listed {new Date(product.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <Link
                      to={`/marketplace/${prodId}`}
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        display: 'block',
                      }}
                      className="listing-title-link"
                    >
                      {product.title}
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: '800', color: 'var(--primary-700)', fontSize: '1rem' }}>
                        ${typeof product.price === 'number' ? product.price.toFixed(product.price % 1 === 0 ? 0 : 2) : product.price}
                      </span>
                      <span>Condition: <strong>{product.condition}</strong></span>
                      {product.location && <span>Pickup: <strong>{product.location}</strong></span>}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Mark Sold / Active Toggle */}
                  <Button
                    variant={isSold ? 'secondary' : 'default'}
                    size="sm"
                    onClick={() => handleToggleStatus(product)}
                    isLoading={isUpdating}
                    icon={isSold ? <RotateCcw size={14} /> : <CheckCircle size={14} />}
                  >
                    {isSold ? 'Reactivate' : 'Mark Sold'}
                  </Button>

                  {/* View Details */}
                  <Link
                    to={`/marketplace/${prodId}`}
                    className="btn btn-secondary btn-sm"
                    title="View public listing"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </Link>

                  {/* Edit Listing */}
                  <Link
                    to={`/marketplace/${prodId}/edit`}
                    className="btn btn-secondary btn-sm"
                    title="Edit listing details"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </Link>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(product)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger-500)' }}
                    title="Delete listing"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          title="Delete Marketplace Listing?"
          message={`Are you sure you want to permanently delete "${deleteTarget.title}"? This action cannot be undone.`}
          confirmText="Delete Listing"
          cancelText="Keep Listing"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default MarketplaceMyListingsPage;
