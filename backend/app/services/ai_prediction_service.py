import os
import joblib
import pandas as pd
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.device_telemetry import DeviceTelemetry
from app.models.ai_prediction import AIPrediction
from app.models.threat_event import ThreatEvent
from app.models.enums import ThreatSeverity
from app.models.alert import Alert
from app.models.device import Device

class AIPredictionService:
    _iso_model = None
    _rf_model = None
    
    @classmethod
    def load_models(cls):
        if cls._iso_model is None or cls._rf_model is None:
            models_dir = os.path.join(os.path.dirname(__file__), '..', 'models', 'ai')
            iso_path = os.path.join(models_dir, 'anomaly_model_v1.joblib')
            rf_path = os.path.join(models_dir, 'risk_model_v1.joblib')
            
            if os.path.exists(iso_path) and os.path.exists(rf_path):
                cls._iso_model = joblib.load(iso_path)
                cls._rf_model = joblib.load(rf_path)
            else:
                raise FileNotFoundError("AI models not found. Please run train_models.py first.")

    @classmethod
    def evaluate_telemetry(cls, db: Session, device: Device, telemetry: DeviceTelemetry) -> tuple[AIPrediction | None, ThreatEvent | None]:
        try:
            cls.load_models()
        except FileNotFoundError:
            # Silently skip if models are not generated yet, or log it
            return None, None
            
        features = pd.DataFrame([{
            'cpu_usage_percent': telemetry.cpu_usage_percent,
            'memory_usage_percent': telemetry.memory_usage_percent,
            'disk_usage_percent': telemetry.disk_usage_percent,
        }])
        
        # 1 means normal, -1 means anomaly in IsolationForest
        anomaly_pred = cls._iso_model.predict(features)[0]
        
        # Default confidence from decision function
        decision_score = float(cls._iso_model.decision_function(features)[0])
        confidence = min(max(abs(decision_score) * 2, 0.0), 1.0) # normalized roughly
        
        is_anomaly = (anomaly_pred == -1)
        threat_type = 'None'
        
        if is_anomaly:
            threat_pred = cls._rf_model.predict(features)[0]
            threat_type = threat_pred
            
            # Predict probability if available
            proba = cls._rf_model.predict_proba(features)
            confidence = float(max(proba[0]))
        
        # Record Prediction
        prediction_record = AIPrediction(
            device_id=device.id,
            model_name="risk_model_v1.0.0",
            prediction={
                "is_anomaly": bool(is_anomaly),
                "threat_type": str(threat_type)
            },
            confidence=confidence
        )
        
        db.add(prediction_record)
        
        threat_event = None
        if is_anomaly and threat_type != 'None':
            # Create ThreatEvent
            threat_event = ThreatEvent(
                device_id=device.id,
                threat_type=str(threat_type),
                severity=ThreatSeverity.HIGH if confidence > 0.8 else ThreatSeverity.MEDIUM,
                description=f"AI detected anomalous behavior matching signature: {threat_type} with confidence {confidence:.2f}",
                detected_at=datetime.utcnow()
            )
            db.add(threat_event)
            
            # Create an Alert for Incident Management
            alert = Alert(
                organization_id=device.organization_id,
                device_id=device.id,
                alert_type="ai_threat",
                severity="critical" if confidence > 0.8 else "error",
                title=f"AI Threat Detected: {threat_type}",
                message=f"AI Engine detected {threat_type} anomalous behavior with {confidence*100:.1f}% confidence.",
                metric_value=telemetry.cpu_usage_percent,
                threshold_value=None,
                status="open",
            )
            db.add(alert)
            
        return prediction_record, threat_event
