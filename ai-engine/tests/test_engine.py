from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def destination(i, name, **overrides):
    base = {
        "destinationId": i,
        "name": name,
        "interests": ["Nature"],
        "latitude": 36.0 + i * 0.1,
        "longitude": 74.0 + i * 0.1,
        "crowdLevel": "Low",
        "riskStatus": "Low Risk",
        "accessStatus": "Open",
        "weatherUnfavourable": False,
        "accommodationAvailable": 10,
    }
    base.update(overrides)
    return base


def request(destinations, **overrides):
    body = {
        "tourist": {"interests": ["Nature", "Photography"], "visitCounts": {}, "location": None},
        "sourceDestinationId": None,
        "destinations": destinations,
        "limit": 5,
    }
    body.update(overrides)
    return client.post("/recommendations/score", json=body)


def ids(response):
    return [r["destinationId"] for r in response.json()["recommendations"]]


def test_excludes_unsafe_overcrowded_and_closed_destinations():
    res = request([
        destination(1, "Safe"),
        destination(2, "High risk", riskStatus="High Risk"),
        destination(3, "Critical crowd", crowdLevel="Critical"),
        destination(4, "Closed", accessStatus="Closed"),
    ])
    assert res.status_code == 200
    assert ids(res) == [1]
    assert res.json()["excluded"] == 3


def test_alternatives_are_not_more_crowded_or_riskier_than_source():
    res = request(
        [
            destination(1, "Source", crowdLevel="High", riskStatus="Elevated Risk"),
            destination(2, "Quieter", crowdLevel="Low"),
            destination(3, "Even busier", crowdLevel="High", riskStatus="High Risk"),
        ],
        sourceDestinationId=1,
    )
    assert ids(res) == [2]
    reasons = res.json()["recommendations"][0]["reasons"]
    assert "Quieter than your pick" in reasons
    assert "Safer than your pick" in reasons


def test_preferences_drive_ranking():
    res = request([
        destination(1, "History only", interests=["Historical Sites"]),
        destination(2, "Nature and photos", interests=["Nature", "Photography"]),
    ])
    assert ids(res)[0] == 2


def test_visited_destinations_are_kept_but_ranked_lower():
    destinations = [destination(1, "Visited"), destination(2, "New")]
    res = request(destinations, tourist={"interests": ["Nature"], "visitCounts": {"1": 3}, "location": None})
    assert ids(res) == [2, 1]
    assert res.json()["recommendations"][1]["previouslyVisited"] is True


def test_no_suitable_alternative_returns_empty_list():
    res = request(
        [destination(1, "Source", crowdLevel="Critical"), destination(2, "Also critical", crowdLevel="Critical")],
        sourceDestinationId=1,
    )
    assert res.json()["recommendations"] == []


def test_distance_from_tourist_location_is_used_when_given():
    res = request(
        [destination(1, "Far", latitude=36.0, longitude=80.0), destination(2, "Near", latitude=36.0, longitude=74.0)],
        tourist={"interests": ["Nature"], "visitCounts": {}, "location": {"latitude": 36.0, "longitude": 74.0}},
    )
    assert ids(res)[0] == 2
    assert "distance" in res.json()["recommendations"][0]["factors"]


def test_distance_is_measured_from_the_selected_destination_without_a_location():
    res = request(
        [
            destination(1, "Source", crowdLevel="High", latitude=36.0, longitude=74.0),
            destination(2, "Far", latitude=36.0, longitude=80.0),
            destination(3, "Near", latitude=36.1, longitude=74.0),
        ],
        sourceDestinationId=1,
    )
    assert ids(res) == [3, 2]
    assert "11 km from Source" in res.json()["recommendations"][0]["reasons"]


def test_distance_is_left_out_when_there_is_no_reference_point():
    res = request([destination(1, "Anywhere")])
    assert "distance" not in res.json()["recommendations"][0]["factors"]


def test_scores_are_between_0_and_1_and_ranked_from_best_to_worst():
    res = request([
        destination(1, "Best", interests=["Nature", "Photography"], accommodationAvailable=40),
        destination(2, "Busy", crowdLevel="High"),
        destination(3, "Risky", riskStatus="Elevated Risk", accessStatus="Limited"),
        destination(4, "Stormy", weatherUnfavourable=True),
    ])
    recommendations = res.json()["recommendations"]
    scores = [r["score"] for r in recommendations]
    assert all(0.0 <= s <= 1.0 for s in scores)
    assert scores == sorted(scores, reverse=True)
    assert [r["rank"] for r in recommendations] == list(range(1, len(recommendations) + 1))
    assert recommendations[0]["destinationId"] == 1


def test_weights_cover_every_factor_of_fr_05_03_and_add_up_to_one():
    from app.scoring import WEIGHTS

    assert set(WEIGHTS) == {"preference", "crowd", "safety", "weather", "distance", "accessibility", "accommodation"}
    assert abs(sum(WEIGHTS.values()) - 1.0) < 1e-9


def test_limit_is_respected():
    res = request([destination(i, f"Place {i}") for i in range(1, 9)], limit=3)
    assert len(ids(res)) == 3


def test_tourist_without_preferences_still_gets_recommendations():
    res = request(
        [destination(1, "A"), destination(2, "B", crowdLevel="Moderate")],
        tourist={"interests": [], "visitCounts": {}, "location": None},
    )
    assert ids(res) == [1, 2]


def test_invalid_input_is_rejected():
    assert request([destination(1, "Bad level", crowdLevel="Packed")]).status_code == 422
    assert request([destination(1, "Bad risk", riskStatus="Unknown")]).status_code == 422
    assert request([destination(1, "Fine")], limit=0).status_code == 422
    assert client.post("/recommendations/score", json={}).status_code == 422


def test_health_reports_the_approach():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok", "approach": "content-based", "version": "1.0.0"}
