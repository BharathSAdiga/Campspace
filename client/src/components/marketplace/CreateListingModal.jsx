import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle } from 'lucide-react';
import { marketplaceService } from '../../services/marketplace.service';
import { Alert } from '../common/Alert';

const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Stationery',
  'Housing / Sublet',
  'Other',
];

const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'];

export const CreateListingModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Textbooks',
    condition: 'Good',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a title for the listing.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a description of the item.');
      return;
    }

    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      setError('Please enter a valid price ($0 or greater).');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      const response = await marketplaceService.createListing(payload);

      if (response.success && response.data?.listing) {
        onSuccess(response.data.listing);
      }
    } catch (err) {
      setError(err.message || 'Failed to publish listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--slate-300)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <PlusCircle size={22} color="var(--primary-400)" />
          <h2 style={{ fontSize: '1.5rem' }}>Post an Item for Sale</h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', marginBottom: '1.5rem' }}>
          Publish items, textbooks, or supplies to the verified campus marketplace.
        </p>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="listing-title">
              Item Title *
            </label>
            <input
              id="listing-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Calculus Early Transcendentals 9th Ed."
              value={formData.title}
              onChange={handleChange}
              maxLength={120}
              required
            />
          </div>

          {/* Category & Condition */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="listing-category">
                Category *
              </label>
              <select
                id="listing-category"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="listing-condition">
                Condition *
              </label>
              <select
                id="listing-condition"
                name="condition"
                className="form-input"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="listing-price">
                Price ($ USD) *
              </label>
              <input
                id="listing-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0 for Free"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="listing-location">
                Campus Location
              </label>
              <input
                id="listing-location"
                name="location"
                type="text"
                className="form-input"
                placeholder="e.g. Science Library, North Dorms"
                value={formData.location}
                onChange={handleChange}
                maxLength={100}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="listing-description">
              Description *
            </label>
            <textarea
              id="listing-description"
              name="description"
              rows="4"
              className="form-textarea"
              placeholder="Detail the item condition, edition, included accessories, or pickup arrangements..."
              value={formData.description}
              onChange={handleChange}
              maxLength={2000}
              required
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2 }}
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
