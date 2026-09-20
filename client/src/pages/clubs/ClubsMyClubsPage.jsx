import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  BookOpen
} from 'lucide-react';
import clubService from '../../services/club.service';
import { ClubCard } from '../../components/clubs/ClubCard';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';

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
      setClubs(response.data || response || []);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
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
                  <span className="orange-dot" /> Member Dashboard
                </span>
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '850', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                My Clubs
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.6 }}>
                View and manage the campus organizations you are currently enrolled in or coordinating.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/clubs" className="btn btn-outline">
                 Browse All Clubs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="container" style={{ marginTop: '2.5rem' }}>
        {isLoading ? (
          <div style={{ padding: '6rem 0', textAlign: 'center' }}>
            <Spinner text="Loading your clubs..." />
          </div>
        ) : error ? (
          <ErrorState 
            title="Something went wrong" 
            message={error} 
            onRetry={loadClubs} 
          />
        ) : clubs.length === 0 ? (
          <EmptyState 
            title="No Clubs Joined" 
            description="You haven't joined any clubs yet. Explore the campus directory to find communities that match your interests."
            action={<Button variant="primary" onClick={() => navigate('/clubs')}>Browse Clubs</Button>}
          />
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}
          >
            {clubs.map((club) => (
              <div key={club.id || club._id}>
                <ClubCard club={club} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
