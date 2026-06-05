# 🚧 AsphaltEye — AI Road Damage Detection System

AsphaltEye is an end-to-end Computer Vision and Web application designed to automatically detect, classify, and report road damages such as potholes and cracks. Built on top of **Ultralytics YOLOv11**, it features a high-performance **Flask API backend** and an interactive, modern **React frontend dashboard**.

---

## 🌟 Key Features

- **Real-Time Detection**: Analyzes and detects road anomalies in both images and videos.
- **Classification Categories**: Detects and categorizes road defects based on standard RDD (Road Damage Detection) categories:
  - `D00`: Longitudinal Crack
  - `D10`: Transverse Crack
  - `D20`: Alligator Crack
  - `D40`: Pothole
  - Other damages
- **Defect Counter**: Tracks and tallies the total counts of each defect type found in uploaded media.
- **Interactive Dashboard**: Modern user interface built with React to upload media, review visual outputs (with bounding boxes), and generate reports.
- **Community Reporting**: A built-in reporting system allowing users to submit road defect reports with photos, severity levels, descriptions, and locations.

---

## 📁 Repository Structure

```text
├── app.py                     # Flask API backend containing prediction & reporting routes
├── train.py                   # YOLO custom model training script
├── convert_xml_to_yolo.py     # Script to convert RDD XML dataset annotations to YOLO format
├── data.yaml                  # YOLO dataset configuration
├── frontend/                  # React dashboard frontend code (Vite + CSS)
│   ├── src/                   # React source files (components, pages, styles)
│   └── package.json           # Frontend dependencies
├── dataset/                   # Dataset folder (ignored in git)
├── static/                    # Generated outputs, media uploads, and reports (ignored in git)
└── .gitignore                 # Excluded directories (datasets, node_modules, pt models, etc.)
```

---

## 🛠️ Installation & Setup

Follow these instructions to run the application locally.

### 1. Prerequisites
- **Python 3.8+**
- **Node.js 16+** & **npm**

### 2. Backend Setup
1. Clone this repository and navigate to the project directory:
   ```bash
   git clone https://github.com/Fachrilfr/Road-Damage-Detection.git
   cd Road-Damage-Detection
   ```
2. Create and activate a Python virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install flask flask-cors ultralytics opencv-python
   ```
4. Run the Flask API server:
   ```bash
   python app.py
   ```
   *The server will start running on `http://localhost:5001`.*

### 3. Frontend Setup
1. Open a new terminal tab/window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on the local port shown in your terminal (usually `http://localhost:5173`).*

---

## 🧠 Model & Dataset

- **Dataset**: Uses the **RDD2022 (Road Damage Detection)** dataset, featuring annotations formatted in Pascal VOC XML.
- **XML to YOLO Format**: Use `convert_xml_to_yolo.py` to convert XML annotations into standard YOLO text labels.
- **Training**: Custom training was performed using `train.py` on the YOLOv11 model.

---

## 🤝 Contribution

Contributions are welcome! Feel free to open issues or submit pull requests to improve the detection accuracy, expand features, or enhance the dashboard UI.
