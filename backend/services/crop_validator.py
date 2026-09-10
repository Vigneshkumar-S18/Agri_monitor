import torch
from PIL import Image, ImageStat
from transformers import CLIPProcessor, CLIPModel

CLIP_MODEL_NAME = "openai/clip-vit-base-patch32"

try:
    processor = CLIPProcessor.from_pretrained(CLIP_MODEL_NAME)
    clip_model = CLIPModel.from_pretrained(CLIP_MODEL_NAME)
    clip_model.eval()
    CLIP_AVAILABLE = True
except Exception as e:
    print(f"Warning: Failed to load CLIP model: {e}")
    CLIP_AVAILABLE = False
    processor = None
    clip_model = None

# Contrasting prompt categories
CROP_LABELS = [
    "a tomato plant leaf",
    "a tomato leaf with texture and veins",
    "a close-up photo of a plant leaf"
]

NON_CROP_LABELS = [
    "a human person, face, or selfie",
    "a dog, cat, animal, bird, or pet",
    "a car, vehicle, or motorcycle",
    "a building, architecture, or city street",
    "a laptop, computer, mobile phone, or electronic screen",
    "furniture, indoor room, or household object",
    "food, cooked meal, or beverage",
    "a random object or drawing"
]

ALL_LABELS = CROP_LABELS + NON_CROP_LABELS

def check_basic_image_quality(image: Image.Image) -> tuple[bool, str]:
    """Basic sanity checks on image dimensions and variance."""
    if image.width < 50 or image.height < 50:
        return False, "Image resolution is too low."
    
    # Check if image is blank or nearly uniform
    stat = ImageStat.Stat(image.convert("L"))
    variance = stat.var[0]
    if variance < 10:
        return False, "Image is blank or has insufficient visual detail."
        
    return True, ""

def validate_tomato_image(image: Image.Image) -> dict:
    """
    Stage 1 Validator:
    Determines if the uploaded image actually depicts a tomato / plant leaf,
    preventing Out-Of-Distribution (OOD) hallucinations.
    """
    # 1. Basic image quality check
    is_good_quality, reason = check_basic_image_quality(image)
    if not is_good_quality:
        return {
            "is_valid_crop": False,
            "confidence": 0.0,
            "detected_category": "Invalid / Blank Image",
            "reason": reason
        }

    # If CLIP is not available, fallback to basic image validation
    if not CLIP_AVAILABLE or clip_model is None:
        return {
            "is_valid_crop": True,
            "confidence": 100.0,
            "detected_category": "Tomato Leaf (Fallback Mode)",
            "reason": None
        }

    try:
        rgb_image = image.convert("RGB")
        inputs = processor(
            text=ALL_LABELS,
            images=rgb_image,
            return_tensors="pt",
            padding=True
        )

        with torch.no_grad():
            outputs = clip_model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)[0]

        crop_prob = sum(probs[i].item() for i in range(len(CROP_LABELS)))
        non_crop_prob = sum(probs[len(CROP_LABELS) + j].item() for j in range(len(NON_CROP_LABELS)))

        # Find best matching specific non-crop category if rejected
        best_idx = int(torch.argmax(probs).item())
        best_label = ALL_LABELS[best_idx]

        # Tomato / Crop threshold
        is_tomato_leaf = (crop_prob >= 0.40) and (crop_prob > non_crop_prob)

        return {
            "is_valid_crop": bool(is_tomato_leaf),
            "confidence": round(float(crop_prob) * 100, 2),
            "detected_category": best_label,
            "reason": None if is_tomato_leaf else "Image does not match a tomato leaf or plant crop."
        }
    except Exception as e:
        print(f"Error during crop validation: {e}")
        return {
            "is_valid_crop": True,
            "confidence": 50.0,
            "detected_category": "Unchecked",
            "reason": None
        }
