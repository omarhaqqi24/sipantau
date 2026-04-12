from pydantic import BaseModel

class IrisRequest(BaseModel):
    harga_petani_h_min_0: float
    harga_petani_h_min_1: float
    harga_petani_h_min_2: float
    harga_petani_h_min_3: float
    
    harga_pasar_h_min_0: float
    harga_pasar_h_min_1: float
    harga_pasar_h_min_2: float

class PredictionResponse(BaseModel):
    hari_1: float
    hari_2: float
    hari_3: float