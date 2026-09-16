import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Pre-fill demo credentials for quick validation
   */
  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
    setFormErrors({});
    setApiError('');
  };

  return (
    <div className="auth-page-container" style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem', boxShadow: 'var(--shadow-md)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <GraduationCap size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.35rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sign in to access your Campspace dashboard and campus tools.
          </p>
        </div>

        {/* Server API Error Alert */}
        {apiError && (
          <div style={{ marginBottom: '1.25rem' }}>
            <Alert type="error" message={apiError} dismissible onDismiss={() => setApiError('')} />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="login-email" className="form-label">
              Campus Email <span style={{ color: 'var(--danger-500)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                  display: 'flex',
                }}
              >
                <Mail size={18} />
              </span>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="student@campus.edu"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${formErrors.email ? 'is-invalid' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
            {formErrors.email && <span className="form-error">{formErrors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label htmlFor="login-password" className="form-label" style={{ marginBottom: 0 }}>
                Password <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                  display: 'flex',
                }}
              >
                <Lock size={18} />
              </span>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${formErrors.password ? 'is-invalid' : ''}`}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  padding: '2px',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password && <span className="form-error">{formErrors.password}</span>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Sign In
          </Button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>
            Sign up
          </Link>
        </div>

        {/* Demo Roles Shortcut for Reviewers & Developers */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <ShieldCheck size={14} /> Quick Demo Credentials
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleDemoLogin('student_demo@campus.edu', 'password123')}
            >
              Fill Student
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleDemoLogin('organizer_demo@campus.edu', 'password123')}
            >
              Fill Organizer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
