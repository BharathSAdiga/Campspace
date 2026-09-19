import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import { Search, Users, Shield, Plus, ChevronRight, Activity, BookOpen, UserPlus, LogOut, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clubService } from '../../services';
import { Button, Card, Spinner, Alert, EmptyState, Badge, Input, Select, Textarea } from '../../components/common';

const CATEGORIES = ['All Categories', 'Academic', 'Cultural', 'Sports', 'Technology', 'Arts', 'Social', 'Other'];

// --------------------------------------------------------
// CLUBS LIST PAGE
// --------------------------------------------------------
export const ClubsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadClubs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = {};
      if (search.trim()) query.search = search.trim();
      if (category !== 'All Categories') query.category = category;
      
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
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Campus Clubs</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Explore student organizations and connect with peers.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {user && (
            <Link to="/clubs/my-clubs" className="btn btn-secondary">
              My Clubs
            </Link>
          )}
          {(user?.role === 'organizer' || user?.role === 'admin') && (
            <Link to="/clubs/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Register Club
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
              placeholder="Search clubs..."
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
      ) : clubs.length === 0 ? (
        <EmptyState title="No Clubs Found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid-3">
          {clubs.map((club) => (
            <Card
              key={club.id}
              title={club.name}
              subtitle={club.category}
              interactive
              onClick={() => navigate(`/clubs/${club.id}`)}
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={14} /> {club.members?.length || 0} Members
                  </span>
                </div>
              }
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {club.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Shield size={14} /> Coordinator: {club.coordinator?.name}
              </div>
            </Card>
          ))}
        </div>
      )}
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
      await fetchClub(); // reload
    } catch (err) {
      alert(err.message || `Failed to ${action} club`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div style={{ padding: '5rem 0', textAlign: 'center' }}><Spinner /></div>;
  if (error) return <div className="container" style={{ padding: '2rem 0' }}><Alert type="error" message={error} /></div>;
  if (!club) return <EmptyState title="Club Not Found" />;

  const isMember = user && club.members?.some(m => m.id === user.id || m._id === user.id || m === user.id);
  const isCoordinator = user && club.coordinator?.id === user.id;

  return (
    <div className="container" style={{ padding: '3rem 0', paddingBottom: '5rem' }}>
      <Button variant="outline" size="sm" onClick={() => navigate('/clubs')} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Clubs
      </Button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="default" style={{ marginBottom: '1rem' }}>{club.category}</Badge>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{club.name}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={16} /> {club.members?.length || 0} Members</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Shield size={16} /> {club.coordinator?.name} (Coordinator)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {isCoordinator && (
            <Button variant="outline" onClick={() => navigate(`/clubs/${id}/edit`)} icon={<Edit size={16} />}>
              Edit Club
            </Button>
          )}
          {!isCoordinator && (
            isMember ? (
              <Button variant="outline" onClick={() => handleJoinLeave('leave')} isLoading={isProcessing} icon={<LogOut size={16} />}>
                Leave Club
              </Button>
            ) : (
              <Button variant="primary" onClick={() => handleJoinLeave('join')} isLoading={isProcessing} icon={<UserPlus size={16} />}>
                Join Club
              </Button>
            )
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} /> About Us
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{club.description}</p>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------
// CLUBS CREATE & EDIT PAGE (Shared Form)
// --------------------------------------------------------
export const ClubsFormPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Academic',
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
            category: response.data.category,
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
    setFormData(prev => ({ ...prev, [name]: value }));
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

  if (isLoading) return <div style={{ padding: '5rem 0', textAlign: 'center' }}><Spinner /></div>;

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>{isEdit ? 'Edit Club Settings' : 'Register New Club'}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{isEdit ? 'Update club information.' : 'Submit a new student organization.'}</p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: '1.5rem' }} />}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Club Name" name="name" required value={formData.name} onChange={handleChange} />
          
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={CATEGORIES.filter(c => c !== 'All Categories').map(c => ({ value: c, label: c }))}
          />
          
          <Textarea label="Description" name="description" required rows={6} value={formData.description} onChange={handleChange} />
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" type="button" onClick={() => navigate(isEdit ? `/clubs/${id}` : '/clubs')} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>{isEdit ? 'Update Club' : 'Create Club'}</Button>
          </div>
        </form>
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
    <div className="container" style={{ padding: '3rem 0', paddingBottom: '5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>My Clubs</h1>
      
      {error && <Alert type="error" message={error} />}
      
      {isLoading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}><Spinner /></div>
      ) : clubs.length === 0 ? (
        <EmptyState title="No Clubs Found" description="You have not joined any clubs yet." action={<Button variant="primary" onClick={() => navigate('/clubs')}>Browse Clubs</Button>} />
      ) : (
        <div className="grid-3">
          {clubs.map((club) => (
            <Card
              key={club.id}
              title={club.name}
              subtitle={club.category}
              interactive
              onClick={() => navigate(`/clubs/${club.id}`)}
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Coordinator: {club.coordinator?.name}
                  </span>
                </div>
              }
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {club.description}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
