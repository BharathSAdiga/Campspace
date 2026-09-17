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
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, var(--primary-50) 0%, #FFFFFF 100%)',
          borderColor: 'var(--primary-100)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>
                Welcome, {user?.name || 'Campus Member'}!
              </h1>
              <Badge variant={user?.role === 'admin' ? 'warning' : user?.role === 'organizer' ? 'primary' : 'default'} size="md">
                {user?.role?.toUpperCase() || 'STUDENT'}
              </Badge>
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>
              Your authenticated Campspace session is active. Access your campus modules below.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/marketplace" className="btn btn-primary btn-sm">
              Explore Marketplace
            </Link>
            <Link to="/events" className="btn btn-secondary btn-sm">
              View Events
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* User Profile Summary Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontWeight: '600', fontSize: '1.125rem' }}>
            <User size={20} color="var(--primary-600)" />
            <span>Profile Overview</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Full Name</span>
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Email Address</span>
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Assigned Role</span>
              <span style={{ fontWeight: '600', fontSize: '0.875rem', textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Session Token</span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                JWT Active (Bearer)
              </span>
            </div>
          </div>
        </div>

        {/* Backend Role Authorization Verifier */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', fontSize: '1.125rem' }}>
            <Shield size={20} color="var(--primary-600)" />
            <span>Role Authorization Verifier</span>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Test the backend authorization middleware (<code>authorize('organizer', 'admin')</code>). The server is the single source of truth for access control.
          </p>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleTestRoleAuth}
            isLoading={roleTestLoading}
            icon={<Lock size={15} />}
          >
            Verify Endpoint Access
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
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Campus Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Marketplace */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShoppingBag size={18} color="var(--primary-600)" />
              <strong style={{ fontSize: '0.9375rem' }}>Marketplace</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Buy and sell textbooks, electronics, and dorm items with verified students.
            </p>
          </div>
          <Link to="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: '600', marginTop: '1rem', color: 'var(--primary-600)' }}>
            Browse Items <ArrowRight size={14} />
          </Link>
        </div>

        {/* Events */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calendar size={18} color="var(--accent-teal)" />
              <strong style={{ fontSize: '0.9375rem' }}>Events</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Discover workshops, hackathons, and cultural campus events.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--accent-teal)' }}>
              Explore Events <ArrowRight size={14} />
            </Link>
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <Link to="/events/my-events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary-600)' }}>
                My Events <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Resources */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Layers size={18} color="var(--text-muted)" />
              <strong style={{ fontSize: '0.9375rem' }}>Resources</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Reserve labs, study halls, and specialized equipment.
            </p>
          </div>
          <Link to="/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: '600', marginTop: '1rem', color: 'var(--text-muted)' }}>
            View Labs <ArrowRight size={14} />
          </Link>
        </div>

        {/* Clubs */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Users size={18} color="var(--text-muted)" />
              <strong style={{ fontSize: '0.9375rem' }}>Clubs</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Join student organizations and participate in campus chapters.
            </p>
          </div>
          <Link to="/clubs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: '600', marginTop: '1rem', color: 'var(--text-muted)' }}>
            Browse Clubs <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
