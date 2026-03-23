from fastapi import FastAPI, Body
from typing import List, Dict, Any
import requests
import json

app = FastAPI()

# =============================
# CONFIG
# =============================

GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"


# =============================
# TYPES (Python Equivalent)
# =============================

DynamicRow = Dict[str, Any]


# =============================
# HELPERS
# =============================

def extract_json_object(text: str) -> Dict:
    if not text:
        raise ValueError("Empty response")

    start = text.find("{")
    end = text.rfind("}") + 1

    if start == -1 or end == -1:
        raise ValueError("No JSON found in response")

    json_text = text[start:end]

    try:
        return json.loads(json_text)
    except Exception as e:
        print("Raw output:", text)
        raise ValueError("Failed to parse JSON")


def call_gemini(prompt: str) -> str:
    res = requests.post(
        GEMINI_URL,
        headers={"Content-Type": "application/json"},
        json={
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }
    )

    if res.status_code != 200:
        raise Exception(f"Gemini API Error: {res.text}")

    data = res.json()

    return (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )


# =============================
# MAIN API
# =============================

@app.post("/table")
async def get_table_response(data: List[DynamicRow] = Body(...)):
    if not data or len(data) == 0:
        return {"error": "No data provided"}

    try:
        columns = list(data[0].keys())
        sample_rows = json.dumps(data[:5], indent=2)

        # =============================
        # STEP 1: ER GRAPH GENERATION
        # =============================

        prompt = f"""
You are an AI that converts tabular business data into a graph representation.

Requirements:
- Columns = nodes (business entities)
- Define edges (relationships)
- Output ONLY JSON

Columns: {", ".join(columns)}

First 5 rows:
{sample_rows}

Output format:
{{
  "entities": ["Entity1", "Entity2"],
  "relationships": [
    {{"from": "Entity1", "to": "Entity2", "type": "one-to-many"}}
  ],
  "table": [{{...}}]
}}
"""

        raw_text = call_gemini(prompt)

        parsed = extract_json_object(raw_text)

        # =============================
        # FALLBACKS (same as TS)
        # =============================

        parsed["entities"] = parsed.get("entities") or columns
        parsed["table"] = parsed.get("table") or data
        parsed["relationships"] = parsed.get("relationships") or []

        # =============================
        # STEP 2: DESCRIPTION GENERATION
        # =============================

        sample_rows_desc = "\n".join([
            f"Row {i+1}: " + ", ".join(
                [f"{col}={row.get(col, '-')}" for col in parsed["entities"]]
            )
            for i, row in enumerate(parsed["table"][:3])
        ])

        desc_prompt = f"""
You have generated a graph representation.

Nodes: {", ".join(parsed["entities"])}

Edges:
{", ".join([f"{r['from']} -> {r['to']} ({r['type']})" for r in parsed["relationships"]])}

Sample rows:
{sample_rows_desc}

Explain in 3-4 concise sentences:
1. Why each entity exists
2. How rows relate (give examples)

Respond in plain text only.
"""

        description = call_gemini(desc_prompt).strip()

        parsed["description"] = description

        return parsed

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}