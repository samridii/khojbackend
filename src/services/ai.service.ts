import Groq from 'groq-sdk';
import { aiMatchRepository } from '../repositories/index.repository';

// Lazy initialization — only create client when actually needed
const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in your .env file.');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export const aiService = {
  runCompass: async (userId: string, inputText: string, moodTags: string[]) => {
    const groq = getGroqClient();

    const prompt = `
You are a cultural guide specialising in Nepal's living heritage.

A user describes their travel mood and interests:
"${inputText}"

Mood tags: ${moodTags.join(', ')}

Respond ONLY with a valid JSON object, nothing else:
{
  "communities": ["name1", "name2"],
  "crafts": ["name1", "name2"],
  "foods": ["name1", "name2"],
  "festivals": ["name1", "name2"],
  "music": ["name1", "name2"],
  "regions": ["name1", "name2"],
  "culturalInsight": "A warm 2-3 sentence insight.",
  "matchPercent": 92,
  "cultureName": "Primary culture name",
  "tagline": "One sentence describing why this is a match."
}
Each array should have 2-4 specific Nepali items.
    `.trim();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const raw   = response.choices[0].message.content || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const results = JSON.parse(clean);

    const match = await aiMatchRepository.create({
      userId: userId as any,
      inputText,
      moodTags,
      results,
    });

    return match;
  },

  buildJourney: async (params: {
    userId: string;
    durationDays: number;
    budget: string;
    startCity: string;
    travelStyle: string;
    interests: string[];
    groupType: string;
    ethnicFocus?: string;
  }) => {
    const groq = getGroqClient();
    const { userId, durationDays, budget, startCity, travelStyle, interests, groupType, ethnicFocus } = params;

    const prompt = `
You are an expert cultural travel planner for Nepal.

Create a detailed ${durationDays}-day cultural journey:
- Budget: ${budget}
- Starting city: ${startCity}
- Travel style: ${travelStyle}
- Interests: ${interests.join(', ')}
- Group type: ${groupType}
${ethnicFocus ? `- Ethnic/cultural focus: ${ethnicFocus}` : ''}

Respond ONLY with a valid JSON object, nothing else:
{
  "title": "A poetic journey title",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "region": "Region name",
      "stops": [
        {
          "time": "9:00 AM",
          "place": "Place name",
          "type": "cultural_site",
          "description": "What to do and see here.",
          "tip": "Practical tip."
        }
      ],
      "etiquetteTips": ["Tip 1", "Tip 2"]
    }
  ]
}
Stop types: cultural_site, workshop, food, festival, rest.
    `.trim();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 2048,
    });

    const raw   = response.choices[0].message.content || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const journeyData = JSON.parse(clean);

    return { ...journeyData, durationDays, budget, startCity, travelStyle, interests, groupType, ethnicFocus };
  },

  getUserMatches: (userId: string) =>
    aiMatchRepository.findByUser(userId),

  deleteMatch: async (id: string, userId: string) => {
    const match = await aiMatchRepository.findById(id);
    if (!match) throw new Error('Match not found.');
    if (match.userId.toString() !== userId) throw new Error('Access denied.');
    return aiMatchRepository.deleteById(id);
  },
};