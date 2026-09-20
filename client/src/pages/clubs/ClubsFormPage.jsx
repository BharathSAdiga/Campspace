import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  BookOpen,
  AlignLeft,
  Plus,
  GraduationCap,
  Globe,
  Trophy,
  Laptop,
  Palette,
  Package,
  Trash2,
} from 'lucide-react';
import clubService from '../../services/club.service';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { CustomDropdown } from '../../components/common/CustomDropdown';

const CATEGORY_OPTIONS = [
  { id: 'Academic', label: 'Academic & Professional', icon: GraduationCap },
  { id: 'Cultural', label: 'Cultural & Heritage', icon: Globe },
  { id: 'Sports', label: 'Sports & Fitness', icon: Trophy },
  { id: 'Technology', label: 'Technology & Coding', icon: Laptop },
  { id: 'Arts', label: 'Arts & Creative', icon: Palette },
  { id: 'Social', label: 'Social & Networking', icon: Users },
  { id: 'Other', label: 'Other', icon: Package },
];

const CATEGORIES = CATEGORY_OPTIONS.map((c) => c.id);

export const ClubsFormPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Academic',
    description: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${formData.name || 'this club'}"? This action cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await clubService.deleteClub(id);
      navigate('/clubs');
    } catch (err) {
      setApiError(err.message || 'Failed to delete club.');
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (isEdit && id) {
      const fetchClub = async () => {
        try {
          const response = await clubService.getClubById(id);
          const data = response.data || response;
          setFormData({
            name: data.name || '',
            description: data.description || '',
            category: data.category || 'Academic',
          });
        } catch (err) {
          setApiError(err.message || 'Failed to fetch club data');
        } finally {
          setIsLoading(false);
        }
      };
      fetchClub();
    }
  }, [isEdit, id]);

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Club name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name cannot exceed 100 characters';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    } else if (!CATEGORIES.includes(formData.category)) {
      errors.category = 'Please select a valid category';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      let response;
      if (isEdit) {
        response = await clubService.updateClub(id, formData);
      } else {
        response = await clubService.createClub(formData);
      }
      
      const payload = response.data || response;
      navigate(`/clubs/${payload.id || payload._id || id}`);
    } catch (err) {
      setApiError(err.message || `Failed to ${isEdit ? 'update' : 'create'} club.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '800px' }}>
      {/* Back Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={isEdit ? `/clubs/${id}` : "/clubs"}
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
          <span>{isEdit ? 'Back to Club' : 'Back to Clubs'}</span>
        </Link>
      </div>

      {/* Page Header */}
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
              boxShadow: 'none',
            }}
          >
            <span className="orange-dot" /> {isEdit ? 'Manage Club' : 'New Club Registration'}
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit Club Details' : 'Register New Club'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem', margin: 0 }}>
          {isEdit ? 'Update your club information.' : 'Submit a new student organization to the campus directory.'}
        </p>
      </div>

      {apiError && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert type="error" message={apiError} dismissible onDismiss={() => setApiError('')} />
        </div>
      )}

      {/* Main Form */}
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--liquid-glass-border)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
              Club Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Club Name <span style={{ color: 'var(--danger-color)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Users size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Chess Club, Robotics Society"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${formErrors.name ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem', backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>
              {formErrors.name && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{formErrors.name}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="category" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Category <span style={{ color: 'var(--danger-color)' }}>*</span>
              </label>
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
                placeholder="Select a category..."
                ariaLabel="Club Category"
              />
              {formErrors.category && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{formErrors.category}</span>}
            </div>
          </div>

          {/* Section 2: Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--liquid-glass-border)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
              About the Club
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="description" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Description <span style={{ color: 'var(--danger-color)' }}>*</span>
              </label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.25rem 0' }}>
                Provide a detailed description of your club, meeting schedules, and what members can expect.
              </p>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }}>
                  <AlignLeft size={18} />
                </div>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your club..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className={`form-input ${formErrors.description ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem', paddingTop: '1rem', backgroundColor: 'var(--bg-subtle)', resize: 'vertical' }}
                />
              </div>
              {formErrors.description && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{formErrors.description}</span>}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--liquid-glass-border)', margin: '0.5rem 0' }} />

          <div style={{ display: 'flex', justifyContent: isEdit ? 'space-between' : 'flex-end', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderColor: 'rgba(239, 68, 68, 0.45)',
                  color: 'var(--danger-500, #ef4444)',
                  backgroundColor: 'rgba(239, 68, 68, 0.06)',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                <Trash2 size={16} />
                <span>{isDeleting ? 'Deleting...' : 'Delete Club'}</span>
              </button>
            )}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isEdit ? `/clubs/${id}` : '/clubs')}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={isDeleting}
                style={{ padding: '0 2rem' }}
              >
                {isEdit ? 'Save Changes' : 'Register Club'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ClubsCreatePage = () => <ClubsFormPage isEdit={false} />;
export const ClubsEditPage = () => <ClubsFormPage isEdit={true} />;
