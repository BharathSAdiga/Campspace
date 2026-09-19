import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ShoppingBag,
  Layers,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  Flame,
  ArrowUpRight,
  Laptop,
  Star,
  Sparkles,
  TrendingUp,
  Terminal,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ScrollProgressBar } from '../components/common';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeSector, setActiveSector] = useState('events');

  const sectors = [
    {
      id: 'events',
      name: 'Events & Workshops',
      code: 'SECTOR-01',
      index: '01',
      icon: Calendar,
      tagline: 'Flagship Hackathons, Summits & Mixers',
      description:
        'Discover and RSVP to verified collegiate hackathons, career workshops, guest keynotes, and socials with real-time seat telemetry.',
      route: '/events',
      cta: 'Explore All Events',
      items: [
        {
          title: 'HackCampus 2026 // 24H AI & Robotics Hackathon',
          meta: 'Oct 24 • Engineering Atrium',
          badge: 'FLAGSHIP',
          capacity: '184 / 250 Spots Filled',
          progress: 74,
        },
        {
          title: 'Deep Learning & Quantum Computing Keynote',
          meta: 'Nov 12 • Turing Hall Auditorium',
          badge: 'KEYNOTE',
          capacity: '92 / 120 Spots Filled',
          progress: 76,
        },
        {
          title: 'Astronomy Society Lunar & Deep Sky Night',
          meta: 'Nov 18 • Science Observatory Deck',
          badge: 'FIELD EVENT',
          capacity: '45 / 50 Spots Filled',
          progress: 90,
        },
      ],
    },
    {
      id: 'marketplace',
      name: 'Peer Marketplace',
      code: 'SECTOR-02',
      index: '02',
      icon: ShoppingBag,
      tagline: 'Zero-Fee Direct Student Commerce',
      description:
        'Buy, sell, and swap tech gear, textbooks, lab equipment, and dorm furniture directly with peers on campus. 0% platform tax.',
      route: '/marketplace',
      cta: 'Browse Marketplace',
      items: [
        {
          title: 'MacBook Pro 14" M3 Max (36GB / 1TB SSD)',
          meta: '$1,450 • CS Senior • Science Quad',
          badge: 'TECH',
          capacity: 'Verified Student Seller',
          progress: 100,
        },
        {
          title: 'Principles of Astrophysics & Cosmology (4th Ed.)',
          meta: '$42 • Physics Dept • North Quad',
          badge: 'TEXTBOOK',
          capacity: 'Mint Condition',
          progress: 100,
        },
        {
          title: 'Ergonomic Desk Setup & 4K Monitor (27-inch)',
          meta: '$180 • Grad Housing • Pickup Today',
          badge: 'DORM GEAR',
          capacity: 'Instant Hand-off',
          progress: 100,
        },
      ],
    },
    {
      id: 'resources',
      name: 'Compute & Labs',
      code: 'SECTOR-03',
      index: '03',
      icon: Layers,
      tagline: 'High-Performance Facilities & Hardware',
      description:
        'Reserve high-power GPU cluster nodes, clean rooms, podcast soundstages, rapid 3D prototyping bays, and private focus study pods.',
      route: '/resources',
      cta: 'Book Facilities',
      items: [
        {
          title: 'Quantum & AI Simulation Cluster #2 (8x H100)',
          meta: 'Engineering Building Lab 402',
          badge: 'SUPERCOMPUTE',
          capacity: 'Available Today • 3 Slots Open',
          progress: 60,
        },
        {
          title: 'Acoustic Soundstage & Podcasting Suite A',
          meta: 'Fine Arts Media Wing',
          badge: 'MULTIMEDIA',
          capacity: 'Reserved for 4 PM',
          progress: 40,
        },
        {
          title: 'Rapid Prototyping & 3D Fabrication Studio',
          meta: 'Innovation Workshop Center',
          badge: 'MAKER LAB',
          capacity: 'Open Walk-in Today',
          progress: 85,
        },
      ],
    },
    {
      id: 'clubs',
      name: 'Guilds & Societies',
      code: 'SECTOR-04',
      index: '04',
      icon: Users,
      tagline: 'Chartered Student Organizations',
      description:
        'Discover autonomous engineering teams, design guilds, academic associations, and cultural societies active on campus.',
      route: '/clubs',
      cta: 'Discover Clubs',
      items: [
        {
          title: 'Autonomous Systems & Drone Racing Guild',
          meta: 'Engineering Quad Hangar • 142 Members',
          badge: 'ENGINEERING',
          capacity: 'Open Recruitment Sprint',
          progress: 92,
        },
        {
          title: 'Campus Design Collective & Swiss Typography Lab',
          meta: 'Arts Studio 204 • 88 Members',
          badge: 'DESIGN',
          capacity: 'Portfolio Review Active',
          progress: 80,
        },
        {
          title: 'Collegiate Esports & High-Performance Gaming',
          meta: 'Student Union Arena • 310 Members',
          badge: 'ATHLETICS',
          capacity: 'Open Practice Friday',
          progress: 65,
        },
      ],
    },
  ];

  const currentSectorData = sectors.find((s) => s.id === activeSector) || sectors[0];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface-0)',
        color: 'var(--text-primary)',
        position: 'relative',
        overflowX: 'hidden',
        paddingTop: 'var(--header-height)',
      }}
    >
      <ScrollProgressBar />

      {/* ── Monochromatic Ambient Light ────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1280px',
          height: '500px',
          background: 'radial-gradient(ellipse at 50% 10%, var(--border-subtle) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6,
        }}
      />

      {/* ── Hero Section (Editorial Split Composition) ─────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(2.5rem, 5vw, 4.5rem) 0 3rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Asymmetric Editorial Typography */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <span className="telemetry-tag">
                  <span className="live-dot" />
                  [01 // SYSTEM OVERVIEW]
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  // OS V2.4
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 850,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05,
                  margin: '0 0 1.5rem',
                  fontFamily: 'var(--font-heading)',
                  textTransform: 'uppercase',
                }}
              >
                The Unified Campus Operating Platform.
              </h1>

              <p
                className="editorial-lead"
                style={{
                  maxWidth: '560px',
                  marginBottom: '2rem',
                }}
              >
                Campspace consolidates campus life into one synchronized architectural system. Coordinate
                flagship student hackathons with live RSVP tracking, buy & sell textbooks with verified peers at
                zero platform fee, reserve compute facilities, and connect with chartered guilds.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="btn btn-primary btn-lg"
                  style={{ gap: '0.5rem', minWidth: '180px' }}
                >
                  <Terminal size={16} />
                  <span>{isAuthenticated ? 'Enter Dashboard' : 'Initialize Session'}</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/events"
                  className="btn btn-secondary btn-lg"
                  style={{ gap: '0.5rem' }}
                >
                  <Calendar size={16} />
                  <span>Explore Archive</span>
                </Link>

                <Link
                  to="/marketplace"
                  className="btn btn-ghost btn-lg"
                  style={{ gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                >
                  <span>Marketplace</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>

              {/* Architecture Specs Monospace Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  flexWrap: 'wrap',
                }}
              >
                <span>AUTH: JWT BEARER</span>
                <span>•</span>
                <span>COMMERCE: 0% FEES</span>
                <span>•</span>
                <span>MODULES: 04 ACTIVE</span>
              </div>
            </motion.div>

            {/* Right Column: Live Operational Telemetry Monitor */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.15}>
              <div
                className="arch-panel"
                style={{
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Console Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={16} color="var(--text-primary)" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
                      TELEMETRY // ACTIVE SECTOR
                    </span>
                  </div>
                  <span className="mono-badge mono-badge-filled">{currentSectorData.code}</span>
                </div>

                {/* Sector Quick Switcher */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.35rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {sectors.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSector(sec.id)}
                      style={{
                        padding: '0.5rem 0.25rem',
                        background: activeSector === sec.id ? 'var(--text-primary)' : 'var(--surface-2)',
                        color: activeSector === sec.id ? 'var(--text-inverse)' : 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {sec.index}
                    </button>
                  ))}
                </div>

                {/* Sector Featured Preview */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      {currentSectorData.name}
                    </span>
                    <Link
                      to={currentSectorData.route}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>Launch</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', lineHeight: 1.25 }}>
                    {currentSectorData.tagline}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {currentSectorData.description}
                  </p>
                </div>

                {/* Sector Live Feed Item */}
                <div
                  style={{
                    padding: '1rem',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="mono-badge">{currentSectorData.items[0].badge}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      REAL-TIME
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 750, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {currentSectorData.items[0].title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {currentSectorData.items[0].meta}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    <span>{currentSectorData.items[0].capacity}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{currentSectorData.items[0].progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${currentSectorData.items[0].progress}%`,
                        height: '100%',
                        background: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Real-Time Architectural Ticker Strip ───────────────────── */}
      <div className="ticker-strip">
        <div className="ticker-item">
          <span className="live-dot" />
          <span>EVENT ARCHIVE: ACTIVE // REAL-TIME RSVP TELEMETRY</span>
        </div>
        <span>///</span>
        <div className="ticker-item">
          <span className="live-dot" />
          <span>PEER MARKETPLACE: 0% TRANSACTION FEES // VERIFIED STUDENTS</span>
        </div>
        <span>///</span>
        <div className="ticker-item">
          <span className="live-dot" />
          <span>RESOURCE ALLOCATION: OPERATIONAL // TIME-SLOT SCHEDULING</span>
        </div>
        <span>///</span>
        <div className="ticker-item">
          <span className="live-dot" />
          <span>STUDENT GUILDS: CHARTERED DIRECTORY // OPEN RECRUITMENT</span>
        </div>
      </div>

      {/* ── 02 // Sector Architecture Matrix ───────────────────────── */}
      <section style={{ padding: 'clamp(4rem, 6vw, 6rem) 0' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="telemetry-tag" style={{ marginBottom: '0.5rem' }}>
                [02 // SECTOR ARCHITECTURE]
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 850, margin: 0, textTransform: 'uppercase' }}>
                Four Synchronized Modules.
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: 0 }}>
              Engineered to operate as one unified campus digital fabric rather than disconnected siloed tools.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.id}
                  className="card arch-panel arch-panel-interactive"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span className="mono-badge mono-badge-filled">{sector.code}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                        {sector.index}
                      </span>
                    </div>

                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                      {sector.name}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                      {sector.description}
                    </p>
                  </div>

                  <Link
                    to={sector.route}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', width: '100%', minHeight: '38px' }}
                  >
                    <span>{sector.cta}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 03 // Architecture & Security Principles ───────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 6vw, 6rem) 0',
          background: 'var(--surface-1)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div style={{ marginBottom: '3rem', maxWidth: '640px' }}>
            <span className="telemetry-tag" style={{ marginBottom: '0.5rem' }}>
              [03 // PLATFORM INTEGRITY]
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 850, margin: '0 0 0.75rem', textTransform: 'uppercase' }}>
              Engineered For Campus Trust.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              Strictly enforced access policies and student security built into the core backend.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="card arch-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <Shield size={20} color="var(--text-primary)" />
                <span className="mono-badge">AUTH PROTOCOL</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.65rem' }}>
                Verified Collegiate Authentication
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Every participant holds an authenticated university session verified through JWT Bearer tokens and
                role-governed authorization (Students, Organizers, Administrators). Zero bot traffic, zero spam.
              </p>
            </div>

            <div className="card arch-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <Lock size={20} color="var(--text-primary)" />
                <span className="mono-badge">COMMERCE POLICY</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.65rem' }}>
                Zero Platform Commission
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Student transactions remain 100% peer-to-peer. No 15% marketplace commissions, no platform processing tax.
                Coordinate campus handoffs with direct in-person inspection and accountability.
              </p>
            </div>

            <div className="card arch-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <Zap size={20} color="var(--text-primary)" />
                <span className="mono-badge">RSVP TELEMETRY</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.65rem' }}>
                Real-Time Quota Telemetry
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Live capacity tracking ensures attendee quotas are respected automatically. Capacity meters,
                instant registration confirmations, and direct organizer attendee management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 // Architectural Call To Action ─────────────────────── */}
      <section style={{ padding: 'clamp(4rem, 7vw, 6.5rem) 0' }}>
        <div className="container">
          <div
            className="arch-panel"
            style={{
              padding: 'clamp(2.5rem, 5vw, 4.5rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-strong)',
            }}
          >
            <span className="telemetry-tag" style={{ marginBottom: '1.25rem' }}>
              [04 // SESSION INITIATION]
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.75rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                margin: '0 0 1rem',
                textTransform: 'uppercase',
                maxWidth: '780px',
              }}
            >
              Ready To Enter The Campspace Network?
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                maxWidth: '580px',
                margin: '0 auto 2.5rem',
                lineHeight: 1.6,
              }}
            >
              Access event registrations, fee-free student commerce, campus lab reservations, and student
              societies in a single unified operating workspace.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="btn btn-primary btn-lg"
                style={{ gap: '0.5rem', minWidth: '200px' }}
              >
                <span>{isAuthenticated ? 'Enter Dashboard Hub' : 'Create Campus Account'}</span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/events" className="btn btn-secondary btn-lg">
                <span>Explore Campus Events</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
