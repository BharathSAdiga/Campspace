import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Tag,
  MapPin,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  ShieldAlert,
  Save,
} from 'lucide-react';
import productService from '../../services/product.service';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { Spinner } from '../../components/common/Spinner';

const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Stationery',
  'Sports & Fitness',
  'Dorm & Housing',
  'Other',
];

const CONDITIONS = [
  { value: 'New', label: 'Brand New (Unopened in original box)' },
  { value: 'Like New', label: 'Like New (Pristine with minimal or no signs of use)' },
  { value: 'Good', label: 'Good (Fully functional with minor cosmetic wear)' },
  { value: 'Fair', label: 'Fair (Noticeable wear but functions properly)' },
  { value: 'Poor', label: 'Poor (Heavily worn or for parts/repair)' },
];

export const MarketplaceEditPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Textbooks',
    condition: 'Like New',
    price: '',
    location: '',
    description: '',
    status: 'ACTIVE',
  });

  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageError, setImageError] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing product data
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const product = await productService.getProductById(id);
        if (!isMounted) return;

        // Check ownership
        const sellerId = product.seller?.id || product.seller?._id || product.seller;
        const currentUserId = user?.id || user?._id;
        const isOwner = sellerId === currentUserId || user?.role === 'admin';

        if (!isOwner) {
          setIsUnauthorized(true);
          setIsLoading(false);
          return;
        }

        setFormData({
          title: product.title || '',
          category: product.category || 'Textbooks',
          condition: product.condition || 'Like New',
          price: product.price !== undefined ? String(product.price) : '',
          location: product.location || '',
          description: product.description || '',
          status: product.status || 'ACTIVE',
        });

        if (Array.isArray(product.images)) {
          setImages(product.images);
        }
      } catch (err) {
        if (isMounted) {
          setApiError(err.message || 'Failed to load product details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const validate = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 120) {
      errors.title = 'Title cannot exceed 120 characters';
    }

    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      errors.category = 'Please select a valid category';
    }

    if (!formData.condition) {
      errors.condition = 'Condition is required';
    }

    if (formData.price === '' || formData.price === null) {
      errors.price = 'Price is required';
    } else {
      const numPrice = Number(formData.price);
      if (isNaN(numPrice) || numPrice < 0) {
        errors.price = 'Price must be a valid non-negative number';
      }
    }

    if (!formData.location.trim()) {
      errors.location = 'Pickup location is required';
    } else if (formData.location.trim().length > 100) {
      errors.location = 'Location cannot exceed 100 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 2000) {
      errors.description = 'Description cannot exceed 2000 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    setImageError('');
    const url = imageUrlInput.trim();

    if (!url) return;

    if (!/^https?:\/\/.+\..+/i.test(url)) {
      setImageError('Please enter a valid HTTP or HTTPS image URL');
      return;
    }

    if (images.includes(url)) {
      setImageError('This image URL has already been added');
      return;
    }

    if (images.length >= 6) {
      setImageError('You can add up to 6 photos per listing');
      return;
    }

    setImages((prev) => [...prev, url]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        condition: formData.condition,
        price: Number(formData.price),
        location: formData.location.trim(),
        description: formData.description.trim(),
        status: formData.status,
        images,
      };

      await productService.updateProduct(id, payload);
      navigate(`/marketplace/${id}`);
    } catch (err) {
      setApiError(err.message || 'Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <Spinner text="Loading listing information..." />
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShieldAlert size={48} color="var(--accent-rose)" style={{ marginBottom: '1rem' }} />
          <h2>Permission Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            You do not own this listing. Only the verified seller or an administrator has permission to modify this item.
          </p>
          <Link to={`/marketplace/${id}`} className="btn btn-primary">
            View Listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '800px' }}>
      {/* Back Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={`/marketplace/${id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Product Details</span>
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
          Edit Marketplace Listing
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem', margin: 0 }}>
          Update pricing, description, availability status, or pickup location.
        </p>
      </div>

      {/* Server Error Alert */}
      {apiError && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert type="error" message={apiError} dismissible onDismiss={() => setApiError('')} />
        </div>
      )}

      {/* Edit Form */}
      <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleSubmit} noValidate>
          {/* General Details */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              1. General Details
            </h2>

            {/* Title */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="edit-title" className="form-label">
                Listing Title <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                id="edit-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${formErrors.title ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
                maxLength={120}
              />
              {formErrors.title && <span className="form-error">{formErrors.title}</span>}
            </div>

            {/* Category & Condition */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="edit-category" className="form-label">
                  Category <span style={{ color: 'var(--danger-500)' }}>*</span>
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-input ${formErrors.category ? 'is-invalid' : ''}`}
                  disabled={isSubmitting}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && <span className="form-error">{formErrors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="edit-condition" className="form-label">
                  Condition <span style={{ color: 'var(--danger-500)' }}>*</span>
                </label>
                <select
                  id="edit-condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={`form-input ${formErrors.condition ? 'is-invalid' : ''}`}
                  disabled={isSubmitting}
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
                {formErrors.condition && <span className="form-error">{formErrors.condition}</span>}
              </div>
            </div>

            {/* Price & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="edit-price" className="form-label">
                  Price ($ USD) <span style={{ color: 'var(--danger-500)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      pointerEvents: 'none',
                      fontWeight: '700',
                    }}
                  >
                    $
                  </span>
                  <input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={`form-input ${formErrors.price ? 'is-invalid' : ''}`}
                    style={{ paddingLeft: '2rem' }}
                    disabled={isSubmitting}
                  />
                </div>
                {formErrors.price && <span className="form-error">{formErrors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="edit-location" className="form-label">
                  Campus Pickup Spot <span style={{ color: 'var(--danger-500)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      pointerEvents: 'none',
                      display: 'flex',
                    }}
                  >
                    <MapPin size={17} />
                  </span>
                  <input
                    id="edit-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className={`form-input ${formErrors.location ? 'is-invalid' : ''}`}
                    style={{ paddingLeft: '2.4rem' }}
                    disabled={isSubmitting}
                    maxLength={100}
                  />
                </div>
                {formErrors.location && <span className="form-error">{formErrors.location}</span>}
              </div>
            </div>

            {/* Listing Status */}
            <div className="form-group">
              <label htmlFor="edit-status" className="form-label">
                Listing Status
              </label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="ACTIVE">ACTIVE (Visible in campus search)</option>
                <option value="SOLD">SOLD (Marked as completed)</option>
                <option value="ARCHIVED">ARCHIVED (Hidden from public catalog)</option>
              </select>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.75rem 0' }} />

          {/* Description */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              2. Description
            </h2>
            <div className="form-group">
              <label htmlFor="edit-desc" className="form-label">
                Full Description <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <textarea
                id="edit-desc"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className={`form-input ${formErrors.description ? 'is-invalid' : ''}`}
                style={{ resize: 'vertical', minHeight: '110px' }}
                disabled={isSubmitting}
                maxLength={2000}
              />
              {formErrors.description && <span className="form-error">{formErrors.description}</span>}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.75rem 0' }} />

          {/* Photos */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              3. Photos
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value);
                  if (imageError) setImageError('');
                }}
                className={`form-input ${imageError ? 'is-invalid' : ''}`}
                disabled={isSubmitting || images.length >= 6}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddImage}
                disabled={!imageUrlInput.trim() || isSubmitting || images.length >= 6}
                icon={<Plus size={16} />}
              >
                Add
              </Button>
            </div>

            {imageError && (
              <span className="form-error" style={{ display: 'block', marginBottom: '0.75rem' }}>
                {imageError}
              </span>
            )}

            {images.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '0.75rem',
                  marginTop: '1rem',
                }}
              >
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      paddingTop: '85%',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-card-subtle)',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Upload ${idx + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Link to={`/marketplace/${id}`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              icon={<Save size={18} />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarketplaceEditPage;
