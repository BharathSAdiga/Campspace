import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Info,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Plus,
  BookOpen,
  Clock,
  Activity,
  FileText,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  Laptop,
  Building,
  Dumbbell,
  Tag,
  Check,
  AlertCircle,
  Trash2,
  Compass,
  ClipboardList,
  Edit,
  ShieldAlert,
  Home,
  Monitor,
  Package,
  Filter,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resourceService, bookingService } from '../../services';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';

const CATEGORIES = [
  { id: 'All', label: 'All Resources', icon: Layers },
  { id: 'Room', label: 'Study & Event Rooms', icon: Building },
  { id: 'Laboratory', label: 'Labs & Makerbays', icon: Cpu },
  { id: 'Equipment', label: 'Hardware & AV Gear', icon: Laptop },
  { id: 'Sports', label: 'Sports Courts & Gym', icon: Dumbbell },
  { id: 'Other', label: 'Other Spaces', icon: Tag },
];

const getResourceTheme = (cat) => {
  switch (cat) {
    case 'Room':
      return { gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(37, 99, 235, 0.1) 100%)', text: '#3b82f6' };
    case 'Laboratory':
      return { gradient: 'linear-gradient(135deg, rgba(255, 138, 61, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)', text: '#ff8a3d' };
    case 'Equipment':
      return { gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)', text: '#a855f7' };
    case 'Sports':
      return { gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)', text: '#22c55e' };
    default:
      return { gradient: 'linear-gradient(135deg, rgba(255, 138, 61, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%)', text: '#ff8a3d' };
  }
};

