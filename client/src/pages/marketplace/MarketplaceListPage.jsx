import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  BookOpen,
  Laptop,
  Armchair,
  Shirt,
  PenTool,
  Dumbbell,
  Home,
  Package,
  Heart,
} from 'lucide-react';
import productService from '../../services/product.service';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Badge } from '../../components/common/Badge';

const CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: ShoppingBag },
  { id: 'Textbooks', label: 'Textbooks', icon: BookOpen },
  { id: 'Electronics', label: 'Electronics', icon: Laptop },
  { id: 'Furniture', label: 'Furniture', icon: Armchair },
  { id: 'Clothing', label: 'Clothing', icon: Shirt },
  { id: 'Stationery', label: 'Stationery', icon: PenTool },
  { id: 'Sports & Fitness', label: 'Sports & Fitness', icon: Dumbbell },
  { id: 'Dorm & Housing', label: 'Dorm & Housing', icon: Home },
  { id: 'Other', label: 'Other', icon: Package },
];

const CONDITIONS = [
  { id: 'All', label: 'All Conditions' },
  { id: 'New', label: 'Brand New' },
  { id: 'Like New', label: 'Like New' },
  { id: 'Good', label: 'Good' },
  { id: 'Fair', label: 'Fair' },
  { id: 'Poor', label: 'Poor' },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'oldest', label: 'Oldest First' },
];

export const MarketplaceListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query state derived from search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Temporary price input state before applying
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);

  // Data fetching state
  const [products, setProducts] = useState([]);
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

  // Fetch products from server using active query parameters
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = {
      page,
      limit: 12,
      sort,
    };

    if (search.trim()) query.search = search.trim();
    if (category && category !== 'All') query.category = category;
    if (condition && condition !== 'All') query.condition = condition;
    if (minPrice !== '' && !isNaN(Number(minPrice))) query.minPrice = Number(minPrice);
    if (maxPrice !== '' && !isNaN(Number(maxPrice))) query.maxPrice = Number(maxPrice);

    try {
      const response = await productService.getProducts(query);
      setProducts(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch marketplace listings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [search, category, condition, minPrice, maxPrice, sort, page]);

  // Sync state with URL search params
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sync back to URL search params
  const updateUrlParams = (newParams) => {
    const next = {
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(category !== 'All' ? { category } : {}),
      ...(condition !== 'All' ? { condition } : {}),
      ...(minPrice !== '' ? { minPrice } : {}),
      ...(maxPrice !== '' ? { maxPrice } : {}),
      ...(sort !== 'newest' ? { sort } : {}),
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

  const handleConditionSelect = (e) => {
    const cond = e.target.value;
    setCondition(cond);
    setPage(1);
    updateUrlParams({ condition: cond, page: 1 });
  };

  const handleSortSelect = (e) => {
    const s = e.target.value;
    setSort(s);
    setPage(1);
    updateUrlParams({ sort: s, page: 1 });
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setPage(1);
    updateUrlParams({ minPrice: tempMinPrice, maxPrice: tempMaxPrice, page: 1 });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setTempMinPrice('');
    setTempMaxPrice('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  const isAnyFilterActive = useMemo(() => {
    return (
      search.trim() !== '' ||
      category !== 'All' ||
      condition !== 'All' ||
      minPrice !== '' ||
      maxPrice !== '' ||
      sort !== 'newest'
    );
  }, [search, category, condition, minPrice, maxPrice, sort]);

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
                  <span className="orange-dot" /> Verified Peer-to-Peer
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Campus Marketplace
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.4rem', margin: 0 }}>
                Buy and sell textbooks, dorm gear, electronics, and supplies directly with trusted campus students.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/marketplace/wishlist"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backdropFilter: 'blur(12px)' }}
                title="View your saved items"
              >
                <Heart size={16} fill="var(--accent-orange)" color="var(--accent-orange)" />
                <span>Saved Wishlist</span>
              </Link>
              <Link to="/marketplace/create" className="btn btn-liquid-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} />
                <span>Create Listing</span>
              </Link>
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
                  placeholder="Search by book title, author, laptop model, keyword..."
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
                      setPage(1);
                      updateUrlParams({ search: '', page: 1 });
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
                  >
                    Clear
                  </button>
                )}
              </div>
              <button type="submit" className="btn btn-liquid-orange" style={{ height: '44px', padding: '0 1.35rem' }}>
                Search
              </button>
            </form>
          </div>

          {/* Categories Horizontal Selector */}
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
                    border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--liquid-glass-border)',
                    backgroundColor: isSelected ? 'var(--accent-orange)' : 'var(--liquid-glass-bg)',
                    backdropFilter: 'var(--liquid-glass-blur)',
                    WebkitBackdropFilter: 'var(--liquid-glass-blur)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'var(--liquid-glass-shadow)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={14} color={isSelected ? '#ffffff' : 'currentColor'} />
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

            {/* Condition Select */}
            <select
              value={condition}
              onChange={handleConditionSelect}
              className="form-input"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', height: '36px', width: 'auto' }}
              aria-label="Filter by Condition"
            >
              {CONDITIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Price Range Form */}
            <form
              onSubmit={handleApplyPriceFilter}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={tempMinPrice}
                  onChange={(e) => setTempMinPrice(e.target.value)}
                  className="form-input"
                  style={{ width: '75px', paddingLeft: '1.25rem', paddingRight: '0.35rem', height: '36px', fontSize: '0.8125rem' }}
                  aria-label="Minimum price"
                />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>–</span>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                  className="form-input"
                  style={{ width: '75px', paddingLeft: '1.25rem', paddingRight: '0.35rem', height: '36px', fontSize: '0.8125rem' }}
                  aria-label="Maximum price"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" style={{ height: '36px' }}>
                Apply
              </Button>
            </form>

            {/* Reset Active Filters Button */}
            {isAnyFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
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
              value={sort}
              onChange={handleSortSelect}
              className="form-input"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', height: '36px', width: 'auto' }}
              aria-label="Sort product listings"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Count Label */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div>
            {!isLoading && (
              <span>
                Showing <strong>{products.length}</strong> of <strong>{pagination.total}</strong> active listings
                {category !== 'All' && <span> in <em>{category}</em></span>}
                {search && <span> matching "<strong>{search}</strong>"</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Product Grid & Lifecycle States */}
      <div className="container">
        {/* Loading State */}
        {isLoading && (
          <div style={{ padding: '4rem 0' }}>
            <Spinner text="Fetching verified campus listings..." />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState
            title="Failed to Load Marketplace"
            message={error}
            onRetry={loadProducts}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <EmptyState
            title="No Listings Found"
            description="We couldn't find any products matching your active filters. Try adjusting your search keyword or clearing your filter criteria."
            action={
              isAnyFilterActive ? (
                <Button variant="secondary" onClick={handleResetFilters} icon={<RotateCcw size={15} />}>
                  Clear All Filters
                </Button>
              ) : (
                <Link to="/marketplace/create" className="btn btn-primary">
                  Be the First to Post
                </Link>
              )
            }
          />
        )}

        {/* Success State: Product Grid */}
        {!isLoading && !error && products.length > 0 && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {products.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div
                style={{
                  marginTop: '3rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => handlePageChange(page - 1)}
                  icon={<ChevronLeft size={16} />}
                >
                  Previous
                </Button>

                <span style={{ fontSize: '0.875rem', fontWeight: '600', padding: '0 0.5rem', color: 'var(--text-secondary)' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(page + 1)}
                  icon={<ChevronRight size={16} />}
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MarketplaceListPage;
