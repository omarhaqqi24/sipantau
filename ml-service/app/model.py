import joblib
import os
import logging
import numpy as np
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../model/model_rf_cabai_tuned.pkl")
START_DATE = datetime(2025, 1, 1)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

with open(MODEL_PATH, "rb") as f:
    model = joblib.load(f)
    if model is None:
        raise ValueError("Model failed to load")
    else:
        logger.info("Model loaded successfully")

def predict(features):
    feature = features[0]
    
    hpt0 = feature[0] # Hari ini
    hpt1 = feature[1] # H-1
    hpt2 = feature[2] # H-2
    hpt3 = feature[3] # H-3
    
    hps0 = feature[4] # Hari ini
    hps1 = feature[5] # H-1
    hps2 = feature[6] # H-2
    
    today = datetime.now()
    bulan = today.month
    trend_today = (today - START_DATE).days + 1
    
    # PREDICT H+1
    
    lag2 = hpt1
    lag3 = hpt2
    lag4 = hpt3
    rolling_mean = (hps0 + hps1) / 2
    trend = trend_today + 1
    
    X1 = np.array([[trend, lag3, bulan, rolling_mean, lag2, lag4]])
    pred1 = model.predict(X1)[0]
    
    # PREDICT H+2
    
    lag2 = hpt0
    lag3 = hpt1
    lag4 = hpt2
    rolling_mean = (pred1 + hps0) / 2
    trend = trend + 1
    
    X2 = np.array([[trend, lag3, bulan, rolling_mean, lag2, lag4]])
    pred2 = model.predict(X2)[0]
    
    # PREDICT H+3
    
    lag2 = hpt0
    lag3 = hpt0
    lag4 = hpt1
    
    rolling_mean = (pred2 + pred1) / 2
    trend = trend + 1
    
    X3 = np.array([[trend, lag3, bulan, rolling_mean, lag2, lag4]])
    pred3 = model.predict(X3)[0]
    
    return {
        "hari_1": pred1,
        "hari_2": pred2,
        "hari_3": pred3
    }