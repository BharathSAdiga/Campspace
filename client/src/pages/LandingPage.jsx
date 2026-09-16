import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Calendar,
  Layers,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  GraduationCap,
  Heart,
  TrendingUp,
  Clock,
  Compass,
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="page-wrapper" style={{ paddingTop: '2rem' }}>
      {/* Hero Section */}
      <section
        className="section"
        style={{
          paddingTop: '4rem',
          paddingBottom: '6rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '920px', position: 'relative', zIndex: 2 }}>
          {/* Liquid Glowing Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.15rem',
              background: '#E8E0D2',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(216, 204, 184, 0.9)',
              borderRadius: 'var(--radius-full)',
              color: '#0F172A',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '2rem',
              boxShadow: '0 4px 14px rgba(44, 36, 22, 0.1)',
            }}
          >
            <Sparkles size={16} color="#0F172A" />
            <span>The Unified Next-Gen Campus Platform</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.75rem, 6vw, 4.25rem)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Experience Campus Life in{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #8E785D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Liquid Glass
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              marginBottom: '2.75rem',
              lineHeight: 1.65,
              maxWidth: '740px',
              margin: '0 auto 2.75rem auto',
            }}
          >
            Campspace unites verified students, student organizers, and university administration into a single high-performance digital ecosystem for peer commerce, events, clubs, and facilities.
          </p>

          {/* Interactive CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/register"
              className="btn btn-primary btn-lg"
              style={{
                fontSize: '1rem',
                padding: '0.85rem 2rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/marketplace"
              className="btn btn-secondary btn-lg"
              style={{
                fontSize: '1rem',
                padding: '0.85rem 1.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ShoppingBag size={18} />
              <span>Explore Marketplace</span>
            </Link>

            <Link
              to="/events"
              className="btn btn-outline btn-lg"
              style={{
                fontSize: '1rem',
                padding: '0.85rem 1.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Calendar size={18} />
              <span>Campus Events</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Overlapping Frosted Glass Shelf (Inspired by Material Kit 2 card) */}
      <section className="container" style={{ position: 'relative', zIndex: 10, marginTop: '-2rem', marginBottom: '5rem' }}>
        <div
          className="glass-shelf"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* Stat 1 */}
          <div style={{ textAlign: 'center', padding: '0.5rem 1rem' }}>
            <div
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.4rem',
              }}
            >
              5,000+
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Active Students
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              Verified across campus departments, residences, & colleges.
            </p>
          </div>

          {/* Stat 2 */}
          <div
            style={{
              textAlign: 'center',
              padding: '0.5rem 1rem',
              borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.4rem',
              }}
            >
              1,400+
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Marketplace Listings
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              Textbooks, laptops, dorm essentials, & gear exchanged.
            </p>
          </div>

          {/* Stat 3 */}
          <div
            style={{
              textAlign: 'center',
              padding: '0.5rem 1rem',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.4rem',
              }}
            >
              350+
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Campus Events
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              Hackathons, career symposiums, workshops, & mixers.
            </p>
          </div>

          {/* Stat 4 */}
          <div style={{ textAlign: 'center', padding: '0.5rem 1rem' }}>
            <div
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.4rem',
              }}
            >
              100%
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Zero Commission
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              Direct verified student interactions with zero hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Modules Liquid Grid */}
      <section className="section" style={{ paddingBottom: '5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0F172A',
                backgroundColor: '#E8E0D2',
                border: '1px solid rgba(216, 204, 184, 0.9)',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                marginBottom: '0.75rem',
              }}
            >
              <Layers size={13} color="#0F172A" /> Integrated Architecture
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Everything Campus, In One Place
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              Built from the ground up for college campuses with state-of-the-art security, speed, and real-time collaboration.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Module 1: Marketplace */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
              }}
            >
              <div>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: '#E8E0D2',
                    border: '1px solid rgba(216, 204, 184, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F172A',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 14px rgba(44, 36, 22, 0.1)',
                  }}
                >
                  <ShoppingBag size={26} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">Developer 1</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peer-to-Peer</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Campus Marketplace
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Buy and sell textbooks, electronics, calculators, dorm furniture, and fitness gear directly with verified campus peers.
                </p>
              </div>

              <Link
                to="/marketplace"
                className="btn btn-secondary btn-md"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
              >
                <span>Browse Listings</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Module 2: Events */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
              }}
            >
              <div>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: '#E8E0D2',
                    border: '1px solid rgba(216, 204, 184, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F172A',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 14px rgba(44, 36, 22, 0.1)',
                  }}
                >
                  <Calendar size={26} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">Developer 1</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discovery & RSVP</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Events & Activities
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Discover hackathons, guest lectures, club mixers, and career events with instant one-click registrations and capacity tracking.
                </p>
              </div>

              <Link
                to="/events"
                className="btn btn-secondary btn-md"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
              >
                <span>View Event Schedule</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Module 3: Resource Allocation */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
              }}
            >
              <div>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: '#E8E0D2',
                    border: '1px solid rgba(216, 204, 184, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F172A',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 14px rgba(44, 36, 22, 0.1)',
                  }}
                >
                  <Layers size={26} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-default">Developer 2</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Facilities</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Resource Bookings
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Book campus study pods, conference rooms, high-performance computing labs, and multimedia gear without paperwork.
                </p>
              </div>

              <Link
                to="/resources"
                className="btn btn-secondary btn-md"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
              >
                <span>Reserve Resources</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Module 4: Clubs */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
              }}
            >
              <div>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: '#E8E0D2',
                    border: '1px solid rgba(216, 204, 184, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F172A',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 14px rgba(44, 36, 22, 0.1)',
                  }}
                >
                  <Users size={26} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-default">Developer 2</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student Groups</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Clubs & Organizations
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Find and join recognized student organizations, sports leagues, cultural societies, and technical interest groups.
                </p>
              </div>

              <Link
                to="/clubs"
                className="btn btn-secondary btn-md"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
              >
                <span>Explore Clubs</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Trust & Liquid Security Banner */}
      <section className="container" style={{ paddingBottom: '6rem' }}>
        <div
          className="card"
          style={{
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            background: 'var(--liquid-glass-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg), var(--liquid-glass-highlight)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#0F172A',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Built Exclusively for Verified Students & Faculty
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.6,
            }}
          >
            Sign in with your university account to access encrypted listings, secure RSVP management, and student-only transactions.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '0.75rem 2rem' }}>
              Create Verified Account
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ padding: '0.75rem 2rem' }}>
              Sign In to Campspace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
