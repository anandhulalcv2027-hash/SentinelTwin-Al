import psutil

def collect_network_connections() -> list:
    connections = []
    try:
        for conn in psutil.net_connections(kind='inet'):
            connections.append({
                "local_address": f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else None,
                "remote_address": f"{conn.raddr.ip}:{conn.raddr.port}" if conn.raddr else None,
                "protocol": "TCP" if conn.type == 1 else "UDP",
                "status": conn.status,
                "pid": conn.pid
            })
    except psutil.AccessDenied:
        pass
    # Limit to top 50 to save bandwidth
    return connections[:50]
