"""Destination Scoring (Package Diagram, AI Recommendation Service).

DFD Level 2 (Fig. 42): 4.3 Analyze Destination Suitability and 4.4 Score Destinations.
Content-based approach (FR-05.05) over the factors listed in FR-05.03.
"""

from dataclasses import dataclass, field

import numpy as np

from .data_preparation import CROWD_ORDER, RISK_ORDER, PreparedData
from .schemas import Destination

# Relative importance of each factor. Missing factors (no reference point for distance)
# are left out and the remaining weights are renormalised.
WEIGHTS = {
    "preference": 0.30,
    "crowd": 0.20,
    "safety": 0.20,
    "weather": 0.10,
    "distance": 0.10,
    "accessibility": 0.05,
    "accommodation": 0.05,
}

CROWD_SCORE = {"Low": 1.0, "Moderate": 0.7, "High": 0.3, "Critical": 0.0}
SAFETY_SCORE = {"Low Risk": 1.0, "Elevated Risk": 0.5, "High Risk": 0.0}
ACCESS_SCORE = {"Open": 1.0, "Limited": 0.5, "Closed": 0.0}

NEUTRAL = 0.5
DISTANCE_SCALE_KM = 150.0  # score halves roughly every 100 km
ACCOMMODATION_FULL_AT = 30
# FR-04.03: visited destinations stay eligible, new ones get higher priority
VISITED_PENALTY = 0.10
MIN_SUITABLE_SCORE = 0.50


@dataclass
class ScoredDestination:
    destination: Destination
    score: float
    factors: dict[str, float]
    reasons: list[str] = field(default_factory=list)
    previously_visited: bool = False
    distance_km: float | None = None


def is_suitable(candidate: Destination, source: Destination | None) -> bool:
    """4.3 - hard constraints: never recommend unsafe, over-capacity or closed destinations,
    and never one that is more crowded or riskier than the originally selected destination."""
    if candidate.riskStatus == "High Risk" or candidate.crowdLevel == "Critical" or candidate.accessStatus == "Closed":
        return False
    if source is not None:
        if candidate.destinationId == source.destinationId:
            return False
        if CROWD_ORDER[candidate.crowdLevel] > CROWD_ORDER[source.crowdLevel]:
            return False
        if RISK_ORDER[candidate.riskStatus] > RISK_ORDER[source.riskStatus]:
            return False
    return True


def _weather_score(unfavourable: bool | None) -> float:
    if unfavourable is None:
        return 0.6
    return 0.2 if unfavourable else 1.0


def _reasons(d: Destination, data: PreparedData, distance_km: float | None, visits: int) -> list[str]:
    """Short, plain reasons. Crowd level and risk status are shown next to them, so they are only
    mentioned when they compare favourably with the originally selected destination."""
    reasons = []
    matched = [i for i in d.interests if i in data.tourist_interests]
    if matched:
        reasons.append(f"Good for {', '.join(matched).lower()}")

    source = data.source
    if source is not None and CROWD_ORDER[d.crowdLevel] < CROWD_ORDER[source.crowdLevel]:
        reasons.append("Quieter than your pick")
    if source is not None and RISK_ORDER[d.riskStatus] < RISK_ORDER[source.riskStatus]:
        reasons.append("Safer than your pick")

    if d.weatherUnfavourable is False:
        reasons.append("Good weather")
    elif d.weatherUnfavourable:
        reasons.append("Weather may be poor")

    if distance_km is not None:
        reasons.append(f"{round(distance_km)} km from {data.reference_label}")
    if d.accessStatus == "Limited":
        reasons.append("Limited road access")
    if d.accommodationAvailable > 0:
        reasons.append(f"{d.accommodationAvailable} place{'s' if d.accommodationAvailable > 1 else ''} to stay")
    reasons.append("Visited before" if visits else "New to you")
    return reasons


def score_destinations(data: PreparedData) -> tuple[list[ScoredDestination], int]:
    """4.4 - weighted score in [0, 1] for each suitable candidate. Returns (scored, excluded_count)."""
    scored: list[ScoredDestination] = []
    excluded = 0

    for index, d in enumerate(data.destinations):
        if data.source is not None and d.destinationId == data.source.destinationId:
            continue
        if not is_suitable(d, data.source):
            excluded += 1
            continue

        distance_km = float(data.distances_km[index]) if data.distances_km is not None else None
        factors = {
            "preference": float(data.preference_similarity[index]) if data.preference_similarity is not None else NEUTRAL,
            "crowd": CROWD_SCORE[d.crowdLevel],
            "safety": SAFETY_SCORE[d.riskStatus],
            "weather": _weather_score(d.weatherUnfavourable),
            "accessibility": ACCESS_SCORE[d.accessStatus],
            "accommodation": min(1.0, d.accommodationAvailable / ACCOMMODATION_FULL_AT),
        }
        if distance_km is not None:
            factors["distance"] = float(np.exp(-distance_km / DISTANCE_SCALE_KM))

        total_weight = sum(WEIGHTS[k] for k in factors)
        score = sum(WEIGHTS[k] * v for k, v in factors.items()) / total_weight

        visits = data.visit_counts.get(d.destinationId, 0)
        if visits:
            score *= 1 - VISITED_PENALTY

        if score < MIN_SUITABLE_SCORE:
            excluded += 1
            continue

        scored.append(
            ScoredDestination(
                destination=d,
                score=score,
                factors={k: round(v, 4) for k, v in factors.items()},
                reasons=_reasons(d, data, distance_km, visits),
                previously_visited=bool(visits),
                distance_km=distance_km,
            )
        )
    return scored, excluded
