import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export function LoginPage() {
  const { token, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [remember, setRemember]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError]   = useState('');

  // Field-level validation errors
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Redirect if already authenticated
  if (!authLoading && token) {
    return <Navigate to="/app" replace />;
  }

  function validate(): boolean {
    const next = { email: '', password: '' };
    if (!email) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return !next.email && !next.password;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setApiError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/app', { replace: true });
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      {/* Brand */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          marginBottom: '2rem',
        }}
      >
        <Shield size={22} color="var(--color-accent)" />
        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
          SentinelTwin <span style={{ color: 'var(--color-accent)' }}>AI</span>
        </span>
      </Link>

      {/* Card */}
      <div
        className="st-card animate-fade-in"
        style={{ width: '100%', maxWidth: 420 }}
      >
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
          }}
        >
          Sign in
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
          Access your security operations dashboard.
        </p>

        {/* API error banner */}
        {apiError && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(248, 81, 73, 0.08)',
              border: '1px solid rgba(248, 81, 73, 0.3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              color: 'var(--color-danger)',
              fontSize: '0.83rem',
              lineHeight: 1.5,
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="st-label">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              className={`st-input${errors.email ? ' error' : ''}`}
              placeholder="you@example.com"
              disabled={submitting}
            />
            {errors.email && <p className="st-error-text">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="st-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                className={`st-input${errors.password ? ' error' : ''}`}
                placeholder="••••••••"
                style={{ paddingRight: '2.75rem' }}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="st-error-text">{errors.password}</p>}
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="login-remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: 'var(--color-accent)', width: 14, height: 14, cursor: 'pointer' }}
            />
            <label
              htmlFor="login-remember"
              style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              Remember this device
            </label>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            className="st-btn-primary"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
          >
            {submitting ? (
              <>
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>

      {/* Register link */}
      <p style={{ marginTop: '1.25rem', fontSize: '0.83rem', color: 'var(--color-text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>
          Create one
        </Link>
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
