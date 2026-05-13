from chronos import Chronos2Pipeline
import torch

pipeline = Chronos2Pipeline.from_pretrained(
    "autogluon/chronos-2-small",
    device_map="cuda" if torch.cuda.is_available() else "cpu"
)