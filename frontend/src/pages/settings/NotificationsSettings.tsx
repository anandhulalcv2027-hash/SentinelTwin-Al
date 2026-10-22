import { useState, useEffect } from 'react';
import { settingsService } from '@/services/settingsService';
import { Loader2 } from 'lucide-react';

export function NotificationsSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await settingsService.getSettings();
        setSettings(res.settings?.notifications || {
          critical: true,
          offline: false,
          security: true,
        });
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = async (key: string, value: boolean) => {
    const newNotifs = { ...settings, [key]: value };
    setSettings(newNotifs);
    setSaving(true);
    try {
      const current = await settingsService.getSettings();
      await settingsService.updateSettings({
        settings: { ...current.settings, notifications: newNotifs }
      });
      console.log('Saved Notification settings updated.');
    } catch (err) {
      console.error('Failed to save settings', err);
      // Revert the setting on failure if we wanted to be perfectly strict
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loader2 className="st-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Notifications</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Manage your email and in-app notification preferences.
        </p>
      </div>

      <div className="st-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Email Notifications</h3>
          {saving && <Loader2 className="st-spin" size={16} style={{ color: 'var(--color-primary)' }} />}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Configure which events trigger an email notification.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={!!settings.critical}
              onChange={(e) => handleChange('critical', e.target.checked)}
              disabled={saving}
            />
            <span style={{ fontSize: '0.9rem' }}>Critical system alerts</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={!!settings.offline}
              onChange={(e) => handleChange('offline', e.target.checked)}
              disabled={saving}
            />
            <span style={{ fontSize: '0.9rem' }}>Device offline notifications</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={!!settings.security}
              onChange={(e) => handleChange('security', e.target.checked)}
              disabled={saving}
            />
            <span style={{ fontSize: '0.9rem' }}>Security alerts</span>
          </label>
        </div>
      </div>
    </div>
  );
}
