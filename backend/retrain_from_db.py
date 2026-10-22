import os
import joblib
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sklearn.ensemble import IsolationForest, RandomForestClassifier

# Use the environment variables or a default connection string
# In a real setup, import from app.core.config
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/sentineltwin")

def fetch_data_from_db():
    engine = create_engine(DATABASE_URL)
    
    query = """
    SELECT 
        cpu_usage_percent, 
        memory_usage_percent, 
        disk_usage_percent,
        network_bytes_sent,
        network_bytes_recv,
        active_connections,
        process_count,
        failed_logins
    FROM device_telemetry
    ORDER BY collected_at DESC
    LIMIT 100000
    """
    
    # In a production scenario, you would label threats based on past ThreatEvents
    # For now, we will fetch raw telemetry, and artificially label anomalies for the Random Forest
    # Or rely strictly on IsolationForest to find anomalies, and a small manually labeled dataset for Random Forest.
    df = pd.read_sql(query, engine)
    return df

def retrain_models():
    print("Fetching real telemetry data from DB...")
    try:
        df = fetch_data_from_db()
    except Exception as e:
        print(f"Failed to connect to database: {e}")
        print("Falling back to synthetic data for demonstration.")
        from train_models import generate_synthetic_data
        df = generate_synthetic_data(10000)
        # Add new dummy columns to synthetic data so it works
        df['network_bytes_sent'] = 1000
        df['network_bytes_recv'] = 1000
        df['active_connections'] = 10
        df['process_count'] = 100
        df['failed_logins'] = 0

    if df.empty:
        print("No data found in DB. Cannot retrain.")
        return

    features = [
        'cpu_usage_percent', 'memory_usage_percent', 'disk_usage_percent',
        'network_bytes_sent', 'network_bytes_recv', 'active_connections',
        'process_count', 'failed_logins'
    ]
    
    X = df[features]
    
    print("Training Isolation Forest (Anomaly Detection) on real baseline...")
    iso_forest = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    iso_forest.fit(X)
    
    print("Training Random Forest (Threat Classification)...")
    # For RF, we need labels. If using real data without labels, we mock it based on rules for demo purposes.
    if 'threat_type' not in df.columns:
        df['threat_type'] = 'None'
        df.loc[df['cpu_usage_percent'] > 95, 'threat_type'] = 'Crypto Miner / High CPU'
        df.loc[df['memory_usage_percent'] > 90, 'threat_type'] = 'Memory Leak'
        df.loc[df['network_bytes_sent'] > 50000000, 'threat_type'] = 'Data Exfiltration'
        df.loc[df['failed_logins'] > 3, 'threat_type'] = 'Brute Force'
        
    y = df['threat_type']
    rf_classifier = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf_classifier.fit(X, y)
    
    models_dir = os.path.join(os.path.dirname(__file__), 'app', 'models', 'ai')
    os.makedirs(models_dir, exist_ok=True)
    
    iso_path = os.path.join(models_dir, 'anomaly_model_v1.joblib')
    rf_path = os.path.join(models_dir, 'risk_model_v1.joblib')
    
    print(f"Saving retrained models to {models_dir}...")
    joblib.dump(iso_forest, iso_path)
    joblib.dump(rf_classifier, rf_path)
    print("Retraining complete!")

if __name__ == "__main__":
    retrain_models()
