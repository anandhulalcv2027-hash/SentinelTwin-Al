import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Loader2,
  AlertCircle,
  Mail,
  CheckCircle2,
  ArrowLeft,
  Terminal,
} from 'lucide-react';
import { authService } from '@/services/authService';

// ─── Dev-only flag — Vite sets import.meta.env.DEV automatically ─────────────
const IS_DEV = import.meta.env.DEV;

type PageState = 'form' | 'success';

export function ForgotPasswordPage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // DEV ONLY — raw reset token returned by the backend during development
  const [devResetToken, setDevResetToken] = useState<string | null>(null);

  // The email that was submitted (shown in success state)
  const [submittedEmail, setSubmittedEmail] = useState('');

  // ─── Validation ─────────────────────────────────────────────────────────────
  function validate(): boolean {
    if (!email) {
      setEmailError('Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  }

  // ─── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setApiError('');
    setSubmitting(true);

    try {
      const response = await authService.forgotPassword(email);

      // The backend returns a plain string.
      // In development it is the raw reset token when the email exists;
      // otherwise it returns the generic message.
      // We detect a token by checking it is NOT the generic message string.
      const genericMessages = [
        'If an account exists with this email, a password reset link has been sent.',
      ];
      const isGenericMessage = genericMessages.some(() =>
        (response as string).toLowerCase().includes('if an account'),
      );

      // Store submitted email for success display
      setSubmittedEmail(email);

      if (IS_DEV && !isGenericMessage && typeof response === 'string' && response.length > 0) {
        // Development: backend returned the raw token directly
        // NEVER store this in localStorage/sessionStorage
        setDevResetToken(response as string);
      } else {
        setDevResetToken(null);
      }

      setPageState('success');
    } catch (err) {
      // Security: even on error we do NOT reveal whether the email exists
      setApiError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Try again ──────────────────────────────────────────────────────────────
  function handleTryAgain() {
    setPageState('form');
    setEmail('');
    setEmailError('');
    setApiError('');
    setDevResetToken(null);
    setSubmittedEmail('');
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
        {pageState === 'form' ? (
          <FormView
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            setEmailError={setEmailError}
            apiError={apiError}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        ) : (
          <SuccessView
            submittedEmail={submittedEmail}
            devResetToken={devResetToken}
            onTryAgain={handleTryAgain}
          />
        )}
      </div>

      {/* Back to login */}
      {pageState === 'form' && (
        <p style={{ marginTop: '1.25rem', fontSize: '0.83rem', color: 'var(--color-text-secondary)' }}>
          Remember your password?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}
          >
            Sign in
          </Link>
        </p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Form view ─────────────────────────────────────────────────────────────────

interface FormViewProps {
  email: string;
  setEmail: (v: string) => void;
  emailError: string;
  setEmailError: (v: string) => void;
  apiError: string;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

function FormView({
  email,
  setEmail,
  emailError,
  setEmailError,
  apiError,
  submitting,
  onSubmit,
}: FormViewProps) {
  return (
    <>
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
        <Mail size={20} color="var(--color-accent)" />
      </div>

      <h1
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '0.25rem',
        }}
      >
        Forgot your password?
      </h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
        Enter your email address and we'll help you reset your password.
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

      <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Email */}
        <div>
          <label htmlFor="fp-email" className="st-label">Email address</label>
          <input
            id="fp-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            className={`st-input${emailError ? ' error' : ''}`}
            placeholder="you@example.com"
            disabled={submitting}
          />
          {emailError && <p className="st-error-text">{emailError}</p>}
        </div>

        {/* Submit */}
        <button
          id="fp-submit"
          type="submit"
          className="st-btn-primary"
          disabled={submitting}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
        >
          {submitting ? (
            <>
              <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              Sending…
            </>
          ) : (
            'Send Reset Link'
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
    </>
  );
}

// ─── Success view ──────────────────────────────────────────────────────────────

interface SuccessViewProps {
  submittedEmail: string;
  /** DEV ONLY — null in production builds */
  devResetToken: string | null;
  onTryAgain: () => void;
}

function SuccessView({ submittedEmail, devResetToken, onTryAgain }: SuccessViewProps) {
  // Build the dev reset URL without storing the token anywhere persistent
  const devResetUrl = devResetToken
    ? `${window.location.origin}/reset-password?token=${encodeURIComponent(devResetToken)}`
    : null;

  return (
    <>
      {/* Success icon */}
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
        Check your email
      </h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
        If an account exists with{' '}
        <strong style={{ color: 'var(--color-text-primary)' }}>{submittedEmail}</strong>, we've
        sent instructions to reset your password.
      </p>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
        Didn't receive an email? Check your spam folder, or try again below.
      </p>

      {/* ── DEVELOPMENT-ONLY SECTION ─────────────────────────────────────────
          This block is rendered ONLY when Vite's import.meta.env.DEV is true.
          Vite tree-shakes this entirely in production builds.
          To remove when real email delivery is implemented: delete this block.
      ──────────────────────────────────────────────────────────────────────── */}
      {IS_DEV && devResetUrl && (
        <div
          style={{
            padding: '0.875rem 1rem',
            backgroundColor: 'rgba(210, 153, 34, 0.07)',
            border: '1px solid rgba(210, 153, 34, 0.35)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.5rem',
            }}
          >
            <Terminal size={13} color="var(--color-warn)" />
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--color-warn)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Development Mode
            </span>
          </div>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.6rem',
            }}
          >
            Password reset link (email not configured):
          </p>
          <a
            id="dev-reset-link"
            href={devResetUrl}
            className="st-btn-outline"
            style={{ fontSize: '0.8rem', display: 'inline-flex' }}
          >
            Reset Password
          </a>
          <p
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.5rem',
            }}
          >
            This section does not appear in production builds.
          </p>
        </div>
      )}
      {/* ── END DEVELOPMENT-ONLY SECTION ───────────────────────────────────── */}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link
          to="/login"
          className="st-btn-primary"
          style={{ justifyContent: 'center', textAlign: 'center' }}
        >
          Back to Login
        </Link>
        <button
          type="button"
          className="st-btn-ghost"
          onClick={onTryAgain}
          style={{ justifyContent: 'center', width: '100%' }}
        >
          Try a different email
        </button>
      </div>
    </>
  );
}
