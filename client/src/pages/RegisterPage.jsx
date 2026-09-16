import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common/Alert';
import { UserPlus, ArrowRight, UserCheck, Calendar, GraduationCap } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    campusId: '',
  });
  const [errors, setErrors] = useState([]);
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setGeneralError('');
    setErrors([]);
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const validateForm = () => {
    const validationErrors = [];
    if (!formData.name.trim()) {
      validationErrors.push('Full Name is required');
    }

    if (!formData.email.trim()) {
      validationErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      validationErrors.push('Please enter a valid email address');
    }

    if (!formData.password) {
      validationErrors.push('Password is required');
    } else if (formData.password.length < 6) {
      validationErrors.push('Password must be at least 6 characters long');
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setErrors([]);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setGeneralError(error.message || 'Registration failed. Please try again.');
      if (error.errors && Array.isArray(error.errors)) {
        setErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '3rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--accent-cyan) 100%)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <UserPlus size={24} />
            </div>
            <h2>Create Your Account</h2>
            <p style={{ fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Join the CampusConnect community
            </p>
          </div>

          {/* Role Picker */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              Select Your Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`btn ${formData.role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.75rem', flexDirection: 'column', gap: '0.35rem', height: 'auto' }}
              >
                <GraduationCap size={20} />
                <span style={{ fontWeight: 600 }}>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('organizer')}
                className={`btn ${formData.role === 'organizer' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.75rem', flexDirection: 'column', gap: '0.35rem', height: 'auto' }}
              >
                <Calendar size={20} />
                <span style={{ fontWeight: 600 }}>Event Organizer</span>
              </button>
            </div>
          </div>

          {/* Error Display */}
          <Alert type="error" message={generalError} errors={errors} />

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Campus Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="alex.johnson@university.edu"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="campusId">
                  {formData.role === 'organizer' ? 'Club / Staff ID' : 'Student ID'}
                </label>
                <input
                  id="campusId"
                  name="campusId"
                  type="text"
                  className="form-input"
                  placeholder="e.g. CS-2026-442"
                  value={formData.campusId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" htmlFor="password">
                Password (min 6 chars) *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" /> Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.875rem' }}>
              Already registered?{' '}
              <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary-400)' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
