import { useState } from 'react';
import {
  X,
  DownloadCloud,
  Loader2,
  Terminal,
  Activity,
  AlertTriangle,
  FileArchive,
  CheckCircle2,
  Monitor
} from 'lucide-react';
import { deviceService, handleDeviceError } from '@/services/deviceService';
import type { Device } from '@/types/device';

interface AgentPackageDialogProps {
  device: Device;
  onClose: () => void;
}

export function AgentPackageDialog({ device, onClose }: AgentPackageDialogProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDownload = async () => {
    setDownloading(true);
    setErrorMsg('');
    try {
      await deviceService.downloadAgentPackage(device.id);
      setDownloaded(true);
    } catch (err) {
      setErrorMsg(handleDeviceError(err));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="st-modal-overlay">
      <div
        className="st-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileArchive size={21} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.2rem',
                  fontWeight: 650,
                  color: 'var(--color-text-primary)',
                }}
              >
                Deploy SentinelTwin Agent
              </h2>
              <p
                style={{
                  marginTop: '0.3rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Monitor size={14} />
                <strong>{device.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={downloading}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: downloading ? 'not-allowed' : 'pointer',
              padding: '0.2rem',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: 'rgba(248, 81, 73, 0.08)',
                border: '1px solid rgba(248, 81, 73, 0.3)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger)',
                fontSize: '0.78rem',
                display: 'flex',
                gap: '0.5rem',
                lineHeight: 1.45,
                marginBottom: '1rem'
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {downloaded && (
            <div
              style={{
                backgroundColor: 'rgba(63, 185, 80, 0.08)',
                border: '1px solid rgba(63, 185, 80, 0.3)',
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-success)',
                fontSize: '0.85rem',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <strong style={{ fontWeight: 600 }}>Agent package generated successfully.</strong>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Step 1 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(34, 211, 238, 0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700
                }}>1</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 650, color: 'var(--color-text-primary)' }}>
                  Download the package
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem', paddingLeft: '2rem' }}>
                Download the pre-configured zip file containing the agent executable and configuration for this specific device.
              </p>
              <div style={{ paddingLeft: '2rem' }}>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="st-btn-primary"
                  style={{ minWidth: '160px', justifyContent: 'center' }}
                >
                  {downloading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <DownloadCloud size={16} />
                      Download Agent
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(34, 211, 238, 0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700
                }}>2</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 650, color: 'var(--color-text-primary)' }}>
                  Deploy to the endpoint
                </span>
              </div>
              
              <div style={{ paddingLeft: '2rem' }}>
                <div style={{
                  backgroundColor: 'var(--color-bg-overlay)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}>
                  <ul style={{ 
                    margin: 0, 
                    padding: 0, 
                    listStyle: 'none', 
                    fontSize: '0.75rem', 
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Terminal size={14} color="var(--color-accent)" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>Send the ZIP file to the endpoint user and ask them to extract it.</span>
                    </li>
                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Activity size={14} color="var(--color-accent)" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>Run <strong>Install-SentinelTwin.bat</strong>. The agent will automatically enroll and start monitoring.</span>
                    </li>
                  </ul>
                  
                  <div style={{
                    marginTop: '1rem',
                    backgroundColor: 'rgba(210, 153, 34, 0.08)',
                    border: '1px solid rgba(210, 153, 34, 0.3)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-warn)',
                    fontSize: '0.7rem',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start'
                  }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>Administrator permission may be required to enable automatic startup on Windows.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button onClick={onClose} className="st-btn-ghost">
              {downloaded ? 'Done' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
