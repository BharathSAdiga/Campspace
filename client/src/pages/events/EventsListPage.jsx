import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Search,
  Filter,
  Sparkles,
  ArrowUpDown,
  GraduationCap,
  Briefcase,
  Users,
  Trophy,
  BookOpen,
  Globe,
  Terminal,
  Palette,
  Tag,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from 'lucide-react';
import { eventService } from '../../services/event.service';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories', icon: Sparkles },
  { id: 'Tech & Hackathons', label: 'Tech & Hackathons', icon: Terminal },
  { id: 'Workshop & Seminar', label: 'Workshops', icon: BookOpen },
  { id: 'Career & Professional', label: 'Career', icon: Briefcase },
  { id: 'Academic', label: 'Academic', icon: GraduationCap },
  { id: 'Social & Mixer', label: 'Social & Mixers', icon: Users },
  { id: 'Sports & Recreation', label: 'Sports', icon: Trophy },
  { id: 'Cultural', label: 'Cultural', icon: Globe },
  { id: 'Arts & Performance', label: 'Arts', icon: Palette },
  { id: 'Other', label: 'Other', icon: Tag },
];

const DATE_PRESETS = [
  { id: 'ALL', label: 'Any Date' },
  { id: 'TODAY', label: 'Today' },
  { id: 'THIS_WEEK', label: 'Next 7 Days' },
  { id: 'THIS_MONTH', label: 'This Month' },
];

const SORT_OPTIONS = [
  { value: 'soonest', label: 'Happening Soonest' },
  { value: 'most_popular', label: 'Most Popular' },
  { value: 'newest', label: 'Recently Added' },
  { value: 'oldest', label: 'Oldest Added' },
];

