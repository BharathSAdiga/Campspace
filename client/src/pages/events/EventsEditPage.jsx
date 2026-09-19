import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit3, ArrowLeft, ShieldAlert, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/event.service';
import { EventForm } from '../../components/events/EventForm';
import { Spinner } from '../../components/common/Spinner';
import { Alert } from '../../components/common/Alert';

export const EventsEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [serverError, setServerError] = useState(null);

  const fetchEvent = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await eventService.getEventById(id);
      const data = res.data || res;
      setEvent(data);
    } catch (err) {
      setFetchError(err.message || 'Unable to load event details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // Loading state
  if (isLoading) {
    return (
      <div className="page-wrapper" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <Spinner size="lg" text="Loading event details..." />
      </div>
    );
  }

  // Fetch error state
  if (fetchError || !event) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <Alert type="error" message={fetchError || 'Event not found'} />
          <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button type="button" onClick={fetchEvent} className="btn btn-secondary">
              <RefreshCw size={15} />
              <span>Retry</span>
            </button>
            <Link to="/events" className="btn btn-primary">
              <ArrowLeft size={15} />
              <span>Back to Events</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Ownership verification check
  const organizerId =
    event.organizer?._id?.toString() ||
    event.organizer?.id?.toString() ||
    event.organizer?.toString();
  const currentUserId = user?._id?.toString() || user?.id?.toString();
  const isAdmin = user?.role === 'admin';
  const isOwner = Boolean(currentUserId && organizerId && currentUserId === organizerId);

  if (!isOwner && !isAdmin) {
    return (
      <div className="page-wrapper" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <div
            className="card liquid-glass-card"
            style={{
              padding: '3rem 2rem',
              border: '1px solid var(--liquid-glass-border)',
              background: 'var(--liquid-glass-bg)',
              backdropFilter: 'var(--liquid-glass-blur)',
              WebkitBackdropFilter: 'var(--liquid-glass-blur)',
              boxShadow: 'var(--liquid-glass-shadow)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <ShieldAlert size={48} color="var(--accent-orange)" style={{ marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Forbidden: Unauthorized Access
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              You do not have permission to edit this event. Only the organizing host (
              <strong>{event.organizer?.name || 'Organizer'}</strong>) or a campus administrator can modify event details.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to={`/events/${id}`} className="btn btn-secondary">
                <ArrowLeft size={16} />
                <span>Return to Event</span>
              </Link>
              <Link to="/events" className="btn btn-liquid-orange">
                <span>Browse All Events</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleEditSubmit = async (payload) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await eventService.updateEvent(id, payload);
      navigate(`/events/${id}`);
    } catch (err) {
      setServerError(
        err.message || (err.response?.data?.message) || 'Failed to update event. Please review form inputs.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="events-edit-page page-wrapper" style={{ paddingBottom: '6rem' }}>
      {/* Top Header Navigation */}
      <div
        style={{
          borderBottom: '1px solid var(--liquid-glass-border)',
          background: 'var(--liquid-glass-bg)',
          backdropFilter: 'var(--liquid-glass-blur)',
          WebkitBackdropFilter: 'var(--liquid-glass-blur)',
          padding: '0.85rem 0',
        }}
      >
        <div className="container">
          <Link
            to={`/events/${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={16} />
            <span>Cancel and return to event details</span>
          </Link>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '820px', marginTop: '2.5rem' }}>
        {/* Page Heading */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-orange-subtle)',
              border: '1px solid var(--accent-orange-border)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-orange)',
              marginBottom: '0.75rem',
              boxShadow: 'none',
            }}
          >
            <span className="orange-dot" />
            <span>Event Management</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.03em',
            }}
          >
            Edit Event Details
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Updating details for <strong>{event.title}</strong>. Changes will take effect immediately.
          </p>
        </div>

        {/* Reusable Event Form pre-filled */}
        <EventForm
          initialValues={event}
          onSubmit={handleEditSubmit}
          isSubmitting={isSubmitting}
          isEdit={true}
          onCancel={() => navigate(`/events/${id}`)}
          serverErrors={serverError}
        />
      </div>
    </div>
  );
};

export default EventsEditPage;
