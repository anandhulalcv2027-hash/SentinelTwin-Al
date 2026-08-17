import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { userService, handleUserError } from '@/services/userService';
import { roleService, handleRoleError } from '@/services/roleService';
import { useAuth } from '@/lib/AuthContext';
import type { User, UserCreateRequest, UserUpdateRequest } from '@/types/user';
import type { Role } from '@/types/role';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await userService.getUsers();
      setUsers(response.items);
    } catch (err) {
      setErrorMsg(handleUserError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Users size={24} color="var(--color-accent)" />
            Users
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Manage organization users and roles.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchUsers} className="st-btn-ghost" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="st-btn-primary">
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {errorMsg && (
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
            marginBottom: '1.5rem',
            color: 'var(--color-danger)',
            fontSize: '0.83rem',
            lineHeight: 1.5,
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {successMsg && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(63, 185, 80, 0.08)',
            border: '1px solid rgba(63, 185, 80, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            color: 'var(--color-success)',
            fontSize: '0.83rem',
            lineHeight: 1.5,
          }}
        >
          <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      <div className="st-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Users size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>No users found.</p>
            <button onClick={() => setIsAddModalOpen(true)} className="st-btn-outline">
              <Plus size={15} /> Add your first organization user
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-overlay)' }}>
                  <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                  <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</th>
                  <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                  <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                  <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Verification</th>
                  <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Login</th>
                  <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {u.first_name} {u.last_name}
                      {currentUser?.id === u.id && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.2rem' }}>
                          (Current User)
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {u.username}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      <span style={{ backgroundColor: 'var(--color-bg-overlay)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid var(--color-border)' }}>
                        {u.roles?.length > 0 ? u.roles.join(', ') : 'None'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      {u.is_active ? (
                        <span className="st-badge-healthy">Active</span>
                      ) : (
                        <span className="st-badge-warn">Inactive</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      {u.email_verified ? (
                        <span className="st-badge-healthy">Verified</span>
                      ) : (
                        <span className="st-badge-warn">Unverified</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setEditingUser(u)}
                          className="st-btn-ghost"
                          style={{ padding: '0.35rem', border: 'none' }}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        {currentUser?.id !== u.id && (
                          <button
                            onClick={() => setDeletingUser(u)}
                            className="st-btn-ghost"
                            style={{ padding: '0.35rem', border: 'none', color: 'var(--color-danger)' }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .st-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          backdrop-filter: blur(2px);
          padding: 1rem;
        }
      `}</style>

      {isAddModalOpen && (
        <UserFormModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            showSuccess('User created successfully.');
            fetchUsers();
          }}
        />
      )}

      {editingUser && (
        <UserFormModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            showSuccess('User updated successfully.');
            fetchUsers();
          }}
        />
      )}

      {deletingUser && (
        <DeleteConfirmModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onSuccess={() => {
            setDeletingUser(null);
            showSuccess('User deleted successfully.');
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

function UserFormModal({
  user,
  onClose,
  onSuccess,
}: {
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!user;
  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(''); // Use empty string to prompt for an ID
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchRoles = async () => {
      try {
        const response = await roleService.getRoles();
        if (isMounted) {
          setRoles(response.items);
          setRolesError('');
        }
      } catch (err) {
        if (isMounted) {
          setRolesError(handleRoleError(err));
        }
      } finally {
        if (isMounted) {
          setRolesLoading(false);
        }
      }
    };
    fetchRoles();
    return () => { isMounted = false; };
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = 'First name is required.';
    if (!lastName.trim()) next.lastName = 'Last name is required.';
    if (!isEditing && !username.trim()) next.username = 'Username is required.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) next.email = 'Valid email is required.';
    if (!isEditing && (!password || password.length < 8)) next.password = 'Password is required (min 8 chars).';
    if (!isEditing && !roleId.trim()) next.roleId = 'Role ID is required.'; // The backend needs it for create
    
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    try {
      if (isEditing) {
        const payload: UserUpdateRequest = {
          first_name: firstName,
          last_name: lastName,
          email,
          is_active: isActive,
        };
        if (roleId) payload.role_id = roleId; // update role if provided
        
        await userService.updateUser(user.id, payload);
      } else {
        const payload: UserCreateRequest = {
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
          role_id: roleId,
        };
        await userService.createUser(payload);
      }
      onSuccess();
    } catch (err) {
      setApiError(handleUserError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="st-modal-overlay">
      <div className="st-card animate-fade-in" style={{ width: '100%', maxWidth: 480, padding: '1.5rem 1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {isEditing ? 'Edit User' : 'Add User'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {apiError && (
          <div style={{ backgroundColor: 'rgba(248, 81, 73, 0.08)', border: '1px solid rgba(248, 81, 73, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className="st-label">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={e => { setFirstName(e.target.value); setErrors(p => ({...p, firstName: ''})); }}
                className={`st-input ${errors.firstName ? 'error' : ''}`}
                disabled={submitting}
                autoFocus
              />
              {errors.firstName && <p className="st-error-text">{errors.firstName}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label className="st-label">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={e => { setLastName(e.target.value); setErrors(p => ({...p, lastName: ''})); }}
                className={`st-input ${errors.lastName ? 'error' : ''}`}
                disabled={submitting}
              />
              {errors.lastName && <p className="st-error-text">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="st-label">Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
              className={`st-input ${errors.email ? 'error' : ''}`}
              disabled={submitting}
            />
            {errors.email && <p className="st-error-text">{errors.email}</p>}
          </div>

          <div>
            <label className="st-label">Username {isEditing ? '' : '*'}</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setErrors(p => ({...p, username: ''})); }}
              className={`st-input ${errors.username ? 'error' : ''}`}
              disabled={isEditing || submitting}
              style={{ backgroundColor: isEditing ? 'var(--color-bg-base)' : undefined }}
            />
            {isEditing && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Username cannot be changed.</p>}
            {errors.username && <p className="st-error-text">{errors.username}</p>}
          </div>

          {!isEditing && (
            <div>
              <label className="st-label">Password *</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                className={`st-input ${errors.password ? 'error' : ''}`}
                disabled={submitting}
              />
              {errors.password && <p className="st-error-text">{errors.password}</p>}
            </div>
          )}

          <div>
            <label className="st-label">Role {isEditing ? '(Optional)' : '*'}</label>
            {rolesLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                <Loader2 size={14} className="animate-spin" /> Loading roles...
              </div>
            ) : rolesError ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                <AlertCircle size={14} /> {rolesError}
              </div>
            ) : (
              <select
                value={roleId}
                onChange={e => { setRoleId(e.target.value); setErrors(p => ({...p, roleId: ''})); }}
                className={`st-input ${errors.roleId ? 'error' : ''}`}
                disabled={submitting}
                style={{ appearance: 'auto', backgroundColor: 'var(--color-bg-surface)' }}
              >
                <option value="" disabled>Select a role</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            )}
            {errors.roleId && <p className="st-error-text">{errors.roleId}</p>}
          </div>

          {isEditing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="is-active-cb"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                disabled={submitting}
                style={{ accentColor: 'var(--color-accent)', width: 14, height: 14, cursor: 'pointer' }}
              />
              <label htmlFor="is-active-cb" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                User is active
              </label>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="st-btn-ghost" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="st-btn-primary" disabled={submitting || rolesLoading || (!!rolesError && !isEditing)}>
              {submitting ? (
                <><Loader2 size={15} className="animate-spin" /> Saving…</>
              ) : (
                'Save User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  user,
  onClose,
  onSuccess,
}: {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleDelete = async () => {
    setSubmitting(true);
    setApiError('');
    try {
      await userService.deleteUser(user.id);
      onSuccess();
    } catch (err) {
      setApiError(handleUserError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="st-modal-overlay">
      <div className="st-card animate-fade-in" style={{ width: '100%', maxWidth: 400, padding: '1.5rem 1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} color="var(--color-danger)" />
          Delete User
        </h2>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Are you sure you want to delete <strong>{user.username}</strong>? This action cannot be undone.
        </p>

        {apiError && (
          <div style={{ backgroundColor: 'rgba(248, 81, 73, 0.08)', border: '1px solid rgba(248, 81, 73, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            {apiError}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="st-btn-ghost" disabled={submitting}>
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete} 
            className="st-btn-primary" 
            disabled={submitting}
            style={{ backgroundColor: 'var(--color-danger)', color: '#fff' }}
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Deleting…</>
            ) : (
              'Delete User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
