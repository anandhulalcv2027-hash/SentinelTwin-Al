from collectors.processes import collect_processes
from collectors.network import collect_network_connections
from collectors.ports import collect_open_ports
from collectors.authentication import collect_authentication_events
from collectors.firewall import collect_firewall_state
from collectors.logs import collect_security_events

def collect_security_telemetry() -> dict:
    return {
        "processes": collect_processes(),
        "network_connections": collect_network_connections(),
        "open_ports": collect_open_ports(),
        "authentication_events": collect_authentication_events(),
        "firewall_enabled": collect_firewall_state(),
        "security_events": collect_security_events(),
    }

if __name__ == "__main__":
    import json
    print(json.dumps(collect_security_telemetry(), indent=2))
