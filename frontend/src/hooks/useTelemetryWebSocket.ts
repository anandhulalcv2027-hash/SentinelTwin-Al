import { useEffect, useRef, useState } from 'react';
import type { DeviceTelemetry } from '@/types/device';

interface TelemetryMessage {
    type: 'telemetry.updated';
    device_id: string;
    telemetry: DeviceTelemetry;
}

interface UseTelemetryWebSocketResult {
    connected: boolean;
}

function buildWebSocketUrl(token: string): string {
    const configuredBaseUrl =
        (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

    const baseUrl = configuredBaseUrl || window.location.origin;

    const url = new URL(baseUrl, window.location.origin);

    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';

    const basePath = url.pathname.replace(/\/+$/, '');

    url.pathname = `${basePath}/api/v1/ws/telemetry`;
    url.search = `token=${encodeURIComponent(token)}`;

    return url.toString();
}

export function useTelemetryWebSocket(
    deviceId: string,
    onTelemetry: (telemetry: DeviceTelemetry) => void,
): UseTelemetryWebSocketResult {
    const [connected, setConnected] = useState(false);

    const onTelemetryRef = useRef(onTelemetry);

    useEffect(() => {
        onTelemetryRef.current = onTelemetry;
    }, [onTelemetry]);

    useEffect(() => {
        const token = localStorage.getItem('st_access_token');

        if (!token) {
            setConnected(false);
            return;
        }

        let socket: WebSocket | null = null;
        let reconnectTimer: number | null = null;
        let pingTimer: number | null = null;
        let stopped = false;

        let reconnectDelay = 2000;

        const clearTimers = () => {
            if (reconnectTimer !== null) {
                window.clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }

            if (pingTimer !== null) {
                window.clearInterval(pingTimer);
                pingTimer = null;
            }
        };

        const scheduleReconnect = () => {
            if (stopped || reconnectTimer !== null) {
                return;
            }

            reconnectTimer = window.setTimeout(() => {
                reconnectTimer = null;
                connect();
            }, reconnectDelay);

            reconnectDelay = Math.min(reconnectDelay * 2, 10000);
        };

        const connect = () => {
            if (stopped) {
                return;
            }

            clearTimers();

            try {
                socket = new WebSocket(buildWebSocketUrl(token));
            } catch (error) {
                console.error('Failed to create telemetry WebSocket:', error);
                setConnected(false);
                scheduleReconnect();
                return;
            }

            socket.onopen = () => {
                if (stopped) {
                    return;
                }

                setConnected(true);
                reconnectDelay = 2000;

                pingTimer = window.setInterval(() => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send('ping');
                    }
                }, 20_000);
            };

            socket.onmessage = (event) => {
                if (stopped) {
                    return;
                }

                try {
                    const message = JSON.parse(
                        event.data,
                    ) as Partial<TelemetryMessage> & {
                        type?: string;
                    };

                    if (
                        message.type === 'telemetry.updated' &&
                        message.device_id === deviceId &&
                        message.telemetry
                    ) {
                        onTelemetryRef.current(message.telemetry);
                    }
                } catch (error) {
                    console.error(
                        'Failed to parse telemetry WebSocket message:',
                        error,
                    );
                }
            };

            socket.onerror = () => {
                setConnected(false);
            };

            socket.onclose = () => {
                setConnected(false);
                clearTimers();
                scheduleReconnect();
            };
        };

        connect();

        return () => {
            stopped = true;
            setConnected(false);
            clearTimers();

            if (socket) {
                socket.close();
                socket = null;
            }
        };
    }, [deviceId]);

    return { connected };
}