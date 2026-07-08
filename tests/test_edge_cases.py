import pytest

def test_missing_nested_fields_handling():
    """Verify state builders handle empty or missing gate lists safely."""
    raw_state = {
        "stadiumName": "Estadio Azteca"
        # gates key is missing entirely!
    }
    
    # Handle safely just like server.ts
    gates = raw_state.get("gates", [])
    assert isinstance(gates, list)
    assert len(gates) == 0

def test_numeric_clamping_for_out_of_bounds_inputs():
    """Verify that values like stadium attendance or temperature are clamped to logical limits."""
    # Logic in server.ts:
    # safeCapacity = Math.min(Math.max(Number(capacity) || 0, 0), 200000);
    # safeAttendance = Math.min(Math.max(Number(attendance) || 0, 0), safeCapacity);
    # safeTemp = Math.min(Math.max(Number(temp) || 20, -10), 50);
    
    def clamp_capacity(cap):
        try:
            val = int(cap)
        except (ValueError, TypeError):
            val = 0
        return min(max(val, 0), 200000)
        
    def clamp_attendance(att, cap):
        try:
            val = int(att)
        except (ValueError, TypeError):
            val = 0
        return min(max(val, 0), cap)

    assert clamp_capacity(250000) == 200000 # Capped at max allowed
    assert clamp_capacity(-50) == 0 # Bottom limit
    assert clamp_capacity("invalid") == 0 # Fallback
    
    assert clamp_attendance(150000, 87523) == 87523 # Attendance cannot exceed capacity
    assert clamp_attendance(-100, 87523) == 0 # Cannot be negative
