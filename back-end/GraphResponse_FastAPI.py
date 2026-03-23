from fastapi import FastAPI, UploadFile, File
from typing import List
import json
import requests

app = FastAPI()

# =============================
# CONFIG
# =============================

GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

# =============================
# TYPES
# =============================

class DatasetItem:
    def __init__(self, name: str):
        self.name = name


# =============================
# HELPERS
# =============================

def extract_json_array(text: str) -> List[str]:
    if not text:
        return []

    try:
        cleaned = (
            text.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        start = cleaned.find("[")
        end = cleaned.rfind("]")

        if start != -1 and end != -1:
            json_string = cleaned[start:end + 1]
            parsed = json.loads(json_string)

            if isinstance(parsed, list):
                return [str(v).strip() for v in parsed if str(v).strip()]

    except Exception as e:
        print("JSON extraction failed:", e)

    # fallback
    return [s.strip() for s in text.splitlines() if s.strip()]


def normalize_labels(labels: List[str]) -> List[str]:
    seen = set()
    result = []

    for l in labels:
        key = l.lower()
        if l and key not in seen:
            seen.add(key)
            result.append(l.strip())

    return result


# =============================
# GEMINI CLEANING
# =============================

async def clean_labels_with_gemini(items: List[DatasetItem]) -> List[str]:
    if not items:
        return []

    limited_items = items[:50]
    combined_labels = "\n".join([i.name for i in limited_items])

    prompt = f"""
You are a system modeling AI.

GOAL:
Convert raw dataset into a BUSINESS GRAPH.

STEP 1:
Extract key BUSINESS ENTITIES (nodes)

STEP 2:
Infer RELATIONSHIPS between them (edges)

STEP 3:
Return a COMBINED LIST of:
- Entity names
- AND relationships in "A → B"

RULES:
- Max 8 outputs
- Each item short (1–3 words OR "A → B")
- Remove duplicates
- Return ONLY JSON array

INPUT:
{combined_labels}
"""

    try:
        res = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json"},
            json={
                "contents": [
                    {"parts": [{"text": prompt}]}
                ]
            }
        )

        data = res.json()

        text = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
        )

        extracted = extract_json_array(text)
        normalized = normalize_labels(extracted)

        return normalized[:8] if normalized else [i.name for i in items[:8]]

    except Exception as e:
        print("Gemini error:", e)
        return [i.name for i in items[:8]]


# =============================
# DATASET PARSER
# =============================

async def parse_dataset_file(file: UploadFile) -> List[DatasetItem]:
    content = (await file.read()).decode("utf-8")
    ext = file.filename.split(".")[-1].lower()

    items = []

    try:
        # CSV
        if ext == "csv":
            lines = [l for l in content.splitlines() if l.strip()]

            start_index = 1 if "name" in lines[0].lower() else 0

            for line in lines[start_index:]:
                first_col = line.split(",")[0].strip()
                items.append(DatasetItem(first_col or "Unknown"))

        # JSON
        elif ext == "json":
            parsed = json.loads(content)

            if isinstance(parsed, list):
                for obj in parsed:
                    if isinstance(obj, str):
                        items.append(DatasetItem(obj))
                    else:
                        items.append(
                            DatasetItem(
                                obj.get("name")
                                or obj.get("label")
                                or obj.get("title")
                                or json.dumps(obj)
                            )
                        )
            else:
                items.append(
                    DatasetItem(parsed.get("name") or json.dumps(parsed))
                )

        # TXT / DEFAULT
        else:
            lines = [l for l in content.splitlines() if l.strip()]
            for line in lines:
                items.append(DatasetItem(line.strip()))

    except Exception as e:
        print("Parsing error:", e)
        items = [DatasetItem("Invalid Dataset")]

    return items


# =============================
# API ROUTE
# =============================

@app.post("/graph")
async def generate_graph(file: UploadFile = File(...)):
    items = await parse_dataset_file(file)
    cleaned = await clean_labels_with_gemini(items)

    return {
        "nodes_and_edges": cleaned
    }