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
from app.repositories.device_telemetry_repository import DeviceTelemetryRepository
from sqlalchemy import select, desc


class RuleEngineService:

    @staticmethod
    def evaluate(
        db: Session,
        device: Device,
        telemetry: DeviceTelemetry,
        ai_prediction: AIPrediction | None
    ) -> ThreatEvent | None:
        """
        Combine static rules with AI predictions to calculate a final Risk Score.
        Generates Alerts and ThreatEvents if the risk score exceeds a threshold.
        """
        risk_score = 0
        reasons = []

        # Static Rules
        if telemetry.cpu_usage_percent > 95:
            risk_score += 30
            reasons.append(f"CPU usage critically high ({telemetry.cpu_usage_percent}%)")

        if telemetry.memory_usage_percent > 90:
            risk_score += 20
            reasons.append(f"Memory usage high ({telemetry.memory_usage_percent}%)")

        if telemetry.network_bytes_sent > 100000000: # 100MB in one heartbeat
            risk_score += 40
            reasons.append(f"High outbound network traffic ({telemetry.network_bytes_sent} bytes)")

        if telemetry.failed_logins > 5:
            risk_score += 50
            reasons.append(f"Multiple failed logins detected ({telemetry.failed_logins})")

        # Behavioral / Time-Series Rules
        # Fetch the last 5 telemetry records for this device
        try:
            previous_records = db.scalars(
                select(DeviceTelemetry)
                .where(DeviceTelemetry.device_id == device.id)
                .order_by(desc(DeviceTelemetry.collected_at))
                .limit(5)
            ).all()
            
            if len(previous_records) >= 3:
                # Spike detection for CPU
                avg_cpu_past = sum(r.cpu_usage_percent for r in previous_records[1:]) / (len(previous_records) - 1)
                if avg_cpu_past > 0 and telemetry.cpu_usage_percent > avg_cpu_past * 1.5:
                    risk_score += 15
                    reasons.append(f"CPU usage spiked by 50% compared to recent average ({avg_cpu_past:.1f}% -> {telemetry.cpu_usage_percent}%)")
                
                # Anomaly in active connections
                avg_conn_past = sum(r.active_connections for r in previous_records[1:]) / (len(previous_records) - 1)
                if avg_conn_past > 10 and telemetry.active_connections > avg_conn_past * 2:
                    risk_score += 25
                    reasons.append(f"Active connections doubled compared to recent average ({avg_conn_past:.1f} -> {telemetry.active_connections})")
        except Exception:
            pass # Failsafe against DB issues during trend analysis

        # Combine with AI Prediction
        if ai_prediction and ai_prediction.prediction.get('is_anomaly'):
            confidence = ai_prediction.confidence or 0.0
            ai_threat = ai_prediction.prediction.get('threat_type', 'Unknown')
            
            # AI risk contribution scales with confidence
            ai_score = int(50 * confidence)
            risk_score += ai_score
            reasons.append(f"AI Anomaly '{ai_threat}' (Conf: {confidence:.2f}, Score: +{ai_score})")
            
        # Determine Severity based on Risk Score
        threat_event = None
        if risk_score >= 80:
            severity = ThreatSeverity.CRITICAL if risk_score > 120 else ThreatSeverity.HIGH
            
            description = " | ".join(reasons)
            threat_event = ThreatEvent(
                device_id=device.id,
                threat_type="Correlated Threat",
                severity=severity,
                description=f"Risk Score: {risk_score}. {description}",
                detected_at=datetime.now(timezone.utc)
            )
            db.add(threat_event)
            
            alert = Alert(
                organization_id=device.organization_id,
                device_id=device.id,
                alert_type="correlated_threat",
                severity=severity.value.lower(),
                title="High Risk Threat Detected",
                message=f"Risk score of {risk_score} reached. Reasons: {description}",
                metric_value=float(risk_score),
                status="open",
            )
            db.add(alert)

        return threat_event
