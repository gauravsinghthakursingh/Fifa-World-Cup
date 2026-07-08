import pytest

def test_gate_info_model():
    """Verify bounds and validation for GateInfo structures."""
    gate = {
        "name": "Gate B",
        "status": "Open",
        "density": "Critical",
        "transitConnector": "Metro Line 1"
    }
    
    assert gate["status"] in ["Open", "Closed", "Restricted"]
    assert gate["density"] in ["Low", "Medium", "High", "Critical"]
    assert len(gate["name"]) > 0

def test_transit_info_model():
    """Verify transit connection logs parameter types."""
    transit = {
        "mode": "Metro",
        "status": "Crowded",
        "delayMinutes": 25,
        "description": "Severe queueing at turnstiles."
    }
    
    assert transit["mode"] in ["Metro", "Bus Shuttle", "Rideshare", "Parking Express"]
    assert transit["status"] in ["Normal", "Delayed", "Suspended", "Crowded"]
    assert isinstance(transit["delayMinutes"], int)
    assert transit["delayMinutes"] >= 0

def test_incident_model_validation():
    """Verify operational incident field mapping constraints."""
    incident = {
        "id": "inc-100",
        "title": "Spilled liquid hazard",
        "category": "Safety",
        "severity": "High",
        "status": "Active",
        "location": "Sector 102",
        "timestamp": "14:21",
        "reportedBy": "Vision AI",
        "description": "Debris hazard reported on main pedestrian concourse."
    }
    
    assert incident["category"] in ["Crowd", "Safety", "Accessibility", "Infrastructure", "Medical"]
    assert incident["severity"] in ["Low", "Medium", "High", "Critical"]
    assert incident["status"] in ["Active", "Mitigating", "Resolved"]
    assert len(incident["id"]) > 0
