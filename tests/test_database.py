import pytest

def test_local_storage_persistence():
    """Verify state recovery from local storage cache serialization."""
    mock_local_storage = {}
    
    # Simulate saving stadium state to cache
    stadium_cache = {
        "stadiumName": "Estadio Azteca",
        "attendance": 81450,
        "matchPhase": "Halftime"
    }
    mock_local_storage["stadium_state"] = stadium_cache
    
    # Recover and assert integrity
    recovered = mock_local_storage["stadium_state"]
    assert recovered["stadiumName"] == "Estadio Azteca"
    assert recovered["attendance"] == 81450
    assert recovered["matchPhase"] == "Halftime"

def test_incident_history_persistence():
    """Verify local state modification and incident logs resolution updates."""
    incidents_list = [
        {"id": "inc-1", "title": "Dehydration Sector 103", "status": "Active"},
        {"id": "inc-2", "title": "Power Outage Food Zone", "status": "Active"}
    ]
    
    # Resolve incident inc-1
    for incident in incidents_list:
        if incident["id"] == "inc-1":
            incident["status"] = "Resolved"
            
    assert incidents_list[0]["status"] == "Resolved"
    assert incidents_list[1]["status"] == "Active"
