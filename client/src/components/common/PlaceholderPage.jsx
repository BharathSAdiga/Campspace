import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from './PageHeader';
import { Card } from './Card';
import { Badge } from './Badge';
import { Layers, Calendar, Users, Clock, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

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
              <span className="mono-badge mono-badge-filled">[MODULE: {module.toUpperCase()}]</span>
              <span className="mono-badge">[ROUTE: {routePath}]</span>
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
          <div className="card arch-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--text-primary)',
                  color: 'var(--text-inverse)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isResource ? <Clock size={18} /> : isClub ? <Users size={18} /> : <Layers size={18} />}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 750 }}>
                  {isResource ? 'Resource Scheduling Architecture' : isClub ? 'Campus Guild Registry' : 'Module Specification'}
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  ID: {routePath.replace(/\//g, '_').toUpperCase()}
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ENDPOINT</span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{routePath}</code>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>STATUS</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  ● INTEGRATED WITH CLIENT ROUTER
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACCESS CONTROL</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  CAMPUS AUTHENTICATED
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                Dashboard Hub
              </Link>
              <Link to="/events" className="btn btn-secondary btn-sm">
                Explore Events
              </Link>
            </div>
          </div>

          {/* Column 2: Interactive Operational Schedule / Roster */}
          <div className="card arch-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                [OPERATIONAL TELEMETRY]
              </span>
              <span className="mono-badge">[ONLINE]</span>
            </div>

            {isResource ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Digital Fabrication Lab 01</strong>
                    <span className="mono-badge mono-badge-filled">READY</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    3D Printers, Laser Cutters, CNC Stations // Max capacity: 16
                  </p>
                </div>

                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Quantum Computing Sandbox</strong>
                    <span className="mono-badge">RESERVED</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Cryogenic cluster terminal node // Scheduled: 14:00 - 18:00
                  </p>
                </div>

                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Audio-Visual Media Studio B</strong>
                    <span className="mono-badge mono-badge-filled">READY</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Sound isolation acoustic booth, 4K camera rig // Open Booking
                  </p>
                </div>
              </div>
            ) : isClub ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>AI & Autonomous Systems Society</strong>
                    <span className="mono-badge mono-badge-filled">ACTIVE</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Weekly research sprints & open-source ML build sessions. 184 active members.
                  </p>
                </div>

                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Campus Design & Architecture Guild</strong>
                    <span className="mono-badge mono-badge-filled">ACTIVE</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Spatial computing, UI critique, and Swiss typography workshops.
                  </p>
                </div>

                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Competitive Robotics League</strong>
                    <span className="mono-badge mono-badge-filled">ACTIVE</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    National tournament prep and hardware integration drills.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                [CAMPUS SUBSYSTEM OPERATIONAL]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
