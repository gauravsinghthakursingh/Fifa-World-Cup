from locust import HttpUser, task, between

class StadiumOSLoadTestUser(HttpUser):
    """
    Simulates concurrent operations commanders and stadium spectators
    submitting telemetry commands, reporting live incidents, and querying
    the multilingual AI assistant during high-concurrency matchday events.
    """
    # Wait between 1 to 5 seconds between tasks to simulate real-world user breathing room
    wait_time = between(1, 5)

    @task(3)
    def test_health_endpoint(self):
        """
        Periodically requests the container health metrics to verify baseline uptime.
        """
        self.client.get("/api/health")

    @task(2)
    def test_fan_chat_queries(self):
        """
        Simulates standard multi-language queries from fans scattered across
        various sectors within Estadio Azteca.
        """
        payload = {
            "message": "Where is the nearest vegetarian food stall close to Sector 103-South?",
            "language": "Español",
            "userSector": "Sector 103-South",
            "stadiumState": {
                "stadiumName": "Estadio Azteca",
                "city": "Mexico City",
                "capacity": 87523,
                "attendance": 81450,
                "matchPhase": "First Half",
                "weather": {
                    "temp": 24,
                    "condition": "Sunny"
                },
                "transit": [
                    { "mode": "Metro", "status": "Crowded", "delayMinutes": 12, "description": "Platform crowding" },
                    { "mode": "Bus Shuttle", "status": "Normal", "delayMinutes": 0, "description": "Running on time" }
                ]
            },
            "chatHistory": []
        }
        
        headers = {"Content-Type": "application/json"}
        # Send POST request to the multilingual assist endpoint
        self.client.post("/api/gemini/fan-chat", json=payload, headers=headers)

    @task(1)
    def test_ops_tactical_commands(self):
        """
        Simulates operations control dispatching command directives and routing plans
        to mitigate high-density crowd congestions.
        """
        payload = {
            "command": "Redeploy Gate B staff and redirect pedestrian queues to Gate C.",
            "stadiumState": {
                "stadiumName": "Estadio Azteca",
                "city": "Mexico City",
                "capacity": 87523,
                "attendance": 81450,
                "matchPhase": "First Half",
                "weather": {
                    "temp": 24,
                    "condition": "Sunny"
                },
                "gates": [
                    { "name": "Gate A", "status": "Open", "density": "Medium", "transitConnector": "North Parking" },
                    { "name": "Gate B", "status": "Open", "density": "Critical", "transitConnector": "Metro Station" }
                ],
                "transit": [
                    { "mode": "Metro", "status": "Crowded", "delayMinutes": 15, "description": "Platform crowding" }
                ]
            },
            "incidents": [
                {
                    "id": "inc-1",
                    "title": "Platform Congestion at Gate B",
                    "category": "Crowd",
                    "severity": "High",
                    "status": "Active",
                    "location": "Gate B Outflow",
                    "timestamp": "14:10",
                    "reportedBy": "Sector Manager",
                    "description": "High pressure of outgoing spectators colliding with incoming spectators near Metro entrance.",
                    "aiPlan": ""
                }
            ]
        }
        
        headers = {"Content-Type": "application/json"}
        # Send POST request to the tactical decision engine
        self.client.post("/api/gemini/ops-command", json=payload, headers=headers)
