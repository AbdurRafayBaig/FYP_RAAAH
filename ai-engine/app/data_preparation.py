"""Data Preparation (Package Diagram, AI Recommendation Service).

Turns the tourist profile and destination data into numeric features:
  * a multi-hot interest vector for the tourist and each destination
  * the distance of each destination from a reference point
"""

from dataclasses import dataclass
from typing import Optional

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer

from .schemas import Destination, ScoreRequest

EARTH_RADIUS_KM = 6371.0
CROWD_ORDER = {"Low": 0, "Moderate": 1, "High": 2, "Critical": 3}
RISK_ORDER = {"Low Risk": 0, "Elevated Risk": 1, "High Risk": 2}


@dataclass
class PreparedData:
    destinations: list[Destination]
    source: Optional[Destination]
    preference_similarity: Optional[np.ndarray]  # None when the tourist has no preferences
    distances_km: Optional[np.ndarray]  # None when no reference point is known
    reference_label: Optional[str]
    visit_counts: dict[int, int]
    tourist_interests: list[str]


def haversine_km(lat1: float, lon1: float, lats: np.ndarray, lons: np.ndarray) -> np.ndarray:
    lat1, lon1 = np.radians(lat1), np.radians(lon1)
    lats, lons = np.radians(lats), np.radians(lons)
    a = np.sin((lats - lat1) / 2) ** 2 + np.cos(lat1) * np.cos(lats) * np.sin((lons - lon1) / 2) ** 2
    return 2 * EARTH_RADIUS_KM * np.arcsin(np.sqrt(a))


def interest_similarity(tourist_interests: list[str], destinations: list[Destination]) -> Optional[np.ndarray]:
    """Content-based similarity between the tourist's preferences and destination characteristics."""
    if not tourist_interests or not destinations:
        return None
    binarizer = MultiLabelBinarizer()
    binarizer.fit([tourist_interests] + [d.interests for d in destinations])
    tourist_vector = binarizer.transform([tourist_interests])
    destination_matrix = binarizer.transform([d.interests for d in destinations])
    return cosine_similarity(tourist_vector, destination_matrix)[0]


def prepare(request: ScoreRequest) -> PreparedData:
    destinations = request.destinations
    source = next((d for d in destinations if d.destinationId == request.sourceDestinationId), None)

    # Reference point for distance: the tourist's own location (given with consent),
    # otherwise the originally selected destination.
    distances, label = None, None
    if destinations:
        lats = np.array([d.latitude for d in destinations])
        lons = np.array([d.longitude for d in destinations])
        if request.tourist.location is not None:
            loc = request.tourist.location
            distances, label = haversine_km(loc.latitude, loc.longitude, lats, lons), "your location"
        elif source is not None:
            distances, label = haversine_km(source.latitude, source.longitude, lats, lons), source.name

    return PreparedData(
        destinations=destinations,
        source=source,
        preference_similarity=interest_similarity(request.tourist.interests, destinations),
        distances_km=distances,
        reference_label=label,
        visit_counts=request.tourist.visitCounts,
        tourist_interests=request.tourist.interests,
    )
