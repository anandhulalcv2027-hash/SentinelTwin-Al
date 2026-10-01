import { Link } from 'react-router-dom';

export function UsersRolesSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Users & Roles</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Manage access for members of your organization.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>User Management</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Full user management and role assignment is available in the dedicated Users section.
        </p>
        <Link to="/app/users" className="st-btn-outline" style={{ textDecoration: 'none' }}>
          Go to Users Page
        </Link>
      </div>
    </div>
  );
}
