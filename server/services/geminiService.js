import { GoogleGenerativeAI } from '@google/generative-ai';
import { runFallbackMatching } from './fallbackMatcher.js';

/**
 * Perform AI Skill Matching using Google Gemini.
 * If API key is missing or call fails, gracefully delegates to local fallback matcher.
 */
export async function matchSkillsWithGemini(currentUser, candidates) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    console.warn('⚠️ GEMINI_API_KEY not configured. Using intelligent semantic fallback matcher.');
    return {
      source: 'Local Semantic AI (No API Key provided)',
      matches: runFallbackMatching(currentUser, candidates)
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash which is fast, cost-effective, and supports JSON generation
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const prompt = `
You are the AI Skill Exchange Matching Engine for "SkillSwap", a platform connecting college students for reciprocal skill exchanges.

TARGET USER PROFILE:
Name: ${currentUser.name}
College: ${currentUser.college}
Bio: ${currentUser.bio}
Skills I Can Teach:
${JSON.stringify(currentUser.canTeach, null, 2)}
Skills I Want To Learn:
${JSON.stringify(currentUser.wantsToLearn, null, 2)}

CANDIDATE USERS:
${JSON.stringify(
  candidates
    .filter(c => c.id !== currentUser.id)
    .map(c => ({
      id: c.id,
      name: c.name,
      college: c.college,
      bio: c.bio,
      canTeach: c.canTeach,
      wantsToLearn: c.wantsToLearn
    })),
  null,
  2
)}

TASK:
1. Compare the Target User with each candidate.
2. Understand natural language skill descriptions and semantic synonyms (e.g. "backend with Python" == "Python programming", "Figma" == "UI/UX design", "social media videos" == "video editing").
3. Calculate compatibility percentage (0 to 100):
   - 85 - 100%: Mutual Exchange (Target user teaches what Candidate wants to learn AND Candidate teaches what Target user wants to learn).
   - 55 - 80%: Strong One-Way match (One teaches what the other wants).
   - 20 - 50%: Partial or weak overlap.
4. For each candidate, formulate a clear, inspiring suggestedExchange:
   e.g., "You teach Rahul Python Programming ↔ Rahul teaches you UI/UX Design"
5. Write an encouraging 1-2 sentence explanation tailored to both students.

OUTPUT SPECIFICATION:
Return a JSON array of objects sorted by compatibility descending. Each object MUST have this schema:
[
  {
    "userId": "string",
    "compatibility": integer (0-100),
    "matchType": "Mutual Exchange" | "Skill Match" | "Mentorship Match" | "Potential Explorer",
    "suggestedExchange": "string",
    "explanation": "string",
    "matchedSkills": {
      "youTeachThem": "string or null",
      "theyTeachYou": "string or null"
    }
  }
]
`;

    console.log('🤖 Sending skill profiles to Gemini AI...');
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const rawMatches = JSON.parse(text);

    // Merge AI result with candidate user details
    const candidateMap = new Map(candidates.map(c => [c.id, c]));
    const matches = rawMatches
      .map(m => {
        const userObj = candidateMap.get(m.userId);
        if (!userObj) return null;
        return {
          user: userObj,
          compatibility: m.compatibility,
          matchType: m.matchType,
          suggestedExchange: m.suggestedExchange,
          explanation: m.explanation,
          matchedSkills: m.matchedSkills || {},
          engine: 'gemini-1.5-flash'
        };
      })
      .filter(Boolean);

    // Ensure sorted descending
    matches.sort((a, b) => b.compatibility - a.compatibility);

    console.log(`✅ Gemini AI successfully matched ${matches.length} candidates.`);
    return {
      source: 'Google Gemini 1.5 Flash',
      matches
    };
  } catch (err) {
    console.error('⚠️ Gemini API error occurred:', err.message);
    console.warn('🔄 Seamlessly falling back to intelligent semantic matcher...');
    return {
      source: 'Local Semantic AI (Gemini Fallback)',
      warning: `Gemini API notice: ${err.message}`,
      matches: runFallbackMatching(currentUser, candidates)
    };
  }
}
