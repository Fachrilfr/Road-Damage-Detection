from ultralytics import YOLO
import torch

# -----------------------------
# Check device
# -----------------------------
device = "cpu"

print("Using device:", device)
print("Torch CUDA available:", torch.cuda.is_available())

# -----------------------------
# Load pretrained model
# -----------------------------
# Options: n < s < m < l < x
model = YOLO("yolo11n.pt")   # nano model 

# -----------------------------
# Train on CPU
# -----------------------------
model.train(
    data="data.yaml",
    epochs=20,        # 🔥 turunin drastis dulu
    imgsz=416,        # 🔥 lebih ringan dari 640
    batch=2,          # 🔥 aman untuk CPU
    device="cpu",
    workers=1,        # 🔥 lebih stabil di Windows
    cache=False,
    pretrained=True,
    optimizer="SGD",
    verbose=True
)
