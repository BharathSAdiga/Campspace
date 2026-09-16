import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

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
            <Sparkles size={14} /> The Next-Gen Digital Campus Ecosystem
          </div>

          <h1 style={{ fontSize: '3.25rem', marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Unify Your Campus Life, Events & Community
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--slate-300)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            CampusConnect connects students, event organizers, and campus administrators into one collaborative digital ecosystem. Discover events, manage registrations, and stay informed in real-time.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard ({user?.role}) <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Join Your Campus <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In to Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Role Pillars Section */}
      <section className="section" style={{ background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>Tailored for Every Campus Role</h2>
            <p>Built from the ground up to address the unique needs of students, club leaders, and university administration.</p>
          </div>

          <div className="grid-3">
            {/* Student Pillar */}
            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Users size={24} />
              </div>
              <span className="badge badge-student" style={{ marginBottom: '0.75rem' }}>For Students</span>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.35rem' }}>Discover & Engage</h3>
              <p style={{ fontSize: '0.9375rem' }}>
                Explore campus events, hackathons, workshops, and student clubs. RSVP with one tap and track your activity.
              </p>
            </div>

            {/* Organizer Pillar */}
            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Calendar size={24} />
              </div>
              <span className="badge badge-organizer" style={{ marginBottom: '0.75rem' }}>For Organizers</span>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.35rem' }}>Host & Coordinate</h3>
              <p style={{ fontSize: '0.9375rem' }}>
                Publish campus events, manage attendee capacities, broadcast announcements, and verify attendance seamlessly.
              </p>
            </div>

            {/* Admin Pillar */}
            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <span className="badge badge-admin" style={{ marginBottom: '0.75rem' }}>For Administrators</span>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.35rem' }}>Govern & Oversee</h3>
              <p style={{ fontSize: '0.9375rem' }}>
                Maintain university security, verify organizer credentials, audit event approvals, and track campus engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Features Grid */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
            <div>
              <span style={{ color: 'var(--primary-400)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Unified Architecture
              </span>
              <h2 style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                Secure, Real-Time Campus Infrastructure
              </h2>
              <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
                CampusConnect eliminates fragmented group chats and bulletin boards by centralizing authentication, event schedules, department feeds, and verified student identities into a single reliable system.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ padding: '0.35rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--primary-400)' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--slate-100)' }}>Role-Based Access Control</h4>
                    <p style={{ fontSize: '0.875rem' }}>Protected routes and endpoints tailored explicitly to students, organizers, and admins.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ padding: '0.35rem', background: 'rgba(6, 182, 212, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-cyan)' }}>
                    <Layers size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--slate-100)' }}>Department & ID Verification</h4>
                    <p style={{ fontSize: '0.875rem' }}>Campus-specific identification ensures every interaction is authentic and accountable.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CTA Box */}
            <div className="card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Get Started with CampusConnect</h3>
              <p style={{ marginBottom: '1.75rem', fontSize: '0.9375rem' }}>
                Create your student or organizer profile today to experience the platform.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/register" className="btn btn-primary btn-block">
                  Create Campus Account
                </Link>
                <Link to="/login" className="btn btn-secondary btn-block">
                  Sign In with Existing Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
