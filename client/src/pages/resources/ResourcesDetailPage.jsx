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

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Back Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
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

        {/* RIGHT COLUMN: Sticky Action Card (Booking Form) */}
        <aside style={{ position: 'sticky', top: '2rem' }}>
          <div className="card liquid-glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
               Request Booking
            </h3>
            
            {user && resource.createdBy && (resource.createdBy === user.id || resource.createdBy._id === user.id || resource.createdBy.id === user.id) ? (
              <Alert type="info" message="You are the organizer of this resource and cannot book it yourself." />
            ) : resource.status !== 'Available' ? (
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
        </aside>
      </div>
    </div>
  );
};
