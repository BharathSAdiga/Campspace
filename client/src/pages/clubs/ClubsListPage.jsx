import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Code,
  Music,
  Activity,
  Heart,
  Globe,
  MoreHorizontal
} from 'lucide-react';
import clubService from '../../services/club.service';
import { ClubCard } from '../../components/clubs/ClubCard';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: Globe },
  { id: 'Academic', label: 'Academic', icon: BookOpen },
  { id: 'Cultural', label: 'Cultural', icon: Heart },
  { id: 'Sports', label: 'Sports', icon: Activity },
  { id: 'Technology', label: 'Technology', icon: Code },
  { id: 'Arts', label: 'Arts', icon: Music },
  { id: 'Social', label: 'Social', icon: Users },
  { id: 'Other', label: 'Other', icon: MoreHorizontal },
];

export const ClubsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Query state derived from search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Data fetching state
  const [clubs, setClubs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    count: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clubs from server using active query parameters
  const loadClubs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = {
      page,
      limit: 12,
    };

    if (search.trim()) query.search = search.trim();
    if (category && category !== 'All') query.category = category;

    try {
      const response = await clubService.getClubs(query);
      setClubs(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      } else {
        // Mock pagination if backend doesn't support it yet
        setPagination({
           page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false 
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch campus clubs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [search, category, page]);

  // Sync state with URL search params
  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  // Sync back to URL search params
  const updateUrlParams = (newParams) => {
    const next = {
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(category !== 'All' ? { category } : {}),
      ...(page > 1 ? { page } : {}),
      ...newParams,
    };
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateUrlParams({ search: search.trim(), page: 1 });
  };

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    setPage(1);
    updateUrlParams({ category: catId, page: 1 });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setPage(1);
    setSearchParams({});
  };

  const isAnyFilterActive = useMemo(() => {
    return search.trim() !== '' || category !== 'All';
  }, [search, category]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  return (
    <div className="marketplace-page" style={{ paddingBottom: '4rem' }}>
      {/* 1. Header Section */}
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
                    boxShadow: 'none',
                  }}
                >
                  <span className="orange-dot" /> Official Campus Clubs
                </span>
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '850', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Discover Communities
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.6 }}>
                Explore student organizations, join clubs, and connect with peers sharing your interests.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {user && (
                <Link to="/clubs/my-clubs" className="btn btn-secondary liquid-glass-btn">
                  My Clubs
                </Link>
              )}
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <Link to="/clubs/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Register Club
                </Link>
              )}
            </div>
          </div>

          {/* Integrated Search Bar inside Header */}
          <div style={{ marginTop: '2rem', maxWidth: '800px' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search clubs, keywords, or coordinators..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 2.75rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--liquid-glass-border)',
                    backgroundColor: 'var(--bg-card)',
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s',
                  }}
                />
              </div>
              <Button type="submit" variant="primary" style={{ padding: '0 1.5rem' }}>
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Sidebar: Filters */}
          <aside
            style={{
              position: 'sticky',
              top: '2rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={16} /> Filters
              </h3>
              {isAnyFilterActive && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-orange)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0,
                  }}
                  title="Reset all filters"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: category === cat.id ? 'var(--btn-primary-bg)' : 'transparent',
                      color: category === cat.id ? 'var(--btn-primary-text)' : 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: category === cat.id ? '600' : '400',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (category !== cat.id) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      if (category !== cat.id) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <cat.icon size={16} style={{ color: category === cat.id ? 'inherit' : 'var(--text-muted)' }} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Side: Results */}
          <main>
            {/* Active Filters Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{pagination.total || clubs.length}</strong> clubs
                {category !== 'All' && <span> in <strong>{category}</strong></span>}
                {search && <span> matching "<strong>{search}</strong>"</span>}
              </div>
            </div>

            {/* Content States */}
            {isLoading ? (
              <div style={{ padding: '6rem 0', textAlign: 'center' }}>
                <Spinner text="Finding clubs..." />
              </div>
            ) : error ? (
              <ErrorState 
                title="Something went wrong" 
                message={error} 
                onRetry={loadClubs} 
              />
            ) : clubs.length === 0 ? (
              <EmptyState 
                title="No Clubs Found" 
                description="We couldn't find any clubs matching your current filters. Try removing some filters or searching for something else."
                action={<Button variant="outline" onClick={handleResetFilters}>Clear All Filters</Button>}
              />
            ) : (
              <>
                {/* Product Grid */}
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '1.5rem' 
                  }}
                >
                  {clubs.map((club) => (
                    <div key={club.id}>
                      <ClubCard club={club} />
                    </div>
                  ))}
                </div>

                {/* Pagination Footer */}
                {pagination.totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '4rem' }}>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrevPage}
                      style={{ padding: '0.5rem' }}
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    
                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                      style={{ padding: '0.5rem' }}
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};
