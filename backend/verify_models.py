import os
import sys
import json
import joblib
import pandas as pd
from datetime import datetime

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'app', 'models', 'ai')

def verify():
    print("--- STARTING ARTIFACT LOAD TEST ---")
    
    metadata_path = os.path.join(MODELS_DIR, 'metadata.json')
    imputer_path = os.path.join(MODELS_DIR, 'imputer_v1.joblib')
    scaler_path = os.path.join(MODELS_DIR, 'scaler_v1.joblib')
    rf_path = os.path.join(MODELS_DIR, 'rf_model_v1.joblib')
    iso_path = os.path.join(MODELS_DIR, 'iso_model_v1.joblib')

    for p in [metadata_path, imputer_path, scaler_path, rf_path, iso_path]:
        assert os.path.exists(p), f"Artifact missing: {p}"
        print(f"Verified existence: {os.path.basename(p)}")

    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    print("\nMETADATA LOADED:", list(metadata.keys()))
    print("Feature Schema:", metadata.get("feature_schema"))

    imputer = joblib.load(imputer_path)
    scaler = joblib.load(scaler_path)
    rf_model = joblib.load(rf_path)
    iso_model = joblib.load(iso_path)
    
    print("\nMODELS LOADED SUCCESSFULLY.")
    
    # Test Prediction
    print("\n--- TEST PREDICTION ---")
    test_feature_dict = {
        "cpu_usage_percent": 85.0,
        "memory_usage_percent": 92.5,
        "disk_usage_percent": 75.0,
        "network_tx_rate": 10240.0,
        "network_rx_rate": 5120.0
    }
    
    schema = metadata["feature_schema"]
    print(f"Validating order against schema: {schema}")
    input_df = pd.DataFrame([test_feature_dict], columns=schema)
    
    imputed = imputer.transform(input_df)
    scaled = scaler.transform(imputed)
    scaled_df = pd.DataFrame(scaled, columns=schema)
    
    rf_pred = rf_model.predict(scaled_df)[0]
    rf_prob = rf_model.predict_proba(scaled_df)[0].max()
    
    iso_pred = iso_model.predict(scaled_df)[0]
    iso_score = iso_model.decision_function(scaled_df)[0]
    
    print("Preprocessed Output (scaled):")
    print(scaled_df.values)
    
    print(f"Random Forest output: Class={rf_pred}, Prob={rf_prob:.4f}")
    print(f"Isolation Forest output: Class={iso_pred}, Score={iso_score:.4f}")
    
if __name__ == "__main__":
    verify()
