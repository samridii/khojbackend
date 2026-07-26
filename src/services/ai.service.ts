import Groq from 'groq-sdk';
import { aiMatchRepository } from '../repositories/index.repository';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const aiService = {
  runCompass: async (userId: string, inputText: string, moodTags: string[]) => {
    const prompt = `
You are a cultural guide specialising in Nepal's living heritage.

A user describes their travel mood and interests:
"${inputText}"

Mood tags: ${moodTags.join(', ')}

Based on this, recommend relevant aspects of Nepali culture.
Respond ONLY with a valid JSON object in this exact format, nothing else:
{
  "communities": ["name1", "name2"],
  "crafts": ["name1", "name2"],
  "foods": ["name1", "name2"],
  "festivals": ["name1", "name2"],
  "music": ["name1", "name2"],
  "regions": ["name1", "name2"],
  "culturalInsight": "A warm 2-3 sentence insight connecting the user's mood to Nepali culture.",
  "matchPercent": 92,
  "cultureName": "Primary culture name",
  "tagline": "One sentence describing why this is a match."
}
Each array should have 2-4 specific Nepali items. Be accurate and specific to Nepal.
    `.trim();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const raw = response.choices[0].message.content || '{}';

    // Strip any markdown fences if present
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
    const { userId, durationDays, budget, startCity, travelStyle, interests, groupType, ethnicFocus } = params;

    const prompt = `
You are an expert cultural travel planner for Nepal.

Create a detailed ${durationDays}-day cultural journey with these preferences:
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
          "tip": "Practical tip for visitors."
        }
      ],
      "etiquetteTips": ["Tip 1", "Tip 2"]
    }
  ]
}
Types for stops: cultural_site, workshop, food, festival, rest.
Make it immersive, authentic, and grounded in real Nepal geography and culture.
    `.trim();

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 2048,
    });

    const raw = response.choices[0].message.content || '{}';
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