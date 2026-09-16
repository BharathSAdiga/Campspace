import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common/Alert';
import { LogIn, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setGeneralError('');
    setErrors([]);
  };

  const validateForm = () => {
    const validationErrors = [];
    if (!formData.email.trim()) {
      validationErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      validationErrors.push('Please enter a valid email address');
    }

    if (!formData.password) {
      validationErrors.push('Password is required');
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
      await login(formData.email.trim(), formData.password);
      navigate(fromPath, { replace: true });
    } catch (error) {
      setGeneralError(error.message || 'Login failed. Please check your credentials.');
      if (error.errors && Array.isArray(error.errors)) {
        setErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '3rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <LogIn size={24} />
            </div>
            <h2>Welcome Back</h2>
            <p style={{ fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Sign in to your CampusConnect account
            </p>
          </div>

          {/* Error Display */}
          <Alert type="error" message={generalError} errors={errors} />

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Campus Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Bottom links */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.875rem' }}>
              Don't have an account yet?{' '}
              <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary-400)' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
