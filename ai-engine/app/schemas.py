"""Request / response models of the DestinationScoring interface (Component Diagram, Fig. 37)."""

from typing import Literal, Optional

from pydantic import BaseModel, Field

CrowdLevel = Literal["Low", "Moderate", "High", "Critical"]
RiskStatus = Literal["Low Risk", "Elevated Risk", "High Risk"]
AccessStatus = Literal["Open", "Limited", "Closed"]


class Location(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class Tourist(BaseModel):
    interests: list[str] = []
    # destination id -> number of completed visits (FR-04.03)
    visitCounts: dict[int, int] = {}
    location: Optional[Location] = None


class Destination(BaseModel):
    destinationId: int
    name: str
    interests: list[str] = []
    latitude: float
    longitude: float
    crowdLevel: CrowdLevel
    riskStatus: RiskStatus
    accessStatus: AccessStatus = "Open"
    weatherUnfavourable: Optional[bool] = None
    accommodationAvailable: int = 0


class ScoreRequest(BaseModel):
    tourist: Tourist
    sourceDestinationId: Optional[int] = None
    destinations: list[Destination]
    limit: int = Field(default=5, ge=1, le=20)


class Recommendation(BaseModel):
    destinationId: int
    score: float
    rank: int
    factors: dict[str, float]
    reasons: list[str]
    previouslyVisited: bool


class ScoreResponse(BaseModel):
    recommendations: list[Recommendation]
    excluded: int
    engine: dict[str, str]
