from datetime import timezone
import os
import json
from datetime import datetime
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import joblib

DATA_PATH = os.path.join(
    os.path.dirname(__file__), 
    '..', 'datasets', 'TON_IoT', 'Train_Test_datasets', 'Train_Test_Windows_dataset', 'Train_Test_Windows_10.csv'
)
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'app', 'models', 'ai')

FEATURE_MAPPING = {
    'Processor_pct_ Processor_Time': 'cpu_usage_percent',
    'Memory pct_ Committed Bytes In Use': 'memory_usage_percent',
    'LogicalDisk(_Total) pct_ Free Space': 'disk_usage_percent_raw', # will derive
    'Network_I(Intel R _82574L_GNC) Bytes Sent sec': 'network_tx_rate',
    'Network_I(Intel R _82574L_GNC) Bytes Received sec': 'network_rx_rate'
}

FINAL_FEATURES = [
    'cpu_usage_percent', 
    'memory_usage_percent', 
    'disk_usage_percent', 
    'network_tx_rate', 
    'network_rx_rate'
]

def load_and_preprocess_data():
    print(f"Loading dataset from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    
    # Extract mapped features
    X_raw = pd.DataFrame()
    for source_col, target_col in FEATURE_MAPPING.items():
        if source_col in df.columns:
            X_raw[target_col] = df[source_col]
        else:
            raise ValueError(f"Missing required column in dataset: {source_col}")
            
    # Replace ' ' with NaN and cast to float
    X_raw = X_raw.replace(' ', np.nan).replace('', np.nan)
    for col in X_raw.columns:
        X_raw[col] = pd.to_numeric(X_raw[col], errors='coerce')
        
    # Derivations
    X_raw['disk_usage_percent'] = 100.0 - X_raw['disk_usage_percent_raw']
    
    # Select final features
    X = X_raw[FINAL_FEATURES]
    y = df['label'] # Binary label: 0 normal, 1 attack
    
    return X, y

def train_pipeline():
    X, y = load_and_preprocess_data()
    
    print(f"Dataset shape: {X.shape}, Target distribution: {y.value_counts().to_dict()}")
    
    # 1. Split: 70% Train, 30% Temp (Val + Test)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.30, stratify=y, random_state=42
    )
    
    # Split Temp into 15% Val, 15% Test
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=42
    )
    
    print(f"Train size: {X_train.shape[0]}, Val size: {X_val.shape[0]}, Test size: {X_test.shape[0]}")
    
    # 2. Preprocessing (Fit ONLY on Train)
    imputer = SimpleImputer(strategy='median')
    X_train_imputed = imputer.fit_transform(X_train)
    X_val_imputed = imputer.transform(X_val)
    X_test_imputed = imputer.transform(X_test)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_imputed)
    X_val_scaled = scaler.transform(X_val_imputed)
    X_test_scaled = scaler.transform(X_test_imputed)
    
    # Convert back to DataFrame to preserve feature names (useful for some sklearn warnings)
    X_train_scaled = pd.DataFrame(X_train_scaled, columns=FINAL_FEATURES)
    X_test_scaled = pd.DataFrame(X_test_scaled, columns=FINAL_FEATURES)
    
    # 3. Train Random Forest
    print("\n--- Training Random Forest (Binary Classification) ---")
    rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    rf.fit(X_train_scaled, y_train)
    
    # Evaluate RF on Test Set
    rf_preds = rf.predict(X_test_scaled)
    rf_probs = rf.predict_proba(X_test_scaled)[:, 1]
    
    print("Random Forest Evaluation (Test Set):")
    print(classification_report(y_test, rf_preds, target_names=["Normal", "Attack"]))
    print(f"Accuracy:  {accuracy_score(y_test, rf_preds):.4f}")
    print(f"Precision: {precision_score(y_test, rf_preds):.4f}")
    print(f"Recall:    {recall_score(y_test, rf_preds):.4f}")
    print(f"F1-Score:  {f1_score(y_test, rf_preds):.4f}")
    print(f"ROC-AUC:   {roc_auc_score(y_test, rf_probs):.4f}")
    print("Confusion Matrix:\n", confusion_matrix(y_test, rf_preds))
    
    # Feature Importance
    importances = list(zip(FINAL_FEATURES, rf.feature_importances_))
    importances.sort(key=lambda x: x[1], reverse=True)
    print("\nFeature Importances:")
    for feat, imp in importances:
        print(f"  {feat}: {imp:.4f}")
        
    # 4. Train Isolation Forest
    print("\n--- Training Isolation Forest (Anomaly Detection) ---")
    # Train ONLY on Normal data from the Train set
    normal_mask = (y_train.values == 0)
    X_train_normal = X_train_scaled.loc[normal_mask]
    print(f"Training IF on {X_train_normal.shape[0]} normal samples...")
    
    iso = IsolationForest(n_estimators=100, contamination=0.05, random_state=42, n_jobs=-1)
    iso.fit(X_train_normal)
    
    # Evaluate IF on Test Set
    # IF output: 1 for inlier, -1 for outlier. Map to 0 (normal) and 1 (attack/anomaly)
    iso_raw_preds = iso.predict(X_test_scaled)
    iso_preds = np.where(iso_raw_preds == -1, 1, 0)
    
    print("Isolation Forest Evaluation (Test Set):")
    print(classification_report(y_test, iso_preds, target_names=["Normal", "Anomaly/Attack"]))
    print(f"Accuracy:  {accuracy_score(y_test, iso_preds):.4f}")
    print(f"Precision: {precision_score(y_test, iso_preds):.4f}")
    print(f"Recall:    {recall_score(y_test, iso_preds):.4f}")
    print(f"F1-Score:  {f1_score(y_test, iso_preds):.4f}")
    print("Confusion Matrix:\n", confusion_matrix(y_test, iso_preds))
    
    # 5. Save Models and Metadata
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    print("\nSaving artifacts...")
    joblib.dump(imputer, os.path.join(MODELS_DIR, 'imputer_v1.joblib'))
    joblib.dump(scaler, os.path.join(MODELS_DIR, 'scaler_v1.joblib'))
    joblib.dump(rf, os.path.join(MODELS_DIR, 'rf_model_v1.joblib'))
    joblib.dump(iso, os.path.join(MODELS_DIR, 'iso_model_v1.joblib'))
    
    metadata = {
        "dataset_source": "TON_IoT_Windows_10",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "feature_schema": FINAL_FEATURES,
        "preprocessing": "StandardScaler (fit on 70% train)",
        "random_forest": {
            "version": "v1",
            "parameters": rf.get_params(),
            "metrics_test": {
                "accuracy": accuracy_score(y_test, rf_preds),
                "f1_score": f1_score(y_test, rf_preds),
                "roc_auc": roc_auc_score(y_test, rf_probs)
            }
        },
        "isolation_forest": {
            "version": "v1",
            "parameters": iso.get_params(),
            "training_data": "Normal only (from Train set)",
            "metrics_test": {
                "accuracy": accuracy_score(y_test, iso_preds),
                "f1_score": f1_score(y_test, iso_preds)
            }
        }
    }
    
    with open(os.path.join(MODELS_DIR, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=4)
        
    print("Done! Artifacts saved to:", MODELS_DIR)

if __name__ == "__main__":
    train_pipeline()