export const EventsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state synced with URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
  const [datePreset, setDatePreset] = useState(searchParams.get('datePreset') || 'ALL');
  const [sort, setSort] = useState(searchParams.get('sort') || 'soonest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Data fetching state
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Compute startDate & endDate based on preset
  const computeDateRange = (preset) => {
    const now = new Date();
    if (preset === 'TODAY') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    if (preset === 'THIS_WEEK') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    if (preset === 'THIS_MONTH') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    return {};
  };

  // Sync state to URL
  const updateUrl = (newParams) => {
    const next = {
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(category !== 'ALL' ? { category } : {}),
      ...(datePreset !== 'ALL' ? { datePreset } : {}),
      ...(sort !== 'soonest' ? { sort } : {}),
      ...(page > 1 ? { page } : {}),
      ...newParams,
    };
    setSearchParams(next);
  };

  // Fetch events from backend API
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { startDate, endDate } = computeDateRange(datePreset);

    const query = {
      page,
      limit: 12,
      sort,
      status: 'ACTIVE',
    };

    if (search.trim()) query.search = search.trim();
    if (category && category !== 'ALL') query.category = category;
    if (startDate) query.startDate = startDate;
    if (endDate) query.endDate = endDate;

    try {
      const response = await eventService.getEvents(query);
      setEvents(response.data || []);
      if (response.pagination) {
        setPagination({
          page: response.pagination.page || page,
          limit: response.pagination.limit || 12,
          total: response.total || response.count || 0,
          totalPages: response.pagination.pages || response.pagination.totalPages || 1,
          hasNextPage: !!(response.pagination.hasNext || response.pagination.hasNextPage),
          hasPrevPage: !!(response.pagination.hasPrev || response.pagination.hasPrevPage),
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch campus events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [search, category, datePreset, sort, page]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateUrl({ search: search.trim(), page: 1 });
  };

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    setPage(1);
    updateUrl({ category: catId, page: 1 });
  };

  const handleDatePresetSelect = (presetId) => {
    setDatePreset(presetId);
    setPage(1);
    updateUrl({ datePreset: presetId, page: 1 });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    setPage(1);
    updateUrl({ sort: newSort, page: 1 });
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('ALL');
    setDatePreset('ALL');
    setSort('soonest');
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination.totalPages && newPage > pagination.totalPages)) return;
    setPage(newPage);
    updateUrl({ page: newPage });
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  const isFiltered = search.trim() !== '' || category !== 'ALL' || datePreset !== 'ALL' || sort !== 'soonest';

  return (
    <div className="events-page" style={{ paddingBottom: '4rem' }}>
      {/* 1. Header Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(8, 12, 20, 0.9) 100%)',
          backdropFilter: 'var(--liquid-glass-blur)',
          WebkitBackdropFilter: 'var(--liquid-glass-blur)',
          borderBottom: '1px solid var(--border-subtle)',
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
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#93c5fd',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Sparkles size={12} /> Campus Life & Activities
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Campus Events & Workshops
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.4rem', margin: 0 }}>
                Discover student activities, tech hackathons, career workshops, guest seminars, and club meetups.
              </p>
            </div>

            {/* Quick Refresh CTA */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => loadEvents()}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                title="Refresh event listings"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
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
                  placeholder="Search by event title, guest speaker, venue, topic..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', fontSize: '0.9375rem', height: '44px' }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                      updateUrl({ search: '', page: 1 });
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
                      fontSize: '0.8125rem',
                    }}
                    aria-label="Clear search query"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <Button type="submit" variant="secondary" style={{ height: '44px', padding: '0 1.25rem' }}>
                Search
              </Button>
            </form>
          </div>

          {/* Categories Horizontal Pill Selector */}
          <div
            className="category-pill-container"
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingTop: '1.25rem',
              paddingBottom: '0.5rem',
              scrollbarWidth: 'none',
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
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
                    fontWeight: isSelected ? '700' : '500',
                    border: isSelected ? '1px solid rgba(96, 165, 250, 0.5)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.22)' : 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: isSelected ? '#93c5fd' : 'var(--text-secondary)',
                    boxShadow: isSelected ? '0 0 16px -2px rgba(59, 130, 246, 0.35)' : 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={14} color={isSelected ? '#60a5fa' : 'currentColor'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Filters & Sort Bar */}
      <div className="container" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Left: Date Presets & Filter Summary */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '600' }}>
              <Calendar size={15} />
              <span>Date:</span>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {DATE_PRESETS.map((preset) => {
                const isSelected = datePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleDatePresetSelect(preset.id)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.775rem',
                      fontWeight: isSelected ? '700' : '500',
                      border: isSelected ? '1px solid rgba(96, 165, 250, 0.45)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                      color: isSelected ? '#93c5fd' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Clear Filters (if filtered) */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.775rem', color: '#f87171', padding: '0.2rem 0.5rem' }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* Right: Sort Dropdown & Event Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {!isLoading && `${pagination.total} ${pagination.total === 1 ? 'event' : 'events'}`}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                value={sort}
                onChange={handleSortChange}
                className="form-input"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', height: '36px', width: 'auto' }}
                aria-label="Sort events"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content: States & Event Grid */}
      <div className="container">
        {/* Error State */}
        {error && (
          <div style={{ marginBottom: '1.5rem' }}>
            <Alert type="error" message={error} />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => loadEvents()}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <Spinner text="Finding upcoming campus events..." />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && events.length === 0 && (
          <EmptyState
            title="No Events Found"
            description={
              isFiltered
                ? "No campus events matched your current filters. Try selecting 'Any Date', removing your search query, or switching categories."
                : 'There are currently no active events scheduled on campus. Check back soon for upcoming hackathons, club sessions, and workshops.'
            }
            icon={<Calendar size={32} />}
            action={
              isFiltered ? (
                <Button variant="primary" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              ) : null
            }
          />
        )}

        {/* Success Grid */}
        {!isLoading && !error && events.length > 0 && (
          <>
            {/* Upcoming Events Heading */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Upcoming Campus Events
              </h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Showing {events.length} of {pagination.total} listings
              </span>
            </div>

            <div className="grid-3">
              {events.map((evt) => (
                <EventCard key={evt.id || evt._id} event={evt} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '3rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: p === page ? '700' : '500',
                        border: p === page ? '1px solid rgba(96, 165, 250, 0.5)' : '1px solid var(--border-subtle)',
                        backgroundColor: p === page ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                        color: p === page ? '#93c5fd' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsListPage;
