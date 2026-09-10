"""
AgriSense Tomato Agronomic Knowledge Base & Retrieval System (RAG)
Provides verified agricultural knowledge for tomato crop physiology, irrigation,
disease management, and environmental triggers.
"""

import re
from typing import List, Dict, Any

TOMATO_KNOWLEDGE_DOCS = [
    {
        "id": "irrigation_rules",
        "topic": "Irrigation & Soil Moisture Management",
        "keywords": ["water", "irrigate", "irrigation", "soil moisture", "dry", "wet", "watering", "drought", "waterlogging"],
        "content": (
            "Tomato plants have high water requirements, especially during flowering and fruit setting. "
            "Optimal soil moisture is between 35% and 55%. If soil moisture drops below 30%, irrigation is required. "
            "However, if rain probability within the next 6-12 hours exceeds 65%, irrigation should be postponed to avoid "
            "waterlogging, root rot (Pythium), and nutrient leaching. Always water at the base of the plant using drip irrigation "
            "to avoid wetting the foliage, as leaf moisture promotes fungal spores (Late Blight, Septoria)."
        )
    },
    {
        "id": "late_blight",
        "topic": "Tomato Late Blight (Phytophthora infestans)",
        "keywords": ["late blight", "phytophthora", "dark lesions", "white mold", "water-soaked spots", "blight"],
        "content": (
            "Late Blight is a destructive water-mold disease that spreads rapidly in cool (15-22°C), highly humid (>85%), "
            "and rainy weather. Symptoms include dark, water-soaked lesions on leaves with white fungal growth on undersides. "
            "Treatment: Immediately apply protective copper-based fungicides or Mancozeb/Cymoxanil. Remove and destroy infected plant parts. "
            "Withhold overhead watering and increase airflow between rows."
        )
    },
    {
        "id": "early_blight",
        "topic": "Tomato Early Blight (Alternaria solani)",
        "keywords": ["early blight", "alternaria", "concentric rings", "target spot", "yellow halo", "leaf spots"],
        "content": (
            "Early Blight causes brown-to-black spots with characteristic concentric rings ('bullseye' or target pattern) surrounded by a yellow halo, "
            "starting on older lower leaves. Favored by warm temperatures (24-30°C) and frequent rainfall or heavy dew. "
            "Management: Prune lower leaves touching soil, apply mulch to prevent soil-splash, spray Chlorothalonil or Azoxystrobin, and practice crop rotation."
        )
    },
    {
        "id": "septoria_leaf_spot",
        "topic": "Tomato Septoria Leaf Spot",
        "keywords": ["septoria", "small spots", "circular lesions", "dark border", "defoliation"],
        "content": (
            "Septoria leaf spot creates numerous small (2-3mm) circular spots with gray/white centers and dark brown margins. "
            "It thrives in warm (20-25°C) wet conditions and causes rapid defoliation from bottom up. "
            "Management: Remove infected foliage, avoid working in wet fields, and apply copper fungicides or Daconil."
        )
    },
    {
        "id": "leaf_mold",
        "topic": "Tomato Leaf Mold (Passalora fulva)",
        "keywords": ["leaf mold", "pale green", "yellow spots", "velvety mold", "greenhouse"],
        "content": (
            "Leaf Mold produces pale green or yellow spots on the upper leaf surface with olive-green to brown velvety mold underneath. "
            "Common in high relative humidity (>85%) and poor ventilation. "
            "Management: Lower greenhouse humidity, increase plant spacing, and apply preventive bio-fungicides (Bacillus subtilis) or copper."
        )
    },
    {
        "id": "bacterial_spot",
        "topic": "Tomato Bacterial Spot (Xanthomonas spp.)",
        "keywords": ["bacterial spot", "xanthomonas", "scabby spots", "greasy spots", "black lesions"],
        "content": (
            "Bacterial spot appears as small, greasy, dark brown angular lesions on leaves and scabby raised spots on fruit. "
            "Spreads easily via rain splash and irrigation spray. "
            "Management: Use certified disease-free seeds, avoid overhead watering, apply fixed copper mixed with Mancozeb, and sanitize tools."
        )
    },
    {
        "id": "yellow_leaf_curl",
        "topic": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "keywords": ["yellow leaf curl", "tylcv", "curling", "stunted", "whitefly", "virus"],
        "content": (
            "TYLCV is a viral disease transmitted by the Silverleaf Whitefly (Bemisia tabaci). Symptoms include severe upward leaf curling, "
            "yellowing of leaf margins, stunted growth, and flower drop. "
            "Management: Control whitefly vectors using yellow sticky traps and systemic insecticides (Imidacloprid/Neem oil), use silver reflective mulch, "
            "and rogue out infected plants immediately."
        )
    },
    {
        "id": "mosaic_virus",
        "topic": "Tomato Mosaic Virus (ToMV)",
        "keywords": ["mosaic virus", "mottling", "distortion", "fern-like leaves", "tomv"],
        "content": (
            "Tomato Mosaic Virus causes light and dark green mottled patterns on leaves, leaf distortion (shoestring or fern-like appearance), and uneven fruit ripening. "
            "It is highly contagious and spreads mechanically on hands, tools, and tobacco smoke. "
            "Management: Disinfect pruning shears with 20% nonfat dry milk or bleach solution, wash hands before handling crops, and plant resistant cultivars."
        )
    },
    {
        "id": "spider_mites",
        "topic": "Two-Spotted Spider Mites (Tetranychus urticae)",
        "keywords": ["spider mites", "webbing", "stippling", "yellow speckles", "mites", "dry weather"],
        "content": (
            "Spider mites cause fine yellow stippling/speckling on leaves and webbing on the undersides. Favored by hot, dry, and dusty conditions (>30°C, <50% humidity). "
            "Management: Spray with horticultural soap, neem oil, or predatory mites (Phytoseiulus persimilis). Maintain adequate field moisture to suppress mite proliferation."
        )
    },
    {
        "id": "fertilization_npk",
        "topic": "Tomato Nutrient & Fertilizer Management (NPK)",
        "keywords": ["fertilizer", "npk", "nitrogen", "phosphorus", "potassium", "flowering", "nutrients", "calcium", "blossom end rot"],
        "content": (
            "Tomatoes require balanced nutrition based on growth phase: "
            "1. Vegetative stage: High Nitrogen (NPK 10-10-10 or 20-10-10) to support vine growth. "
            "2. Flowering & Fruit stage: High Potassium and Phosphorus (NPK 5-10-20 or 9-15-30) to boost fruit size and sugar content. "
            "3. Calcium supplementation is essential to prevent Blossom End Rot (black sunken fruit bottom). Apply calcium nitrate or gypsum."
        )
    },
    {
        "id": "heat_stress",
        "topic": "Temperature & Heat Stress Management",
        "keywords": ["heat stress", "temperature", "hot", "sunburn", "blossom drop", "wilting"],
        "content": (
            "Optimal temperature for tomato growth is 21-29°C. Temperatures above 35°C cause pollen sterility, blossom drop, and poor fruit set. "
            "Management: Apply 30% shade netting during peak afternoon sun, maintain soil moisture via drip systems, and apply organic straw mulch to cool the root zone."
        )
    }
]

def query_knowledge_base(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    """
    Retrieves the most relevant agricultural knowledge documents for a query.
    Uses token matching, keyword scoring, and semantic text overlap.
    """
    query_lower = query.lower()
    query_words = set(re.findall(r'\w+', query_lower))

    scored_docs = []
    for doc in TOMATO_KNOWLEDGE_DOCS:
        score = 0
        # Keyword matching
        for kw in doc["keywords"]:
            if kw in query_lower:
                score += 3
            elif any(w in kw for w in query_words if len(w) > 3):
                score += 1
                
        # Content word overlap
        content_words = set(re.findall(r'\w+', doc["content"].lower()))
        overlap = len(query_words.intersection(content_words))
        score += overlap * 0.5

        if score > 0:
            scored_docs.append((score, doc))

    scored_docs.sort(key=lambda x: x[0], reverse=True)
    return [doc for _, doc in scored_docs[:top_k]]
