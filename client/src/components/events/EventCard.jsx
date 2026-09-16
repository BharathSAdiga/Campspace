import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Sparkles, Tag } from 'lucide-react';
import { Badge } from '../common/Badge';

export const EventCard = ({ event }) => {
  if (!event) return null;

  const {
    id,
    _id,
    title,
    category,
    banner,
    image,
    date,
    startTime,
    endTime,
    location,
    organizer,
    maximumParticipants,
    currentParticipants = 0,
    status = 'ACTIVE',
  } = event;

  const eventId = id || _id;
  const bannerImage = banner || image;

  // Format date parts
  const eventDate = date ? new Date(date) : null;
  const monthString = eventDate
    ? eventDate.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()
    : 'TBA';
  const dayString = eventDate ? eventDate.getDate() : '--';
  const fullDateString = eventDate
    ? eventDate.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  // Capacity calculations
  const remainingSpots =
    typeof maximumParticipants === 'number'
      ? Math.max(0, maximumParticipants - currentParticipants)
      : null;
  const isSoldOut = maximumParticipants && currentParticipants >= maximumParticipants;

  const getCapacityBadge = () => {
    if (status === 'CANCELLED') {
      return <Badge variant="danger" size="sm">Cancelled</Badge>;
    }
    if (status === 'CLOSED') {
      return <Badge variant="default" size="sm">Closed</Badge>;
    }
    if (isSoldOut) {
      return <Badge variant="warning" size="sm">Full / Sold Out</Badge>;
    }
    if (remainingSpots !== null && remainingSpots <= 5 && remainingSpots > 0) {
      return <Badge variant="warning" size="sm">{remainingSpots} spots left</Badge>;
    }
    if (typeof maximumParticipants === 'number') {
      return (
        <Badge variant="primary" size="sm">
          {currentParticipants} / {maximumParticipants} registered
        </Badge>
      );
    }
    return <Badge variant="success" size="sm">Open RSVP</Badge>;
  };

  return (
    <Link
      to={`/events/${eventId}`}
      className="card event-card"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        height: '100%',
        padding: 0,
      }}
    >
      {/* Event Banner Media */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '52%', // 16:9 cinematic aspect ratio
          backgroundColor: 'rgba(238, 233, 224, 0.5)',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {bannerImage ? (
          <img
            src={bannerImage}
            alt={title}
            loading="lazy"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease',
            }}
          />
        ) : (
          /* Sleek Ambient Fallback Pattern - Warm Beige & Sand */
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #E8E0D2 0%, #D8CCB8 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--beige-900)',
            }}
          >
            <Sparkles size={28} style={{ color: '#0F172A' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#524331', letterSpacing: '0.05em' }}>
              CAMPUS EVENT
            </span>
          </div>
        )}

        {/* Floating Date Capsule (Top-Left) - Frosted White with Beige accent */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '46px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(216, 204, 184, 0.85)',
            boxShadow: '0 4px 14px rgba(44, 36, 22, 0.1)',
            lineHeight: 1.1,
          }}
        >
          <span style={{ fontSize: '0.625rem', fontWeight: '800', color: '#8E785D', letterSpacing: '0.05em' }}>
            {monthString}
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>
            {dayString}
          </span>
        </div>

        {/* Category Badge (Top-Right) - Frosted White */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 5 }}>
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '0.25rem 0.7rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0F172A',
              border: '1px solid rgba(216, 204, 184, 0.85)',
              boxShadow: '0 4px 12px rgba(44, 36, 22, 0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Tag size={12} color="#0F172A" />
            <span>{category}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Capacity State Badge */}
          <div style={{ marginBottom: '0.6rem' }}>
            {getCapacityBadge()}
          </div>

          {/* Event Title */}
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: '700',
              lineHeight: 1.35,
              marginBottom: '0.6rem',
              color: 'var(--text-primary)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            title={title}
          >
            {title}
          </h3>

          {/* Date & Time Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <Calendar size={14} style={{ flexShrink: 0, color: 'var(--beige-600)' }} />
              <span>{fullDateString}</span>
            </div>

            {(startTime || endTime) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <Clock size={14} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                <span>
                  {startTime} {endTime ? `– ${endTime}` : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Location & Organizer */}
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <MapPin size={14} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {location}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: '1px solid #0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                }}
              >
                {organizer?.name ? organizer.name.charAt(0).toUpperCase() : 'O'}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
                {organizer?.name || 'Campus Organizer'}
              </span>
            </div>

            {typeof maximumParticipants === 'number' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Users size={12} />
                <span>{currentParticipants} RSVP</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
