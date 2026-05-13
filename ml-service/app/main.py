from fastapi import FastAPI
from pydantic import BaseModel

import numpy as np

from app.model import pipeline

app = FastAPI()

class PredictRequest(BaseModel):
    data: list

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: PredictRequest):

    context = np.array(req.data).astype(float)

    # (window, variates)
    context = context.T

    # (1, variates, window)
    context = np.expand_dims(context, axis=0)

    forecast = pipeline.predict(
        inputs=context,
        prediction_length=3
    )

    pred_tensor = forecast[0]

    predictions = pred_tensor.median(dim=1).values
    predictions = predictions.squeeze().cpu().numpy()

    harga_pred = predictions[0].tolist()

    return {
        "prediksi": harga_pred
    }