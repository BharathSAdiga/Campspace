import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';
import { getCategoryIcon } from './ListingCard';

const CATEGORIES = [
  'All',
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Stationery',
  'Housing / Sublet',
  'Other',
];

const CONDITIONS = ['All', 'Brand New', 'Like New', 'Good', 'Fair', 'Poor'];

export const ListingFilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
}) => {
  const isFiltered =
    filters.search ||
    filters.category !== 'All' ||
    filters.condition !== 'All' ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sort !== 'newest';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      {/* Search Input Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            flex: 1,
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--slate-400)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search textbooks, graphing calculators, dorm desks, winter coats..."
            className="form-input"
            style={{
              paddingLeft: '2.75rem',
              paddingRight: filters.search ? '2.5rem' : '1rem',
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              height: '46px',
              fontSize: '0.95rem',
            }}
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--slate-400)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => onFilterChange('category', cat)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                padding: '0.45rem 0.9rem',
                fontSize: '0.825rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                border: active
                  ? '1px solid var(--primary-500)'
                  : '1px solid var(--border-subtle)',
                background: active ? 'var(--primary-600)' : 'var(--bg-card)',
                color: active ? '#ffffff' : 'var(--slate-300)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat !== 'All' && getCategoryIcon(cat, 13)}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Filters Bar: Condition, Price Range, Sort, Reset */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '0.85rem 1.1rem',
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          {/* Condition Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>Condition:</span>
            <select
              className="form-input"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                height: 'auto',
                width: 'auto',
              }}
              value={filters.condition}
              onChange={(e) => onFilterChange('condition', e.target.value)}
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond === 'All' ? 'All Conditions' : cond}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>Price:</span>
            <input
              type="number"
              min="0"
              placeholder="Min $"
              className="form-input"
              style={{
                padding: '0.35rem 0.5rem',
                fontSize: '0.8rem',
                height: 'auto',
                width: '75px',
              }}
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
            />
            <span style={{ color: 'var(--slate-500)' }}>–</span>
            <input
              type="number"
              min="0"
              placeholder="Max $"
              className="form-input"
              style={{
                padding: '0.35rem 0.5rem',
                fontSize: '0.8rem',
                height: 'auto',
                width: '75px',
              }}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            />
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.775rem',
                height: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
            <strong style={{ color: 'var(--slate-200)' }}>{totalResults}</strong> {totalResults === 1 ? 'item' : 'items'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpDown size={14} color="var(--slate-400)" />
            <select
              className="form-input"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                height: 'auto',
                width: 'auto',
              }}
              value={filters.sort}
              onChange={(e) => onFilterChange('sort', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
