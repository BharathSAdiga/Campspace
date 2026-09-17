import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { Alert } from '../common/Alert';

const EVENT_CATEGORIES = [
  'Academic',
  'Career & Professional',
  'Social & Mixer',
  'Sports & Recreation',
  'Workshop & Seminar',
  'Cultural',
  'Tech & Hackathons',
  'Arts & Performance',
  'Other',
];

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3] ? match[3].toUpperCase() : null;

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};

export const EventForm = ({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  onCancel,
  serverErrors = null,
}) => {
  // Normalize initial date format to YYYY-MM-DD for date input
  const formatDateForInput = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    category: initialValues.category || '',
    description: initialValues.description || '',
    banner: initialValues.banner || initialValues.image || '',
    date: formatDateForInput(initialValues.date),
    startTime: initialValues.startTime || '',
    endTime: initialValues.endTime || '',
    location: initialValues.location || '',
    maximumParticipants:
      typeof initialValues.maximumParticipants === 'number'
        ? initialValues.maximumParticipants
        : 50,
    status: initialValues.status || 'ACTIVE',
  });

  const [clientErrors, setClientErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageLoadError, setImageLoadError] = useState(false);

  // Sync state if initialValues changes (e.g. after async fetch in edit page)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        title: initialValues.title || '',
        category: initialValues.category || '',
        description: initialValues.description || '',
        banner: initialValues.banner || initialValues.image || '',
        date: formatDateForInput(initialValues.date),
        startTime: initialValues.startTime || '',
        endTime: initialValues.endTime || '',
        location: initialValues.location || '',
        maximumParticipants:
          typeof initialValues.maximumParticipants === 'number'
            ? initialValues.maximumParticipants
            : 50,
        status: initialValues.status || 'ACTIVE',
      });
    }
  }, [initialValues]);

  // Validation function
  const validate = (dataToValidate = formData) => {
    const errs = {};

    // Title
    if (!dataToValidate.title?.trim()) {
      errs.title = 'Event title is required';
    } else if (dataToValidate.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    } else if (dataToValidate.title.trim().length > 120) {
      errs.title = 'Title cannot exceed 120 characters';
    }

    // Category
    if (!dataToValidate.category) {
      errs.category = 'Please select an event category';
    } else if (!EVENT_CATEGORIES.includes(dataToValidate.category)) {
      errs.category = 'Invalid category selected';
    }

    // Description
    if (!dataToValidate.description?.trim()) {
      errs.description = 'Event description is required';
    } else if (dataToValidate.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters';
    } else if (dataToValidate.description.trim().length > 5000) {
      errs.description = 'Description cannot exceed 5000 characters';
    }

    // Date
    if (!dataToValidate.date) {
      errs.date = 'Event date is required';
    } else {
      const parsed = new Date(dataToValidate.date);
      if (isNaN(parsed.getTime())) {
        errs.date = 'Invalid date format';
      }
    }

    // Time
    const startMin = parseTimeToMinutes(dataToValidate.startTime);
    const endMin = parseTimeToMinutes(dataToValidate.endTime);

    if (!dataToValidate.startTime) {
      errs.startTime = 'Start time is required';
    } else if (startMin === null) {
      errs.startTime = 'Invalid start time format';
    }

    if (!dataToValidate.endTime) {
      errs.endTime = 'End time is required';
    } else if (endMin === null) {
      errs.endTime = 'Invalid end time format';
    } else if (startMin !== null && endMin <= startMin) {
      errs.endTime = 'End time must be after start time';
    }

    // Location
    if (!dataToValidate.location?.trim()) {
      errs.location = 'Event venue or location is required';
    } else if (dataToValidate.location.trim().length > 150) {
      errs.location = 'Location cannot exceed 150 characters';
    }

    // Maximum Participants
    const maxVal = Number(dataToValidate.maximumParticipants);
    if (
      dataToValidate.maximumParticipants === '' ||
      dataToValidate.maximumParticipants === undefined ||
      dataToValidate.maximumParticipants === null
    ) {
      errs.maximumParticipants = 'Participant capacity limit is required';
    } else if (isNaN(maxVal) || !Number.isInteger(maxVal) || maxVal < 1) {
      errs.maximumParticipants = 'Capacity must be a positive whole number (at least 1)';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (name === 'banner') {
      setImageLoadError(false);
    }

    if (touched[name]) {
      const validationErrs = validate(updated);
      setClientErrors(validationErrs);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrs = validate();
    setClientErrors(validationErrs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrs = validate();
    setClientErrors(validationErrs);

    if (Object.keys(validationErrs).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrs)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) el.focus();
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      banner: formData.banner.trim(),
      image: formData.banner.trim(),
      date: new Date(formData.date).toISOString(),
      startTime: formData.startTime.trim(),
      endTime: formData.endTime.trim(),
      location: formData.location.trim(),
      maximumParticipants: Number(formData.maximumParticipants),
    };

    if (isEdit) {
      payload.status = formData.status;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Global Server Error Display */}
      {serverErrors && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert
            type="error"
            message={
              typeof serverErrors === 'string'
                ? serverErrors
                : serverErrors.message || 'Validation failed. Please review the highlighted fields below.'
            }
          />
        </div>
      )}

      <div
        className="card"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* SECTION 1: Core Details */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={18} color="var(--text-primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Core Event Information
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Title Field */}
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" htmlFor="event-title" style={{ margin: 0 }}>
                  Event Title <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formData.title.length}/120
                </span>
              </div>
              <input
                id="event-title"
                name="title"
                type="text"
                placeholder="e.g. HackCampus 2026: 24-Hour AI & Web3 Hackathon"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={120}
                className={`form-input ${clientErrors.title && touched.title ? 'error' : ''}`}
                style={{
                  borderColor: clientErrors.title && touched.title ? '#ef4444' : undefined,
                }}
              />
              {clientErrors.title && touched.title && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={13} />
                  <span>{clientErrors.title}</span>
                </div>
              )}
            </div>

            {/* Category and Status Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isEdit ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
              {/* Category */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="event-category" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  Category <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                </label>
                <select
                  id="event-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-select ${clientErrors.category && touched.category ? 'error' : ''}`}
                  style={{
                    borderColor: clientErrors.category && touched.category ? '#ef4444' : undefined,
                  }}
                >
                  <option value="">-- Select a Category --</option>
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {clientErrors.category && touched.category && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={13} />
                    <span>{clientErrors.category}</span>
                  </div>
                )}
              </div>

              {/* Status (Edit Mode Only) */}
              {isEdit && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="event-status" style={{ marginBottom: '0.4rem', display: 'block' }}>
                    Event Status <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                  </label>
                  <select
                    id="event-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="ACTIVE">ACTIVE (Open for RSVP)</option>
                    <option value="CLOSED">CLOSED (RSVPs Locked)</option>
                    <option value="CANCELLED">CANCELLED (Notice Displayed)</option>
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                    Setting to Cancelled or Closed stops new attendee registrations.
                  </span>
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" htmlFor="event-description" style={{ margin: 0 }}>
                  Event Description <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formData.description.length}/5000
                </span>
              </div>
              <textarea
                id="event-description"
                name="description"
                rows={5}
                placeholder="Describe what attendees can expect, keynote speakers, agenda, dress code, eligibility, catering, and what to bring..."
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={5000}
                className={`form-input ${clientErrors.description && touched.description ? 'error' : ''}`}
                style={{
                  resize: 'vertical',
                  borderColor: clientErrors.description && touched.description ? '#ef4444' : undefined,
                  minHeight: '120px',
                }}
              />
              {clientErrors.description && touched.description && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                  <AlertCircle size={13} />
                  <span>{clientErrors.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Schedule & Venue */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <Calendar size={18} color="var(--text-primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Schedule & Location
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Date, Start Time, End Time Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {/* Date */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="event-date" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  Event Date <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                </label>
                <input
                  id="event-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${clientErrors.date && touched.date ? 'error' : ''}`}
                  style={{
                    borderColor: clientErrors.date && touched.date ? '#ef4444' : undefined,
                  }}
                />
                {clientErrors.date && touched.date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={13} />
                    <span>{clientErrors.date}</span>
                  </div>
                )}
              </div>

              {/* Start Time */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="event-start-time" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  Start Time <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                </label>
                <input
                  id="event-start-time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${clientErrors.startTime && touched.startTime ? 'error' : ''}`}
                  style={{
                    borderColor: clientErrors.startTime && touched.startTime ? '#ef4444' : undefined,
                  }}
                />
                {clientErrors.startTime && touched.startTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={13} />
                    <span>{clientErrors.startTime}</span>
                  </div>
                )}
              </div>

              {/* End Time */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="event-end-time" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  End Time <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                </label>
                <input
                  id="event-end-time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${clientErrors.endTime && touched.endTime ? 'error' : ''}`}
                  style={{
                    borderColor: clientErrors.endTime && touched.endTime ? '#ef4444' : undefined,
                  }}
                />
                {clientErrors.endTime && touched.endTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={13} />
                    <span>{clientErrors.endTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location and Capacity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              {/* Location */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="event-location" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  Location / Venue <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="event-location"
                    name="location"
                    type="text"
                    placeholder="e.g. Science Library - Computer Lab 3 or Campus Great Ballroom"
                    value={formData.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={150}
                    className={`form-input ${clientErrors.location && touched.location ? 'error' : ''}`}
                    style={{
                      borderColor: clientErrors.location && touched.location ? '#ef4444' : undefined,
                    }}
                  />
                </div>
                {clientErrors.location && touched.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={13} />
                    <span>{clientErrors.location}</span>
                  </div>
                )}
              </div>

              {/* Maximum Participants */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="event-max-participants" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  Capacity Cap <span style={{ color: 'var(--accent-rose, #ef4444)' }}>*</span>
                </label>
                <input
                  id="event-max-participants"
                  name="maximumParticipants"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 50"
                  value={formData.maximumParticipants}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${clientErrors.maximumParticipants && touched.maximumParticipants ? 'error' : ''}`}
                  style={{
                    borderColor: clientErrors.maximumParticipants && touched.maximumParticipants ? '#ef4444' : undefined,
                  }}
                />
                {clientErrors.maximumParticipants && touched.maximumParticipants && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={13} />
                    <span>{clientErrors.maximumParticipants}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Banner & Media */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <ImageIcon size={18} color="var(--text-primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Banner Image (Optional)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="event-banner" style={{ marginBottom: '0.4rem', display: 'block' }}>
                Banner Image URL
              </label>
              <input
                id="event-banner"
                name="banner"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.banner}
                onChange={handleChange}
                className="form-input"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                Enter a direct image link. If omitted, an elegant fallback design pattern is automatically used.
              </span>
            </div>

            {/* Live Banner Preview Card */}
            {formData.banner && !imageLoadError && (
              <div
                style={{
                  marginTop: '0.5rem',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  position: 'relative',
                  paddingTop: '35%',
                  backgroundColor: 'var(--bg-subtle)',
                }}
              >
                <img
                  src={formData.banner}
                  alt="Banner preview"
                  onError={() => setImageLoadError(true)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}
                >
                  Live Banner Preview
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            marginTop: '0.5rem',
          }}
        >
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn btn-secondary"
              style={{ minWidth: '110px' }}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              minWidth: '160px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <span>{isEdit ? 'Saving Changes...' : 'Publishing Event...'}</span>
            ) : (
              <span>{isEdit ? 'Update Event Details' : 'Publish Campus Event'}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EventForm;
