from pydantic import BaseModel

class IrisRequest(BaseModel):
    harga_petani_h_min_0: float
    harga_petani_h_min_1: float
    harga_petani_h_min_2: float
    harga_petani_h_min_3: float
    
    harga_pasar_h_min_0: float
    harga_pasar_h_min_1: float
    harga_pasar_h_min_2: float
    
    tanggal: str

class PredictionResponse(BaseModel):
    hari_1: float
    hari_2: float
    hari_3: float
    today: str
    
    # DEBUGGING MODE
    # hari_1: float
    # hari_2: float
    # hari_3: float
    # trend_1: int
    # trend_2: int
    # trend_3: int
    # rolling_mean1: float
    # rolling_mean2: float
    # rolling_mean3: float
    # hpt0: float
    # hpt1: float
    # hpt2: float
    # hpt3: float
    # hps0: float
    # hps1: float
    # hps2: float