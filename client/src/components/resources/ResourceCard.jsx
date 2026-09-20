import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Box, Users } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ResourceCard = ({ resource }) => {
  if (!resource) return null;

  const {
    id,
    _id,
    name,
    category,
    description,
    location,
    capacity,
    status = 'Available',
  } = resource;

  const resourceId = id || _id;

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'Available':
        return 'success';
      case 'Unavailable':
        return 'danger';
      case 'Maintenance':
        return 'warning';
      default:
        return 'default';
    }
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
        to={`/resources/${resourceId}`}
        className="card liquid-glass-card product-card"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
        }}
      >
        {/* Decorative Header */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '45%', 
            background: 'linear-gradient(135deg, var(--bg-subtle) 0%, var(--liquid-glass-bg) 100%)',
            overflow: 'hidden',
            borderBottom: '1px solid var(--liquid-glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              gap: '0.35rem',
            }}
          >
            <Box size={48} strokeWidth={1} style={{ color: 'var(--accent-orange)', opacity: 0.8 }} />
          </div>

          {/* Category Pill */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 5 }}>
            <span
              className="liquid-glass-pill"
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.72rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              {category}
            </span>
          </div>
          
          {/* Status Badge */}
          <div style={{ position: 'absolute', bottom: '0.65rem', right: '0.65rem', zIndex: 5 }}>
            <Badge variant={getStatusBadgeVariant(status)} size="sm">
               {status}
            </Badge>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            {/* Title */}
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                lineHeight: 1.35,
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={name}
            >
              {name}
            </h3>
            
            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {description}
            </p>
          </div>

          {/* Footer: Location & Capacity */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--liquid-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} style={{ flexShrink: 0, color: 'var(--accent-orange)' }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {location}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={14} />
                <span style={{ color: 'var(--text-secondary)' }}>{capacity ? `Capacity: ${capacity}` : 'Capacity: N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ResourceCard;
