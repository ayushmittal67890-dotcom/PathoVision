# PathoVision 🧬

![PathoVision](https://img.shields.io/badge/AI-Diagnostics-blue) ![Accuracy](https://img.shields.io/badge/Accuracy-~99.8%25-success) ![PyTorch](https://img.shields.io/badge/PyTorch-ResNet50-orange) ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green) ![React](https://img.shields.io/badge/React-Frontend-61DAFB)

PathoVision is an end-to-end Deep Learning diagnostic platform that automates the classification of histopathology tissue slides. Using a fine-tuned ResNet-50 Convolutional Neural Network (CNN), the platform accurately detects and classifies 5 distinct types of lung and colon tissue malignancies.

## 🚀 Features
* **State-of-the-art CNN Inference:** Utilizes PyTorch and a fine-tuned ResNet-50 architecture.
* **Exceptional Accuracy:** Achieved **>99.5% Validation Accuracy** (~0.99 F1-Score) on the LC25000 histopathology benchmark dataset.
* **Lightning Fast Backend:** Built with FastAPI for asynchronous, low-latency API image processing and prediction generation.
* **Modern UI/UX:** A responsive React + Tailwind CSS frontend featuring drag-and-drop slide ingestion and dynamic confidence meters.

---

## 🔬 Dataset & Classification Classes
The model was trained on the [LC25000 Lung and Colon Cancer Histopathological Image Dataset](https://www.kaggle.com/datasets/andrewmvd/lung-and-colon-cancer-histopathological-images), utilizing an 80/20 train/validation split with on-the-fly data augmentation (random flips, rotations).

The CNN classifies images into 5 highly specific tissue classes:
1. **Colon Adenocarcinoma**
2. **Benign Colon Tissue**
3. **Lung Adenocarcinoma**
4. **Lung Squamous Cell Carcinoma**
5. **Benign Lung Tissue**

---

## 🛠️ Tech Stack
* **Deep Learning:** Python, PyTorch, Torchvision (ResNet-50)
* **Backend:** FastAPI, Uvicorn, Pydantic
* **Frontend:** React.js, Vite, Tailwind CSS v4

---

## 💻 Running the Project Locally

### Prerequisites
* Python 3.10+
* Node.js & npm

### 1. Start the FastAPI Backend
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn app:app --reload
```
The backend will be running at `http://127.0.0.1:8000`.

### 2. Start the React Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be running at `http://localhost:5173/` (or the port specified by Vite).

---

## 📊 Model Evaluation
* **Architecture:** ResNet-50 (Transfer Learning via ImageNet weights)
* **Optimizer:** AdamW with StepLR scheduler
* **Loss Function:** Cross-Entropy Loss
* **Test Accuracy:** >99.5%
* **Latency:** <150ms per inference

---

*Designed and engineered for highly accurate, automated medical image analysis.*
