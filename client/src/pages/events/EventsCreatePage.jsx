import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CalendarPlus, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/event.service';
import { EventForm } from '../../components/events/EventForm';

export const EventsCreatePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Guard: User must be an organizer or admin
  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';

  if (isAuthenticated && !isOrganizer) {
    return (
      <div className="page-wrapper" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <div className="card" style={{ padding: '3rem 2rem', border: '1px solid var(--border-subtle)' }}>
            <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Organizer Access Required
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your account currently has the role of <strong>{user?.role || 'student'}</strong>. Only authorized campus organizers and administrators are permitted to publish new events.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/events" className="btn btn-secondary">
                <ArrowLeft size={16} />
                <span>Back to Events</span>
              </Link>
              <Link to="/dashboard" className="btn btn-primary">
                <span>Go to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateSubmit = async (payload) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await eventService.createEvent(payload);
      const newEvent = response.data || response;
      const targetId = newEvent.id || newEvent._id;

      if (targetId) {
        navigate(`/events/${targetId}`);
      } else {
        navigate('/events');
      }
    } catch (err) {
      setServerError(
        err.message || (err.response?.data?.message) || 'Failed to create event. Please check required fields.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="events-create-page page-wrapper" style={{ paddingBottom: '6rem' }}>
      {/* Top Header Navigation */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          padding: '0.85rem 0',
        }}
      >
        <div className="container">
          <Link
            to="/events"
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
            <span>Cancel and return to Events</span>
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
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--border-subtle)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}
          >
            <CalendarPlus size={13} />
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
            Create Campus Event
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Publish a new campus activity, workshop, or gathering. Specify venue, schedule, and attendee limits.
          </p>
        </div>

        {/* Reusable Event Form */}
        <EventForm
          onSubmit={handleCreateSubmit}
          isSubmitting={isSubmitting}
          isEdit={false}
          onCancel={() => navigate('/events')}
          serverErrors={serverError}
        />
      </div>
    </div>
  );
};

export default EventsCreatePage;
