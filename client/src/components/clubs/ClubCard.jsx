import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Shield, BookOpen } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ClubCard = ({ club }) => {
  if (!club) return null;

  const {
    id,
    _id,
    name,
    category,
    description,
    members = [],
    coordinator,
  } = club;

  const clubId = id || _id;

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
        to={`/clubs/${clubId}`}
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
        {/* Decorative Header (instead of image) */}
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
            <BookOpen size={48} strokeWidth={1} style={{ color: 'var(--accent-orange)', opacity: 0.8 }} />
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
          
          {/* Members Badge */}
          <div style={{ position: 'absolute', bottom: '0.65rem', right: '0.65rem', zIndex: 5 }}>
            <Badge variant="default" size="sm">
               <Users size={12} style={{ marginRight: '4px' }} /> {members.length} Members
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

          {/* Footer: Coordinator */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--liquid-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: 'var(--radius-xs)',
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
                  {coordinator?.name ? coordinator.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>{coordinator?.name || 'Coordinator'}</span>
              </div>
              <span>
                <Shield size={14} style={{ color: 'var(--accent-orange)' }} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ClubCard;
