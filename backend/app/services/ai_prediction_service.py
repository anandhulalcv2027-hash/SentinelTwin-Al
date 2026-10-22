from datetime import timezone
import os
import json
import logging
import joblib
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.device import Device
from app.models.ai_prediction import AIPrediction

logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'ai')

class AIPredictionService:
    _metadata = None
    _imputer = None
    _scaler = None
    _rf_model = None
    _iso_model = None
    _is_loaded = False
    
    @classmethod
    def load_models(cls):
        if cls._is_loaded:
            return

        try:
            metadata_path = os.path.join(MODELS_DIR, 'metadata.json')
            imputer_path = os.path.join(MODELS_DIR, 'imputer_v1.joblib')
            scaler_path = os.path.join(MODELS_DIR, 'scaler_v1.joblib')
            rf_path = os.path.join(MODELS_DIR, 'rf_model_v1.joblib')
            iso_path = os.path.join(MODELS_DIR, 'iso_model_v1.joblib')

            if not all(os.path.exists(p) for p in [metadata_path, imputer_path, scaler_path, rf_path, iso_path]):
                logger.warning("One or more AI model artifacts are missing. Prediction Service will operate in fallback mode.")
                return

            with open(metadata_path, 'r') as f:
                cls._metadata = json.load(f)

            cls._imputer = joblib.load(imputer_path)
            cls._scaler = joblib.load(scaler_path)
            cls._rf_model = joblib.load(rf_path)
            cls._iso_model = joblib.load(iso_path)
            
            cls._is_loaded = True
            logger.info("AI models and preprocessing artifacts loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load AI artifacts: {e}")
            cls._is_loaded = False

    @classmethod
    def execute_prediction(cls, db: Session, device: Device, telemetry_features: dict[str, float]) -> AIPrediction | None:
        """
        Executes ML prediction on engineered features.
        If models are unavailable, returns MODEL_NOT_AVAILABLE state via a None or specific return.
        """
        cls.load_models()
        
        if not cls._is_loaded:
            # Model artifacts do not exist. Return controlled status gracefully.
            return None

        required_features = cls._metadata.get("feature_schema", [])
        
        # Validate schema
        missing_features = [f for f in required_features if f not in telemetry_features]
        if missing_features:
            logger.error(f"Schema mismatch. Missing required features: {missing_features}")
            return None

        try:
            # Construct DataFrame exactly matching required feature order
            input_df = pd.DataFrame([telemetry_features], columns=required_features)
            
            # Preprocessing
            imputed_data = cls._imputer.transform(input_df)
            scaled_data = cls._scaler.transform(imputed_data)
            
            # Ensure it remains a DataFrame with correct feature names
            scaled_df = pd.DataFrame(scaled_data, columns=required_features)

            # Random Forest Prediction
            rf_pred = cls._rf_model.predict(scaled_df)[0]
            rf_prob = cls._rf_model.predict_proba(scaled_df)[0].max()
            classification = "Attack" if rf_pred == 1 else "Normal"

            # Isolation Forest Prediction
            iso_raw = cls._iso_model.predict(scaled_df)[0]
            is_anomaly = True if iso_raw == -1 else False
            iso_score = cls._iso_model.decision_function(scaled_df)[0]

            prediction_data = {
                "status": "SUCCESS",
                "prediction_timestamp": datetime.now(timezone.utc).isoformat(),
                "model_version": cls._metadata.get("random_forest", {}).get("version", "unknown"),
                "feature_schema_version": cls._metadata.get("feature_schema", []),
                "classification": classification,
                "confidence": float(rf_prob),
                "is_anomaly": is_anomaly,
                "anomaly_score": float(iso_score)
            }
            
            # Record Prediction
            prediction_record = AIPrediction(
                device_id=device.id,
                model_name=f"rf_{cls._metadata.get('random_forest', {}).get('version', 'unknown')}_iso_{cls._metadata.get('isolation_forest', {}).get('version', 'unknown')}",
                prediction=prediction_data,
                confidence=float(rf_prob) if classification == "Attack" else float(iso_score)
            )
            
            db.add(prediction_record)
            return prediction_record

        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            return None
