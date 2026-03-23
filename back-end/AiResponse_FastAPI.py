from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import requests
import base64
import json
import io

from typing import Optional

# PDF parsing
import PyPDF2

app = FastAPI()

# ================================
# GEMINI CONFIG
# ================================

GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

# ================================
# HELPERS
# ================================

def file_to_base64(file_bytes: bytes) -> str:
    return base64.b64encode(file_bytes).decode("utf-8")


def pdf_to_text(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""

    for i, page in enumerate(reader.pages):
        text += f"\n\n--- Page {i+1} ---\n{page.extract_text()}"

    return text


def parse_json_file(file_bytes: bytes) -> str:
    try:
        data = json.loads(file_bytes.decode("utf-8"))
        return json.dumps(data, indent=2)
    except:
        return file_bytes.decode("utf-8")


def parse_jsonl_file(file_bytes: bytes) -> str:
    lines = file_bytes.decode("utf-8").split("\n")
    lines = [l for l in lines if l.strip()]

    MAX_LINES = 50
    parsed = []

    for i, line in enumerate(lines[:MAX_LINES]):
        try:
            parsed.append(f"Record {i+1}:\n{json.dumps(json.loads(line), indent=2)}")
        except:
            parsed.append(f"Record {i+1}:\n{line}")

    return "\n\n".join(parsed)


def is_analysis_query(text: str) -> bool:
    keywords = [
        "analyze", "analysis", "compare", "relationship",
        "trend", "pattern", "insight", "graph", "data",
        "correlation", "distribution", "breakdown", "evaluate"
    ]
    return any(k in text.lower() for k in keywords)


# ================================
# MAIN API
# ================================

@app.post("/llm")
async def get_llm_response(
    prompt: str = Form(...),
    model: str = Form("graph"),
    file: Optional[UploadFile] = File(None)
):
    try:
        parts = []

        # ================================
        # MODEL CONTROL
        # ================================

        if model == "graph":
            if not (is_analysis_query(prompt) or file):
                return {
                    "text": "This system is designed to answer questions related to the provided dataset only."
                }

            prompt = f"""
You are GraphModel — an analysis-focused AI designed for structured data exploration.

### RULES:
- Only dataset-related answers
- No general knowledge
- Structured responses only

User Query:
{prompt}
"""

        elif model == "flo":
            prompt = f"""
You are FloModel (General Purpose LLM).

User Query:
{prompt}
"""

        # ================================
        # FILE HANDLING
        # ================================

        if file:
            file_bytes = await file.read()
            filename = file.filename.lower()
            content_type = file.content_type

            # IMAGE
            if content_type.startswith("image/"):
                base64_data = file_to_base64(file_bytes)

                parts.append({
                    "inline_data": {
                        "mime_type": content_type,
                        "data": base64_data
                    }
                })

                parts.append({
                    "text": prompt or "Analyze this image"
                })

            # PDF
            elif content_type == "application/pdf":
                text = pdf_to_text(file_bytes)
                text = text[:20000]

                parts.append({
                    "text": f"### PDF CONTENT ###\n{text}\n\n### USER PROMPT ###\n{prompt}"
                })

            # JSON
            elif filename.endswith(".json"):
                text = parse_json_file(file_bytes)[:20000]

                parts.append({
                    "text": f"### JSON DATA ###\n{text}\n\n### USER PROMPT ###\n{prompt}"
                })

            # JSONL
            elif filename.endswith(".jsonl"):
                text = parse_jsonl_file(file_bytes)

                parts.append({
                    "text": f"### JSONL DATA ###\n{text}\n\n### USER PROMPT ###\n{prompt}"
                })

            # TEXT / CODE
            elif (
                "text" in content_type or
                filename.endswith((".csv", ".md", ".ts", ".js", ".py"))
            ):
                text = file_bytes.decode("utf-8")[:20000]

                parts.append({
                    "text": f"### FILE CONTENT ###\n{text}\n\n### USER PROMPT ###\n{prompt}"
                })

            else:
                parts.append({
                    "text": f"{prompt}\n\nUnsupported file type: {file.filename}"
                })

        else:
            parts.append({"text": prompt})

        # ================================
        # GEMINI API CALL
        # ================================

        response = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json"},
            json={
                "contents": [
                    {"parts": parts}
                ]
            }
        )

        if response.status_code != 200:
            return JSONResponse(
                status_code=500,
                content={"text": f"Gemini API Error: {response.status_code}"}
            )

        data = response.json()

        text = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "No response generated.")
        )

        return {
            "text": text,
            "raw": data
        }

    except Exception as e:
        print("ERROR:", e)
        return {"text": "Something went wrong while fetching the response."}