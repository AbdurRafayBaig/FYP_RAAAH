"""Unit tests of the parts of the recommendation engine (Package Diagram, AI Recommendation Service).

test_engine.py checks the engine through its HTTP interface; these tests check Data Preparation,
Destination Scoring and Ranking one function at a time, so a failure points at the step that broke.
"""

import math

import numpy as np
import pytest

from app.data_preparation import EARTH_RADIUS_KM, haversine_km, interest_similarity, prepare
from app.ranking import rank
from app.schemas import Destination, Location, ScoreRequest, Tourist
from app.scoring import (
    MIN_SUITABLE_SCORE,
    VISITED_PENALTY,
    ScoredDestination,
    is_suitable,
    score_destinations,
)


def dest(i, **overrides):
    values = {
        "destinationId": i,
        "name": f"Destination {i}",
        "interests": ["Nature"],
        "latitude": 36.0,
        "longitude": 74.0,
        "crowdLevel": "Low",
        "riskStatus": "Low Risk",
        "accessStatus": "Open",
        "weatherUnfavourable": False,
        "accommodationAvailable": 10,
    }
    values.update(overrides)
    return Destination(**values)


def prepared(destinations, interests=("Nature",), visits=None, source_id=None, location=None):
    return prepare(
        ScoreRequest(
            tourist=Tourist(interests=list(interests), visitCounts=visits or {}, location=location),
            sourceDestinationId=source_id,
            destinations=destinations,
        )
    )


# ---------------------------------------------------------------- Data Preparation: distance


def test_distance_to_the_same_point_is_zero():
    assert haversine_km(36.0, 74.0, np.array([36.0]), np.array([74.0]))[0] == pytest.approx(0.0)


def test_one_degree_of_latitude_is_about_111_km():
    expected = 2 * math.pi * EARTH_RADIUS_KM / 360
    assert haversine_km(0.0, 0.0, np.array([1.0]), np.array([0.0]))[0] == pytest.approx(expected)


def test_distance_is_the_same_in_both_directions():
    there = haversine_km(33.68, 73.05, np.array([36.32]), np.array([74.65]))[0]
    back = haversine_km(36.32, 74.65, np.array([33.68]), np.array([73.05]))[0]
    assert there == pytest.approx(back)


def test_distance_is_computed_for_every_destination_at_once():
    distances = haversine_km(36.0, 74.0, np.array([36.0, 37.0, 35.0]), np.array([74.0, 74.0, 74.0]))
    assert distances.shape == (3,)
    assert distances[0] == pytest.approx(0.0)
    assert distances[1] == pytest.approx(distances[2])


# ---------------------------------------------------------------- Data Preparation: preferences


def test_no_similarity_without_preferences_or_destinations():
    assert interest_similarity([], [dest(1)]) is None
    assert interest_similarity(["Nature"], []) is None


def test_similarity_of_matching_disjoint_and_partial_interests():
    destinations = [
        dest(1, interests=["Nature", "Hiking"]),
        dest(2, interests=["Culture"]),
        dest(3, interests=["Nature"]),
    ]
    similarity = interest_similarity(["Nature", "Hiking"], destinations)
    assert similarity[0] == pytest.approx(1.0)
    assert similarity[1] == pytest.approx(0.0)
    assert similarity[2] == pytest.approx(1 / math.sqrt(2))


def test_the_tourist_location_is_preferred_as_the_reference_point():
    data = prepared([dest(1), dest(2)], source_id=1, location=Location(latitude=33.68, longitude=73.05))
    assert data.reference_label == "your location"
    assert data.distances_km[0] > 0


def test_the_selected_destination_is_the_reference_point_without_a_location():
    data = prepared([dest(1, name="Hunza"), dest(2)], source_id=1)
    assert data.reference_label == "Hunza"
    assert data.distances_km[0] == pytest.approx(0.0)


# ---------------------------------------------------------------- Destination Scoring: suitability


@pytest.mark.parametrize(
    "overrides",
    [{"riskStatus": "High Risk"}, {"crowdLevel": "Critical"}, {"accessStatus": "Closed"}],
    ids=["high risk", "critical crowd", "closed"],
)
def test_unsafe_overcrowded_or_closed_destinations_are_never_suitable(overrides):
    assert not is_suitable(dest(2, **overrides), source=None)


def test_limited_access_is_still_suitable():
    assert is_suitable(dest(2, accessStatus="Limited"), source=None)


def test_the_selected_destination_is_not_its_own_alternative():
    source = dest(1)
    assert not is_suitable(dest(1), source)


def test_an_alternative_may_not_be_more_crowded_or_riskier_than_the_selected_destination():
    source = dest(1, crowdLevel="Moderate", riskStatus="Elevated Risk")
    assert not is_suitable(dest(2, crowdLevel="High"), source)
    assert not is_suitable(dest(2, riskStatus="High Risk"), source)
    assert is_suitable(dest(2, crowdLevel="Moderate", riskStatus="Elevated Risk"), source)
    assert is_suitable(dest(2, crowdLevel="Low", riskStatus="Low Risk"), source)


# ---------------------------------------------------------------- Destination Scoring: scores


def test_a_visit_lowers_the_score_by_the_visited_penalty():
    fresh, _ = score_destinations(prepared([dest(1)]))
    visited, _ = score_destinations(prepared([dest(1)], visits={1: 2}))
    assert visited[0].score == pytest.approx(fresh[0].score * (1 - VISITED_PENALTY))
    assert visited[0].previously_visited and not fresh[0].previously_visited


def test_distance_is_not_a_factor_without_a_reference_point():
    scored, _ = score_destinations(prepared([dest(1)]))
    assert "distance" not in scored[0].factors
    assert scored[0].distance_km is None


def test_a_poor_destination_scoring_below_the_minimum_is_excluded():
    poor = dest(
        1,
        interests=["Culture"],
        crowdLevel="High",
        riskStatus="Elevated Risk",
        accessStatus="Limited",
        weatherUnfavourable=True,
        accommodationAvailable=0,
    )
    scored, excluded = score_destinations(prepared([poor], interests=["Nature"]))
    assert scored == []
    assert excluded == 1


def test_every_kept_score_is_at_least_the_minimum():
    destinations = [dest(i, crowdLevel=level) for i, level in enumerate(["Low", "Moderate", "High"], start=1)]
    scored, _ = score_destinations(prepared(destinations))
    assert all(s.score >= MIN_SUITABLE_SCORE for s in scored)


# ---------------------------------------------------------------- Ranking


def scored(i, score, preference=0.5, distance_km=None):
    return ScoredDestination(
        destination=dest(i), score=score, factors={"preference": preference}, distance_km=distance_km
    )


def test_ranks_start_at_one_and_follow_the_score():
    ranked = rank([scored(1, 0.6), scored(2, 0.9), scored(3, 0.75)], limit=5)
    assert [r.destinationId for r in ranked] == [2, 3, 1]
    assert [r.rank for r in ranked] == [1, 2, 3]


def test_equal_scores_are_ordered_by_preference_then_distance():
    ranked = rank(
        [
            scored(1, 0.8, preference=0.5, distance_km=10),
            scored(2, 0.8, preference=0.9, distance_km=200),
            scored(3, 0.8, preference=0.5, distance_km=5),
        ],
        limit=5,
    )
    assert [r.destinationId for r in ranked] == [2, 3, 1]


def test_ranking_keeps_only_the_requested_number():
    ranked = rank([scored(i, 0.5 + i / 100) for i in range(10)], limit=3)
    assert len(ranked) == 3
    assert ranked[-1].rank == 3
