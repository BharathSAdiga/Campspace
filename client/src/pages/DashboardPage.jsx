import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { Alert } from '../components/common/Alert';
import {
  User,
  Mail,
  Building,
  CreditCard,
  Calendar,
  Users,
  ShieldCheck,
  Edit3,
  Check,
  PlusCircle,
  Clock,
  Sparkles,
  Phone,
  ShoppingBag,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, updateUser, isStudent, isOrganizer, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    campusId: user?.campusId || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [saveStatus, setSaveStatus] = useState({ loading: false, message: '', error: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveStatus({ loading: true, message: '', error: '' });

    try {
      const response = await authService.updateProfile(formData);
      if (response.success && response.data?.user) {
        updateUser(response.data.user);
        setSaveStatus({ loading: false, message: 'Profile updated successfully!', error: '' });
        setIsEditing(false);
      }
    } catch (err) {
      setSaveStatus({
        loading: false,
        message: '',
        error: err.message || 'Failed to update profile',
      });
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'organizer':
        return 'badge-organizer';
      case 'admin':
        return 'badge-admin';
      default:
        return 'badge-student';
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Welcome Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <h1>Welcome, {user?.name}!</h1>
              <span className={`badge ${getRoleBadgeClass(user?.role)}`}>
                {user?.role} Portal
              </span>
            </div>
            <p>Here is your unified campus control center and activity summary.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn ${isEditing ? 'btn-secondary' : 'btn-outline'}`}
            >
              <Edit3 size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Alerts for Profile Update */}
        {saveStatus.message && <Alert type="success" message={saveStatus.message} />}
        {saveStatus.error && <Alert type="error" message={saveStatus.error} />}

        {/* Main Content Grid */}
        <div className="grid" style={{ gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: '2rem' }}>
          {/* Left Column: User Profile Details Card */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-purple) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>{user?.name}</h3>
                <span className={`badge ${getRoleBadgeClass(user?.role)}`} style={{ marginTop: '0.25rem' }}>
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Profile Form (View or Edit) */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="department">Department</label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    className="form-input"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="campusId">Campus / Student ID</label>
                  <input
                    id="campusId"
                    name="campusId"
                    type="text"
                    className="form-input"
                    value={formData.campusId}
                    onChange={handleInputChange}
                    placeholder="e.g. CS-2026-101"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 555-0199"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-textarea"
                    rows="3"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell your campus community about yourself..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={saveStatus.loading}
                >
                  {saveStatus.loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem' }}>
                  <Mail size={18} color="var(--primary-400)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>Email</div>
                    <div style={{ color: 'var(--slate-100)', fontWeight: 500 }}>{user?.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem' }}>
                  <Building size={18} color="var(--primary-400)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>Department</div>
                    <div style={{ color: 'var(--slate-100)', fontWeight: 500 }}>
                      {user?.department || 'Not specified'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem' }}>
                  <CreditCard size={18} color="var(--primary-400)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>Campus ID</div>
                    <div style={{ color: 'var(--slate-100)', fontWeight: 500 }}>
                      {user?.campusId || 'Not assigned'}
                    </div>
                  </div>
                </div>

                {user?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem' }}>
                    <Phone size={18} color="var(--primary-400)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>Phone</div>
                      <div style={{ color: 'var(--slate-100)', fontWeight: 500 }}>{user.phone}</div>
                    </div>
                  </div>
                )}

                {user?.bio && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Bio</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-200)' }}>{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Role-Specific Feature Modules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Student View */}
            {isStudent && (
              <>
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%)', borderColor: 'rgba(6, 182, 212, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Sparkles size={20} color="var(--accent-cyan)" />
                    <h3 style={{ fontSize: '1.2rem' }}>Student Experience Hub</h3>
                  </div>
                  <p style={{ fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
                    Explore active campus clubs, register for workshops, and track your attendance passes.
                  </p>
                  <div className="grid-3">
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>0</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>Active RSVPs</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-300)' }}>Active</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>Membership Status</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>Verified</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>Student Account</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <ShoppingBag size={20} color="var(--primary-400)" />
                      <h3 style={{ fontSize: '1.2rem' }}>Campus Marketplace</h3>
                    </div>
                    <Link to="/marketplace" className="btn btn-outline btn-sm">
                      Browse All
                    </Link>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-400)', marginBottom: '1.25rem' }}>
                    Find affordable used textbooks, electronics, dorm essentials, or post your own items.
                  </p>
                  <Link
                    to="/marketplace"
                    className="btn btn-primary btn-block"
                    style={{ textAlign: 'center' }}
                  >
                    Open Marketplace
                  </Link>
                </div>

                <div className="card">
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Upcoming Campus Events</h3>
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-400)' }}>
                    <Calendar size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                    <p style={{ fontWeight: 600 }}>No registered events yet</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Campus events published by organizers will appear right here.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Organizer View */}
            {isOrganizer && (
              <>
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%)', borderColor: 'rgba(139, 92, 246, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Calendar size={20} color="var(--accent-purple)" />
                      <h3 style={{ fontSize: '1.2rem' }}>Organizer Management Center</h3>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
                    Create and publish campus events, manage attendee registration lists, and broadcast announcements.
                  </p>
                  <div className="grid-3">
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-purple)' }}>0</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>Events Hosted</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-300)' }}>0</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>Total Attendees</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>Active</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>Organizer Status</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>My Created Events</h3>
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-400)' }}>
                    <Calendar size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                    <p style={{ fontWeight: 600 }}>No events published yet</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Ready to host a campus event or workshop? Publish your first event soon.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Admin View */}
            {isAdmin && (
              <>
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <ShieldCheck size={20} color="var(--accent-amber)" />
                    <h3 style={{ fontSize: '1.2rem' }}>Campus Administration Console</h3>
                  </div>
                  <p style={{ fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
                    Full administrative governance over users, departments, and event approvals across campus.
                  </p>
                  <div className="grid-3">
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>Admin</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>Access Level</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>Active</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>System Health</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Enabled</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>Audit Logs</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
