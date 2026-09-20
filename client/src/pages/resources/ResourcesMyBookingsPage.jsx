import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Search,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import bookingService from '../../services/booking.service';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Badge } from '../../components/common/Badge';

export const ResourcesMyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data || response || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your bookings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setProcessingId(id);
    try {
      await bookingService.cancelBooking(id);
      await loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved': return <Badge variant="success">Approved</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'Cancelled': return <Badge variant="default">Cancelled</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
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
                My Bookings
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.6 }}>
                View and manage your requests for campus rooms, equipment, and facilities.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/resources" className="btn btn-outline">
                 Browse Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content List */}
      <section className="container" style={{ marginTop: '2.5rem' }}>
        {isLoading ? (
          <div style={{ padding: '6rem 0', textAlign: 'center' }}>
            <Spinner text="Loading your bookings..." />
          </div>
        ) : error ? (
          <ErrorState 
            title="Something went wrong" 
            message={error} 
            onRetry={loadBookings} 
          />
        ) : bookings.length === 0 ? (
          <EmptyState 
            title="No Bookings Found" 
            description="You haven't requested any resources yet. Head over to the resources page to book a room or equipment."
            action={<Button variant="primary" onClick={() => navigate('/resources')}>Browse Resources</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((b) => (
              <div 
                key={b.id || b._id}
                className="card liquid-glass-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                      {b.resource?.name || 'Unknown Resource'}
                    </h3>
                    {getStatusBadge(b.status)}
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={16} /> 
                      {b.date ? new Date(b.date).toLocaleDateString() : 'No date'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={16} /> 
                      {b.startTime} - {b.endTime}
                    </div>
                    {b.resource?.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={16} /> 
                        {b.resource.location}
                      </div>
                    )}
                  </div>
                  
                  {b.purpose && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <FileText size={16} />
                      <i>"{b.purpose}"</i>
                    </div>
                  )}
                </div>
                
                <div>
                  {(b.status === 'Pending' || b.status === 'Approved') && (
                     <Button
                       variant="outline"
                       onClick={() => handleCancelBooking(b.id || b._id)}
                       isLoading={processingId === (b.id || b._id)}
                       style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                     >
                       Cancel Booking
                     </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
