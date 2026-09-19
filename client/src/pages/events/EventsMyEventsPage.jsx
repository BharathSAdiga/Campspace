import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Clock,
  MapPin,
  Tag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Mail,
  Copy,
  Check,
  Shield,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/event.service';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Alert } from '../../components/common/Alert';
import { Modal } from '../../components/common/Modal';

export const EventsMyEventsPage = () => {
  const { user } = useAuth();

  // Events list & filter state
  const [events, setEvents] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Status updating state per event ID
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Registrations modal state
  const [selectedEventForRegs, setSelectedEventForRegs] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [regError, setRegError] = useState(null);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Fetch organizer's events
  const fetchMyEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await eventService.getMyEvents({
        status: filterStatus,
      });
      setEvents(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your organized events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  // Handle Event Status Change (ACTIVE, CANCELLED, CLOSED)
  const handleUpdateStatus = async (eventItem, nextStatus) => {
    const eventId = eventItem.id || eventItem._id;
    setStatusUpdatingId(eventId);
    setSuccessMessage('');
    setError(null);

    try {
      await eventService.updateEvent(eventId, { status: nextStatus });
      setSuccessMessage(`Event "${eventItem.title}" marked as ${nextStatus}`);
      setEvents((prev) =>
        prev.map((e) => ((e.id || e._id) === eventId ? { ...e, status: nextStatus } : e))
      );
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update event status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const eventId = deleteTarget.id || deleteTarget._id;
    setIsDeleting(true);
    setSuccessMessage('');
    setError(null);

    try {
      await eventService.deleteEvent(eventId);
      setSuccessMessage(`"${deleteTarget.title}" and its registrations were permanently deleted`);
      setEvents((prev) => prev.filter((e) => (e.id || e._id) !== eventId));
      setDeleteTarget(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Registrations Modal & Fetch Attendee List
  const handleOpenRegistrations = async (eventItem) => {
    setSelectedEventForRegs(eventItem);
    setLoadingRegs(true);
    setRegError(null);
    setRegistrations([]);
    setAttendeeSearch('');
    setCopiedEmails(false);

    const eventId = eventItem.id || eventItem._id;
    try {
      const res = await eventService.getRegistrations(eventId);
      setRegistrations(res.data || []);
    } catch (err) {
      setRegError(err.message || 'Failed to load attendee registrations');
    } finally {
      setLoadingRegs(false);
    }
  };

  // Copy all attendee email addresses to clipboard
  const handleCopyEmails = () => {
    const emails = registrations
      .map((r) => r.user?.email)
      .filter(Boolean)
      .join(', ');
    if (emails) {
      navigator.clipboard.writeText(emails);
      setCopiedEmails(true);
      setTimeout(() => setCopiedEmails(false), 2500);
    }
  };

  // Filter events locally by search query
  const filteredEvents = events.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q)
    );
  });

  // Calculate high-level summary metrics
  const totalEventsCount = events.length;
  const activeEventsCount = events.filter((e) => e.status === 'ACTIVE').length;
  const totalParticipantsEnrolled = events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0);
  const totalCapacitySum = events.reduce((sum, e) => sum + (e.maximumParticipants || 0), 0);
  const overallFillRate = totalCapacitySum > 0 ? Math.round((totalParticipantsEnrolled / totalCapacitySum) * 100) : 0;

  // Filtered attendees in modal
  const filteredAttendees = registrations.filter((reg) => {
    if (!attendeeSearch.trim()) return true;
    const q = attendeeSearch.toLowerCase();
    const name = reg.user?.name?.toLowerCase() || '';
    const email = reg.user?.email?.toLowerCase() || '';
    const role = reg.user?.role?.toLowerCase() || '';
    return name.includes(q) || email.includes(q) || role.includes(q);
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'CLOSED':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.74rem',
                fontWeight: '700',
                color: 'var(--accent-orange)',
                backgroundColor: 'var(--accent-orange-subtle)',
                border: '1px solid var(--accent-orange-border)',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 0 12px var(--accent-orange-glow)',
              }}
            >
              <span className="orange-dot" /> Organizer Control Center
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            My Events & Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem', margin: 0 }}>
            Manage campus events you own, monitor RSVP capacity, export attendee lists, and control event status.
          </p>
        </div>

        <Link
          to="/events/create"
          className="btn btn-liquid-orange"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={18} />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Metrics Summary Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          className="card liquid-glass-card"
          style={{
            padding: '1.25rem',
            background: 'var(--liquid-glass-bg)',
            backdropFilter: 'var(--liquid-glass-blur)',
            WebkitBackdropFilter: 'var(--liquid-glass-blur)',
            border: '1px solid var(--liquid-glass-border)',
            boxShadow: 'var(--liquid-glass-shadow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Events</span>
            <Calendar size={18} color="var(--accent-orange)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {totalEventsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Hosted across campus
          </div>
        </div>

        <div
          className="card liquid-glass-card"
          style={{
            padding: '1.25rem',
            background: 'var(--liquid-glass-bg)',
            backdropFilter: 'var(--liquid-glass-blur)',
            WebkitBackdropFilter: 'var(--liquid-glass-blur)',
            border: '1px solid var(--liquid-glass-border)',
            boxShadow: 'var(--liquid-glass-shadow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase' }}>Active Events</span>
            <CheckCircle2 size={18} color="var(--accent-orange)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-orange)' }}>
            {activeEventsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Open for student RSVPs
          </div>
        </div>

        <div
          className="card liquid-glass-card"
          style={{
            padding: '1.25rem',
            background: 'var(--liquid-glass-bg)',
            backdropFilter: 'var(--liquid-glass-blur)',
            WebkitBackdropFilter: 'var(--liquid-glass-blur)',
            border: '1px solid var(--liquid-glass-border)',
            boxShadow: 'var(--liquid-glass-shadow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Attendees</span>
            <Users size={18} color="var(--accent-orange)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {totalParticipantsEnrolled}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Registered participants
          </div>
        </div>

        <div
          className="card liquid-glass-card"
          style={{
            padding: '1.25rem',
            background: 'var(--liquid-glass-bg)',
            backdropFilter: 'var(--liquid-glass-blur)',
            WebkitBackdropFilter: 'var(--liquid-glass-blur)',
            border: '1px solid var(--liquid-glass-border)',
            boxShadow: 'var(--liquid-glass-shadow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase' }}>Fill Capacity</span>
            <BarChart3 size={18} color="var(--accent-orange)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {overallFillRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Average attendance rate
          </div>
        </div>
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
          <Alert
            type="error"
            message={error}
            dismissible
            onDismiss={() => setError(null)}
            action={
              <button
                type="button"
                onClick={() => fetchMyEvents()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: '600',
                  padding: 0,
                }}
              >
                Retry
              </button>
            }
          />
        </div>
      )}

      {/* Filters and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--liquid-glass-border)',
          paddingBottom: '0.75rem',
        }}
      >
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'CLOSED', label: 'Closed' },
            { id: 'CANCELLED', label: 'Cancelled' },
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
                  padding: '0.45rem 1rem',
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

        {/* Search within organizer's events */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search your events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem 0.45rem 2.4rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div style={{ padding: '5rem 0' }}>
          <Spinner text="Loading your events..." />
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No Matching Events Found' : 'No Events Found'}
          description={
            searchQuery
              ? `No events matching "${searchQuery}" in ${filterStatus.toLowerCase()} status.`
              : filterStatus === 'ALL'
              ? "You haven't organized any campus events yet. Create your first workshop, mixer, or meetup to get started!"
              : `You have no events currently marked as ${filterStatus.toLowerCase()}.`
          }
          icon={<Calendar size={36} color="var(--text-muted)" />}
          action={
            filterStatus === 'ALL' && !searchQuery ? (
              <Link to="/events/create" className="btn btn-primary">
                Create First Event
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFilterStatus('ALL');
                  setSearchQuery('');
                }}
                className="btn btn-secondary"
              >
                Reset Filters
              </button>
            )
          }
        />
      ) : (
        /* Event Cards List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredEvents.map((eventItem) => {
            const eventId = eventItem.id || eventItem._id;
            const bannerImg = eventItem.banner || eventItem.image;
            const currentCount = eventItem.currentParticipants || 0;
            const maxCount = eventItem.maximumParticipants || 1;
            const pct = Math.min(100, Math.round((currentCount / maxCount) * 100));
            const isFull = currentCount >= maxCount;
            const isUpdating = statusUpdatingId === eventId;

            // Formatted date
            const eventDate = new Date(eventItem.date).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={eventId}
                className="card liquid-glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  background: 'var(--liquid-glass-bg)',
                  backdropFilter: 'var(--liquid-glass-blur)',
                  WebkitBackdropFilter: 'var(--liquid-glass-blur)',
                  border: '1px solid var(--liquid-glass-border)',
                  boxShadow: 'var(--liquid-glass-shadow)',
                  borderRadius: 'var(--radius-xl)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                  }}
                >
                  {/* Left: Thumbnail & Core Details */}
                  <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minWidth: '300px' }}>
                    {/* Banner / Poster */}
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-card-subtle)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {bannerImg ? (
                        <img
                          src={bannerImg}
                          alt={eventItem.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Calendar size={32} color="var(--text-muted)" />
                      )}
                    </div>

                    {/* Meta & Title */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          marginBottom: '0.35rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Badge variant={getStatusBadgeVariant(eventItem.status)} size="sm">
                          {eventItem.status}
                        </Badge>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            color: 'var(--text-muted)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Tag size={12} />
                          {eventItem.category}
                        </span>
                      </div>

                      <Link
                        to={`/events/${eventId}`}
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          lineHeight: '1.3',
                          display: 'inline-block',
                          marginBottom: '0.4rem',
                        }}
                        className="event-title-hover"
                      >
                        {eventItem.title}
                      </Link>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.25rem',
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={13} color="var(--text-muted)" />
                          {eventDate} • {eventItem.startTime} - {eventItem.endTime}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={13} color="var(--text-muted)" />
                          {eventItem.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Participant Capacity Gauge */}
                  <div
                    style={{
                      minWidth: '200px',
                      backgroundColor: 'var(--bg-card-subtle)',
                      padding: '0.85rem 1.1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        RSVP CAPACITY
                      </span>
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: '800',
                          color: isFull ? 'var(--danger-500)' : 'var(--text-primary)',
                        }}
                      >
                        {currentCount} / {maxCount}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        height: '7px',
                        backgroundColor: 'var(--border-subtle)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor:
                            pct >= 100
                              ? 'var(--danger-500)'
                              : pct >= 75
                              ? 'var(--accent-amber)'
                              : 'var(--primary-500)',
                          borderRadius: '9999px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>{pct}% filled</span>
                      <span>{Math.max(0, maxCount - currentCount)} spots open</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  {/* Left Action: View Public Page & View Registrations */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {/* View Registrations Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenRegistrations(eventItem)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: '600',
                      }}
                      title="View attendee roster"
                    >
                      <Users size={15} />
                      <span>Registrations ({currentCount})</span>
                    </button>

                    {/* Public Event Link */}
                    <Link
                      to={`/events/${eventId}`}
                      className="btn btn-ghost btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      title="View public event page"
                    >
                      <Eye size={15} />
                      <span>View Public</span>
                    </Link>

                    {/* Edit Event Link */}
                    <Link
                      to={`/events/${eventId}/edit`}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      title="Edit event details"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </Link>
                  </div>

                  {/* Right Actions: Status Controls & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Status Toggle Actions */}
                    {eventItem.status === 'ACTIVE' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(eventItem, 'CLOSED')}
                          isLoading={isUpdating}
                          title="Close registrations"
                          style={{ color: 'var(--accent-amber)', fontSize: '0.8125rem' }}
                        >
                          Close RSVPs
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(eventItem, 'CANCELLED')}
                          isLoading={isUpdating}
                          title="Cancel this event"
                          style={{ color: 'var(--danger-500)', fontSize: '0.8125rem' }}
                        >
                          Cancel Event
                        </Button>
                      </>
                    )}

                    {eventItem.status === 'CLOSED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUpdateStatus(eventItem, 'ACTIVE')}
                        isLoading={isUpdating}
                        icon={<RotateCcw size={14} />}
                        title="Reopen registrations"
                      >
                        Reopen RSVPs
                      </Button>
                    )}

                    {eventItem.status === 'CANCELLED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUpdateStatus(eventItem, 'ACTIVE')}
                        isLoading={isUpdating}
                        icon={<RotateCcw size={14} />}
                        title="Reactivate event"
                      >
                        Reactivate Event
                      </Button>
                    )}

                    {/* Delete Destructive Action */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(eventItem)}
                      className="btn btn-ghost btn-sm"
                      style={{
                        color: 'var(--danger-500)',
                        padding: '0.4rem 0.6rem',
                        marginLeft: '0.25rem',
                      }}
                      title="Permanently delete event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
          title="Delete Campus Event?"
          message={`Are you sure you want to permanently delete "${deleteTarget.title}"? All attendee registrations will be cleared and this action cannot be undone.`}
          confirmText="Delete Event"
          cancelText="Keep Event"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Attendee Registrations Modal */}
      {selectedEventForRegs && (
        <Modal
          isOpen={Boolean(selectedEventForRegs)}
          onClose={() => setSelectedEventForRegs(null)}
          title={`Attendee Roster (${registrations.length})`}
          maxWidth="640px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleCopyEmails}
                disabled={registrations.length === 0}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {copiedEmails ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                <span>{copiedEmails ? 'Emails Copied!' : 'Copy Attendee Emails'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEventForRegs(null)}
                className="btn btn-primary btn-sm"
              >
                Done
              </button>
            </div>
          }
        >
          <div>
            {/* Event Header in Modal */}
            <div
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
                {selectedEventForRegs.title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Capacity: <strong>{selectedEventForRegs.currentParticipants || 0}</strong> /{' '}
                <strong>{selectedEventForRegs.maximumParticipants || 0}</strong> registered
              </div>
            </div>

            {/* Error Message inside Modal */}
            {regError && (
              <div style={{ marginBottom: '1rem' }}>
                <Alert type="error" message={regError} />
              </div>
            )}

            {/* Filter input */}
            {registrations.length > 0 && (
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Filter attendees by name or email..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.85rem 0.45rem 2.3rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Loading / Attendee List */}
            {loadingRegs ? (
              <div style={{ padding: '2.5rem 0' }}>
                <Spinner text="Loading attendee list..." />
              </div>
            ) : registrations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>No Registrations Yet</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.35rem 0 0' }}>
                  Students who register for this event will appear here.
                </p>
              </div>
            ) : filteredAttendees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>
                No attendees match "{attendeeSearch}".
              </div>
            ) : (
              <div
                style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr
                      style={{
                        backgroundColor: 'var(--bg-card-subtle)',
                        borderBottom: '1px solid var(--border-subtle)',
                        textAlign: 'left',
                      }}
                    >
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: '700' }}>Attendee</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: '700' }}>Role</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontWeight: '700' }}>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendees.map((reg) => {
                      const regId = reg.id || reg._id;
                      const u = reg.user || {};
                      const regDate = reg.registeredAt
                        ? new Date(reg.registeredAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Confirmed';

                      return (
                        <tr
                          key={regId}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          <td style={{ padding: '0.65rem 0.85rem' }}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                              {u.name || 'Anonymous Student'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {u.email || 'No email'}
                            </div>
                          </td>
                          <td style={{ padding: '0.65rem 0.85rem' }}>
                            <Badge variant="default" size="sm">
                              {u.role || 'student'}
                            </Badge>
                          </td>
                          <td style={{ padding: '0.65rem 0.85rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            {regDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventsMyEventsPage;
