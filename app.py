# ============================================================
# app.py — AsphaltEye (Backend API)
# Frontend sekarang menggunakan React (Vite) di folder frontend/
# ============================================================
from flask import Flask, request, jsonify
from ultralytics import YOLO
import cv2
import os
import uuid
import json
from datetime import datetime

app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads"
RESULT_FOLDER = "static/results"
REPORT_FOLDER = "static/reports"
REPORTS_JSON  = "data/reports.json"

for folder in [UPLOAD_FOLDER, RESULT_FOLDER, REPORT_FOLDER, "data"]:
    os.makedirs(folder, exist_ok=True)

model = YOLO("runs/detect/train8/weights/best.pt")
print(model.names)


# ── HELPERS ─────────────────────────────────────────────────
def count_detections(results):
    counts = {"D00": 0, "D10": 0, "D20": 0, "D40": 0, "OTHER": 0}
    class_map = {
        "Longitudinal Crack": "D00",
        "Transverse Crack":   "D10",
        "Alligator Crack":    "D20",
        "Pothole":            "D40"
    }
    for r in results:
        if r.boxes is None:
            continue
        for cls in r.boxes.cls.tolist():
            name = model.names[int(cls)]
            counts[class_map.get(name, "OTHER")] += 1
    return counts


def load_reports():
    if not os.path.exists(REPORTS_JSON):
        return []
    with open(REPORTS_JSON, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def save_reports(reports):
    with open(REPORTS_JSON, "w", encoding="utf-8") as f:
        json.dump(reports, f, ensure_ascii=False, indent=2)


# ── DETECTION ENDPOINTS ──────────────────────────────────────

@app.route("/predict_image", methods=["POST"])
def predict_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"})
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"})
    filename    = str(uuid.uuid4()) + ".jpg"
    upload_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(upload_path)
    results     = model(upload_path)
    counts      = count_detections(results)
    annotated   = results[0].plot()
    result_path = os.path.join(RESULT_FOLDER, filename)
    cv2.imwrite(result_path, annotated)
    return jsonify({"result_image": "/" + result_path, "counts": counts})


video_progress = {"percent": 0}

@app.route("/predict_video", methods=["POST"])
def predict_video():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"})
    file = request.files["file"]
    conf = float(request.form.get("confidence", 0.25))
    filename    = str(uuid.uuid4()) + ".mp4"
    upload_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(upload_path)
    cap    = cv2.VideoCapture(upload_path)
    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps    = int(cap.get(cv2.CAP_PROP_FPS) or 25)
    result_path = os.path.join(RESULT_FOLDER, "annotated_" + filename)
    out = cv2.VideoWriter(
        result_path, cv2.VideoWriter_fourcc(*"mp4v"), fps, (width, height)
    )
    counts = {"D00": 0, "D10": 0, "D20": 0, "D40": 0, "OTHER": 0}
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        results      = model(frame, conf=conf)
        frame_counts = count_detections(results)
        for k in counts:
            counts[k] += frame_counts[k]
        out.write(results[0].plot())
    cap.release()
    out.release()
    return jsonify({"result_video": "/" + result_path, "counts": counts})


# ── REPORT ENDPOINTS ─────────────────────────────────────────

@app.route("/submit_report", methods=["POST"])
def submit_report():
    reporter_name = request.form.get("reporter_name", "").strip()
    location      = request.form.get("location", "").strip()
    latitude      = request.form.get("latitude", "").strip()
    longitude     = request.form.get("longitude", "").strip()
    severity      = request.form.get("severity", "").strip()
    description   = request.form.get("description", "").strip()
    damage_types  = request.form.get("damage_types", "").strip()

    if not reporter_name:
        return jsonify({"success": False, "error": "Nama pelapor wajib diisi."})
    if not location:
        return jsonify({"success": False, "error": "Lokasi wajib diisi."})
    if not damage_types:
        return jsonify({"success": False, "error": "Jenis kerusakan wajib dipilih."})
    if not severity:
        return jsonify({"success": False, "error": "Tingkat keparahan wajib dipilih."})

    photo_path = None
    if "photo" in request.files:
        photo = request.files["photo"]
        if photo and photo.filename:
            ext        = os.path.splitext(photo.filename)[1].lower() or ".jpg"
            photo_name = str(uuid.uuid4()) + ext
            save_path  = os.path.join(REPORT_FOLDER, photo_name)
            photo.save(save_path)
            photo_path = "/" + save_path

    report = {
        "id":            str(uuid.uuid4())[:8].upper(),
        "timestamp":     datetime.now().isoformat(),
        "reporter_name": reporter_name,
        "location":      location,
        "latitude":      latitude or None,
        "longitude":     longitude or None,
        "damage_types":  [d.strip() for d in damage_types.split(",") if d.strip()],
        "severity":      severity,
        "description":   description,
        "photo_url":     photo_path,
        "status":        "Dilaporkan"
    }

    reports = load_reports()
    reports.insert(0, report)
    save_reports(reports)

    return jsonify({
        "success":   True,
        "report_id": report["id"],
        "message":   f"Laporan #{report['id']} berhasil disimpan."
    })


@app.route("/api/reports", methods=["GET"])
def api_reports():
    reports = load_reports()
    return jsonify({"reports": reports, "total": len(reports)})


# ── RUN ──────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5001)