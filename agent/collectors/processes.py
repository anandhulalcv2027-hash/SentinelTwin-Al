import psutil

def collect_processes() -> list:
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'exe', 'username', 'ppid', 'cpu_percent', 'memory_percent', 'create_time']):
        try:
            info = proc.info
            processes.append({
                "pid": info.get('pid'),
                "name": info.get('name') or "",
                "exe": info.get('exe'),
                "username": info.get('username'),
                "ppid": info.get('ppid'),
                "cpu_percent": info.get('cpu_percent', 0.0),
                "memory_percent": info.get('memory_percent', 0.0),
                "create_time": info.get('create_time')
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    # Limit to top 50 processes by CPU to save bandwidth
    processes.sort(key=lambda x: x['cpu_percent'] or 0, reverse=True)
    return processes[:50]
