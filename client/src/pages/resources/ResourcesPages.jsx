import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import {
  Search, Calendar, MapPin, Users, Info, ChevronRight, CheckCircle, XCircle, Plus, BookOpen, Clock, Activity, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resourceService, bookingService } from '../../services';
import { Button, Card, Spinner, Alert, EmptyState, Badge, Modal, Input, Select, Textarea } from '../../components/common';

const CATEGORIES = ['All Categories', 'Room', 'Equipment', 'Laboratory', 'Sports', 'Other'];

// --------------------------------------------------------
// RESOURCES LIST PAGE
// --------------------------------------------------------
export const ResourcesListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = {};
      if (search.trim()) query.search = search.trim();
      if (category !== 'All Categories') query.category = category;
      
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
    setSearchParams({ search, category: category !== 'All Categories' ? category : '' });
  };

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    setCategory(val);
    setSearchParams({ search, category: val !== 'All Categories' ? val : '' });
  };

  return (
    <div className="page-wrapper container" style={{ paddingBottom: '5rem', paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Campus Resources</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Book study rooms, equipment, and laboratory spaces.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {user && (
            <Link to="/resources/my-bookings" className="btn btn-secondary">
              My Bookings
            </Link>
          )}
          {(user?.role === 'organizer' || user?.role === 'admin') && (
            <Link to="/resources/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Resource
            </Link>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 2 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select
              value={category}
              onChange={handleCategorySelect}
              options={CATEGORIES.map(c => ({ value: c, label: c }))}
            />
          </div>
          <Button type="submit" variant="primary">Search</Button>
        </form>
      </div>

      {error && <Alert type="error" message={error} />}
      {isLoading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}><Spinner /></div>
      ) : resources.length === 0 ? (
        <EmptyState title="No Resources Found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid-3">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              title={resource.name}
              subtitle={resource.category}
              interactive
              onClick={() => navigate(`/resources/${resource.id}`)}
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} /> {resource.location}
                  </span>
                  <Badge variant={resource.status === 'Available' ? 'success' : 'warning'}>
                    {resource.status}
                  </Badge>
                </div>
              }
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {resource.description}
              </p>
              {resource.capacity && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Users size={14} /> Capacity: {resource.capacity}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
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
  
  // Booking Form State
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

  if (isLoading) return <div style={{ padding: '5rem 0', textAlign: 'center' }}><Spinner /></div>;
  if (error) return <div className="container" style={{ padding: '2rem 0' }}><Alert type="error" message={error} /></div>;
  if (!resource) return <EmptyState title="Resource Not Found" />;

  return (
    <div className="container" style={{ padding: '3rem 0', paddingBottom: '5rem' }}>
      <Button variant="outline" size="sm" onClick={() => navigate('/resources')} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Resources
      </Button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div>
          <Badge variant={resource.status === 'Available' ? 'success' : 'warning'} style={{ marginBottom: '1rem' }}>
            {resource.status}
          </Badge>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{resource.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>{resource.category}</p>
          
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} /> Description
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{resource.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Card title="Location" icon={<MapPin size={18} />} style={{ padding: '1.5rem' }}>
              {resource.location}
            </Card>
            <Card title="Capacity" icon={<Users size={18} />} style={{ padding: '1.5rem' }}>
              {resource.capacity ? `${resource.capacity} People` : 'N/A'}
            </Card>
          </div>
          
          {resource.facilities?.length > 0 && (
            <div className="card" style={{ padding: '2rem', marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Facilities</h3>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                {resource.facilities.map((f, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{f}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Request Booking</h3>
            
            {resource.status !== 'Available' ? (
              <Alert type="warning" message="This resource is currently not available for booking." />
            ) : (
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  label="Date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Input
                    label="Start Time"
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Input
                    label="End Time"
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                <Textarea
                  label="Purpose"
                  placeholder="Why do you need this resource?"
                  required
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
                
                {bookingError && <Alert type="error" message={bookingError} />}
                {bookingSuccess && <Alert type="success" message="Booking request submitted successfully! It is now pending approval." />}
                
                <Button type="submit" variant="primary" fullWidth isLoading={isBooking}>
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
    facilities: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const dataToSubmit = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        facilities: formData.facilities ? formData.facilities.split(',').map(f => f.trim()).filter(f => f) : []
      };
      
      const response = await resourceService.createResource(dataToSubmit);
      navigate(`/resources/${response.data.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create resource.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Add Campus Resource</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Register a new facility or equipment for campus booking.</p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: '1.5rem' }} />}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Resource Name" name="name" required value={formData.name} onChange={handleChange} />
          <Textarea label="Description" name="description" required rows={4} value={formData.description} onChange={handleChange} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={['Room', 'Equipment', 'Laboratory', 'Sports', 'Other'].map(c => ({ value: c, label: c }))}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={['Available', 'Maintenance', 'Unavailable'].map(c => ({ value: c, label: c }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            <Input label="Location / Room Number" name="location" required value={formData.location} onChange={handleChange} />
            <Input label="Capacity (optional)" name="capacity" type="number" min="1" value={formData.capacity} onChange={handleChange} />
          </div>

          <Input 
            label="Facilities (comma separated)" 
            name="facilities" 
            placeholder="Projector, Whiteboard, AC" 
            value={formData.facilities} 
            onChange={handleChange} 
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => navigate('/resources')} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>Create Resource</Button>
          </div>
        </form>
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
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancelBooking(id);
      loadBookings(); // Reload list
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'error',
      'Cancelled': 'default'
    };
    return <Badge variant={map[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="container" style={{ padding: '3rem 0', paddingBottom: '5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>My Bookings</h1>
      
      {error && <Alert type="error" message={error} />}
      
      {isLoading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}><Spinner /></div>
      ) : bookings.length === 0 ? (
        <EmptyState title="No Bookings Found" description="You have not made any resource booking requests yet." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to={`/resources/${booking.resource?.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                    {booking.resource?.name || 'Unknown Resource'}
                  </Link>
                  {getStatusBadge(booking.status)}
                </h3>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={14} /> {new Date(booking.date).toLocaleDateString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {booking.startTime} - {booking.endTime}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><FileText size={14} /> {booking.purpose}</span>
                </div>
              </div>
              
              <div>
                {(booking.status === 'Pending' || booking.status === 'Approved') && (
                  <Button variant="outline" size="sm" onClick={() => handleCancel(booking.id)}>
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
