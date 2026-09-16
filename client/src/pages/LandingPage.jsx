import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Calendar,
  Layers,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="section" style={{ paddingTop: '5rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary-300)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} /> The Modern Campus Life & Operations Platform
          </div>

          <h1 style={{ fontSize: '3.25rem', marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Welcome to <span style={{ color: 'var(--primary-400)' }}>Campspace</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--slate-300)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            A unified digital campus platform bringing together students, organizers, and campus administration. Explore the marketplace, upcoming events, campus clubs, and resource bookings.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/folio" className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, #000 0%, #333 100%)' }}>
              View "Folio" Showcase <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              Explore Dashboard
            </Link>
            <Link to="/marketplace" className="btn btn-outline btn-lg">
              Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Modules Overview */}
      <section className="section" style={{ background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>Platform Modules</h2>
            <p>Designed with clean modular ownership across development teams.</p>
          </div>

          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {/* Developer 1: Marketplace */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--primary-400)' }}>
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <span className="badge badge-student">Developer 1</span>
                  <h3 style={{ fontSize: '1.25rem' }}>Marketplace</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--slate-300)' }}>
                Campus commerce hub for buying and selling textbooks, electronics, and supplies.
              </p>
            </div>

            {/* Developer 1: Events */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-purple)' }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <span className="badge badge-organizer">Developer 1</span>
                  <h3 style={{ fontSize: '1.25rem' }}>Events</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--slate-300)' }}>
                Campus event discovery, scheduling, and attendee participation.
              </p>
            </div>

            {/* Developer 2: Resource Allocation */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(6, 182, 212, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-cyan)' }}>
                  <Layers size={22} />
                </div>
                <div>
                  <span className="badge badge-admin">Developer 2</span>
                  <h3 style={{ fontSize: '1.25rem' }}>Resource Allocation & Booking</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--slate-300)' }}>
                Campus space reservations, lab allocations, and equipment booking.
              </p>
            </div>

            {/* Developer 2: Clubs */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-amber)' }}>
                  <Users size={22} />
                </div>
                <div>
                  <span className="badge badge-admin">Developer 2</span>
                  <h3 style={{ fontSize: '1.25rem' }}>Clubs & Organizations</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--slate-300)' }}>
                Student association registries, membership directories, and club rosters.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
