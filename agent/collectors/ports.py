import psutil

def collect_open_ports() -> list:
    ports = []
    try:
        for conn in psutil.net_connections(kind='inet'):
            if conn.status == 'LISTEN':
                ports.append({
                    "port": conn.laddr.port if conn.laddr else None,
                    "protocol": "TCP" if conn.type == 1 else "UDP",
                    "bind_address": conn.laddr.ip if conn.laddr else None,
                    "pid": conn.pid
                })
    except psutil.AccessDenied:
        pass
    return ports[:50]
