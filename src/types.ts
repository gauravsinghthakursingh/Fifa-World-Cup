export interface GateInfo {
  name: string;
  status: 'Open' | 'Closed' | 'Restricted';
  density: 'Low' | 'Medium' | 'High' | 'Critical';
  transitConnector: string;
}

export interface TransitInfo {
  mode: 'Metro' | 'Bus Shuttle' | 'Rideshare' | 'Parking Express';
  status: 'Normal' | 'Delayed' | 'Suspended' | 'Crowded';
  delayMinutes: number;
  description: string;
}

export interface Incident {
  id: string;
  title: string;
  category: 'Crowd' | 'Safety' | 'Accessibility' | 'Infrastructure' | 'Medical';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Mitigating' | 'Resolved';
  location: string;
  timestamp: string;
  reportedBy: string;
  description: string;
  aiPlan?: string;
}

export interface StadiumState {
  stadiumName: string;
  city: string;
  capacity: number;
  attendance: number;
  matchPhase: 'Gates Open' | 'Warmups' | 'First Half' | 'Halftime' | 'Second Half' | 'Post-Match' | 'Closed';
  weather: {
    temp: number;
    condition: 'Sunny' | 'Overcast' | 'Rain' | 'Heavy Rain' | 'Windy';
  };
  gates: GateInfo[];
  transit: TransitInfo[];
}

export interface OPSRequest {
  command: string;
  stadiumState: StadiumState;
  incidents: Incident[];
}

export interface OPSResponse {
  analysis: string;
  recommendedActions: {
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    targetSector: string;
  }[];
  mitigationSteps: string[];
}

export interface FanChatRequest {
  message: string;
  language: string;
  userSector?: string;
  stadiumState: StadiumState;
  chatHistory: { role: 'user' | 'model'; text: string }[];
}

export interface FanChatResponse {
  reply: string;
  suggestions: string[];
}
