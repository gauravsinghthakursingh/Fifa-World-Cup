import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// Lazy-initialize Gemini SDK to avoid crashes on startup if API key is not yet set
let aiInstance: GoogleGenAI | null = null;

function getGeminiSDK(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing. Please configure it in the Secrets/Settings panel.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// HEALTH API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// STADIUM OPERATIONS AI COMMAND ROUTE
app.post('/api/gemini/ops-command', async (req, res) => {
  try {
    const { command, stadiumState, incidents } = req.body;

    if (!command) {
       res.status(400).json({ error: 'Command prompt is required.' });
       return;
    }

    const ai = getGeminiSDK();

    const systemInstruction = `You are "StadiumOS AI Core", an advanced Generative AI decision-support system designed for stadium commanders, safety directors, and logistics organizers during the FIFA World Cup 2026.
Your role is to analyze current stadium states (such as crowd density, gate status, transit delays, weather, and match phases), evaluate reported active incidents, and provide highly tactical, strategic, and calm operations plans.

Structure your analysis to cover:
1. Incident assessment & immediate safety recommendations.
2. Crowd flow optimization (suggesting gate switches or concourse path adjustments).
3. Transport coordination advice.
4. Sustainability and volunteer resource deployment.

Respond strictly in the requested JSON structure. Keep explanations highly professional, actionable, and tailored to World Cup venue environments. Avoid generic fluff.`;

    const prompt = `Analyze current Stadium Operations scenario:
--- Stadium State ---
Stadium: ${stadiumState.stadiumName} (Capacity: ${stadiumState.capacity})
Current Attendance: ${stadiumState.attendance}
Match Phase: ${stadiumState.matchPhase}
Weather: ${stadiumState.weather.temp}°C, ${stadiumState.weather.condition}

--- Gate Configurations ---
${stadiumState.gates.map((g: any) => `- ${g.name}: Status: ${g.status}, Density: ${g.density}, Connects to: ${g.transitConnector}`).join('\n')}

--- Transit Status ---
${stadiumState.transit.map((t: any) => `- ${t.mode}: Status: ${t.status}, Delay: ${t.delayMinutes} min (${t.description})`).join('\n')}

--- Active Operational Incidents ---
${incidents.length === 0 ? 'None' : incidents.map((i: any) => `- [${i.severity} Priority] ${i.category}: "${i.title}" at ${i.location} (Status: ${i.status}) - ${i.description}`).join('\n')}

--- Commander's Input / Directive ---
"${command}"

Evaluate this directive against current metrics. Generate tactical analysis, prioritized recommended actions with designated targets, and a detailed mitigation checklist.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1, // low temperature for precise tactical recommendations
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: 'Clear, executive-level summary of the tactical assessment, gate/crowd adjustments, and weather/transit recommendations.',
            },
            recommendedActions: {
              type: Type.ARRAY,
              description: 'Immediate discrete actions with priority and target sectors.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Short actionable title (e.g., Redirection of Sector C)' },
                  description: { type: Type.STRING, description: 'Clear operating instruction for staff on the ground.' },
                  priority: { type: Type.STRING, description: 'Must be one of: Low, Medium, High, Critical' },
                  targetSector: { type: Type.STRING, description: 'Specific location or sector (e.g., Gate A, Metro Hub)' },
                },
                required: ['title', 'description', 'priority', 'targetSector'],
              },
            },
            mitigationSteps: {
              type: Type.ARRAY,
              description: 'Chronological checklist items representing standard operating procedures for resolving current issues.',
              items: { type: Type.STRING },
            },
          },
          required: ['analysis', 'recommendedActions', 'mitigationSteps'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Received empty response from Gemini API.');
    }

    const jsonResponse = JSON.parse(resultText.trim());
    res.json(jsonResponse);
  } catch (error: any) {
    console.error('Ops Command Error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while generating command support suggestions.',
    });
  }
});

// FAN MULTILINGUAL ASSISTANT ROUTE
app.post('/api/gemini/fan-chat', async (req, res) => {
  try {
    const { message, language, userSector, stadiumState, chatHistory } = req.body;

    if (!message) {
       res.status(400).json({ error: 'Message is required.' });
       return;
    }

    const ai = getGeminiSDK();

    const systemInstruction = `You are "Kika", the official multilingual AI Fan Experience Host for FIFA World Cup 2026.
Your purpose is to provide warm, accurate, and helpful assistance to football fans from around the world visiting ${stadiumState.stadiumName} in ${stadiumState.city}.
Answer queries about stadium amenities, accessibility ramps, seating zones, concession food (mentioning traditional dishes/options like vegetarian/halal), transportation exit strategies, safety, and match-day schedules.

CRITICAL INSTRUCTIONS:
1. Always respond in the requested language: "${language || 'Detect from user message'}" (match the fan's tone and language perfectly!).
2. Be friendly, energetic, and highly respectful of international cultural diversity.
3. Reference the current stadium conditions and transit status if relevant to the user query (e.g., if a metro is delayed, suggest taking the bus shuttle).
4. Provide highly context-aware 1-click follow-up suggestions in the same language. Keep responses concise (under 3-4 paragraphs) to avoid overwhelming fans on their mobile devices.`;

    const chatHistoryContext = chatHistory && chatHistory.length > 0 
      ? chatHistory.map((h: any) => `${h.role === 'user' ? 'Fan' : 'Kika'}: ${h.text}`).join('\n')
      : '';

    const prompt = `--- Stadium Context for Fan ---
Stadium Name: ${stadiumState.stadiumName}
City: ${stadiumState.city}
Match Phase: ${stadiumState.matchPhase}
Weather: ${stadiumState.weather.temp}°C, ${stadiumState.weather.condition}
Fan Ticket Location / Sector: ${userSector || 'General / Unspecified'}

Transit status updates to be aware of:
${stadiumState.transit.map((t: any) => `- ${t.mode}: ${t.status} (${t.description})`).join('\n')}

--- Chat History ---
${chatHistoryContext}

--- New Fan Query ---
Fan: "${message}"

Generate a helpful response in the selected language (${language}). Also generate 3 helpful follow-up queries that the fan might click next.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'The direct translation-friendly answer to the fan in their language. Keep it detailed but formatted with bullet points for high legibility.',
            },
            suggestions: {
              type: Type.ARRAY,
              description: '3 contextual follow-up questions or actions translated into the requested language.',
              items: { type: Type.STRING },
            },
          },
          required: ['reply', 'suggestions'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Received empty response from Gemini API.');
    }

    const jsonResponse = JSON.parse(resultText.trim());
    res.json(jsonResponse);
  } catch (error: any) {
    console.error('Fan Chat Error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while generating response.',
    });
  }
});

// VITE SERVER OR STATIC FILE SERVING SETUP
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode with Vite middleware
    console.log('Starting server in DEVELOPMENT mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode serving static files from dist/
    console.log('Starting server in PRODUCTION mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();
