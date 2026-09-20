import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  Shield,
  Plus,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  UserPlus,
  LogOut,
  Edit,
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  Share2,
  Compass,
  Code,
  Palette,
  Trophy,
  Globe,
  Tag,
  Check,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clubService } from '../../services';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';

const CATEGORIES = [
  { id: 'All', label: 'All Organizations', icon: Compass },
  { id: 'Technology', label: 'Technology & Code', icon: Code },
  { id: 'Arts', label: 'Arts & Design', icon: Palette },
  { id: 'Sports', label: 'Sports & Athletics', icon: Trophy },
  { id: 'Cultural', label: 'Cultural & Heritage', icon: Globe },
  { id: 'Academic', label: 'Academic & Research', icon: BookOpen },
  { id: 'Social', label: 'Social & Impact', icon: Users },
  { id: 'Other', label: 'Special Interest', icon: Tag },
];

const getCategoryColor = (cat) => {
  switch (cat) {
    case 'Technology':
      return { gradient: 'linear-gradient(135deg, rgba(255, 138, 61, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)', text: '#ff8a3d' };
    case 'Arts':
      return { gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)', text: '#ec4899' };
    case 'Sports':
      return { gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)', text: '#22c55e' };
    case 'Cultural':
      return { gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)', text: '#f59e0b' };
    case 'Academic':
      return { gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)', text: '#3b82f6' };
    default:
      return { gradient: 'linear-gradient(135deg, rgba(255, 138, 61, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)', text: '#ff8a3d' };
  }
};

