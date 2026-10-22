import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Shield, XCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState<
        'verifying' | 'success' | 'error'
    >('verifying');

    const [message, setMessage] = useState(
        'Verifying your email address...',
    );

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        async function verifyEmail() {
            try {
                const response = await api.post(
                    '/api/v1/auth/verify-email',
                    {
                        token,
                    },
                );

                setStatus('success');
                setMessage(
                    response.data?.message ||
                    response.data ||
                    'Your email has been verified successfully.',
                );
            } catch (error) {
                let errorMessage = 'Unable to verify your email address.';

                if (
                    error &&
                    typeof error === 'object' &&
                    'response' in error
                ) {
                    const axiosError = error as {
                        response?: {
                            data?: {
                                detail?: string;
                            };
                        };
                    };

                    if (axiosError.response?.data?.detail) {
                        errorMessage = axiosError.response.data.detail;
                    }
                }

                setStatus('error');
                setMessage(errorMessage);
            }
        }

        verifyEmail();
    }, [searchParams]);

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
                <Shield
                    size={22}
                    color="var(--color-accent)"
                />

                <span
                    style={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    SentinelTwin{' '}
                    <span style={{ color: 'var(--color-accent)' }}>
                        AI
                    </span>
                </span>
            </Link>

            {/* Card */}
            <div
                className="st-card animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: 420,
                    textAlign: 'center',
                }}
            >
                {status === 'verifying' && (
                    <>
                        <Loader2
                            size={42}
                            color="var(--color-accent)"
                            style={{
                                animation:
                                    'spin 1s linear infinite',
                                marginBottom: '1rem',
                            }}
                        />

                        <h1
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color:
                                    'var(--color-text-primary)',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Verifying your email
                        </h1>

                        <p
                            style={{
                                fontSize: '0.85rem',
                                color:
                                    'var(--color-text-secondary)',
                            }}
                        >
                            Please wait while we verify your
                            email address.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle2
                            size={48}
                            color="var(--color-accent)"
                            style={{
                                marginBottom: '1rem',
                            }}
                        />

                        <h1
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color:
                                    'var(--color-text-primary)',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Email verified
                        </h1>

                        <p
                            style={{
                                fontSize: '0.85rem',
                                color:
                                    'var(--color-text-secondary)',
                                lineHeight: 1.6,
                                marginBottom: '1.5rem',
                            }}
                        >
                            {message}
                        </p>

                        <Link
                            to="/login"
                            className="st-btn-primary"
                            style={{
                                display: 'inline-flex',
                                width: '100%',
                                justifyContent: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            Continue to Sign In
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle
                            size={48}
                            color="var(--color-danger)"
                            style={{
                                marginBottom: '1rem',
                            }}
                        />

                        <h1
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color:
                                    'var(--color-text-primary)',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Verification failed
                        </h1>

                        <p
                            style={{
                                fontSize: '0.85rem',
                                color:
                                    'var(--color-text-secondary)',
                                lineHeight: 1.6,
                                marginBottom: '1.5rem',
                            }}
                        >
                            {message}
                        </p>

                        <Link
                            to="/login"
                            style={{
                                color: 'var(--color-accent)',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                            }}
                        >
                            Return to Sign In
                        </Link>
                    </>
                )}
            </div>

            <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
}
