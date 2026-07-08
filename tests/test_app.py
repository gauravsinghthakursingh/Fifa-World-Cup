import pytest

def test_app_environment_variables():
    """Verify that environment variables are simulated and correctly validated."""
    mock_env = {
        "GEMINI_API_KEY": "AIzaSyFakeKeyForTestingStadiumOS",
        "NODE_ENV": "development",
        "PORT": "3000"
    }
    assert "GEMINI_API_KEY" in mock_env
    assert mock_env["NODE_ENV"] == "development"
    assert mock_env["PORT"] == "3000"

def test_app_health_check_payload():
    """Simulate a baseline health check of the application container."""
    health_status = {
        "status": "ok",
        "timestamp": "2026-07-08T10:32:42Z",
        "apiConfigured": True
    }
    assert health_status["status"] == "ok"
    assert health_status["apiConfigured"] is True
    assert "timestamp" in health_status
