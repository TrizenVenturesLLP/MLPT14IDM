"""
Fingerprint Liveness Risk Analysis System

FastAPI application combining:
- Agent 1: Usage Pattern Analysis
- Agent 2: CNN-based Liveness Detection  
- Agent 3: Risk Engine (combines both scores)

API Endpoints:
- POST /analyze-fingerprint: Upload fingerprint image for analysis
- GET /usage-history: Get usage history for a fingerprint
- GET /health: Health check endpoint
- GET /: API information
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os

# Import agents and utilities
from app.utils.image_utils import decode_image, preprocess_for_model, validate_image
from app.agents.liveness_agent import LivenessAgent
from app.agents.usage_agent import UsageAgent
from app.agents.risk_engine import RiskEngine, RiskLevel


# =============================================================================
# Pydantic Models for API Documentation
# =============================================================================

class AnalysisResponse(BaseModel):
    """Response model for fingerprint analysis."""
    liveness_score: float
    risk_level: str
    explanation: str
    usage_score: Optional[float] = None
    combined_score: Optional[float] = None
    anomalies: Optional[List[str]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "liveness_score": 0.83,
                "risk_level": "NORMAL",
                "explanation": "Fingerprint appears live and usage patterns are normal",
                "usage_score": 1.0,
                "combined_score": 0.90,
                "anomalies": []
            }
        }


class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str
    model_loaded: bool
    agents: List[str]


class ErrorResponse(BaseModel):
    """Response model for errors."""
    detail: str


# =============================================================================
# FastAPI Application
# =============================================================================

app = FastAPI(
    title="Fingerprint Liveness Risk Analysis System",
    description="""
## Fingerprint Risk Analysis API

Multi-agent system analyzing fingerprint images for liveness AND usage patterns.

### Agents:
- **Agent 1 (Usage Pattern)**: Tracks fingerprint usage, detects anomalies
- **Agent 2 (Liveness Detection)**: CNN-based spoof detection
- **Agent 3 (Risk Engine)**: Combines scores into final assessment

### Risk Scoring:
- Combined = (Liveness × 60%) + (Usage × 40%)
- **NORMAL**: Combined score ≥ 0.7
- **SUSPICIOUS**: Combined score 0.4-0.7
- **HIGH**: Combined score < 0.4

### Usage Anomalies Detected:
- High frequency (>5 uses in 24 hours)
- Cross-case reuse (same fingerprint, different cases)
- Reactivation (dormant >30 days, suddenly active)
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# Initialize Agents (Lazy Loading)
# =============================================================================

_liveness_agent: Optional[LivenessAgent] = None
_usage_agent: Optional[UsageAgent] = None
_risk_engine: Optional[RiskEngine] = None


def get_liveness_agent() -> LivenessAgent:
    """Get or create liveness agent singleton."""
    global _liveness_agent
    if _liveness_agent is None:
        model_path = os.path.join(
            os.path.dirname(__file__), 
            "models", 
            "spoof_model.h5"
        )
        _liveness_agent = LivenessAgent(model_path if os.path.exists(model_path) else None)
    return _liveness_agent


def get_usage_agent() -> UsageAgent:
    """Get or create usage agent singleton."""
    global _usage_agent
    if _usage_agent is None:
        _usage_agent = UsageAgent()
    return _usage_agent


def get_risk_engine() -> RiskEngine:
    """Get or create risk engine singleton."""
    global _risk_engine
    if _risk_engine is None:
        _risk_engine = RiskEngine()
    return _risk_engine


# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/", tags=["Info"])
async def root():
    """API information and welcome message."""
    return {
        "name": "Fingerprint Liveness Risk Analysis System",
        "version": "2.0.0",
        "description": "Multi-agent fingerprint analysis with liveness + usage pattern detection",
        "agents": ["Agent 1: Usage Pattern", "Agent 2: Liveness Detection", "Agent 3: Risk Engine"],
        "endpoints": {
            "analyze": "POST /analyze-fingerprint",
            "health": "GET /health",
            "docs": "GET /docs"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint."""
    agent = get_liveness_agent()
    return HealthResponse(
        status="healthy",
        model_loaded=agent.model is not None,
        agents=["UsageAgent", "LivenessAgent", "RiskEngine"]
    )


@app.post(
    "/analyze-fingerprint",
    response_model=AnalysisResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid image"},
        500: {"model": ErrorResponse, "description": "Processing error"}
    },
    tags=["Analysis"]
)
async def analyze_fingerprint(
    file: UploadFile = File(..., description="Fingerprint image file (PNG, JPG, BMP)"),
    case_id: Optional[str] = Form(None, description="Case or record identifier"),
    sector: str = Form("unknown", description="Usage sector (forensic/hospital/unknown)")
):
    """
    Analyze a fingerprint image for liveness AND usage patterns.
    
    ## Process:
    1. Upload fingerprint image with optional case_id and sector
    2. Agent 1 records usage and analyzes patterns
    3. Agent 2 predicts liveness using CNN
    4. Agent 3 combines scores into final risk assessment
    
    ## Returns:
    - **liveness_score**: Float 0-1 (1 = live, 0 = spoofed)
    - **usage_score**: Float 0-1 (1 = normal usage, 0 = highly suspicious)
    - **combined_score**: Weighted combination (60% liveness + 40% usage)
    - **risk_level**: NORMAL, SUSPICIOUS, or HIGH
    - **explanation**: Human-readable explanation
    - **anomalies**: List of detected usage anomalies
    """
    # Validate file type
    allowed_types = ["image/png", "image/jpeg", "image/jpg", "image/bmp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: PNG, JPG, BMP"
        )
    
    try:
        # Read file bytes
        file_bytes = await file.read()
        
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Decode image
        image = decode_image(file_bytes)
        
        # Validate image
        if not validate_image(image):
            raise HTTPException(
                status_code=400,
                detail="Invalid image. Ensure image is at least 32x32 pixels."
            )
        
        # Preprocess for model
        preprocessed = preprocess_for_model(image)
        
        # === Agent 2: Liveness Detection ===
        liveness_agent = get_liveness_agent()
        liveness_score = liveness_agent.predict(preprocessed)
        
        # === Agent 1: Usage Pattern Analysis ===
        usage_agent = get_usage_agent()
        usage_analysis = usage_agent.record_and_analyze(
            image_bytes=file_bytes,
            case_id=case_id,
            sector=sector,
            liveness_score=liveness_score
        )
        
        # === Agent 3: Risk Engine (combines both) ===
        risk_engine = get_risk_engine()
        assessment = risk_engine.evaluate(
            liveness_score=liveness_score,
            usage_score=usage_analysis.usage_score,
            anomalies=usage_analysis.anomalies
        )
        
        # Return combined response
        return AnalysisResponse(
            liveness_score=round(assessment.liveness_score, 2),
            risk_level=assessment.risk_level.value,
            explanation=assessment.explanation,
            usage_score=round(assessment.usage_score, 2),
            combined_score=round(assessment.combined_score, 2),
            anomalies=assessment.anomalies
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )


# =============================================================================
# Startup Event
# =============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize agents on startup."""
    print("=" * 60)
    print("Fingerprint Liveness Risk Analysis System v2.0")
    print("=" * 60)
    print("Initializing agents...")
    
    # Pre-load agents
    get_usage_agent()
    print("  [OK] Agent 1: Usage Pattern Analysis")
    get_liveness_agent()
    print("  [OK] Agent 2: Liveness Detection")
    get_risk_engine()
    print("  [OK] Agent 3: Risk Engine")
    
    print("\nAll agents initialized!")
    print("API ready at http://localhost:8000")
    print("Swagger UI at http://localhost:8000/docs")
    print("=" * 60)
