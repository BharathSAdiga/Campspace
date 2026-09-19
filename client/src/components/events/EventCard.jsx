import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, CalendarDays, Tag } from 'lucide-react';
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
      return <span className="badge-orange" style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.68rem', fontWeight: 800 }}>{remainingSpots} spots left</span>;
    }
    if (typeof maximumParticipants === 'number') {
      return (
        <Badge variant="primary" size="sm">
          {currentParticipants} / {maximumParticipants} registered
        </Badge>
      );
    }
    return <Badge variant="default" size="sm">Open RSVP</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Link
        to={`/events/${eventId}`}
        className="card liquid-glass-card event-card"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          height: '100%',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Event Banner Media */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '52%', // 16:9 aspect ratio
            backgroundColor: 'var(--bg-subtle)',
            overflow: 'hidden',
            borderBottom: '1px solid var(--liquid-glass-border)',
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
                gap: '0.5rem',
              }}
            >
              <CalendarDays size={28} style={{ color: 'var(--accent-orange)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                CAMPUS EVENT
              </span>
            </div>
          )}

          {/* Floating Liquid Glass Date Capsule (Top-Left) */}
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
              width: '48px',
              height: '50px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--liquid-glass-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--liquid-glass-border)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontSize: '0.625rem', fontWeight: '800', color: 'var(--accent-orange)', letterSpacing: '0.05em' }}>
              {monthString}
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: '850', color: 'var(--text-primary)' }}>
              {dayString}
            </span>
          </div>

          {/* Floating Category Badge (Top-Right) */}
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 5 }}>
            <span
              className="liquid-glass-pill"
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '0.72rem',
                gap: '0.35rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              }}
            >
              <Tag size={11} style={{ color: 'var(--accent-orange)' }} />
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
                fontSize: '1.1rem',
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
                <Calendar size={14} style={{ flexShrink: 0, color: 'var(--accent-orange)' }} />
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
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--liquid-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                    backgroundColor: 'var(--btn-primary-bg)',
                    color: 'var(--btn-primary-text)',
                    border: '1px solid var(--liquid-glass-border)',
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
                  <Users size={12} style={{ color: 'var(--accent-orange)' }} />
                  <span>{currentParticipants} RSVP</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
