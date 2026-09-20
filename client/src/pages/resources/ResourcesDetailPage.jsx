import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Building2,
  FlaskConical,
  Cpu,
  Dumbbell,
  Sparkles,
  ShieldCheck,
  Layers,
  Trash2,
  Shield,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import resourceService from '../../services/resource.service';
import bookingService from '../../services/booking.service';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Alert } from '../../components/common/Alert';
import { CustomDropdown } from '../../components/common/CustomDropdown';

const STATUS_OPTIONS = [
  { id: 'Available', label: 'Available (Open for bookings)', icon: CheckCircle },
  { id: 'Unavailable', label: 'Unavailable (Bookings blocked)', icon: XCircle },
  { id: 'Maintenance', label: 'Maintenance (Under repair)', icon: AlertTriangle },
];

const CATEGORY_CONFIG = {
  Room: {
    label: 'Campus Room & Hall',
    tagline: 'Lecture halls, conference rooms, auditoriums & collaborative spaces',
    Icon: Building2,
    accentColor: '#ff8a3d',
    glowColor: 'rgba(255, 138, 61, 0.22)',
    gradient: 'linear-gradient(135deg, rgba(255, 138, 61, 0.12) 0%, rgba(245, 110, 25, 0.03) 100%)',
    badgeText: 'FACILITY // ROOM',
  },
  Laboratory: {
    label: 'Science & Engineering Lab',
    tagline: 'Research stations, specialized apparatus & experimental facilities',
    Icon: FlaskConical,
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.22)',
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.14) 0%, rgba(99, 102, 241, 0.03) 100%)',
    badgeText: 'RESEARCH // LAB',
  },
  Equipment: {
    label: 'Hardware & Technical Gear',
    tagline: 'Specialized lab devices, test benches, kits & electronic tools',
    Icon: Cpu,
    accentColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.22)',
    gradient: 'linear-gradient(135deg, rgba(52, 211, 153, 0.14) 0%, rgba(16, 185, 129, 0.03) 100%)',
    badgeText: 'HARDWARE // GEAR',
  },
  Sports: {
    label: 'Athletics & Recreation',
    tagline: 'Sports courts, recreation grounds, fitness halls & physical gear',
    Icon: Dumbbell,
    accentColor: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.22)',
    gradient: 'linear-gradient(135deg, rgba(244, 114, 182, 0.14) 0%, rgba(239, 68, 68, 0.03) 100%)',
    badgeText: 'ATHLETICS // COURT',
  },
  Other: {
    label: 'General Campus Asset',
    tagline: 'Multi-purpose campus resource, common utility & shared equipment',
    Icon: Sparkles,
    accentColor: '#ff8a3d',
    glowColor: 'rgba(255, 138, 61, 0.22)',
    gradient: 'linear-gradient(135deg, rgba(255, 138, 61, 0.12) 0%, rgba(168, 85, 247, 0.03) 100%)',
    badgeText: 'RESOURCE // UTILITY',
  },
};

const ResourceCategoryBanner = ({ category, location, capacity }) => {
  const meta = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
  const { Icon, accentColor, glowColor, gradient, label, tagline, badgeText } = meta;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        background: gradient,
        border: '1px solid var(--liquid-glass-border)',
        overflow: 'hidden',
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--liquid-glass-shadow)',
      }}
    >
      {/* Ambient background glow circle */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: glowColor,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative large watermark icon */}
      <div
        style={{
          position: 'absolute',
          right: '1.5rem',
          bottom: '-1.5rem',
          opacity: 0.08,
          pointerEvents: 'none',
          transform: 'rotate(-10deg)',
          color: accentColor,
        }}
      >
        <Icon size={200} strokeWidth={1.5} />
      </div>

      {/* Top Bar inside Banner */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${accentColor}40`,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: accentColor,
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              display: 'inline-block',
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          {badgeText}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <ShieldCheck size={14} style={{ color: accentColor }} />
          <span>VERIFIED CAMPUS ASSET</span>
        </div>
      </div>

      {/* Main Category Info */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            background: `linear-gradient(135deg, ${accentColor}25 0%, rgba(0,0,0,0.35) 100%)`,
            border: `1.5px solid ${accentColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
            flexShrink: 0,
            boxShadow: `0 8px 24px ${accentColor}20`,
          }}
        >
          <Icon size={32} strokeWidth={2} />
        </div>

        <div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '0.2rem',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}
          >
            {tagline}
          </div>
        </div>
      </div>

      {/* Bottom Specs Strip */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--liquid-glass-border)',
        }}
      >
        {location && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <MapPin size={14} style={{ color: accentColor }} />
            <span>{location}</span>
          </div>
        )}
        {capacity && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <Users size={14} style={{ color: accentColor }} />
            <span>Up to {capacity} People</span>
          </div>
        )}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Layers size={13} />
          <span>Active Reservation System</span>
        </div>
      </div>
    </div>
  );
};

