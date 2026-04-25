from fastapi import FastAPI, HTTPException
from app.model import predict
from app.schema import IrisRequest, PredictionResponse
import numpy as np
from datetime import datetime

app = FastAPI()

@app.get("/")
def root():
    return {"message": "ML is service running"}

@app.post("/predict", response_model=PredictionResponse)
def predict_api(data: IrisRequest):
    try:
        tgl = datetime.fromisoformat(data.tanggal.replace("Z", "+00:00")).replace(tzinfo=None)
        features = np.array([[
            data.harga_petani_h_min_0,
            data.harga_petani_h_min_1,
            data.harga_petani_h_min_2,
            data.harga_petani_h_min_3,
            data.harga_pasar_h_min_0,
            data.harga_pasar_h_min_1,
            data.harga_pasar_h_min_2,
        ]], dtype=float)
        
        tanggal = tgl
        
        if np.isnan(features).any():
            raise HTTPException(status_code=400, detail="Invalid input")
        
        return predict(features, tanggal)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}