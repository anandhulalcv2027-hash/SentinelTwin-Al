import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import StandardScaler

DATA_PATH = os.path.join(
    os.path.dirname(__file__), 
    '..', 'datasets', 'TON_IoT', 'Train_Test_datasets', 'Train_Test_Windows_dataset', 'Train_Test_Windows_10.csv'
)

def investigate():
    print("--- INVESTIGATING RF ROBUSTNESS ---")
    df = pd.read_csv(DATA_PATH)
    
    # Check distributions
    print("\nFeature Distributions by Label:")
    features = [
        'Processor_pct_ Processor_Time',
        'Memory pct_ Committed Bytes In Use',
        'LogicalDisk(_Total) pct_ Free Space',
        'Network_I(Intel R _82574L_GNC) Bytes Sent sec',
        'Network_I(Intel R _82574L_GNC) Bytes Received sec'
    ]
    
    for f in features:
        # Some cols have ' ' string space
        df[f] = df[f].replace(' ', pd.NA).replace('', pd.NA)
        df[f] = pd.to_numeric(df[f], errors='coerce')
        
    print(df.groupby('label')[features].mean())
    
    # Train with different random seed (999)
    print("\n--- Training with Random Seed 999 ---")
    X = df[features].fillna(df[features].median())
    y = df['label']
    
    # 70/15/15 split
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.30, stratify=y, random_state=999
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=999
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=999, n_jobs=-1)
    rf.fit(X_train_scaled, y_train)
    
    preds = rf.predict(X_test_scaled)
    print(f"Accuracy with Seed 999: {accuracy_score(y_test, preds):.4f}")
    print(classification_report(y_test, preds))
    
if __name__ == "__main__":
    investigate()
