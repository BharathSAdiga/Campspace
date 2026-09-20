import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Shield,
  BookOpen,
  Edit,
  UserPlus,
  LogOut,
  Info,
  Check
} from 'lucide-react';
import clubService from '../../services/club.service';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';

export const ClubsDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchClub = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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
      await fetchClub(); // reload
    } catch (err) {
      alert(err.message || `Failed to ${action} club`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <Spinner text="Loading club details..." />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <EmptyState
          title="Club Not Found"
          description={error || "The club you're looking for doesn't exist or has been removed."}
          action={
            <Link to="/clubs" className="btn btn-primary">
              <ArrowLeft size={16} style={{ marginRight: '0.35rem' }} /> Back to Clubs
            </Link>
          }
        />
      </div>
    );
  }

  const isMember = user && club.members?.some(m => m.id === user.id || m._id === user.id || m === user.id);
  const isCoordinator = user && club.coordinator?.id === user.id;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Back Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/clubs"
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
          <ArrowLeft size={16} /> Back to Clubs
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
              <Badge variant="default">{club.category}</Badge>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '850', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1rem' }}>
              {club.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 <Users size={18} /> {club.members?.length || 0} Members
               </span>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 <Shield size={18} /> Coordinator: {club.coordinator?.name}
               </span>
            </div>
          </div>

          {/* Banner Placeholder */}
          <div
            style={{
              width: '100%',
              height: '300px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--bg-subtle) 0%, var(--liquid-glass-bg) 100%)',
              border: '1px solid var(--liquid-glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
             <BookOpen size={64} style={{ color: 'var(--accent-orange)', opacity: 0.8 }} />
          </div>

          {/* Description Section */}
          <section className="card liquid-glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={20} style={{ color: 'var(--text-secondary)' }} /> About This Club
            </h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
              {club.description}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Action Card */}
        <aside style={{ position: 'sticky', top: '2rem' }}>
          <div className="card liquid-glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>Membership</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isCoordinator && (
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You are the coordinator of this club.</p>
                </div>
              )}
              
              {isMember && !isCoordinator && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  <Check size={18} /> You are a member
                </div>
              )}

              {isCoordinator ? (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(`/clubs/${id}/edit`)}
                  style={{ padding: '1rem' }}
                >
                  <Edit size={18} style={{ marginRight: '0.5rem' }} /> Edit Club Details
                </Button>
              ) : isMember ? (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => handleJoinLeave('leave')}
                  isLoading={isProcessing}
                  style={{ padding: '1rem', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                >
                  <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Leave Club
                </Button>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleJoinLeave('join')}
                  isLoading={isProcessing}
                  style={{ padding: '1rem' }}
                >
                  <UserPlus size={18} style={{ marginRight: '0.5rem' }} /> Join Club
                </Button>
              )}
            </div>

            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--liquid-glass-border)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coordinator</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--btn-primary-bg)',
                      color: 'var(--btn-primary-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}
                  >
                    {club.coordinator?.name ? club.coordinator.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{club.coordinator?.name || 'Verified User'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Club Manager</div>
                  </div>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
