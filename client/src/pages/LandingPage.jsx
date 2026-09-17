import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ShoppingBag,
  Layers,
  Users,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Zap,
  Globe,
  Compass,
  Search,
  Radio,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  Terminal,
  Activity,
  Cpu,
  Orbit,
  Maximize2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeSector, setActiveSector] = useState('events');

  // Sector Data for the Interactive Orbit Gateway
  const sectors = [
    {
      id: 'events',
      name: 'Campus Events',
      code: 'SECTOR-EV',
      icon: Calendar,
      tagline: 'Workshops, Hackathons & Keynote Summits',
      description:
        'Coordinate and RSVP to student hackathons, career fairs, guest seminars, and campus mixers with real-time capacity telemetry.',
      route: '/events',
      cta: 'Explore Events',
      items: [
        {
          title: 'HackCampus 2026 // 24H AI & Space Tech Hackathon',
          meta: 'Oct 24 • Engineering Atrium',
          badge: 'FLAGSHIP',
          capacity: '184 / 250 Spots Filled',
        },
        {
          title: 'Deep Learning & Quantum Computing Seminar',
          meta: 'Nov 12 • Turing Hall Auditorium',
          badge: 'KEYNOTE',
          capacity: '92 / 120 Spots Filled',
        },
        {
          title: 'Astronomy Club Lunar & Deep Sky Observation',
          meta: 'Nov 18 • Science Observatory Deck',
          badge: 'FIELD EVENT',
          capacity: '45 / 50 Spots Filled',
        },
      ],
    },
    {
      id: 'marketplace',
      name: 'Peer Marketplace',
      code: 'SECTOR-MK',
      icon: ShoppingBag,
      tagline: 'Zero-Fee Student Commerce',
      description:
        'Buy, sell, and trade textbooks, high-end electronics, lab instruments, and dorm essentials directly with verified students.',
      route: '/marketplace',
      cta: 'Browse Marketplace',
      items: [
        {
          title: 'MacBook Pro 14" M3 Max (36GB / 1TB SSD)',
          meta: '$1,450 • CS Senior • Science Quad',
          badge: 'TECH',
          capacity: 'Verified Student Seller',
        },
        {
          title: 'Principles of Astrophysics & Cosmology (4th Ed.)',
          meta: '$42 • Physics Dept • North Campus',
          badge: 'TEXTBOOK',
          capacity: 'Mint Condition',
        },
        {
          title: 'Ergonomic Desk Setup & 4K Monitor',
          meta: '$180 • Grad Housing • Pickup Today',
          badge: 'DORM GEAR',
          capacity: 'Immediate Transfer',
        },
      ],
    },
    {
      id: 'resources',
      name: 'Compute & Labs',
      code: 'SECTOR-RS',
      icon: Layers,
      tagline: 'Specialized Hardware & Facility Bookings',
      description:
        'Reserve high-performance GPU nodes, clean rooms, podcast studios, robotics testing bays, and private focus study pods.',
      route: '/resources',
      cta: 'Reserve Facilities',
      items: [
        {
          title: 'Quantum & AI Simulation Cluster #2 (8x H100)',
          meta: 'Engineering Building Lab 402',
          badge: 'SUPERCOMPUTE',
          capacity: 'Available Today',
        },
        {
          title: 'Acoustic Soundstage & Podcasting Suite A',
          meta: 'Fine Arts Media Wing',
          badge: 'MULTIMEDIA',
          capacity: '3 Time Slots Open',
        },
        {
          title: 'Rapid Prototyping & 3D Fabrication Bay',
          meta: 'Innovation Workshop Center',
          badge: 'MAKER LAB',
          capacity: 'Open Walk-in',
        },
      ],
    },
    {
      id: 'clubs',
      name: 'Constellations',
      code: 'SECTOR-CL',
      icon: Users,
      tagline: 'Student Organizations & Societies',
      description:
        'Join student constellations, technical societies, robotics collectives, and creative guilds to shape the future of campus culture.',
      route: '/clubs',
      cta: 'Join Constellations',
      items: [
        {
          title: 'Autonomous Robotics & Rover Development Team',
          meta: '128 Members • Hardware & Firmware',
          badge: 'ENGINEERING',
          capacity: 'Recruiting Cohort 2026',
        },
        {
          title: 'Campus Design Guild & UI/UX Laboratory',
          meta: '84 Members • Figma & Frontend',
          badge: 'CREATIVE',
          capacity: 'Weekly Sprints',
        },
        {
          title: 'Astrophysics & Deep Space Observation Society',
          meta: '210 Members • Stargazing & Research',
          badge: 'SCIENCE',
          capacity: 'Open to All Majors',
        },
      ],
    },
  ];

  const currentSectorData = sectors.find((s) => s.id === activeSector) || sectors[0];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        position: 'relative',
        overflowX: 'hidden',
        paddingTop: '5rem',
      }}
    >
      {/* 1. Deep Space Atmospheric Canvas Grid & Stars */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `
            radial-gradient(1.2px 1.2px at 20px 30px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
            radial-gradient(1.5px 1.5px at 90px 140px, rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0)),
            radial-gradient(1px 1px at 220px 70px, rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 340px 280px, rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0)),
            radial-gradient(1px 1px at 480px 180px, rgba(255, 255, 255, 0.7), rgba(0, 0, 0, 0)),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '450px 450px, 550px 550px, 350px 350px, 600px 600px, 500px 500px, 80px 80px, 80px 80px',
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Luminous Nebulae Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Container */}
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '6rem' }}>
        {/* Top Telemetry Beacon Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.06)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 10px #FFFFFF',
                animation: 'pulseBeacon 1.8s infinite',
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                color: '#FFFFFF',
              }}
            >
              CAMPSPACE OS // ORBITAL CAMPUS ECOSYSTEM
            </span>
          </div>
        </div>

        {/* 2. Massive Space Hero Headline */}
        <div style={{ textAlign: 'center', maxWidth: '980px', margin: '0 auto 3.5rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5.8rem)',
              fontWeight: '900',
              letterSpacing: '-0.04em',
              lineHeight: '1.02',
              margin: '0 0 1.5rem',
              color: '#FFFFFF',
              textShadow: '0 0 40px rgba(255, 255, 255, 0.25)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            THE DIGITAL COSMOS
            <br />
            <span
              style={{
                color: '#FFFFFF',
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.8)',
                background: 'linear-gradient(180deg, #FFFFFF 30%, rgba(255, 255, 255, 0.4) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FOR CAMPUS LIFE.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.28rem)',
              color: '#A1A1AA',
              lineHeight: '1.6',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              fontWeight: '400',
            }}
          >
            An ultra-modern, zero-friction operating system uniting student hackathons, peer-to-peer
            trade, quantum computing labs, and student constellations in one celestial orbit.
          </p>

          {/* Action Button Cluster */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '3rem',
            }}
          >
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="btn btn-primary btn-lg"
              style={{
                background: '#FFFFFF',
                color: '#000000',
                fontWeight: '800',
                fontSize: '1rem',
                padding: '0.85rem 2.2rem',
                borderRadius: '9999px',
                boxShadow: '0 0 35px rgba(255, 255, 255, 0.4)',
                border: '1px solid #FFFFFF',
              }}
            >
              <span>{isAuthenticated ? 'Enter Control Console' : 'Launch Campspace Free'}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/events"
              className="btn btn-secondary btn-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                padding: '0.85rem 2rem',
                borderRadius: '9999px',
                fontWeight: '600',
              }}
            >
              <Orbit size={18} />
              <span>Explore Orbit Events</span>
            </Link>

            <Link
              to="/marketplace"
              className="btn btn-secondary btn-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#A1A1AA',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '0.85rem 1.8rem',
                borderRadius: '9999px',
                fontWeight: '500',
              }}
            >
              <span>Marketplace</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Telemetry Metric Pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              maxWidth: '880px',
              margin: '0 auto',
            }}
          >
            {[
              { label: 'Orbital Sectors', value: '04 Unified', desc: 'Events • Market • Labs • Orgs' },
              { label: 'Campus Governance', value: '100% Student', desc: 'Zero Intermediaries' },
              { label: 'Transaction Tax', value: '0.00%', desc: 'Direct Peer Exchange' },
              { label: 'RSVP Teleportation', value: '< 20ms', desc: 'Real-Time Capacity' },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem 1rem',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(10, 10, 14, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    color: '#A1A1AA',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: '0.2rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '0.25rem' }}>
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Interactive Space Quadrant Station (4 Sectors) */}
        <section style={{ marginBottom: '5.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#71717A',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              // ORBITAL CONTROL MATRIX
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
                fontWeight: '800',
                color: '#FFFFFF',
                margin: '0.5rem 0 0',
                letterSpacing: '-0.03em',
              }}
            >
              Explore The Four Campus Sectors
            </h2>
          </div>

          {/* Sector Selector Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {sectors.map((s) => {
              const Icon = s.icon;
              const isSelected = activeSector === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSector(s.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '9999px',
                    border: isSelected
                      ? '1px solid #FFFFFF'
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: isSelected ? '#FFFFFF' : 'rgba(15, 15, 20, 0.6)',
                    color: isSelected ? '#000000' : '#A1A1AA',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 25px rgba(255, 255, 255, 0.35)' : 'none',
                  }}
                >
                  <Icon size={16} />
                  <span>{s.name}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      opacity: isSelected ? 0.7 : 0.4,
                    }}
                  >
                    {s.code}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Sector Display Deck */}
          <div
            style={{
              backgroundColor: 'rgba(8, 8, 12, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              padding: '2.5rem',
              backdropFilter: 'blur(32px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 255, 255, 0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: '#A1A1AA',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '0.4rem',
                  }}
                >
                  <span>ORBIT VECTOR:</span>
                  <strong style={{ color: '#FFFFFF' }}>{currentSectorData.code}</strong>
                </div>
                <h3
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    margin: 0,
                    color: '#FFFFFF',
                  }}
                >
                  {currentSectorData.tagline}
                </h3>
                <p
                  style={{
                    color: '#A1A1AA',
                    fontSize: '0.98rem',
                    margin: '0.4rem 0 0',
                    maxWidth: '650px',
                  }}
                >
                  {currentSectorData.description}
                </p>
              </div>

              <Link
                to={currentSectorData.route}
                className="btn btn-primary"
                style={{
                  background: '#FFFFFF',
                  color: '#000000',
                  fontWeight: '700',
                  padding: '0.65rem 1.6rem',
                  borderRadius: '9999px',
                  boxShadow: '0 0 25px rgba(255, 255, 255, 0.3)',
                }}
              >
                <span>{currentSectorData.cta}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Sector Telemetry Preview Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {currentSectorData.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(16, 16, 22, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.25s ease',
                  }}
                  className="space-card-glow"
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        letterSpacing: '0.08em',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {item.badge}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#71717A',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      INDEX-0{idx + 1}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      lineHeight: '1.35',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.title}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#A1A1AA', marginBottom: '0.75rem' }}>
                    {item.meta}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#D4D4D8',
                      paddingTop: '0.65rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <CheckCircle2 size={13} color="#FFFFFF" />
                    <span>{item.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Bento Grid: Deep Space Framework */}
        <section style={{ marginBottom: '5.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#71717A',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              // CORE SYSTEM ARCHITECTURE
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
                fontWeight: '800',
                color: '#FFFFFF',
                margin: '0.5rem 0 0',
                letterSpacing: '-0.03em',
              }}
            >
              Engineered For Deep Space Velocity
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Bento Card 1: Monochromatic HUD */}
            <div
              style={{
                padding: '2rem',
                borderRadius: '20px',
                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                }}
              >
                <Terminal size={22} strokeWidth={2.4} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.5rem' }}>
                Pure Monochromatic HUD
              </h4>
              <p style={{ color: '#A1A1AA', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                High-contrast pure white and obsidian dark UI designed for zero visual fatigue,
                instant readability in low-light auditoriums, and lightning-fast keyboard navigation.
              </p>
            </div>

            {/* Bento Card 2: Stellar Security */}
            <div
              style={{
                padding: '2rem',
                borderRadius: '20px',
                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                }}
              >
                <Shield size={22} strokeWidth={2.4} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.5rem' }}>
                Role-Based Orbit Security
              </h4>
              <p style={{ color: '#A1A1AA', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                Strict organizer permissions, attendee privacy enforcement, and tokenized session
                encryption ensure students and faculty collaborate without data leaks.
              </p>
            </div>

            {/* Bento Card 3: Real-Time Telemetry */}
            <div
              style={{
                padding: '2rem',
                borderRadius: '20px',
                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                }}
              >
                <Zap size={22} strokeWidth={2.4} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.5rem' }}>
                Live Quota Telemetry
              </h4>
              <p style={{ color: '#A1A1AA', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                Never run into overbooked events or unavailable lab equipment again. Instantaneous
                seat counters, remaining spots gauges, and auto-closing RSVP pipelines.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Mission Control Final Warp Call-to-Action */}
        <div
          style={{
            borderRadius: '28px',
            background: 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.12) 0%, rgba(10, 10, 14, 0.95) 75%)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            padding: '4.5rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Subtle star particle in CTA */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '1.25rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Sparkles size={13} />
            <span>MISSION LAUNCH READY</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: '900',
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              margin: '0 0 1rem',
            }}
          >
            Ready To Enter The Orbit?
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              color: '#A1A1AA',
              maxWidth: '580px',
              margin: '0 auto 2.5rem',
              lineHeight: '1.6',
            }}
          >
            Join thousands of campus explorers. Publish events, discover peer trade, reserve
            computing facilities, and synchronize your campus existence today.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <Link
              to="/register"
              className="btn btn-primary btn-lg"
              style={{
                background: '#FFFFFF',
                color: '#000000',
                fontWeight: '800',
                fontSize: '1.05rem',
                padding: '0.9rem 2.5rem',
                borderRadius: '9999px',
                boxShadow: '0 0 40px rgba(255, 255, 255, 0.45)',
                border: '1px solid #FFFFFF',
              }}
            >
              <span>Initialize Orbit Access</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/events"
              className="btn btn-secondary btn-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.9rem 2.2rem',
                borderRadius: '9999px',
              }}
            >
              <span>Explore Public Gateway</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