export const ResourcesDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccessMessage, setStatusSuccessMessage] = useState('');
  
  // Booking Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchResource = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await resourceService.getResourceById(id);
        if (isMounted) {
          setResource(data.data || data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch resource details.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchResource();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/resources/${id}` } });
      return;
    }

    setIsBooking(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      await bookingService.createBooking({
        resource: id,
        date,
        startTime,
        endTime,
        purpose
      });
      setBookingSuccess(true);
      setDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
    } catch (err) {
      setBookingError(err.message || 'Failed to request booking.');
    } finally {
      setIsBooking(false);
    }
  };

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'Available':
        return 'success';
      case 'Unavailable':
        return 'danger';
      case 'Maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <Spinner text="Loading resource details..." />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <EmptyState
          title="Resource Not Found"
          description={error || "The resource you're looking for doesn't exist or has been removed."}
          action={
            <Link to="/resources" className="btn btn-primary">
              <ArrowLeft size={16} style={{ marginRight: '0.35rem' }} /> Back to Resources
            </Link>
          }
        />
      </div>
    );
  }

  const extractId = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (obj._id) return obj._id.toString();
    if (obj.id) return obj.id.toString();
    return '';
  };

  const currentUserId = extractId(user);
  const createdById = extractId(resource?.createdBy);
  const userEmail = user?.email?.toLowerCase();
  const creatorEmail = (typeof resource?.createdBy === 'object' ? resource?.createdBy?.email : '')?.toLowerCase();

  const isOwner = Boolean(
    (currentUserId && createdById && currentUserId === createdById) ||
    (userEmail && creatorEmail && userEmail === creatorEmail) ||
    (user && resource?.createdBy && (
      resource.createdBy === user.id ||
      resource.createdBy === user._id ||
      resource.createdBy._id === user.id ||
      resource.createdBy._id === user._id ||
      resource.createdBy.id === user.id ||
      resource.createdBy.id === user._id
    ))
  );

  const isUserAdmin = user?.role === 'admin';
  const canManage = isOwner || isUserAdmin;

  const handleStatusChange = async (newStatus) => {
    if (!newStatus || newStatus === resource?.status) return;
    setIsUpdatingStatus(true);
    setStatusSuccessMessage('');
    try {
      await resourceService.updateResource(id, { status: newStatus });
      setResource((prev) => ({ ...prev, status: newStatus }));
      setStatusSuccessMessage(`Status switched to "${newStatus}"`);
      setTimeout(() => setStatusSuccessMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update resource status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteResource = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${resource?.name}"? This action cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await resourceService.deleteResource(id);
      navigate('/resources');
    } catch (err) {
      alert(err.message || 'Failed to delete resource');
      setIsDeleting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Back Breadcrumb & Management Actions */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          to="/resources"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={16} /> Back to Resources
        </Link>

        {canManage && (
          <button
            type="button"
            onClick={handleDeleteResource}
            disabled={isDeleting}
            className="btn btn-outline btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderColor: 'rgba(239, 68, 68, 0.45)',
              color: 'var(--danger-500, #ef4444)',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
            }}
          >
            <Trash2 size={14} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Resource'}</span>
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Badge variant="default">{resource.category}</Badge>
              <Badge variant={getStatusBadgeVariant(resource.status)}>{resource.status}</Badge>

              {canManage && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Switch Status:</span>
                  <div style={{ minWidth: '190px' }}>
                    <CustomDropdown
                      options={STATUS_OPTIONS}
                      value={resource.status}
                      onChange={handleStatusChange}
                      size="sm"
                      disabled={isUpdatingStatus}
                    />
                  </div>
                </div>
              )}
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '850', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1rem' }}>
              {resource.name}
            </h1>
          </div>

          {/* Smart Category Banner */}
          <ResourceCategoryBanner
            category={resource.category}
            location={resource.location}
            capacity={resource.capacity}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="card liquid-glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '50%' }}>
                  <MapPin size={24} style={{ color: 'var(--accent-orange)' }} />
               </div>
               <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Location</div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{resource.location}</div>
               </div>
            </div>
            <div className="card liquid-glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '50%' }}>
                  <Users size={24} style={{ color: 'var(--accent-orange)' }} />
               </div>
               <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Capacity</div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{resource.capacity ? `${resource.capacity} People` : 'N/A'}</div>
               </div>
            </div>
          </div>

          {/* Description Section */}
          <section className="card liquid-glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: 'var(--text-secondary)' }} /> Description
            </h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
              {resource.description}
            </div>
          </section>
          
          {resource.facilities?.length > 0 && (
            <section className="card liquid-glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--text-secondary)' }} /> Facilities
              </h2>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {resource.facilities.map((f, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{f}</li>)}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Sticky Action Card */}
        <aside style={{ position: 'sticky', top: '2rem' }}>
          <div className="card liquid-glass-card" style={{ padding: '2rem' }}>
            {canManage ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Shield size={20} style={{ color: 'var(--accent-orange)' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    Organizer Controls
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  You uploaded this resource. Manage its availability status or remove this listing from campus.
                </p>

                {statusSuccessMessage && (
                  <div style={{ marginBottom: '1rem' }}>
                    <Alert type="success" message={statusSuccessMessage} />
                  </div>
                )}

                {/* Status Switcher Panel */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>Availability Status</span>
                    <Badge variant={getStatusBadgeVariant(resource.status)}>{resource.status}</Badge>
                  </div>
                  
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    Switch option to control whether students can reserve this resource:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {STATUS_OPTIONS.map((opt) => {
                      const isSelected = resource.status === opt.id;
                      const IconComp = opt.icon;
                      let activeBorder = 'var(--liquid-glass-border)';
                      let activeBg = 'var(--liquid-glass-bg)';
                      if (isSelected) {
                        if (opt.id === 'Available') {
                          activeBorder = 'rgba(52, 211, 153, 0.6)';
                          activeBg = 'rgba(52, 211, 153, 0.12)';
                        } else if (opt.id === 'Unavailable') {
                          activeBorder = 'rgba(239, 68, 68, 0.6)';
                          activeBg = 'rgba(239, 68, 68, 0.12)';
                        } else {
                          activeBorder = 'rgba(245, 158, 11, 0.6)';
                          activeBg = 'rgba(245, 158, 11, 0.12)';
                        }
                      }
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={isUpdatingStatus}
                          onClick={() => handleStatusChange(opt.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: `1.5px solid ${activeBorder}`,
                            backgroundColor: activeBg,
                            cursor: isUpdatingStatus ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'left',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <IconComp
                              size={16}
                              style={{
                                color:
                                  opt.id === 'Available'
                                    ? 'var(--success-500, #10b981)'
                                    : opt.id === 'Unavailable'
                                    ? 'var(--danger-500, #ef4444)'
                                    : 'var(--warning-500, #f59e0b)',
                              }}
                            />
                            <span style={{ fontWeight: isSelected ? '700' : '500', fontSize: '0.875rem' }}>
                              {opt.id}
                            </span>
                          </div>
                          {isSelected && (
                            <span style={{ fontSize: '0.725rem', fontWeight: '800', color: 'var(--accent-orange)' }}>
                              CURRENT
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Organizer Delete Action Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleDeleteResource}
                    disabled={isDeleting}
                    className="btn btn-outline btn-block"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem',
                      borderColor: 'rgba(239, 68, 68, 0.45)',
                      color: 'var(--danger-500, #ef4444)',
                      backgroundColor: 'rgba(239, 68, 68, 0.06)',
                      fontWeight: '600',
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                    <span>{isDeleting ? 'Deleting Resource...' : 'Delete Resource'}</span>
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                    Permanently removes this resource and blocks any further booking requests.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                   Request Booking
                </h3>
                
                {resource.status !== 'Available' ? (
                  <Alert type="warning" message="This resource is currently not available for booking." />
                ) : (
                  <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor="date" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Date</label>
                      <div style={{ position: 'relative' }}>
                        <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          id="date"
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="form-input"
                          style={{ paddingLeft: '2.75rem', backgroundColor: 'var(--bg-subtle)' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="startTime" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Start</label>
                        <div style={{ position: 'relative' }}>
                          <Clock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            id="startTime"
                            type="time"
                            required
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '2.25rem', backgroundColor: 'var(--bg-subtle)', paddingRight: '0.5rem' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="endTime" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>End</label>
                        <div style={{ position: 'relative' }}>
                          <Clock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            id="endTime"
                            type="time"
                            required
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '2.25rem', backgroundColor: 'var(--bg-subtle)', paddingRight: '0.5rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor="purpose" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Purpose</label>
                      <textarea
                        id="purpose"
                        placeholder="Why do you need this resource?"
                        required
                        rows={3}
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="form-input"
                        style={{ backgroundColor: 'var(--bg-subtle)', resize: 'vertical' }}
                      />
                    </div>
                    
                    {bookingError && <Alert type="error" message={bookingError} />}
                    {bookingSuccess && <Alert type="success" message="Booking request submitted successfully! It is now pending approval." />}
                    
                    <Button type="submit" variant="primary" fullWidth isLoading={isBooking} style={{ marginTop: '0.5rem', padding: '1rem' }}>
                      Submit Request
                    </Button>
                    {!user && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                        You will be asked to log in.
                      </p>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
