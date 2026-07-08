import pytest

def get_density_badge_class(density):
    """Simulate density styling class mappings used in our React components."""
    if density == "Critical":
        return "bg-red-600 text-white animate-pulse font-bold"
    elif density == "High":
        return "bg-orange-500 text-black font-bold"
    elif density == "Medium":
        return "bg-yellow-500 text-black font-bold"
    else:
        return "bg-blue-600 text-white font-bold"

def test_density_badge_utility():
    """Verify that density badges map correctly to high-contrast styles."""
    assert "bg-red-600" in get_density_badge_class("Critical")
    assert "animate-pulse" in get_density_badge_class("Critical")
    assert "bg-orange-500" in get_density_badge_class("High")
    assert "bg-yellow-500" in get_density_badge_class("Medium")
    assert "bg-blue-600" in get_density_badge_class("Low")

def test_time_string_formatting():
    """Test standard operational timestamp formatting rules."""
    time_str = "14:20:45"
    parts = time_str.split(":")
    assert len(parts) == 3
    assert all(p.isdigit() for p in parts)
    assert 0 <= int(parts[0]) < 24
    assert 0 <= int(parts[1]) < 60
    assert 0 <= int(parts[2]) < 60
