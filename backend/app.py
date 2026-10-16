from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50
import torch.nn.functional as F
from PIL import Image
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASSES = [
    "Colon Adenocarcinoma",
    "Benign Colon Tissue",
    "Lung Adenocarcinoma",
    "Benign Lung Tissue",
    "Lung Squamous Cell Carcinoma"
]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize ResNet-50 and modify the final layer for 5 classes
model = resnet50(weights=None)
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, len(CLASSES))

# Load the trained weights
weights_path = "lung_colon_resnet50.pth"
if os.path.exists(weights_path):
    model.load_state_dict(torch.load(weights_path, map_location=device))
else:
    print(f"Warning: {weights_path} not found. Running with random weights.")

model = model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPEG images are supported")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(tensor)
            probabilities = F.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
            
        class_idx = predicted.item()
        return {
            "prediction": CLASSES[class_idx],
            "confidence": f"{confidence.item() * 100:.2f}%"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
