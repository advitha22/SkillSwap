/**
 * Intelligent Local Semantic Fallback Matcher.
 * Guarantees that SkillSwap matching continues to function flawlessly
 * even if the Gemini API key is unset, invalid, or temporarily rate-limited.
 */

// Semantic cluster dictionary for flexible natural-language synonym recognition
const SEMANTIC_CLUSTERS = {
  programming: ['python', 'coding', 'programming', 'developer', 'backend', 'frontend', 'javascript', 'react', 'script', 'web development', 'software', 'html', 'css', 'code'],
  python: ['python', 'backend', 'django', 'fastapi', 'flask', 'automation', 'scripting', 'data analysis', 'pandas', 'machine learning'],
  design: ['ui', 'ux', 'ui/ux', 'figma', 'design', 'graphic design', 'wireframe', 'prototyping', 'canva', 'photoshop', 'illustrator', 'user interface'],
  video: ['video', 'editing', 'premiere', 'davinci', 'reels', 'tiktok', 'youtube', 'content creation', 'after effects', 'vlog', 'filmmaking'],
  publicSpeaking: ['public speaking', 'presentation', 'speech', 'debate', 'pitch', 'pitching', 'communication', 'interview', 'verbal', 'stage', 'storytelling'],
  dataScience: ['machine learning', 'data science', 'statistics', 'math', 'pandas', 'scikit', 'deep learning', 'ai', 'data analysis', 'analytics'],
  webDev: ['frontend', 'react', 'javascript', 'html', 'css', 'tailwind', 'web dev', 'web development', 'vite', 'ui'],
  music: ['guitar', 'music', 'acoustic', 'electric', 'audio', 'sound', 'ableton', 'recording', 'mixing', 'songs', 'instrument'],
  languages: ['spanish', 'language', 'conversational', 'tutoring', 'fluent', 'grammar', 'english', 'french', 'polyglot'],
  finance: ['finance', 'investing', 'stocks', 'financial', 'budgeting', 'portfolio', 'economics', 'excel', 'spreadsheet', 'modeling'],
  database: ['sql', 'database', 'postgres', 'postgresql', 'relational', 'queries', 'schema', 'indexing', 'backend']
};

/**
 * Clean and tokenize a text string
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

/**
 * Calculate semantic similarity score between two skill descriptions (0.0 to 1.0)
 */
function calculateSkillSimilarity(skillA, skillB) {
  const textA = typeof skillA === 'string' ? skillA : `${skillA.skill || ''} ${skillA.description || ''}`;
  const textB = typeof skillB === 'string' ? skillB : `${skillB.skill || ''} ${skillB.description || ''}`;

  const lowerA = textA.toLowerCase();
  const lowerB = textB.toLowerCase();

  // 1. Direct exact or substring match
  if (lowerA.includes(lowerB) || lowerB.includes(lowerA)) {
    return 1.0;
  }

  // 2. Token overlap (Jaccard similarity)
  const tokensA = new Set(tokenize(lowerA));
  const tokensB = new Set(tokenize(lowerB));

  let sharedTokens = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) sharedTokens++;
  }
  const tokenScore = sharedTokens / Math.max(tokensA.size, tokensB.size, 1);

  // 3. Cluster overlap (Synonym / concept grouping)
  let sharedClusters = 0;
  let totalClusters = 0;

  for (const [_, keywords] of Object.entries(SEMANTIC_CLUSTERS)) {
    const aHas = keywords.some(k => lowerA.includes(k));
    const bHas = keywords.some(k => lowerB.includes(k));

    if (aHas || bHas) totalClusters++;
    if (aHas && bHas) sharedClusters++;
  }

  const clusterScore = totalClusters > 0 ? (sharedClusters / totalClusters) : 0;

  return Math.min(1.0, (tokenScore * 0.4) + (clusterScore * 0.8));
}

/**
 * Find best matching skill pair between User A's list and User B's list
 */
