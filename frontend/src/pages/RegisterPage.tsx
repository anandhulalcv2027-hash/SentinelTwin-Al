import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import type { RegisterRequest } from '@/types/auth';

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  organization_name: string;
  organization_slug: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: '',
  password_confirm: '',
  organization_name: '',
  organization_slug: '',
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

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

export function RegisterPage() {
  const { token, isLoading: authLoading, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]         = useState<FormState>(INITIAL);
  const [showPwd, setShowPwd]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (!authLoading && token) {
    return <Navigate to="/app" replace />;
  }

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-populate slug from org name
      if (key === 'organization_name') {
        next.organization_slug = slugify(value);
      }
      return next;
    });
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FieldErrors = {};

    if (!form.first_name.trim())  e.first_name = 'First name is required.';
    if (!form.last_name.trim())   e.last_name  = 'Last name is required.';

    if (!form.email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';

    if (!form.username.trim()) e.username = 'Username is required.';
    else if (form.username.length > 100) e.username = 'Max 100 characters.';

    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Must be at least 8 characters.';

    if (!form.password_confirm) e.password_confirm = 'Please confirm your password.';
    else if (form.password !== form.password_confirm) e.password_confirm = 'Passwords do not match.';

    if (!form.organization_name.trim()) e.organization_name = 'Organization name is required.';
    if (!form.organization_slug.trim()) e.organization_slug = 'Organization slug is required.';
    else if (!/^[a-z0-9-]+$/.test(form.organization_slug))
      e.organization_slug = 'Slug must be lowercase letters, numbers, and hyphens only.';

    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setApiError('');
    setSubmitting(true);
    try {
      const payload: RegisterRequest = {
        first_name:        form.first_name,
        last_name:         form.last_name,
        email:             form.email,
        username:          form.username,
        password:          form.password,
        organization_name: form.organization_name,
        organization_slug: form.organization_slug,
      };
      await register(payload);
      navigate('/app', { replace: true });
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : 'Registration failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  const strength = form.password ? passwordStrength(form.password) : null;

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
        style={{ width: '100%', maxWidth: 500 }}
      >
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
          Create your account
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
          Set up your organization and start monitoring endpoints.
        </p>

        {/* API error */}
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

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Personal info ─────────────────────────────────────────── */}
          <SectionLabel>Personal Information</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Field
              id="reg-first-name"
              label="First name"
              type="text"
              value={form.first_name}
              onChange={(v) => update('first_name', v)}
              error={fieldErrors.first_name}
              placeholder="Jane"
              autoComplete="given-name"
              disabled={submitting}
            />
            <Field
              id="reg-last-name"
              label="Last name"
              type="text"
              value={form.last_name}
              onChange={(v) => update('last_name', v)}
              error={fieldErrors.last_name}
              placeholder="Smith"
              autoComplete="family-name"
              disabled={submitting}
            />
          </div>

          <Field
            id="reg-email"
            label="Work email"
            type="email"
            value={form.email}
            onChange={(v) => update('email', v)}
            error={fieldErrors.email}
            placeholder="jane.smith@company.com"
            autoComplete="email"
            disabled={submitting}
            style={{ marginBottom: '0.75rem' }}
          />

          <Field
            id="reg-username"
            label="Username"
            type="text"
            value={form.username}
            onChange={(v) => update('username', v)}
            error={fieldErrors.username}
            placeholder="janesmith"
            autoComplete="username"
            disabled={submitting}
            style={{ marginBottom: '1.25rem' }}
          />

          {/* ── Organization ──────────────────────────────────────────── */}
          <SectionLabel>Organization</SectionLabel>
          <Field
            id="reg-org-name"
            label="Organization name"
            type="text"
            value={form.organization_name}
            onChange={(v) => update('organization_name', v)}
            error={fieldErrors.organization_name}
            placeholder="Acme Corp"
            autoComplete="organization"
            disabled={submitting}
            style={{ marginBottom: '0.75rem' }}
          />
          <div style={{ marginBottom: '1.25rem' }}>
            <Field
              id="reg-org-slug"
              label="Organization slug"
              type="text"
              value={form.organization_slug}
              onChange={(v) => update('organization_slug', v)}
              error={fieldErrors.organization_slug}
              placeholder="acme-corp"
              autoComplete="off"
              disabled={submitting}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Lowercase letters, numbers, and hyphens only. Auto-filled from name.
            </p>
          </div>

          {/* ── Security ──────────────────────────────────────────────── */}
          <SectionLabel>Security</SectionLabel>
          <div style={{ marginBottom: '0.75rem' }}>
            <label htmlFor="reg-password" className="st-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className={`st-input${fieldErrors.password ? ' error' : ''}`}
                placeholder="Min. 8 characters"
                style={{ paddingRight: '2.75rem' }}
                autoComplete="new-password"
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
            {fieldErrors.password && <p className="st-error-text">{fieldErrors.password}</p>}
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
                    — Use 12+ chars, uppercase, numbers, and symbols for strong security
                  </span>
                </div>
              </div>
            )}
          </div>

          <Field
            id="reg-password-confirm"
            label="Confirm password"
            type={showPwd ? 'text' : 'password'}
            value={form.password_confirm}
            onChange={(v) => update('password_confirm', v)}
            error={fieldErrors.password_confirm}
            placeholder="Re-enter password"
            autoComplete="new-password"
            disabled={submitting}
            style={{ marginBottom: '1.5rem' }}
          />

          <button
            id="reg-submit"
            type="submit"
            className="st-btn-primary"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {submitting ? (
              <>
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>
      </div>

      <p style={{ marginTop: '1.25rem', fontSize: '0.83rem', color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>
          Sign in
        </Link>
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: '0.7rem',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      {children}
    </p>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

function Field({ id, label, type, value, onChange, error, placeholder, autoComplete, disabled, style }: FieldProps) {
  return (
    <div style={style}>
      <label htmlFor={id} className="st-label">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`st-input${error ? ' error' : ''}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      {error && <p className="st-error-text">{error}</p>}
    </div>
  );
}
