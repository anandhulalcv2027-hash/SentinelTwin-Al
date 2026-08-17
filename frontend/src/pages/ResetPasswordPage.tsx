import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Shield,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { authService } from '@/services/authService';

// Reuse the same strength logic as RegisterPage
function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: 'Weak',   color: 'var(--color-danger)' };
  if (score <= 2) return { score, label: 'Fair',   color: 'var(--color-warn)'   };
  if (score <= 3) return { score, label: 'Good',   color: '#60a5fa'              };
  return              { score, label: 'Strong', color: 'var(--color-success)'  };
}

type PageState = 'form' | 'success';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  // Read token from URL query param — never stored beyond this component's lifetime
  const token = searchParams.get('token') ?? '';

  const [pageState, setPageState]         = useState<PageState>('form');
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd]             = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [apiError, setApiError]           = useState('');
  const [errors, setErrors]               = useState({ newPassword: '', confirmPassword: '' });

  // ─── Validate ───────────────────────────────────────────────────────────────
  function validate(): boolean {
    const next = { newPassword: '', confirmPassword: '' };

    if (!newPassword) {
      next.newPassword = 'Password is required.';
    } else if (newPassword.length < 8) {
      next.newPassword = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword !== confirmPassword) {
      next.confirmPassword = 'Passwords do not match.';
    }

    setErrors(next);
    return !next.newPassword && !next.confirmPassword;
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setApiError('');
    setSubmitting(true);

    try {
      // Security: token comes from URL only; new_password is never logged or stored
      await authService.resetPassword(token, newPassword);
      // Clear password fields immediately after submission
      setNewPassword('');
      setConfirmPassword('');
      setPageState('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';

      // Detect invalid/expired/used token errors from backend
      if (
        msg.toLowerCase().includes('invalid') ||
        msg.toLowerCase().includes('expired') ||
        msg.toLowerCase().includes('used')
      ) {
        setApiError(
          'This password reset link is invalid or has expired. Please request a new one.',
        );
      } else if (msg.toLowerCase().includes('inactive')) {
        setApiError('This user account is inactive. Please contact support.');
      } else {
        setApiError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const strength = newPassword ? passwordStrength(newPassword) : null;

  // ─── Missing / invalid token guard ──────────────────────────────────────────
  if (!token) {
    return (
      <AuthPageShell>
        <div
          className="st-card animate-fade-in"
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(248, 81, 73, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={20} color="var(--color-danger)" />
          </div>

          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '0.25rem',
            }}
          >
            Invalid reset link
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1.75rem',
            }}
          >
            Invalid or missing password reset link. Please request a new one.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/forgot-password"
              className="st-btn-primary"
              style={{ justifyContent: 'center', textAlign: 'center' }}
            >
              Request New Reset Link
            </Link>
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                color: 'var(--color-text-secondary)',
                fontSize: '0.83rem',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <ArrowLeft size={13} />
              Back to Login
            </Link>
          </div>
        </div>
      </AuthPageShell>
    );
  }

  // ─── Success state ───────────────────────────────────────────────────────────
  if (pageState === 'success') {
    return (
      <AuthPageShell>
        <div
          className="st-card animate-fade-in"
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(63, 185, 80, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle2 size={22} color="var(--color-success)" />
          </div>

          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '0.25rem',
            }}
          >
            Password reset successfully
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1.75rem',
            }}
          >
            Your password has been changed. You can now sign in with your new password.
          </p>

          <Link
            to="/login"
            className="st-btn-primary"
            style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
          >
            Back to Login
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  // ─── Reset form ──────────────────────────────────────────────────────────────
  return (
    <AuthPageShell>
      <div
        className="st-card animate-fade-in"
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Icon accent */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-accent-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <KeyRound size={20} color="var(--color-accent)" />
        </div>

        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
          }}
        >
          Reset your password
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
          Enter your new password below.
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
            <div>
              <div>{apiError}</div>
              {(apiError.includes('invalid') || apiError.includes('expired')) && (
                <Link
                  to="/forgot-password"
                  style={{
                    color: 'var(--color-danger)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    fontSize: '0.83rem',
                    marginTop: '0.35rem',
                    display: 'inline-block',
                  }}
                >
                  Request New Reset Link
                </Link>
              )}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {/* New password */}
          <div>
            <label htmlFor="rp-new-password" className="st-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="rp-new-password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((p) => ({ ...p, newPassword: '' }));
                }}
                className={`st-input${errors.newPassword ? ' error' : ''}`}
                placeholder="Min. 8 characters"
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
            {errors.newPassword && <p className="st-error-text">{errors.newPassword}</p>}

            {/* Strength indicator */}
            {strength && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 3,
                        flex: 1,
                        borderRadius: 2,
                        backgroundColor: i <= strength.score ? strength.color : 'var(--color-border)',
                        transition: 'background-color 0.2s',
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {strength.score >= 4 && <CheckCircle2 size={11} color={strength.color} />}
                  <span style={{ fontSize: '0.72rem', color: strength.color }}>
                    {strength.label}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    — Use 12+ chars, uppercase, numbers, and symbols
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="rp-confirm-password" className="st-label">Confirm New Password</label>
            <input
              id="rp-confirm-password"
              type={showPwd ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((p) => ({ ...p, confirmPassword: '' }));
              }}
              className={`st-input${errors.confirmPassword ? ' error' : ''}`}
              placeholder="Re-enter password"
              disabled={submitting}
            />
            {errors.confirmPassword && <p className="st-error-text">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button
            id="rp-submit"
            type="submit"
            className="st-btn-primary"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
          >
            {submitting ? (
              <>
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                Resetting…
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          {/* Back to login */}
          <Link
            to="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              color: 'var(--color-text-secondary)',
              fontSize: '0.83rem',
              textDecoration: 'none',
              marginTop: '0.25rem',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <ArrowLeft size={13} />
            Back to Login
          </Link>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AuthPageShell>
  );
}

// ─── Shared page shell (brand header) ─────────────────────────────────────────

function AuthPageShell({ children }: { children: React.ReactNode }) {
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
      {children}
    </div>
  );
}
