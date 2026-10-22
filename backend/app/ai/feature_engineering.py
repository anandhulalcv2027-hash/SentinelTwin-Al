from typing import Any
import pandas as pd
import numpy as np
from app.models.device_telemetry import DeviceTelemetry
from app.models.security_telemetry import SecurityTelemetry

class FeatureEngineering:
    @staticmethod
    def extract_features(
        op_telemetry: DeviceTelemetry,
        sec_telemetry: SecurityTelemetry | None = None,
        historical_telemetry: list[DeviceTelemetry] | None = None,
        historical_sec: list[SecurityTelemetry] | None = None,
    ) -> dict[str, float]:
        """
        Extracts engineered features from raw telemetry data.
        """
        features = {}

        # 1. Operational Features
        features["cpu_usage"] = op_telemetry.cpu_usage_percent
        features["memory_usage"] = op_telemetry.memory_usage_percent
        features["disk_usage"] = op_telemetry.disk_usage_percent
        
        # Rate calculations (if historical exists)
        if historical_telemetry and len(historical_telemetry) > 0:
            prev_op = historical_telemetry[0]
            time_diff = max(1.0, (op_telemetry.collected_at - prev_op.collected_at).total_seconds())
            features["network_tx_rate"] = (op_telemetry.network_bytes_sent - prev_op.network_bytes_sent) / time_diff
            features["network_rx_rate"] = (op_telemetry.network_bytes_recv - prev_op.network_bytes_recv) / time_diff
            # Avoid negative rates due to restarts
            features["network_tx_rate"] = max(0.0, features["network_tx_rate"])
            features["network_rx_rate"] = max(0.0, features["network_rx_rate"])
        else:
            features["network_tx_rate"] = 0.0
            features["network_rx_rate"] = 0.0

        # 2. Security Features
        if sec_telemetry:
            # Connections
            features["active_connection_count"] = float(len(sec_telemetry.network_connections))
            unique_ips = set()
            for conn in sec_telemetry.network_connections:
                remote = conn.get("remote_address")
                if remote:
                    ip = remote.split(":")[0] if ":" in remote else remote
                    unique_ips.add(ip)
            features["unique_remote_ip_count"] = float(len(unique_ips))

            # Ports
            features["listening_port_count"] = float(len(sec_telemetry.open_ports))

            # Auth
            failed_logins = sum(1 for a in sec_telemetry.authentication_events if a.get("event_type") == "login_failure")
            success_logins = sum(1 for a in sec_telemetry.authentication_events if a.get("event_type") == "login_success")
            features["failed_login_count"] = float(failed_logins)
            features["successful_login_count"] = float(success_logins)
            
            total_auth = failed_logins + success_logins
            features["authentication_failure_rate"] = float(failed_logins) / total_auth if total_auth > 0 else 0.0

            # Processes
            features["suspicious_process_count"] = 0.0
            suspicious_names = {"nc.exe", "powershell.exe", "cmd.exe", "mimikatz.exe", "psexec.exe"}
            for p in sec_telemetry.processes:
                if p.get("name", "").lower() in suspicious_names:
                    features["suspicious_process_count"] += 1.0

            # Firewall
            features["firewall_disabled"] = 1.0 if sec_telemetry.firewall_enabled is False else 0.0
            
            features["security_event_frequency"] = float(len(sec_telemetry.security_events))
        else:
            features["active_connection_count"] = 0.0
            features["unique_remote_ip_count"] = 0.0
            features["listening_port_count"] = 0.0
            features["failed_login_count"] = 0.0
            features["successful_login_count"] = 0.0
            features["authentication_failure_rate"] = 0.0
            features["suspicious_process_count"] = 0.0
            features["firewall_disabled"] = 0.0
            features["security_event_frequency"] = 0.0

        # Create DataFrame structure for ML (optional, we return dict for now)
        return features

    @staticmethod
    def features_to_dataframe(features_list: list[dict[str, float]]) -> pd.DataFrame:
        df = pd.DataFrame(features_list)
        # Handle NaNs
        df.fillna(0.0, inplace=True)
        return df
