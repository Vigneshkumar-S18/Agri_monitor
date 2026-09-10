import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_NAME = "oshriagronov/tomadoc-mythos"
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
model.eval()

def predict_disease(image: Image.Image):
    image = image.convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)
        
    probabilities = torch.softmax(outputs.logits, dim=-1)[0]
    top_values, top_indices = torch.topk(probabilities, k=3)
    
    results = []
    for value, index in zip(top_values, top_indices):
        label = model.config.id2label[index.item()]
        results.append({
            "label": label,
            "confidence": round(float(value) * 100, 2)
        })
        
    return results
