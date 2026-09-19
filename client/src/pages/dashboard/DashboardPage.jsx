import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Shield,
  ShoppingBag,
  Calendar,
  Layers,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Lock,
  Terminal,
  Activity,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import api from '../../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [roleTestLoading, setRoleTestLoading] = useState(false);
  const [roleTestResult, setRoleTestResult] = useState(null);

  const handleTestRoleAuth = async () => {
    setRoleTestLoading(true);
    setRoleTestResult(null);
    try {
      const res = await api.get('/api/auth/role-check/organizer-or-admin');
      setRoleTestResult({
        success: true,
        status: 200,
        message: res.message || 'Access granted: Your role has permission to access this endpoint.',
      });
    } catch (err) {
      setRoleTestResult({
        success: false,
        status: err.status || 403,
        message: err.message || 'Forbidden: Backend rejected request based on role permissions.',
      });
    } finally {
      setRoleTestLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        {/* Cockpit Header */}
        <div
          className="card liquid-glass-card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid var(--liquid-glass-border)',
            boxShadow: 'var(--liquid-glass-shadow)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span className="liquid-glass-pill" style={{ padding: '0.25rem 0.65rem' }}>
                  <span className="orange-dot" />
                  <span>[COCKPIT // ACTIVE SESSION]</span>
                </span>
                <span className="badge-orange">
                  {user?.role?.toUpperCase() || 'STUDENT'}
                </span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 850, margin: '0 0 0.4rem', textTransform: 'uppercase' }}>
                Welcome, <span className="text-orange">{user?.name || 'Campus Member'}</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                Your authenticated Campspace session is active. Operating with full campus privileges.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <Link to="/marketplace" className="btn btn-liquid-orange btn-sm">
                Marketplace
              </Link>
              <Link to="/events" className="btn btn-secondary btn-sm">
                Events Archive
              </Link>
              <Link to="/resources" className="btn btn-ghost btn-sm">
                Book Resources
              </Link>
            </div>
          </div>
        </div>

        {/* Operating Diagnostics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* User Profile Summary Card */}
          <div className="card liquid-glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} style={{ color: 'var(--accent-orange)' }} />
                <span style={{ fontWeight: 750, fontSize: '1rem', textTransform: 'uppercase' }}>
                  Profile Identity
                </span>
              </div>
              <span className="badge-orange">VERIFIED</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>NAME</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.name}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>EMAIL</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.email}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>ROLE</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'capitalize' }}>{user?.role}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>TOKEN STATUS</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>
                  JWT ACTIVE (BEARER)
                </span>
              </div>
            </div>
          </div>

          {/* Backend Role Authorization Verifier */}
          <div className="card arch-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} color="var(--text-primary)" />
                <span style={{ fontWeight: 750, fontSize: '1rem', textTransform: 'uppercase' }}>
                  Role Access Diagnostic
                </span>
              </div>
              <span className="mono-badge">[DIAGNOSTIC]</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Executes a live call to the server authorization endpoint (<code>authorize('organizer', 'admin')</code>). The backend remains the sole authoritative source for access control.
            </p>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleTestRoleAuth}
              isLoading={roleTestLoading}
              icon={<Lock size={14} />}
              style={{ minHeight: '38px', width: '100%', justifyContent: 'center' }}
            >
              Verify Endpoint Authorization
            </Button>

            {roleTestResult && (
              <div style={{ marginTop: '1rem' }}>
                <Alert
                  type={roleTestResult.success ? 'success' : 'warning'}
                  message={`HTTP ${roleTestResult.status}: ${roleTestResult.message}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modules Overview */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="telemetry-tag" style={{ marginBottom: '0.25rem' }}>
              [CAMPUS MODULES]
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>
              Operational Sectors
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {/* Marketplace */}
          <div className="card arch-panel arch-panel-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <ShoppingBag size={18} color="var(--text-primary)" />
                <span className="mono-badge">SECTOR-01</span>
              </div>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.35rem' }}>Marketplace</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Buy and sell textbooks, electronics, and dorm items with verified students at 0% fees.
              </p>
            </div>
            <Link to="/marketplace" className="btn btn-secondary btn-sm" style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'space-between' }}>
              <span>Browse Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Events */}
          <div className="card arch-panel arch-panel-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Calendar size={18} color="var(--text-primary)" />
                <span className="mono-badge">SECTOR-02</span>
              </div>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.35rem' }}>Events Archive</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Discover collegiate hackathons, guest seminars, workshops, and RSVP with live quotas.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '1.25rem' }}>
              <Link to="/events" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Explore Events</span>
                <ArrowRight size={13} />
              </Link>
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <Link to="/events/my-events" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>Organizer Hub</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>

          {/* Resources */}
          <div className="card arch-panel arch-panel-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Layers size={18} color="var(--text-primary)" />
                <span className="mono-badge">SECTOR-03</span>
              </div>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.35rem' }}>Facilities & Labs</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Reserve specialized hardware, 3D printing maker bays, and quantum simulation nodes.
              </p>
            </div>
            <Link to="/resources" className="btn btn-secondary btn-sm" style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'space-between' }}>
              <span>Book Allocation</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Clubs */}
          <div className="card arch-panel arch-panel-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Users size={18} color="var(--text-primary)" />
                <span className="mono-badge">SECTOR-04</span>
              </div>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.35rem' }}>Guilds & Societies</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Connect with autonomous engineering leagues, design collectives, and cultural societies.
              </p>
            </div>
            <Link to="/clubs" className="btn btn-secondary btn-sm" style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'space-between' }}>
              <span>Guild Directory</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