function findBestSkillMatch(listA, listB) {
  let bestScore = 0;
  let bestPair = null;

  for (const itemA of listA) {
    for (const itemB of listB) {
      const score = calculateSkillSimilarity(itemA, itemB);
      if (score > bestScore) {
        bestScore = score;
        bestPair = {
          fromA: typeof itemA === 'string' ? itemA : itemA.skill,
          fromB: typeof itemB === 'string' ? itemB : itemB.skill,
          score
        };
      }
    }
  }

  return { bestScore, bestPair };
}

/**
 * Match target user with an array of candidate users using local semantic intelligence.
 */
export function runFallbackMatching(currentUser, candidates) {
  const matches = [];

  for (const candidate of candidates) {
    if (candidate.id === currentUser.id) continue;

    // 1. What current user teaches vs what candidate wants to learn
    const teachToCandidate = findBestSkillMatch(currentUser.canTeach, candidate.wantsToLearn);

    // 2. What candidate teaches vs what current user wants to learn
    const candidateToCurrentUser = findBestSkillMatch(candidate.canTeach, currentUser.wantsToLearn);

    const scoreTeach = teachToCandidate.bestScore;
    const scoreLearn = candidateToCurrentUser.bestScore;

    let compatibility = 0;
    let matchType = 'Partial';
    let suggestedExchange = '';
    let explanation = '';

    // Mutual Exchange Condition (Both directions show relevant match)
    if (scoreTeach >= 0.35 && scoreLearn >= 0.35) {
      matchType = 'Mutual Exchange';
      const avg = (scoreTeach + scoreLearn) / 2;
      compatibility = Math.min(98, Math.round(75 + (avg * 23)));

      suggestedExchange = `You teach ${candidate.name} ${teachToCandidate.bestPair.fromA} ↔ ${candidate.name} teaches you ${candidateToCurrentUser.bestPair.fromA}`;
      explanation = `Excellent mutual match! You can help ${candidate.name} master ${teachToCandidate.bestPair.fromA}, and in return ${candidate.name} can teach you ${candidateToCurrentUser.bestPair.fromA}.`;
    } else if (scoreLearn >= 0.4) {
      // Candidate can teach what current user wants
      matchType = 'Skill Match';
      compatibility = Math.min(75, Math.round(45 + (scoreLearn * 25)));
      suggestedExchange = `${candidate.name} can teach you ${candidateToCurrentUser.bestPair.fromA}`;
      explanation = `${candidate.name} has strong proficiency in ${candidateToCurrentUser.bestPair.fromA}, matching your goal to learn it.`;
    } else if (scoreTeach >= 0.4) {
      // Current user can teach what candidate wants
      matchType = 'Mentorship Match';
      compatibility = Math.min(70, Math.round(40 + (scoreTeach * 25)));
      suggestedExchange = `You can teach ${candidate.name} ${teachToCandidate.bestPair.fromA}`;
      explanation = `${candidate.name} is looking to learn ${teachToCandidate.bestPair.fromA}, which you have expertise in.`;
    } else {
      // Low relevance
      compatibility = Math.round(Math.max(scoreTeach, scoreLearn) * 35);
      matchType = 'Potential Explorer';
      suggestedExchange = `Connect to explore complementary interests`;
      explanation = `Shared campus network; explore cross-disciplinary collaboration opportunities.`;
    }

    matches.push({
      user: candidate,
      compatibility,
      matchType,
      suggestedExchange,
      explanation,
      matchedSkills: {
        youTeachThem: teachToCandidate.bestPair ? teachToCandidate.bestPair.fromA : null,
        theyTeachYou: candidateToCurrentUser.bestPair ? candidateToCurrentUser.bestPair.fromA : null
      },
      engine: 'semantic-fallback'
    });
  }

  // Sort by compatibility descending
  matches.sort((a, b) => b.compatibility - a.compatibility);

  return matches;
}
