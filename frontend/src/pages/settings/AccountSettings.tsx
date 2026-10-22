import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { userService, handleUserError } from '@/services/userService';
import { authService } from '@/services/authService';

export function AccountSettings() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await userService.updateUser(user.id, {
        first_name: firstName,
        last_name: lastName,
      });

      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      setError(handleUserError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError(null);
    setPasswordSuccess(null);

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        'Please fill in all password fields.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        'New password and confirmation do not match.',
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        'New password must be at least 8 characters long.',
      );
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(
        'New password must be different from your current password.',
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      await authService.changePassword(
        currentPassword,
        newPassword,
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setPasswordSuccess(
        'Password changed successfully. Your active sessions have been revoked. Please sign in again.',
      );
    } catch (err) {
      setPasswordError(handleUserError(err));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          Account Settings
        </h2>

        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '0.85rem',
          }}
        >
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Profile Information */}
      <div className="st-card">
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          Profile Information
        </h3>

        <form
          onSubmit={handleUpdateProfile}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '400px',
          }}
        >
          <div>
            <label className="st-label">
              First Name
            </label>

            <input
              type="text"
              className="st-input"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="st-label">
              Last Name
            </label>

            <input
              type="text"
              className="st-input"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="st-label">
              Email Address
            </label>

            <input
              type="email"
              className="st-input"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              disabled
            />

            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.25rem',
              }}
            >
              {user.email_verified ? (
                <span
                  style={{
                    color: 'var(--color-success)',
                  }}
                >
                  Email is verified
                </span>
              ) : (
                <span
                  style={{
                    color: 'var(--color-warn)',
                  }}
                >
                  Email is unverified
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="st-error-text">
              {error}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-success)',
              }}
            >
              {successMsg}
            </div>
          )}

          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="st-btn-primary"
              disabled={isSaving}
            >
              {isSaving
                ? 'Saving...'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="st-card">
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}
        >
          Password
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1rem',
          }}
        >
          Change your password securely. You will need to
          enter your current password.
        </p>

        <form
          onSubmit={handleChangePassword}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '400px',
          }}
        >
          <div>
            <label className="st-label">
              Current Password
            </label>

            <input
              type="password"
              className="st-input"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label className="st-label">
              New Password
            </label>

            <input
              type="password"
              className="st-input"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              autoComplete="new-password"
              minLength={8}
              required
            />

            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.25rem',
              }}
            >
              Minimum 8 characters.
            </div>
          </div>

          <div>
            <label className="st-label">
              Confirm New Password
            </label>

            <input
              type="password"
              className="st-input"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {passwordError && (
            <div className="st-error-text">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-success)',
              }}
            >
              {passwordSuccess}
            </div>
          )}

          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="st-btn-outline"
              disabled={isChangingPassword}
            >
              {isChangingPassword
                ? 'Changing Password...'
                : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
