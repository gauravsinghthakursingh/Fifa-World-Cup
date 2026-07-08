import { StadiumState, Incident } from './types';

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇲🇽' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export const INITIAL_STADIUM_STATE: StadiumState = {
  stadiumName: 'Estadio Azteca',
  city: 'Mexico City',
  capacity: 87523,
  attendance: 81450,
  matchPhase: 'First Half',
  weather: {
    temp: 24,
    condition: 'Sunny',
  },
  gates: [
    { name: 'Gate A', status: 'Open', density: 'Medium', transitConnector: 'North Parking' },
    { name: 'Gate B', status: 'Open', density: 'Critical', transitConnector: 'Metro Station Line 1' },
    { name: 'Gate C', status: 'Open', density: 'High', transitConnector: 'Bus Shuttle Hub North' },
    { name: 'Gate D', status: 'Open', density: 'Low', transitConnector: 'Rideshare Zone East' },
    { name: 'Gate E', status: 'Open', density: 'Low', transitConnector: 'South Parking' },
    { name: 'Gate F', status: 'Restricted', density: 'High', transitConnector: 'Metro Station Line 2' },
    { name: 'Gate G', status: 'Open', density: 'Medium', transitConnector: 'Bus Shuttle Hub South' },
    { name: 'Gate H', status: 'Closed', density: 'Critical', transitConnector: 'VIP / Media Lot' },
  ],
  transit: [
    { mode: 'Metro', status: 'Crowded', delayMinutes: 12, description: 'Line 1 station access is throttled due to platform crowding.' },
    { mode: 'Bus Shuttle', status: 'Normal', delayMinutes: 0, description: 'Dedicated lanes operational. Shuttles running every 3 minutes.' },
    { mode: 'Rideshare', status: 'Delayed', delayMinutes: 20, description: 'High congestion on East Ring Road causing pickup delays.' },
    { mode: 'Parking Express', status: 'Normal', delayMinutes: 0, description: 'North & South express lots currently at 78% capacity.' },
  ],
};

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    title: 'Platform Congestion at Gate B',
    category: 'Crowd',
    severity: 'High',
    status: 'Active',
    location: 'Gate B Outflow',
    timestamp: '14:10',
    reportedBy: 'Sector Manager North',
    description: 'High pressure of outgoing spectators colliding with incoming spectators near Metro entrance. High congestion.',
    aiPlan: 'Redirect outgoing spectator traffic to Gate C (Bus Shuttle Hub) immediately. Use PA system announcement in Zone 4.'
  },
  {
    id: 'inc-2',
    title: 'Wheelchair Elevator Inoperable',
    category: 'Accessibility',
    severity: 'Medium',
    status: 'Mitigating',
    location: 'Sector 103-South',
    timestamp: '13:55',
    reportedBy: 'Volunteer Unit 12',
    description: 'Elevator 3 is stuck on Level 2. Two wheelchair-bound fans require escort to field level access paths.',
    aiPlan: 'Deploy Volunteer Assistance Squad to escort visitors through Ramp 2C. Technician has been dispatched.'
  }
];

export const ATTENDANCE_HISTORY = [
  { time: '13:30', attendance: 25000 },
  { time: '13:45', attendance: 48000 },
  { time: '14:00', attendance: 68500 },
  { time: '14:15', attendance: 76200 },
  { time: '14:30', attendance: 81450 },
];
