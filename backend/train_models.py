import os
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestClassifier
import joblib

def generate_synthetic_data(num_samples=10000):
    np.random.seed(42)
    
    # Generate normal telemetry
    normal_samples = int(num_samples * 0.8)
    normal_cpu = np.random.normal(25, 10, normal_samples)
    normal_mem = np.random.normal(50, 15, normal_samples)
    normal_disk = np.random.normal(40, 10, normal_samples)
    
    normal_df = pd.DataFrame({
        'cpu_usage_percent': np.clip(normal_cpu, 0, 100),
        'memory_usage_percent': np.clip(normal_mem, 0, 100),
        'disk_usage_percent': np.clip(normal_disk, 0, 100),
        'is_anomaly': 0,
        'threat_type': 'None'
    })
    
    # Generate Crypto Miner (High CPU)
    miner_samples = int(num_samples * 0.05)
    miner_cpu = np.random.normal(95, 5, miner_samples)
    miner_mem = np.random.normal(60, 10, miner_samples)
    miner_disk = np.random.normal(45, 10, miner_samples)
    
    miner_df = pd.DataFrame({
        'cpu_usage_percent': np.clip(miner_cpu, 0, 100),
        'memory_usage_percent': np.clip(miner_mem, 0, 100),
        'disk_usage_percent': np.clip(miner_disk, 0, 100),
        'is_anomaly': 1,
        'threat_type': 'Crypto Miner'
    })
    
    # Generate Memory Leak (High RAM)
    leak_samples = int(num_samples * 0.05)
    leak_cpu = np.random.normal(30, 10, leak_samples)
    leak_mem = np.random.normal(95, 5, leak_samples)
    leak_disk = np.random.normal(45, 10, leak_samples)
    
    leak_df = pd.DataFrame({
        'cpu_usage_percent': np.clip(leak_cpu, 0, 100),
        'memory_usage_percent': np.clip(leak_mem, 0, 100),
        'disk_usage_percent': np.clip(leak_disk, 0, 100),
        'is_anomaly': 1,
        'threat_type': 'Memory Exhaustion'
    })

    # Generate Ransomware behavior (High CPU, High Disk usage spike)
    # Note: Real ransomware would have IOPS, but we only have disk% for now
    ransom_samples = int(num_samples * 0.1)
    ransom_cpu = np.random.normal(85, 15, ransom_samples)
    ransom_mem = np.random.normal(70, 15, ransom_samples)
    ransom_disk = np.random.normal(95, 5, ransom_samples)
    
    ransom_df = pd.DataFrame({
        'cpu_usage_percent': np.clip(ransom_cpu, 0, 100),
        'memory_usage_percent': np.clip(ransom_mem, 0, 100),
        'disk_usage_percent': np.clip(ransom_disk, 0, 100),
        'is_anomaly': 1,
        'threat_type': 'Ransomware / High I/O'
    })
    
    # Combine and shuffle
    df = pd.concat([normal_df, miner_df, leak_df, ransom_df]).sample(frac=1).reset_index(drop=True)
    return df

def train_and_save_models():
    print("Generating synthetic data...")
    df = generate_synthetic_data(10000)
    
    features = ['cpu_usage_percent', 'memory_usage_percent', 'disk_usage_percent']
    X = df[features]
    
    print("Training Isolation Forest (Anomaly Detection)...")
    iso_forest = IsolationForest(n_estimators=100, contamination=0.2, random_state=42)
    iso_forest.fit(X)
    
    print("Training Random Forest (Threat Classification)...")
    # Only train RF on anomalies to classify them, or train on all.
    # Training on all to classify normal vs specific threats
    y = df['threat_type']
    rf_classifier = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf_classifier.fit(X, y)
    
    # Create models directory
    models_dir = os.path.join(os.path.dirname(__file__), 'app', 'models', 'ai')
    os.makedirs(models_dir, exist_ok=True)
    
    iso_path = os.path.join(models_dir, 'anomaly_model_v1.joblib')
    rf_path = os.path.join(models_dir, 'risk_model_v1.joblib')
    
    print(f"Saving models to {models_dir}...")
    joblib.dump(iso_forest, iso_path)
    joblib.dump(rf_classifier, rf_path)
    print("Training complete! Models saved.")

if __name__ == "__main__":
    train_and_save_models()
