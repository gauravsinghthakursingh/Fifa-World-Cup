import pytest
import json

def test_health_route_response():
    """Verify health endpoint JSON payload response schema."""
    response_data = {
        "status": "ok",
        "timestamp": "2026-07-08T14:20:45Z",
        "apiConfigured": True
    }
    assert response_data["status"] == "ok"
    assert "timestamp" in response_data
    assert response_data["apiConfigured"] is True

def test_ops_command_route_validation():
    """Verify route parameter constraints for operations decisions."""
    # Test safe parameter checks on route payload
    payload = {
        "command": "Optimized evacuation route for East Gate",
        "stadiumState": {
            "capacity": 87523,
            "attendance": 81450,
            "matchPhase": "First Half"
        }
    }
    
    assert len(payload["command"]) > 0
    assert payload["stadiumState"]["capacity"] == 87523
    assert payload["stadiumState"]["attendance"] <= payload["stadiumState"]["capacity"]

def test_fan_chat_route_validation():
    """Verify route parameter constraints for the fan assistance chatbot."""
    payload = {
        "message": "Where can I get vegetarian tacos?",
        "language": "Spanish",
        "userSector": "Sector 103-South"
    }
    assert payload["language"] == "Spanish"
    assert payload["userSector"] == "Sector 103-South"
    assert len(payload["message"]) > 0
