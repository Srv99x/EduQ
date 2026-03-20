import os
from pathlib import Path
from typing import Literal, Optional

import httpx
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import uvicorn


def _load_env_file(path: Path) -> None:
    """Minimal .env loader so backend can use shared root env file."""
    if not path.exists() or not path.is_file():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key:
            os.environ.setdefault(key, value)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
_load_env_file(PROJECT_ROOT / ".env")
_load_env_file(Path(__file__).resolve().parent / ".env")

# Initialize FastAPI app
app = FastAPI(title="EduQ API", version="1.0.0")

allowed_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class SubscriptionRequest(BaseModel):
    email: EmailStr

class SubscriptionResponse(BaseModel):
    message: str
    email: str


class CodeExecutionRequest(BaseModel):
    language: Literal["python", "javascript", "typescript"]
    code: str
    stdin: str = ""


class CodeExecutionResponse(BaseModel):
    stdout: str = ""
    stderr: str = ""
    output: str
    exit_code: int = 0


async def _run_with_onlinecompiler(payload: CodeExecutionRequest, timeout_seconds: float) -> CodeExecutionResponse:
    """Run code via onlinecompiler.io REST API."""
    api_key = os.getenv("ONLINECOMPILER_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ONLINECOMPILER_API_KEY is missing in backend environment.",
        )

    run_url = os.getenv("ONLINECOMPILER_API_URL", "https://api.onlinecompiler.io/api/run-code-sync/")
    compiler_map = {
        "python": "python-3.14",
        "javascript": "nodejs-24",
        "typescript": "typescript-deno",
    }

    request_payload = {
        "compiler": compiler_map[payload.language],
        "code": payload.code,
        "input": payload.stdin,
    }

    headers = {
        "Authorization": api_key,
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=timeout_seconds) as client:
        response = await client.post(run_url, json=request_payload, headers=headers)
        response.raise_for_status()
        data = response.json()

    stdout = data.get("output") or ""
    stderr = data.get("error") or ""

    if data.get("exit_code") is None:
        exit_code = 0 if str(data.get("status", "")).lower() == "success" else 1
    else:
        exit_code = int(data.get("exit_code") or 0)

    output = stdout or stderr or "Program executed with no output."

    return CodeExecutionResponse(
        stdout=stdout,
        stderr=stderr,
        output=output,
        exit_code=exit_code,
    )

# --- Database Simulation ---
# In a real production environment, use SQLAlchemy or asyncpg with PostgreSQL.
# Example: database = await asyncpg.connect(user='user', password='password', database='eduq', host='127.0.0.1')
fake_subscriber_db = {"test@example.com", "alex.carter@example.com"}

# --- Route Handlers ---


@app.post(
    "/api/code/run",
    response_model=CodeExecutionResponse,
    tags=["Code Runner"],
)
async def run_code(payload: CodeExecutionRequest):
    """
    Runs code via a cloud code execution API (onlinecompiler.io by default).
    This keeps execution off the browser and avoids embedding provider secrets client-side.
    """
    if not payload.code.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code cannot be empty.",
        )

    timeout_seconds = float(os.getenv("CODE_EXEC_TIMEOUT", "15"))

    try:
        return await _run_with_onlinecompiler(payload, timeout_seconds)
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Code execution timed out. Try simpler input or increase timeout.",
        ) from exc
    except httpx.HTTPStatusError as exc:
        provider_message = ""
        try:
            provider_message = exc.response.text[:240]
        except Exception:
            provider_message = ""
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Execution provider error: {exc.response.status_code}. {provider_message}".strip(),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected execution failure.",
        ) from exc

@app.post(
    "/api/newsletter/subscribe", 
    response_model=SubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Newsletter"]
)
async def subscribe_newsletter(subscription: SubscriptionRequest):
    """
    Subscribes a user to the newsletter.
    - Validates email format using Pydantic.
    - Normalizes email (lowercase, strip whitespace).
    - Checks for duplicates in the database.
    - Returns 400 if already exists.
    """
    # Normalize the email input
    email_entry = subscription.email.lower().strip()
    
    # Check if email already exists in the database
    if email_entry in fake_subscriber_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already subscribed."
        )
    
    # Save to database (Simulated)
    # await database.execute("INSERT INTO subscribers (email) VALUES ($1)", email_entry)
    fake_subscriber_db.add(email_entry)
    
    return {
        "message": "Successfully subscribed to EduQ updates!", 
        "email": email_entry
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)