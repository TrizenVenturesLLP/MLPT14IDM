# Fingerprint Liveness Risk Analysis System

A multi-agent system that analyzes fingerprint images for **liveness detection** and **usage pattern anomalies**.

## 🎯 What It Does

- **Detects spoofed/fake fingerprints** using CNN-based liveness detection
- **Tracks usage patterns** to identify suspicious behavior (reuse, high frequency)
- **Combines both scores** into a final risk assessment

---

## 🏗️ Architecture

| Agent | Purpose |
|-------|---------|
| **Agent 1** | Usage Pattern Analysis - tracks frequency, cross-case reuse, reactivation |
| **Agent 2** | CNN Liveness Detection - detects spoof/fake fingerprints |
| **Agent 3** | Risk Engine - combines scores: `(liveness × 60%) + (usage × 40%)` |

---

## 📁 Project Structure

```
fingerprint/
├── app/
│   ├── main.py              # FastAPI application
│   ├── database.py          # SQLite usage tracking
│   ├── agents/
│   │   ├── liveness_agent.py    # Agent 2: CNN inference
│   │   ├── usage_agent.py       # Agent 1: Pattern detection
│   │   └── risk_engine.py       # Agent 3: Combined scoring
│   ├── utils/
│   │   └── image_utils.py       # Image preprocessing
│   └── models/
│       └── spoof_model.h5       # Trained CNN model
├── frontend/
│   └── index.html           # Web UI for testing
├── training/
│   ├── train_spoof_model.py     # Model training script
│   ├── create_demo_dataset.py   # Synthetic data generator
│   └── seed_usage_data.py       # Demo usage data seeder
├── dataset/                 # Training images
├── venv/                    # Python virtual environment
└── requirements.txt
```

---

## 🚀 Quick Start

### 1. Setup Environment

```bash
cd "d:\Trizen Ventures\trizen\fingerprint"

# Create virtual environment (if not exists)
python -m venv venv

# Activate
./venv/Scripts/activate   # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Start the Server

```bash
uvicorn app.main:app --port 8000
```

### 3. Test the API

**Option A: Web Interface**
- Open `frontend/index.html` in your browser

**Option B: Swagger UI**
- Open http://localhost:8000/docs

**Option C: Command Line**
```bash
curl -X POST "http://localhost:8000/analyze-fingerprint" \
  -F "file=@dataset/live/live_0001.png" \
  -F "case_id=CASE-001" \
  -F "sector=forensic"
```

---

## 📊 API Response

```json
{
  "liveness_score": 0.83,
  "usage_score": 1.0,
  "combined_score": 0.90,
  "risk_level": "NORMAL",
  "explanation": "Fingerprint appears live and usage patterns are normal",
  "anomalies": []
}
```

### Risk Levels

| Combined Score | Level | Meaning |
|----------------|-------|---------|
| ≥ 0.7 | NORMAL | Live fingerprint, normal usage |
| 0.4 - 0.7 | SUSPICIOUS | Potential anomalies detected |
| < 0.4 | HIGH | Strong risk indicators |

---

## 🔍 Usage Anomalies Detected

- **High frequency**: >5 uses in 24 hours
- **Cross-case reuse**: Same fingerprint in different cases
- **Reactivation**: Dormant >30 days, suddenly active

---

## 🧠 Training Your Own Model

```bash
# Generate synthetic training data
python training/create_demo_dataset.py

# Train the model
python training/train_spoof_model.py --dataset_path ./dataset --epochs 10
```

For better accuracy, use a real dataset like [UniNa Fingerprints PAD](https://www.kaggle.com/c/unina-data-mining-1819-fingeprints-pad).

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python 3.12
- **ML**: TensorFlow/Keras
- **Database**: SQLite
- **Frontend**: HTML/CSS/JS
