import uuid
import sys
import os
from datetime import datetime
from app.db.session import SessionLocal
from app.models.device import Device
from app.models.organization import Organization
from app.models.device_telemetry import DeviceTelemetry
from app.services.risk_engine_service import DynamicRiskEngineService
from app.services.alert_service import AlertService
from app.models.threat_event import ThreatEvent
from app.models.alert import Alert

def test_risk_and_alerts():
    print("--- STARTING RISK ENGINE & ALERT TEST ---")
    db = SessionLocal()
    org_id = uuid.uuid4()
    dev_id = uuid.uuid4()
    try:
        # Create a mock org and device
        org = Organization(id=org_id, name="Test Org", slug=str(org_id), email=f"{org_id}@test.com")
        db.add(org)
        
        dev = Device(id=dev_id, organization_id=org_id, name="Test Device", device_identifier="test-device-id", is_active=True)
        db.add(dev)
        db.commit()
        
        # Test 1: Telemetry with high risk (fails rule-based threshold)
        telemetry = DeviceTelemetry(
            device_id=dev_id,
            cpu_usage_percent=98.0, # Rule triggers
            memory_usage_percent=50.0,
            disk_usage_percent=20.0,
            active_connections=10,
            process_count=100,
            failed_logins=10, # Rule triggers
            network_bytes_sent=0,
            network_bytes_recv=0,
            uptime_seconds=3600,
            hostname="test",
            operating_system="Windows",
            os_version="10",
            agent_version="1.0"
        )
        
        # Mock prediction (anomaly)
        class MockAIPrediction:
            prediction = {
                "classification": "Attack",
                "confidence": 0.85,
                "is_anomaly": True,
                "anomaly_score": -0.5,
                "model_version": "v1"
            }
        
        print("Executing Risk Engine...")
        threat_event, alert, is_alert_new = DynamicRiskEngineService.evaluate(
            db, dev, telemetry, MockAIPrediction()
        )
        
        assert threat_event is not None
        assert alert is not None
        assert is_alert_new is True
        print(f"Test 1 Passed: Threat Event created. Risk Score: {threat_event.risk_score:.2f}")
        print(f"Alert Created: {alert.title} (ID: {alert.id})")
        
        # Commit to save the alert as open
        db.commit()
        
        # Test 2: Send exact same telemetry to test Deduplication
        print("\nExecuting Risk Engine again (duplicate telemetry)...")
        threat_event2, alert2, is_alert_new2 = DynamicRiskEngineService.evaluate(
            db, dev, telemetry, MockAIPrediction()
        )
        
        assert threat_event2 is not None
        assert alert2 is None
        assert is_alert_new2 is False # Should deduplicate alert
        print("Test 2 Passed: Alert deduplication worked. New alert was NOT created.")
        
        # Test 3: Normalization Cap (Score > 100)
        # Mock prediction with high confidence (60 pts) + high rules (85 pts) = 145 raw
        threat_event_cap, alert_cap, _ = DynamicRiskEngineService.evaluate(
            db, dev, telemetry, MockAIPrediction()
        )
        assert threat_event_cap.risk_score == 100.0, f"Expected 100.0, got {threat_event_cap.risk_score}"
        print(f"Test 3 Passed: Risk score capped at 100.0 (Raw was 136.0+)")

        # Test 4: Normal Risk (Score < 60)
        safe_telemetry = DeviceTelemetry(
            device_id=dev_id,
            cpu_usage_percent=10.0,
            memory_usage_percent=20.0,
            disk_usage_percent=20.0,
            active_connections=5,
            process_count=50,
            failed_logins=0,
            network_bytes_sent=0,
            network_bytes_recv=0,
            uptime_seconds=3600,
            hostname="test",
            operating_system="Windows",
            os_version="10",
            agent_version="1.0"
        )
        class MockSafePrediction:
            prediction = {
                "classification": "Normal",
                "confidence": 0.99,
                "is_anomaly": False,
                "anomaly_score": 1.5,
                "model_version": "v1"
            }
        
        threat_event_safe, alert_safe, _ = DynamicRiskEngineService.evaluate(
            db, dev, safe_telemetry, MockSafePrediction()
        )
        assert threat_event_safe is None, "Threat event should not be created for safe telemetry"
        assert alert_safe is None
        print("Test 4 Passed: Safe telemetry ignored.")

        print("\nAll integration tests passed successfully.")

    finally:
        # Cleanup
        db.rollback()
        # Drop the created mock data
        db.query(Alert).filter(Alert.organization_id == org_id).delete()
        db.query(ThreatEvent).filter(ThreatEvent.organization_id == org_id).delete()
        db.query(DeviceTelemetry).filter(DeviceTelemetry.device_id == dev_id).delete()
        db.query(Device).filter(Device.id == dev_id).delete()
        db.query(Organization).filter(Organization.id == org_id).delete()
        db.commit()
        db.close()

if __name__ == "__main__":
    test_risk_and_alerts()