// --------------------------------------------------------
// RESOURCE CARD COMPONENT
// --------------------------------------------------------
const ResourceCard = ({ resource, onClick }) => {
  const { id, _id, name, description, category, location, capacity, facilities = [], status } = resource;
  const resourceId = id || _id;
  const isAvailable = status === 'Available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <div
        onClick={onClick}
        className="card liquid-glass-card product-card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          cursor: 'pointer',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
        }}
      >
        {/* Image Container (Marketplace Style) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '65%', // 16:10 aspect ratio
            backgroundColor: 'var(--bg-subtle)',
            overflow: 'hidden',
            borderBottom: '1px solid var(--liquid-glass-border)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              gap: '0.35rem',
            }}
          >
            <Compass size={32} strokeWidth={1.5} />
            <span style={{ fontSize: '0.75rem' }}>No photo available</span>
          </div>

          {/* Category Pill (Top-Left) */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 5 }}>
            <span
              className="liquid-glass-pill"
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.72rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              {category}
            </span>
          </div>

          {/* Status Badge (Bottom-Right) */}
          <div style={{ position: 'absolute', bottom: '0.65rem', right: '0.65rem', zIndex: 5 }}>
            <Badge variant={isAvailable ? 'success' : 'warning'} size="sm">
              {status}
            </Badge>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            {/* Top Info: Capacity & Location */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '850', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {capacity}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', marginLeft: '0.3rem' }}>
                  Capacity
                </span>
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                lineHeight: 1.35,
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={name}
            >
              {name}
            </h3>
          </div>

          {/* Footer: Location & Action */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--liquid-glass-border)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <MapPin size={14} style={{ flexShrink: 0, color: 'var(--accent-orange)' }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {location}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--btn-primary-bg)',
                    color: 'var(--btn-primary-text)',
                    border: '1px solid var(--liquid-glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                  }}
                >
                  R
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>Verified Space</span>
              </div>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                Reserve <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --------------------------------------------------------
// RESOURCES LIST PAGE
// --------------------------------------------------------
export const ResourcesListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');

  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = {};
      if (search.trim()) query.search = search.trim();
      if (category !== 'All' && category !== 'All Resources' && category !== 'All Categories') {
        query.category = category;
      }

      const response = await resourceService.getResources(query);
      setResources(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch campus resources.');
    } finally {
      setIsLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(category !== 'All' ? { category } : {}),
    });
  };

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    setSearchParams({
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(catId !== 'All' ? { category: catId } : {}),
    });
  };

  return (
    <div className="resources-page" style={{ paddingBottom: '4rem' }}>
      {/* 1. Liquid Glass Header Section (Theme matches Marketplace) */}
      <section
        style={{
          background: 'var(--liquid-glass-bg)',
          backdropFilter: 'var(--liquid-glass-blur)',
          WebkitBackdropFilter: 'var(--liquid-glass-blur)',
          borderBottom: '1px solid var(--liquid-glass-border)',
          padding: '2.5rem 0',
          position: 'relative',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--accent-orange)',
                    backgroundColor: 'var(--accent-orange-subtle)',
                    border: '1px solid var(--accent-orange-border)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span className="orange-dot" /> Spatial & Hardware Provisioning
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Campus Resources & Allocations
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.4rem', margin: 0 }}>
                Book study suites, AV conference auditoriums, 3D printing maker bays, and engineering lab spaces.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {user && (
                <Link
                  to="/resources/my-bookings"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backdropFilter: 'blur(12px)' }}
                >
                  <Clock size={16} color="var(--accent-orange)" />
                  <span>My Bookings</span>
                </Link>
              )}
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <Link
                  to="/resources/create"
                  className="btn btn-liquid-orange"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Plus size={18} />
                  <span>Add Resource</span>
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ marginTop: '1.75rem', maxWidth: '720px' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search resources by room number, hardware, equipment name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input"
                  style={{
                    paddingLeft: '2.5rem',
                    fontSize: '0.9375rem',
                    height: '44px',
                    background: 'var(--liquid-glass-bg)',
                    borderColor: 'var(--liquid-glass-border)',
                  }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setSearchParams({ ...(category !== 'All' ? { category } : {}) });
                    }}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <Button type="submit" variant="primary" style={{ height: '44px', px: '1.5rem' }}>
                Search
              </Button>
            </form>
          </div>

          {/* Category Filter Chips */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingTop: '1.25rem',
              paddingBottom: '0.25rem',
              scrollbarWidth: 'none',
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '9999px',
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? '700' : '500',
                    border: isActive ? '1px solid var(--accent-orange)' : '1px solid var(--liquid-glass-border)',
                    backgroundColor: isActive ? 'var(--accent-orange)' : 'var(--liquid-glass-bg)',
                    backdropFilter: 'var(--liquid-glass-blur)',
                    WebkitBackdropFilter: 'var(--liquid-glass-blur)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'var(--liquid-glass-shadow)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={14} color={isActive ? '#ffffff' : 'currentColor'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Filters & Sort Bar (Marketplace Style) */}
      <div className="container" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <div
          className="card liquid-glass-card"
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'var(--liquid-glass-bg)',
            backdropFilter: 'var(--liquid-glass-blur)',
            WebkitBackdropFilter: 'var(--liquid-glass-blur)',
            border: '1px solid var(--liquid-glass-border)',
            boxShadow: 'var(--liquid-glass-shadow)',
          }}
        >
          {/* Left: Filters Controls */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-orange)', fontSize: '0.8125rem', fontWeight: '600' }}>
              <Filter size={15} />
              <span>Filters:</span>
            </div>

            {/* Reset Active Filters Button */}
            {(search || category !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setSearchParams({});
                }}
                className="btn btn-ghost btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: 'var(--danger-500)',
                  fontSize: '0.8125rem',
                }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Sort Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowUpDown size={14} /> Sort:
            </span>
            <select
              className="form-input"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', height: '36px', width: 'auto' }}
              aria-label="Sort resources"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Status Count Label */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div>
            {!isLoading && (
              <span>
                Showing <strong>{resources.length}</strong> active resources
                {category !== 'All' && <span> in <em>{category}</em></span>}
                {search && <span> matching "<strong>{search}</strong>"</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: '1.5rem' }} />}

        {isLoading ? (
          <div style={{ padding: '6rem 0', textAlign: 'center' }}>
            <Spinner />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Loading campus allocations...
            </p>
          </div>
        ) : resources.length === 0 ? (
          <EmptyState
            title="No Resources Found"
            description="No campus facilities or equipment matched your criteria. Try adjusting your query."
            action={
              (search || category !== 'All') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch('');
                    setCategory('All');
                    setSearchParams({});
                  }}
                >
                  Clear All Filters
                </Button>
              )
            }
          />
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{resources.length}</strong> available{' '}
                {resources.length === 1 ? 'allocation' : 'allocations'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.id || resource._id}
                  resource={resource}
                  onClick={() => navigate(`/resources/${resource.id || resource._id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --------------------------------------------------------
// RESOURCE DETAIL & BOOKING PAGE
// --------------------------------------------------------
export const ResourcesDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Cockpit Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await resourceService.getResourceById(id);
        setResource(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch resource details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResource();
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
        purpose,
      });
      setBookingSuccess(true);
      setDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
    } catch (err) {
      setBookingError(err.message || 'Failed to submit reservation request.');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading)
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <Alert type="error" message={error} />
      </div>
    );
  if (!resource) return <EmptyState title="Resource Not Found" />;

  const theme = getResourceTheme(resource.category);
  const isAvailable = resource.status === 'Available';

  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Back Link */}
        <Link
          to="/resources"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} /> Back to Allocations
        </Link>

        {/* Two-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Column 1: Resource Telemetry & Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Hero Specs Card */}
            <div
              className="card liquid-glass-card"
              style={{
                padding: 0,
                overflow: 'hidden',
                border: '1px solid var(--liquid-glass-border)',
              }}
            >
              <div
                style={{
                  height: '140px',
                  background: theme.gradient,
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--liquid-glass-border)',
                }}
              >
                <span
                  className="liquid-glass-pill"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.85rem',
                  }}
                >
                  {resource.category}
                </span>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    border: isAvailable
                      ? '1px solid rgba(34, 197, 94, 0.4)'
                      : '1px solid rgba(245, 158, 11, 0.4)',
                    background: isAvailable
                      ? 'rgba(34, 197, 94, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                    color: isAvailable ? '#22c55e' : '#f59e0b',
                  }}
                >
                  {resource.status}
                </span>
              </div>

              <div style={{ padding: '2rem' }}>
                <h1
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    margin: '0 0 0.5rem',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {resource.name}
                </h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  {resource.description}
                </p>
              </div>
            </div>

            {/* Location & Capacity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card liquid-glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-orange)' }}>
                  <MapPin size={18} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Location Spec
                  </span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {resource.location}
                </div>
              </div>

              <div className="card liquid-glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-orange)' }}>
                  <Users size={18} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Max Capacity
                  </span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {resource.capacity ? `${resource.capacity} Attendees` : 'Open Allocation'}
                </div>
              </div>
            </div>

            {/* Facilities & Amenities Matrix */}
            {resource.facilities?.length > 0 && (
              <div className="card liquid-glass-card" style={{ padding: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Cpu size={18} color="var(--accent-orange)" /> Provisioned Equipment & Amenities
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {resource.facilities.map((fac, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.82rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '999px',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--liquid-glass-border)',
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                      }}
                    >
                      <Check size={13} color="var(--accent-orange)" /> {fac}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Booking Cockpit */}
          <div
            className="card liquid-glass-card"
            style={{
              padding: '2rem',
              position: 'sticky',
              top: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="liquid-glass-pill" style={{ padding: '0.2rem 0.65rem', fontSize: '0.72rem' }}>
                <span className="orange-dot" /> [TIME SLOT // ALLOCATION]
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
              Reserve This Resource
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Submit your desired date and hours. Approvals are synchronized in real time to avoid conflicting slots.
            </p>

            {!isAvailable ? (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <AlertCircle size={18} color="#f59e0b" /> Allocation Inactive
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  This resource is currently under scheduled maintenance and cannot accept reservations.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    Reservation Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                      End Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    Booking Purpose & Notes *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Specify meeting agenda, student group, or required equipment configuration..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {bookingError && <Alert type="error" message={bookingError} />}
                {bookingSuccess && (
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#22c55e', marginBottom: '0.25rem' }}>
                      <CheckCircle size={16} /> Request Submitted Successfully
                    </div>
                    <span>Your allocation request is pending organizer approval. Track it under My Bookings.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBooking}
                  className="btn btn-liquid-orange"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Calendar size={16} />
                  <span>{isBooking ? 'Validating Slot...' : 'Submit Reservation'}</span>
                </button>

                {!user && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                    You will be redirected to sign in before reserving.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------
// RESOURCES CREATE PAGE
// --------------------------------------------------------
export const ResourcesCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Room',
    location: '',
    capacity: '',
    status: 'Available',
    facilities: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const dataToSubmit = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : undefined,
        facilities: formData.facilities
          ? formData.facilities
              .split(',')
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
      };

      const response = await resourceService.createResource(dataToSubmit);
      navigate(`/resources/${response.data.id || response.data._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create campus resource.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '780px', paddingTop: '2.5rem' }}>
        {/* Back Link */}
        <Link
          to="/resources"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} /> Cancel and return
        </Link>

        <div className="card liquid-glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="liquid-glass-pill" style={{ padding: '0.2rem 0.65rem', fontSize: '0.72rem' }}>
                <span className="orange-dot" /> [NEW ALLOCATION // RESOURCE DEPLOYMENT]
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
              Add Campus Resource
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
              Register a new facility, technical hardware hub, or laboratory for campus reservation.
            </p>
          </div>

          {error && <Alert type="error" message={error} style={{ marginBottom: '1.5rem' }} />}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Resource / Space Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Advanced Robotics & IoT Lab"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  {['Room', 'Laboratory', 'Equipment', 'Sports', 'Other'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Operational Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Location / Room Spec *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Engineering Block B, Room 304"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Capacity (optional)
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  placeholder="e.g. 50"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Facilities & Hardware (comma separated)
              </label>
              <input
                type="text"
                name="facilities"
                placeholder="Dual Projectors, 3D Printers, High-Speed WiFi, Surround Sound"
                value={formData.facilities}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Description & Usage Guidelines *
              </label>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Describe access rules, hardware equipment instructions, key pickup procedures..."
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                marginTop: '1rem',
                borderTop: '1px solid var(--liquid-glass-border)',
                paddingTop: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/resources')}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-liquid-orange"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                <span>{isSubmitting ? 'Provisioning...' : 'Provision Resource'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------
// MY BOOKINGS PAGE
// --------------------------------------------------------
export const ResourcesMyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your bookings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await bookingService.cancelBooking(id);
      loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#22c55e',
            }}
          >
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
            }}
          >
            Pending Review
          </span>
        );
      case 'Rejected':
        return (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
            }}
          >
            Rejected
          </span>
        );
      default:
        return (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid var(--liquid-glass-border)',
              background: 'var(--bg-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section
        style={{
          background: 'var(--liquid-glass-bg)',
          backdropFilter: 'var(--liquid-glass-blur)',
          WebkitBackdropFilter: 'var(--liquid-glass-blur)',
          borderBottom: '1px solid var(--liquid-glass-border)',
          padding: '2.5rem 0',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--accent-orange)',
                    backgroundColor: 'var(--accent-orange-subtle)',
                    border: '1px solid var(--accent-orange-border)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span className="orange-dot" /> Active Reservations
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                My Resource Bookings
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem', margin: 0 }}>
                Review and manage your scheduled laboratory, room, and equipment time allocations.
              </p>
            </div>

            <Link to="/resources" className="btn btn-secondary">
              Browse Allocations
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: '1.5rem' }} />}

        {isLoading ? (
          <div style={{ padding: '6rem 0', textAlign: 'center' }}>
            <Spinner />
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No Active Reservations"
            description="You have not requested any campus facility or equipment bookings yet."
            action={
              <Link to="/resources" className="btn btn-liquid-orange">
                Explore & Book Resources
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((booking) => {
              const bookingId = booking.id || booking._id;
              const resId = booking.resource?.id || booking.resource?._id || booking.resource;

              return (
                <div
                  key={bookingId}
                  className="card liquid-glass-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <Link
                        to={`/resources/${resId}`}
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        {booking.resource?.name || 'Campus Resource'}
                      </Link>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '1.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.88rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={15} color="var(--accent-orange)" />
                        {new Date(booking.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={15} color="var(--accent-orange)" />
                        {booking.startTime} – {booking.endTime}
                      </span>
                      {booking.resource?.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={15} color="var(--accent-orange)" />
                          {booking.resource.location}
                        </span>
                      )}
                    </div>

                    {booking.purpose && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.6rem 0 0' }}>
                        <strong>Purpose:</strong> {booking.purpose}
                      </p>
                    )}
                  </div>

                  <div>
                    {(booking.status === 'Pending' || booking.status === 'Approved') && (
                      <button
                        type="button"
                        onClick={() => handleCancel(bookingId)}
                        className="btn btn-secondary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.82rem',
                          color: '#ef4444',
                        }}
                      >
                        <Trash2 size={14} /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
