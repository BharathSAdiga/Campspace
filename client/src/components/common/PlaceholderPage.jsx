import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from './PageHeader';
import { TiltCard } from './TiltCard';
import { Layers, Calendar, Users, Clock, ArrowRight } from 'lucide-react';

export const PlaceholderPage = ({
  title,
  description,
  module = 'Shared',
  owner = 'Shared',
  routePath,
}) => {
  const isResource = module.toLowerCase().includes('resource');
  const isClub = module.toLowerCase().includes('club');

  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      <div className="container">
        <PageHeader
          title={title}
          description={description}
          breadcrumb={`Campspace // ${module.toUpperCase()}`}
          badge={
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge-outline">In Development</span>
            </div>
          }
        />

        {/* Operational Split Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem',
          }}
        >
          {/* Column 1: System Spec & Telemetry */}
          <TiltCard tiltIntensity={6}>
            <div className="card liquid-glass-card" style={{ padding: '2rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--liquid-glass-bg)',
                    border: '1px solid var(--accent-orange-border)',
                    color: 'var(--accent-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px var(--accent-orange-subtle)',
                  }}
                >
                  {isResource ? <Clock size={20} /> : isClub ? <Users size={20} /> : <Layers size={20} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    {isResource ? 'Resource Scheduling' : isClub ? 'Campus Clubs' : 'Module Information'}
                  </h3>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {description}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/dashboard" className="btn btn-liquid-orange btn-sm">
                  Dashboard Hub
                </Link>
                <Link to="/events" className="btn btn-secondary btn-sm">
                  Explore Events
                </Link>
              </div>
            </div>
          </TiltCard>

          {/* Column 2: Interactive Operational Schedule / Roster */}
          <TiltCard tiltIntensity={6}>
            <div className="card liquid-glass-card" style={{ padding: '2rem', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  Overview
                </span>
              </div>

              {isResource ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ border: '1px solid var(--liquid-glass-border)', background: 'var(--liquid-glass-bg)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.88rem' }}>Digital Fabrication Lab 01</strong>
                      <span className="badge-orange">READY</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      3D Printers, Laser Cutters, CNC Stations // Max capacity: 16
                    </p>
                  </div>

                  <div style={{ border: '1px solid var(--liquid-glass-border)', background: 'var(--liquid-glass-bg)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.88rem' }}>Quantum Computing Sandbox</strong>
                      <span className="liquid-glass-pill" style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}>RESERVED</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      Cryogenic cluster terminal node // Scheduled: 14:00 - 18:00
                    </p>
                  </div>

                  <div style={{ border: '1px solid var(--liquid-glass-border)', background: 'var(--liquid-glass-bg)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.88rem' }}>Audio-Visual Media Studio B</strong>
                      <span className="badge-orange">READY</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      Sound isolation acoustic booth, 4K camera rig // Open Booking
                    </p>
                  </div>
                </div>
              ) : isClub ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ border: '1px solid var(--liquid-glass-border)', background: 'var(--liquid-glass-bg)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.88rem' }}>AI & Autonomous Systems Society</strong>
                      <span className="badge-orange">ACTIVE</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      Weekly research sprints & open-source ML build sessions. 184 active members.
                    </p>
                  </div>

                  <div style={{ border: '1px solid var(--liquid-glass-border)', background: 'var(--liquid-glass-bg)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.88rem' }}>Campus Design & Architecture Guild</strong>
                      <span className="badge-orange">ACTIVE</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      Spatial computing, UI critique, and Swiss typography workshops.
                    </p>
                  </div>

                  <div style={{ border: '1px solid var(--liquid-glass-border)', background: 'var(--liquid-glass-bg)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.88rem' }}>Competitive Robotics League</strong>
                      <span className="badge-orange">ACTIVE</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      National tournament prep and hardware integration drills.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Content coming soon
                </div>
              )}
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
