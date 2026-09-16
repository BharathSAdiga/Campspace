import React from 'react';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { Badge } from './Badge';
import { Layers } from 'lucide-react';

export const PlaceholderPage = ({
  title,
  description,
  module = 'Shared',
  owner = 'Shared',
  routePath,
}) => {
  const getBadgeVariant = () => {
    if (owner === 'Developer 1') return 'primary';
    if (owner === 'Developer 2') return 'warning';
    return 'default';
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <PageHeader
          title={title}
          description={description}
          breadcrumb={`Campspace / ${module}`}
          badge={<Badge variant={getBadgeVariant()}>{owner}</Badge>}
        />

        <Card style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-hover)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Layers size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title} Foundation</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            {description}
          </p>
          <div
            style={{
              display: 'inline-block',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.85rem',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              color: 'var(--slate-300)',
            }}
          >
            Route: {routePath}
          </div>
        </Card>
      </div>
    </div>
  );
};