// --------------------------------------------------------
// CLUB CARD COMPONENT
// --------------------------------------------------------
const ClubCard = ({ club, onClick }) => {
  const { id, _id, name, description, category, coordinator, members = [] } = club;
  const clubId = id || _id;
  const colorTheme = getCategoryColor(category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <div
        onClick={onClick}
        className="card liquid-glass-card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          cursor: 'pointer',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Banner Graphic */}
        <div
          style={{
            height: '120px',
            background: colorTheme.gradient,
            position: 'relative',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--liquid-glass-border)',
          }}
        >
          <span
            className="liquid-glass-pill"
            style={{
              padding: '0.3rem 0.75rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}
          >
            {category}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              background: 'var(--liquid-glass-bg)',
              padding: '0.3rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid var(--liquid-glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Users size={13} color="var(--accent-orange)" />
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '0.6rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            {name}
          </h3>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>

          {/* Footer Metadata */}
          <div
            style={{
              borderTop: '1px solid var(--liquid-glass-border)',
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Shield size={14} color="var(--accent-orange)" />
              <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {coordinator?.name || 'Coordinator'}
              </span>
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--accent-orange)',
              }}
            >
              Explore <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --------------------------------------------------------
// CLUBS LIST PAGE
// --------------------------------------------------------
export const ClubsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');

  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadClubs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = {};
      if (search.trim()) query.search = search.trim();
      if (category !== 'All' && category !== 'All Categories') query.category = category;

      const response = await clubService.getClubs(query);
      setClubs(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch campus clubs.');
    } finally {
      setIsLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

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
    <div className="clubs-page" style={{ paddingBottom: '4rem' }}>
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
                  <span className="orange-dot" /> Verified Student Societies
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Campus Clubs & Organizations
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.4rem', margin: 0 }}>
                Discover technical guilds, creative collectives, competitive sports leagues, and cultural communities.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {user && (
                <Link
                  to="/clubs/my-clubs"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backdropFilter: 'blur(12px)' }}
                >
                  <Award size={16} color="var(--accent-orange)" />
                  <span>My Clubs</span>
                </Link>
              )}
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <Link
                  to="/clubs/create"
                  className="btn btn-liquid-orange"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Plus size={18} />
                  <span>Register Club</span>
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
                  placeholder="Search clubs by name, mission, keywords..."
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
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isActive ? 'var(--accent-orange)' : 'var(--liquid-glass-bg)',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    border: isActive
                      ? '1px solid var(--accent-orange)'
                      : '1px solid var(--liquid-glass-border)',
                    boxShadow: isActive ? '0 4px 14px rgba(255, 138, 61, 0.3)' : 'none',
                  }}
                >
                  <Icon size={14} color={isActive ? '#ffffff' : 'var(--accent-orange)'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: '1.5rem' }} />}

        {isLoading ? (
          <div style={{ padding: '6rem 0', textAlign: 'center' }}>
            <Spinner />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Loading campus organizations...
            </p>
          </div>
        ) : clubs.length === 0 ? (
          <EmptyState
            title="No Clubs Discovered"
            description="No student organizations matched your search criteria. Try a different keyword or category."
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
                Showing <strong style={{ color: 'var(--text-primary)' }}>{clubs.length}</strong> registered{' '}
                {clubs.length === 1 ? 'organization' : 'organizations'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {clubs.map((club) => (
                <ClubCard
                  key={club.id || club._id}
                  club={club}
                  onClick={() => navigate(`/clubs/${club.id || club._id}`)}
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
// CLUB DETAIL PAGE
// --------------------------------------------------------
export const ClubsDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchClub = useCallback(async () => {
    try {
      const response = await clubService.getClubById(id);
      setClub(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch club details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  const handleJoinLeave = async (action) => {
    if (!user) {
      navigate('/login', { state: { from: `/clubs/${id}` } });
      return;
    }

    setIsProcessing(true);
    try {
      if (action === 'join') {
        await clubService.joinClub(id);
      } else {
        await clubService.leaveClub(id);
      }
      await fetchClub();
    } catch (err) {
      alert(err.message || `Failed to ${action} club`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
  if (!club) return <EmptyState title="Club Not Found" />;

  const isMember = user && club.members?.some((m) => m.id === user.id || m._id === user.id || m === user.id);
  const isCoordinator = user && (club.coordinator?.id === user.id || club.coordinator?._id === user.id || club.coordinator === user.id);
  const colorTheme = getCategoryColor(club.category);

  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Back Link */}
        <Link
          to="/clubs"
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
          <ArrowLeft size={16} /> Back to Organizations
        </Link>

        {/* Hero Header Glass Card */}
        <div
          className="card liquid-glass-card"
          style={{
            padding: 0,
            overflow: 'hidden',
            marginBottom: '2rem',
            border: '1px solid var(--liquid-glass-border)',
          }}
        >
          <div
            style={{
              height: '160px',
              background: colorTheme.gradient,
              position: 'relative',
              padding: '2rem',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <span
              className="liquid-glass-pill"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.35rem 0.85rem',
              }}
            >
              {club.category}
            </span>
          </div>

          <div
            style={{
              padding: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge-orange">{club.category}</span>
                {isCoordinator && <span className="badge-outline">You are Coordinator</span>}
                {isMember && !isCoordinator && <span className="badge-outline">Active Member</span>}
              </div>
              <h1
                style={{
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  margin: '0 0 0.5rem',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em',
                }}
              >
                {club.name}
              </h1>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={16} color="var(--accent-orange)" /> {club.members?.length || 0} Registered Members
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={16} color="var(--accent-orange)" /> Coordinator: {club.coordinator?.name || 'Faculty / Student Lead'}
                </span>
              </div>
            </div>

            {/* Actions Cockpit */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleShare}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {copiedLink ? <Check size={16} color="var(--accent-orange)" /> : <Share2 size={16} />}
                <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
              </button>

              {isCoordinator && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/clubs/${id}/edit`)}
                  icon={<Edit size={16} />}
                >
                  Edit Club Settings
                </Button>
              )}

              {!isCoordinator && (
                isMember ? (
                  <Button
                    variant="outline"
                    onClick={() => handleJoinLeave('leave')}
                    isLoading={isProcessing}
                    icon={<LogOut size={16} />}
                  >
                    Leave Club
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleJoinLeave('join')}
                    disabled={isProcessing}
                    className="btn btn-liquid-orange"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <UserPlus size={16} />
                    <span>{isProcessing ? 'Processing...' : 'Join Organization'}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Two-Column Specification & Roster */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Mission & Overview */}
          <div className="card liquid-glass-card" style={{ padding: '2rem' }}>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-primary)',
              }}
            >
              <BookOpen size={18} color="var(--accent-orange)" /> Mission & Overview
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {club.description}
            </p>
          </div>

          {/* Coordinator & Membership Info */}
          <div className="card liquid-glass-card" style={{ padding: '2rem' }}>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-primary)',
              }}
            >
              <Award size={18} color="var(--accent-orange)" /> Leadership & Structure
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--liquid-glass-border)',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Club Coordinator
                </span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                  {club.coordinator?.name || 'Lead Officer'}
                </div>
                {club.coordinator?.email && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {club.coordinator.email}
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--liquid-glass-border)',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Community Status
                </span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                  Open for Student Enrollment
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  All verified campus students can join and attend guild meetings.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------
// CLUBS CREATE & EDIT FORM PAGE
// --------------------------------------------------------
export const ClubsFormPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      const fetchClub = async () => {
        try {
          const response = await clubService.getClubById(id);
          setFormData({
            name: response.data.name,
            description: response.data.description,
            category: response.data.category || 'Technology',
          });
        } catch (err) {
          setError(err.message || 'Failed to fetch club data');
        } finally {
          setIsLoading(false);
        }
      };
      fetchClub();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      let response;
      if (isEdit) {
        response = await clubService.updateClub(id, formData);
      } else {
        response = await clubService.createClub(formData);
      }
      navigate(`/clubs/${response.data.id || id}`);
    } catch (err) {
      setError(err.message || `Failed to ${isEdit ? 'update' : 'create'} club.`);
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <Spinner />
      </div>
    );

  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '780px', paddingTop: '2.5rem' }}>
        {/* Back Link */}
        <Link
          to={isEdit ? `/clubs/${id}` : '/clubs'}
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
                <span className="orange-dot" /> {isEdit ? '[UPDATE // GUILD SPEC]' : '[NEW REGISTRATION // CAMPUS GUILD]'}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
              {isEdit ? 'Update Organization' : 'Register Campus Club'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
              {isEdit
                ? 'Modify guild details, category classification, and mission description.'
                : 'Establish a new student society, technical community, or athletics collective.'}
            </p>
          </div>

          {error && <Alert type="error" message={error} style={{ marginBottom: '1.5rem' }} />}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Club / Organization Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Autonomous Drone Racing Club"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Category Classification *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                style={{ cursor: 'pointer' }}
              >
                {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Mission & Description *
              </label>
              <textarea
                name="description"
                required
                rows={6}
                placeholder="Detail the club's activities, meeting times, project goals, and membership benefits..."
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
                onClick={() => navigate(isEdit ? `/clubs/${id}` : '/clubs')}
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
                <Sparkles size={16} />
                <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Organization' : 'Create Organization'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ClubsCreatePage = () => <ClubsFormPage isEdit={false} />;
export const ClubsEditPage = () => <ClubsFormPage isEdit={true} />;

// --------------------------------------------------------
// MY CLUBS PAGE
// --------------------------------------------------------
export const ClubsMyClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadClubs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await clubService.getMyClubs();
      setClubs(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your clubs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

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
                  <span className="orange-dot" /> Guild Affiliations
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                My Clubs & Societies
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem', margin: 0 }}>
                Organizations and societies you have joined or coordinate across the campus.
              </p>
            </div>

            <Link to="/clubs" className="btn btn-secondary">
              Browse Directory
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
        ) : clubs.length === 0 ? (
          <EmptyState
            title="No Active Club Memberships"
            description="You have not joined any campus student organizations yet."
            action={
              <Link to="/clubs" className="btn btn-liquid-orange">
                Browse Campus Clubs
              </Link>
            }
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {clubs.map((club) => (
              <ClubCard
                key={club.id || club._id}
                club={club}
                onClick={() => navigate(`/clubs/${club.id || club._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
