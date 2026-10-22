from datetime import timezone
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID

from app.models.device import Device
from app.models.device_telemetry import DeviceTelemetry
from app.models.ai_prediction import AIPrediction
from app.models.threat_event import ThreatEvent
from app.models.enums import ThreatSeverity
from app.models.alert import Alert
from sqlalchemy import select, desc


class DynamicRiskEngineService:

    @staticmethod
    def evaluate(
        db: Session,
        device: Device,
        telemetry: DeviceTelemetry,
        ai_prediction: AIPrediction | None
    ) -> tuple[ThreatEvent | None, Alert | None, bool]:
        """
        Phase 8: Dynamic Risk Engine
        Combines Random Forest, Isolation Forest, and Rule-based indicators.
        Returns a ThreatEvent (Phase 9) if the risk crosses the threshold.
        """
        risk_score = 0.0
        reasons = []
        rule_info = {}
        classifier_info = {}
        anomaly_info = {}
        evidence = {}

        # 1. Rule-Based Security Indicators
        rule_score = 0.0
        
        if telemetry.cpu_usage_percent > 90:
            rule_score += 25.0
            rule_info["high_cpu"] = True
            reasons.append(f"CPU usage critically high ({telemetry.cpu_usage_percent}%)")

        if telemetry.memory_usage_percent > 90:
            rule_score += 25.0
            rule_info["high_memory"] = True
            reasons.append(f"Memory usage critically high ({telemetry.memory_usage_percent}%)")

        # Passive Credential Brute-Force / Authentication Attacks
        if telemetry.failed_logins >= 15:
            rule_score += 70.0
            rule_info["brute_force_auth"] = True
            evidence["failed_logins"] = telemetry.failed_logins
            threat_category = "Passive Credential Brute-Force"
            reasons.append(f"Massive failed logins detected ({telemetry.failed_logins} attempts)")
        elif telemetry.failed_logins >= 5:
            rule_score += 45.0
            rule_info["brute_force_auth"] = True
            evidence["failed_logins"] = telemetry.failed_logins
            threat_category = "Authentication Anomaly"
            reasons.append(f"Multiple failed logins detected ({telemetry.failed_logins} attempts)")

        # Passive Covert Data Exfiltration
        if telemetry.network_bytes_sent > 100_000_000: # 100MB+ egress
            rule_score += 65.0
            rule_info["data_exfiltration"] = True
            evidence["network_bytes_sent"] = telemetry.network_bytes_sent
            threat_category = "Passive Covert Data Exfiltration"
            reasons.append(f"Abnormal outbound data transfer ({telemetry.network_bytes_sent // (1024*1024)} MB sent)")
        elif telemetry.network_bytes_sent > 25_000_000: # 25MB+ egress
            rule_score += 35.0
            rule_info["high_outbound_traffic"] = True
            evidence["network_bytes_sent"] = telemetry.network_bytes_sent
            threat_category = "Suspicious Outbound Egress"
            reasons.append(f"Elevated outbound network traffic ({telemetry.network_bytes_sent // (1024*1024)} MB sent)")
            
        # Network Scanning / Port Reconnaissance / C2 Sockets
        if telemetry.active_connections > 150:
            rule_score += 35.0
            rule_info["network_scanning"] = True
            evidence["active_connections"] = telemetry.active_connections
            if not threat_category:
                threat_category = "Passive Reconnaissance & Port Scan"
            reasons.append(f"Suspicious number of active network sockets ({telemetry.active_connections} connections)")
        elif telemetry.active_connections > 75:
            rule_score += 20.0
            rule_info["high_connection_count"] = True
            evidence["active_connections"] = telemetry.active_connections
            reasons.append("Abnormally high number of active connections")

        # 2. Historical Context (Behavioral Rules)
        try:
            previous_records = db.scalars(
                select(DeviceTelemetry)
                .where(DeviceTelemetry.device_id == device.id)
                .order_by(desc(DeviceTelemetry.collected_at))
                .limit(5)
            ).all()
            
            if len(previous_records) >= 3:
                avg_conn_past = sum(r.active_connections for r in previous_records[1:]) / (len(previous_records) - 1)
                if avg_conn_past > 10 and telemetry.active_connections > avg_conn_past * 2.5:
                    rule_score += 25.0
                    rule_info["connection_spike"] = True
                    reasons.append(f"Connections surged vs recent baseline ({avg_conn_past:.1f} -> {telemetry.active_connections})")
        except Exception:
            pass 

        risk_score += rule_score

        # 3. AI Predictions
        source = "endpoint_agent"
        detection_types = []
        
        if rule_score > 0:
            detection_types.append("rule_based")

        if ai_prediction:
            pred_data = ai_prediction.prediction
            
            # Random Forest contribution
            rf_class = pred_data.get('classification', 'Normal')
            rf_conf = pred_data.get('confidence', 0.0)
            classifier_info = {
                "classification": rf_class,
                "confidence": rf_conf,
                "model_version": pred_data.get("model_version")
            }
            if rf_class == "Attack":
                rf_score = 60.0 * rf_conf
                risk_score += rf_score
                detection_types.append("ai_prediction")
                if not threat_category:
                    threat_category = "Behavioral Resource Anomaly"
                reasons.append(f"AI Classifier detected Attack behavior (Conf: {rf_conf:.2f}, Score: +{rf_score:.1f})")

            # Isolation Forest contribution
            is_anomaly = pred_data.get('is_anomaly', False)
            anomaly_score = pred_data.get('anomaly_score', 0.0)
            anomaly_info = {
                "is_anomaly": is_anomaly,
                "anomaly_score_raw": anomaly_score
            }
            if is_anomaly:
                # Base penalty for anomaly
                iso_score = 30.0
                risk_score += iso_score
                detection_types.append("anomaly_detection")
                if not threat_category:
                    threat_category = "General Anomaly"
                reasons.append(f"AI Anomaly detected (Score: +{iso_score})")

        # 4. Normalize Risk Score
        raw_total_score = risk_score
        normalized_risk_score = min(max(raw_total_score, 0.0), 100.0)
        
        # Preserve calculation components in metadata
        evidence["risk_calculation"] = {
            "raw_rule_score": rule_score,
            "raw_ml_score": raw_total_score - rule_score,
            "raw_total_score": raw_total_score,
            "normalized_risk_score": normalized_risk_score,
            "version": "1.0"
        }

        # 5. Generate Threat Event if Risk is High
        threat_event = None
        if normalized_risk_score >= 50.0: # Detect medium, high, and critical threats
            severity = ThreatSeverity.CRITICAL if normalized_risk_score >= 85.0 else (ThreatSeverity.HIGH if normalized_risk_score >= 65.0 else ThreatSeverity.MEDIUM)
            
            det_type_str = ",".join(detection_types) if detection_types else "rule_based"
            description = " | ".join(reasons)
            
            threat_event = ThreatEvent(
                device_id=device.id,
                organization_id=device.organization_id,
                source=source,
                detection_type=det_type_str,
                threat_category=threat_category or "Correlated Indicators",
                severity=severity,
                risk_score=float(normalized_risk_score),
                classifier_info=classifier_info,
                anomaly_info=anomaly_info,
                rule_info=rule_info,
                evidence_context=evidence,
                status="open",
                description=description,
                detected_at=datetime.now(timezone.utc)
            )
            db.add(threat_event)
            
            # Phase 10: Alert Engine hook
            from app.services.alert_service import AlertService
            alert, is_alert_new = AlertService.process_threat_event(db, threat_event)
            return threat_event, alert, is_alert_new

        return None, None, False
