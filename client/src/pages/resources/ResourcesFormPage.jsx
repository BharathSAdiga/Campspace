import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Box,
  MapPin,
  AlignLeft,
  Users,
  CheckCircle,
  Plus,
  Trash2,
  Home,
  Wrench,
  FlaskConical,
  Trophy,
  Package,
} from 'lucide-react';
import resourceService from '../../services/resource.service';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { CustomDropdown } from '../../components/common/CustomDropdown';

const CATEGORY_OPTIONS = [
  { id: 'Room', label: 'Room / Facility', icon: Home },
  { id: 'Equipment', label: 'Equipment & Hardware', icon: Wrench },
  { id: 'Laboratory', label: 'Laboratory / Research', icon: FlaskConical },
  { id: 'Sports', label: 'Sports & Athletics', icon: Trophy },
  { id: 'Other', label: 'Other Resource', icon: Package },
];

const CATEGORIES = CATEGORY_OPTIONS.map((c) => c.id);

export const ResourcesCreatePage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Room',
    location: '',
    capacity: '',
    description: '',
  });

  const [facilities, setFacilities] = useState([]);
  const [facilityInput, setFacilityInput] = useState('');
  
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Resource name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    if (formData.capacity && isNaN(Number(formData.capacity))) {
      errors.capacity = 'Capacity must be a number';
    } else if (formData.capacity && Number(formData.capacity) < 1) {
      errors.capacity = 'Capacity must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    const val = facilityInput.trim();
    if (!val) return;
    if (facilities.includes(val)) return;
    
    setFacilities(prev => [...prev, val]);
    setFacilityInput('');
  };

  const handleRemoveFacility = (index) => {
    setFacilities(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const payload = {
        ...formData,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        facilities
      };
      const response = await resourceService.createResource(payload);
      const data = response.data || response;
      navigate(`/resources/${data.id || data._id}`);
    } catch (err) {
      setApiError(err.message || 'Failed to create resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/resources"
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
          <ArrowLeft size={16} /> Back to Resources
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
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
            }}
          >
            <span className="orange-dot" /> Resource Management
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
          Add New Resource
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem', margin: 0 }}>
          List a new facility, room, or equipment for campus members to book.
        </p>
      </div>

      {apiError && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert type="error" message={apiError} dismissible onDismiss={() => setApiError('')} />
        </div>
      )}

      <div
        className="card liquid-glass-card"
        style={{
          padding: '2rem',
          background: 'var(--liquid-glass-bg)',
          backdropFilter: 'var(--liquid-glass-blur)',
          WebkitBackdropFilter: 'var(--liquid-glass-blur)',
          border: '1px solid var(--liquid-glass-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Section 1: Basic Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--liquid-glass-border)', paddingBottom: '0.5rem' }}>
              Resource Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label htmlFor="name" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Resource Name *</label>
                 <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Box size={18} /></div>
                   <input
                     id="name"
                     name="name"
                     type="text"
                     value={formData.name}
                     onChange={handleChange}
                     className={`form-input ${formErrors.name ? 'error' : ''}`}
                     style={{ paddingLeft: '2.75rem', backgroundColor: 'var(--bg-subtle)' }}
                   />
                 </div>
                 {formErrors.name && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem' }}>{formErrors.name}</span>}
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                 <label htmlFor="category" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Category *</label>
                 <CustomDropdown
                   options={CATEGORY_OPTIONS}
                   value={formData.category}
                   onChange={(val) => {
                     setFormData((prev) => ({ ...prev, category: val }));
                     if (formErrors.category) {
                       setFormErrors((prev) => ({ ...prev, category: '' }));
                     }
                   }}
                   fullWidth
                   placeholder="Select Category"
                   ariaLabel="Resource Category"
                 />
                 {formErrors.category && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{formErrors.category}</span>}
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label htmlFor="location" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Location / Room # *</label>
                 <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><MapPin size={18} /></div>
                   <input
                     id="location"
                     name="location"
                     type="text"
                     value={formData.location}
                     onChange={handleChange}
                     className={`form-input ${formErrors.location ? 'error' : ''}`}
                     style={{ paddingLeft: '2.75rem', backgroundColor: 'var(--bg-subtle)' }}
                   />
                 </div>
                 {formErrors.location && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem' }}>{formErrors.location}</span>}
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label htmlFor="capacity" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Capacity (Optional)</label>
                 <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Users size={18} /></div>
                   <input
                     id="capacity"
                     name="capacity"
                     type="number"
                     min="1"
                     value={formData.capacity}
                     onChange={handleChange}
                     className={`form-input ${formErrors.capacity ? 'error' : ''}`}
                     style={{ paddingLeft: '2.75rem', backgroundColor: 'var(--bg-subtle)' }}
                   />
                 </div>
                 {formErrors.capacity && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem' }}>{formErrors.capacity}</span>}
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--liquid-glass-border)', paddingBottom: '0.5rem' }}>
              Description & Facilities
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="description" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Description *</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }}><AlignLeft size={18} /></div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`form-input ${formErrors.description ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem', paddingTop: '1rem', backgroundColor: 'var(--bg-subtle)', resize: 'vertical' }}
                />
              </div>
              {formErrors.description && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem' }}>{formErrors.description}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Facilities provided (Optional)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="e.g. Projector, Whiteboard"
                  className="form-input"
                  style={{ backgroundColor: 'var(--bg-subtle)', flex: 1 }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFacility(e)}
                />
                <Button type="button" variant="secondary" onClick={handleAddFacility}><Plus size={18} /> Add</Button>
              </div>
              {facilities.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {facilities.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                      <CheckCircle size={14} style={{ color: 'var(--success-color)' }} />
                      {f}
                      <button type="button" onClick={() => handleRemoveFacility(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', display: 'flex', padding: 0 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--liquid-glass-border)', margin: '0.5rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/resources')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              style={{ padding: '0 2rem' }}
            >
              Add Resource
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
