import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  Tag,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Share2,
  Sparkles,
  RefreshCw,
  Lock,
  Edit3,
} from 'lucide-react';
import { eventService } from '../../services/event.service';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/common/Spinner';
import { Alert } from '../../components/common/Alert';
import { Badge } from '../../components/common/Badge';

export const EventsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Fetch event details
  const fetchEvent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await eventService.getEventById(id);
      if (response && response.data) {
        setEvent(response.data);
      } else if (response) {
        setEvent(response);
      }
    } catch (err) {
      setError(err.message || 'Unable to load event details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // Handle Event Registration
  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/events/${id}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setActionSuccess(null);

    try {
      const result = await eventService.register(id);
      setActionSuccess(result.message || 'Successfully registered for this event!');
      // Update local state with latest numbers from API response
      setEvent((prev) => ({
        ...prev,
        isRegistered: true,
        currentParticipants:
          typeof result.currentParticipants === 'number'
            ? result.currentParticipants
            : (prev?.currentParticipants || 0) + 1,
        remainingSpots:
          typeof result.remainingSpots === 'number'
            ? result.remainingSpots
            : Math.max(0, (prev?.maximumParticipants || 0) - ((prev?.currentParticipants || 0) + 1)),
      }));
    } catch (err) {
      setError(err.message || 'Registration failed. The event might be full or closed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Cancel Registration
  const handleCancelRegistration = async () => {
    setIsSubmitting(true);
    setError(null);
    setActionSuccess(null);
    setShowCancelConfirm(false);

    try {
      const result = await eventService.cancelRegistration(id);
      setActionSuccess(result.message || 'Your event registration has been cancelled successfully.');
      setEvent((prev) => ({
        ...prev,
        isRegistered: false,
        currentParticipants:
          typeof result.currentParticipants === 'number'
            ? result.currentParticipants
            : Math.max(0, (prev?.currentParticipants || 1) - 1),
        remainingSpots:
          typeof result.remainingSpots === 'number'
            ? result.remainingSpots
            : (prev?.remainingSpots || 0) + 1,
      }));
    } catch (err) {
      setError(err.message || 'Failed to cancel registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format Date & Time
  const eventDate = event?.date ? new Date(event.date) : null;
  const fullDateString = eventDate
    ? eventDate.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  // Capacity & Status Logic
  const maximumParticipants = event?.maximumParticipants;
  const currentParticipants = event?.currentParticipants || 0;
  const isSoldOut = maximumParticipants && currentParticipants >= maximumParticipants;
  const isCancelled = event?.status === 'CANCELLED';
  const isClosed = event?.status === 'CLOSED';
  const isRegistered = event?.isRegistered;
  const remainingSpots =
    typeof maximumParticipants === 'number'
      ? Math.max(0, maximumParticipants - currentParticipants)
      : null;

  if (isLoading) {
    return (
      <div className="page-wrapper" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <Spinner size="lg" text="Loading campus event details..." />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <Alert type="error" message={error} />
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

  if (!event) return null;

  const bannerImage = event.banner || event.image;
  const organizerId =
    event.organizer?._id?.toString() ||
    event.organizer?.id?.toString() ||
    event.organizer?.toString();
  const currentUserId = user?._id?.toString() || user?.id?.toString();
  const isOwner = Boolean(currentUserId && organizerId && currentUserId === organizerId);
  const isUserAdmin = user?.role === 'admin';

  return (
    <div className="event-detail-page page-wrapper" style={{ paddingBottom: '6rem' }}>
      {/* Top Back Navigation Bar */}
      <div style={{ borderBottom: '1px solid var(--liquid-glass-border)', background: 'var(--liquid-glass-bg)', backdropFilter: 'var(--liquid-glass-blur)', WebkitBackdropFilter: 'var(--liquid-glass-blur)', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <span>Back to All Campus Events</span>
          </Link>

          {(isOwner || isUserAdmin) && (
            <Link
              to={`/events/${id}/edit`}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backdropFilter: 'blur(12px)' }}
            >
              <Edit3 size={14} />
              <span>Edit Event</span>
            </Link>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        {/* Dynamic Alerts */}
        {actionSuccess && (
          <div style={{ marginBottom: '1.5rem' }}>
            <Alert type="success" message={actionSuccess} />
          </div>
        )}

        {error && (
          <div style={{ marginBottom: '1.5rem' }}>
            <Alert type="error" message={error} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '2.5rem' }}>
          {/* Main Column: Banner, Title, Description */}
          <div>
            {/* Banner Image or Fallback */}
            <div
              className="card liquid-glass-card"
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '50%',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--liquid-glass-border)',
                backgroundColor: 'var(--liquid-glass-bg)',
                marginBottom: '2rem',
                boxShadow: 'var(--liquid-glass-shadow)',
              }}
            >
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt={event.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'var(--liquid-gradient-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <Sparkles size={36} color="var(--accent-orange)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-orange)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
                    CAMPUS EVENT
                  </span>
                </div>
              )}

              {/* Status Badge Over Banner */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                {isCancelled && (
                  <span className="badge badge-outline" style={{ background: 'rgba(0,0,0,0.6)', color: '#ffffff', borderColor: '#666666', fontWeight: 700 }}>
                    <XCircle size={12} /> CANCELLED
                  </span>
                )}
                {isClosed && (
                  <span className="badge badge-default" style={{ fontWeight: 700 }}>
                    REGISTRATION CLOSED
                  </span>
                )}
                {!isCancelled && !isClosed && (
                  <span className="badge badge-orange" style={{ fontWeight: 700 }}>
                    <span className="orange-dot" /> {event.status || 'ACTIVE'}
                  </span>
                )}
              </div>
            </div>

            {/* Category and Title */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--accent-orange-subtle)',
                  border: '1px solid var(--accent-orange-border)',
                  color: 'var(--accent-orange)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem',
                }}
              >
                <Tag size={12} color="var(--accent-orange)" /> {event.category || 'Campus Event'}
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                {event.title}
              </h1>
            </div>

            {/* Organizer Byline */}
            <div
              className="card liquid-glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                background: 'var(--liquid-glass-bg)',
                backdropFilter: 'var(--liquid-glass-blur)',
                WebkitBackdropFilter: 'var(--liquid-glass-blur)',
                border: '1px solid var(--liquid-glass-border)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '2rem',
                boxShadow: 'var(--liquid-glass-shadow)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--accent-orange)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: 'none',
                }}
              >
                {event.organizer?.name ? event.organizer.name.charAt(0).toUpperCase() : 'O'}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hosted & Organized by</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {event.organizer?.name || 'Verified Campus Organizer'}
                  {event.organizer?.role && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 500, textTransform: 'capitalize' }}>
                      ({event.organizer.role})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Event Description Section */}
            <div
              className="card liquid-glass-card"
              style={{
                padding: '2rem',
                background: 'var(--liquid-glass-bg)',
                backdropFilter: 'var(--liquid-glass-blur)',
                WebkitBackdropFilter: 'var(--liquid-glass-blur)',
                border: '1px solid var(--liquid-glass-border)',
                boxShadow: 'var(--liquid-glass-shadow)',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                About This Event
              </h2>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                }}
              >
                {event.description || 'No additional description provided for this campus event.'}
              </div>
            </div>
          </div>

          {/* Sidebar Column: RSVP Card & Key Meta */}
          <div>
            <div
              className="card liquid-glass-card"
              style={{
                position: 'sticky',
                top: '90px',
                padding: '2rem',
                background: 'var(--liquid-glass-bg)',
                backdropFilter: 'var(--liquid-glass-blur)',
                WebkitBackdropFilter: 'var(--liquid-glass-blur)',
                border: '1px solid var(--liquid-glass-border)',
                boxShadow: 'var(--liquid-glass-shadow)',
              }}
            >
              {/* Event Schedule Box */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                Event Schedule & Venue
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginBottom: '2rem' }}>
                {/* Date */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-orange-subtle)', border: '1px solid var(--accent-orange-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)', flexShrink: 0 }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{fullDateString}</div>
                  </div>
                </div>

                {/* Time */}
                {(event.startTime || event.endTime) && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-orange-subtle)', border: '1px solid var(--accent-orange-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)', flexShrink: 0 }}>
                      <Clock size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {event.startTime} {event.endTime ? `– ${event.endTime}` : ''}
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-orange-subtle)', border: '1px solid var(--accent-orange-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)', flexShrink: 0 }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location / Venue</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {event.location || 'Campus Location TBA'}
                    </div>
                  </div>
                </div>

                {/* Capacity & Attendance */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-orange-subtle)', border: '1px solid var(--accent-orange-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)', flexShrink: 0 }}>
                    <Users size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capacity & Attendance</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {currentParticipants}{' '}
                      {typeof maximumParticipants === 'number' ? `/ ${maximumParticipants} registered` : 'attendees'}
                    </div>

                    {typeof maximumParticipants === 'number' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(100, Math.round((currentParticipants / maximumParticipants) * 100))}%`,
                              height: '100%',
                              backgroundColor: isSoldOut ? 'var(--text-muted)' : 'var(--accent-orange)',
                              boxShadow: 'none',
                              borderRadius: '9999px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {isSoldOut ? 'Capacity reached' : `${remainingSpots} spots remaining`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Registration Action Section */}
              <div style={{ borderTop: '1px solid var(--liquid-glass-border)', paddingTop: '1.5rem' }}>
                {/* State 1: Cancelled Event */}
                {isCancelled && (
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.35rem' }}>
                      <AlertCircle size={16} />
                      <span>Event Cancelled</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                      This event has been cancelled by the organizer. Registrations are not available.
                    </p>
                  </div>
                )}

                {/* State 2: Closed Event */}
                {!isCancelled && isClosed && (
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                      <Lock size={16} />
                      <span>Registration Closed</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                      The RSVP window for this event is now closed.
                    </p>
                  </div>
                )}

                {/* State 3: User is Registered */}
                {!isCancelled && !isClosed && isRegistered && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.85rem 1rem',
                        background: 'var(--accent-orange-subtle)',
                        border: '1px solid var(--accent-orange-border)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--accent-orange)',
                        marginBottom: '1rem',
                      }}
                    >
                      <CheckCircle2 size={20} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                        You're Registered for this event!
                      </div>
                    </div>

                    {showCancelConfirm ? (
                      <div
                        style={{
                          padding: '1rem',
                          background: 'var(--liquid-glass-bg)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--liquid-glass-border)',
                          textAlign: 'center',
                        }}
                      >
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                          Are you sure you want to cancel your registration?
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setShowCancelConfirm(false)}
                            disabled={isSubmitting}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1 }}
                          >
                            Keep RSVP
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelRegistration}
                            disabled={isSubmitting}
                            className="btn btn-outline btn-sm"
                            style={{
                              flex: 1,
                              borderColor: 'var(--border-strong)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {isSubmitting ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                <RefreshCw size={12} className="animate-spin" /> Cancelling...
                              </span>
                            ) : (
                              <span>Yes, Cancel</span>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(true)}
                        disabled={isSubmitting}
                        className="btn btn-outline"
                        style={{
                          width: '100%',
                          fontSize: '0.9rem',
                          borderColor: 'var(--liquid-glass-border)',
                          color: 'var(--text-secondary)',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          opacity: isSubmitting ? 0.7 : 1,
                        }}
                      >
                        <span>Cancel My Registration</span>
                      </button>
                    )}
                  </div>
                )}

                {/* State 4: Event Full */}
                {!isCancelled && !isClosed && !isRegistered && isSoldOut && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.85rem 1rem',
                        background: 'var(--border-subtle)',
                        border: '1px solid var(--border-hover)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AlertCircle size={18} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Event Full (Capacity Reached)</span>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="btn btn-secondary"
                      style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Registration Full
                    </button>
                  </div>
                )}

                {/* State 5: Open for Registration */}
                {!isCancelled && !isClosed && !isRegistered && !isSoldOut && (
                  <div>
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={handleRegister}
                        disabled={isSubmitting}
                        className="btn btn-liquid-orange btn-lg"
                        style={{
                          width: '100%',
                          fontSize: '1rem',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          opacity: isSubmitting ? 0.7 : 1,
                        }}
                      >
                        {isSubmitting ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <RefreshCw size={16} className="animate-spin" /> Processing RSVP...
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={18} /> Reserve Free Spot
                          </span>
                        )}
                      </button>
                    ) : (
                      <Link
                        to={`/login?redirect=/events/${id}`}
                        className="btn btn-liquid-orange btn-lg"
                        style={{
                          width: '100%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          textDecoration: 'none',
                          fontSize: '1rem',
                        }}
                      >
                        <span>Sign In to RSVP</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsDetailPage;
