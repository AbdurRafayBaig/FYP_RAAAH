"""RAAAH AI Recommendation Engine (Python + Scikit-learn).

Called by the Recommendation Service of the Backend API over HTTP (Deployment Diagram, Fig. 45).
Run with:  uvicorn app.main:app --port 8000
"""

from fastapi import FastAPI

from .data_preparation import prepare
from .ranking import rank
from .schemas import ScoreRequest, ScoreResponse
from .scoring import score_destinations

ENGINE_INFO = {"approach": "content-based", "version": "1.0.0"}

app = FastAPI(title="RAAAH AI Recommendation Engine", version=ENGINE_INFO["version"])


@app.get("/health")
def health() -> dict:
    return {"status": "ok", **ENGINE_INFO}


@app.post("/recommendations/score", response_model=ScoreResponse)
def score(request: ScoreRequest) -> ScoreResponse:
    data = prepare(request)
    scored, excluded = score_destinations(data)
    return ScoreResponse(recommendations=rank(scored, request.limit), excluded=excluded, engine=ENGINE_INFO)
