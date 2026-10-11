"""Ranking (Package Diagram, AI Recommendation Service) - DFD 4.5 Rank and Present Recommendations."""

from .schemas import Recommendation
from .scoring import ScoredDestination


def rank(scored: list[ScoredDestination], limit: int) -> list[Recommendation]:
    ordered = sorted(
        scored,
        key=lambda s: (
            -s.score,
            -s.factors["preference"],
            s.distance_km if s.distance_km is not None else 0.0,
        ),
    )
    return [
        Recommendation(
            destinationId=s.destination.destinationId,
            score=round(s.score, 4),
            rank=position,
            factors=s.factors,
            reasons=s.reasons,
            previouslyVisited=s.previously_visited,
        )
        for position, s in enumerate(ordered[:limit], start=1)
    ]
