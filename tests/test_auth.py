import pytest

def verify_operator_authorization(token):
    """Simulated token privilege checker for Commander vs Field Volunteer."""
    if token == "COMMANDER_SECRET_JWT":
        return {"authorized": True, "role": "Commander", "permissions": ["resolve_incidents", "dispatch_sop", "simulate_state"]}
    elif token == "VOLUNTEER_TOKEN":
        return {"authorized": True, "role": "Volunteer", "permissions": ["view_incidents", "submit_report"]}
    else:
        return {"authorized": False, "role": "Guest", "permissions": []}

def test_operator_roles_and_permissions():
    """Verify system distinguishes and permits actions based on operator hierarchy."""
    commander = verify_operator_authorization("COMMANDER_SECRET_JWT")
    assert commander["authorized"] is True
    assert commander["role"] == "Commander"
    assert "resolve_incidents" in commander["permissions"]

    volunteer = verify_operator_authorization("VOLUNTEER_TOKEN")
    assert volunteer["authorized"] is True
    assert volunteer["role"] == "Volunteer"
    assert "resolve_incidents" not in volunteer["permissions"]

    unauthorized = verify_operator_authorization("INVALID_TOKEN")
    assert unauthorized["authorized"] is False
    assert len(unauthorized["permissions"]) == 0
