// Helper to determine if gender preferences align
function isGenderCompatible(user1: any, user2: any): boolean {
  const u1Match = user1.preferredMatch === "Anyone" || user1.preferredMatch === user2.gender;
  const u2Match = user2.preferredMatch === "Anyone" || user2.preferredMatch === user1.gender;
  
  return u1Match && u2Match;
}

// Scoring algorithm to match two users based on questionnaire answers
function calculateScore(user1: any, user2: any): number {
  let score = 0;

  if (user1.dealBreaker === "Too quiet" && user2.personalityType === "Very Introverted") score -= 3;
  if (user1.dealBreaker === "Too loud" && user2.personalityType === "Very Extroverted") score -= 3;
  if (user1.dealBreaker === "Not dancing" && user2.danceComfort === "I prefer not to dance") score -= 3;
  
  // Reciprocal deal breaker check
  if (user2.dealBreaker === "Too quiet" && user1.personalityType === "Very Introverted") score -= 3;
  if (user2.dealBreaker === "Too loud" && user1.personalityType === "Very Extroverted") score -= 3;
  if (user2.dealBreaker === "Not dancing" && user1.danceComfort === "I prefer not to dance") score -= 3;

  if (user1.promVibe === user2.promVibe) score += 3;
  if (user1.musicPreference === user2.musicPreference) score += 2;
  
  // Personality similarity
  if (user1.personalityType === user2.personalityType) score += 2;
  
  if (user1.energyLevel === user2.energyLevel) score += 2;
  if (user1.humorStyle === user2.humorStyle) score += 1;
  if (user1.danceComfort === user2.danceComfort) score += 1;

  // Partner expectation check
  if (user1.partnerExpectation === "Someone fun and energetic" && (user2.energyLevel === "High energy" || user2.energyLevel === "Absolute chaos")) score += 2;
  if (user1.partnerExpectation === "Someone chill and easygoing" && (user2.energyLevel === "Calm & relaxed" || user2.energyLevel === "Moderate")) score += 2;
  if (user2.partnerExpectation === "Someone fun and energetic" && (user1.energyLevel === "High energy" || user1.energyLevel === "Absolute chaos")) score += 2;
  if (user2.partnerExpectation === "Someone chill and easygoing" && (user1.energyLevel === "Calm & relaxed" || user1.energyLevel === "Moderate")) score += 2;

  return score;
}

export function generateMatches(singles: any[]) {
  const eligibleSingles = singles.filter(s => s.wantsPair);
  
  // Using a greedy approach for pairings
  let pool = [...eligibleSingles];
  const pairs = [];
  const unmatched = [];

  while (pool.length > 1) {
    const current = pool.shift(); // take the first person
    let bestMatchIndex = -1;
    let highestScore = -Infinity;

    for (let i = 0; i < pool.length; i++) {
      const candidate = pool[i];
      
      // Strict gender preference check before even calculating score
      if (!isGenderCompatible(current, candidate)) {
        continue;
      }

      const score = calculateScore(current, candidate);
      
      if (score > highestScore) {
        highestScore = score;
        bestMatchIndex = i;
      }
    }

    if (bestMatchIndex !== -1) {
      const bestMatch = pool.splice(bestMatchIndex, 1)[0];
      pairs.push({
        person1: current,
        person2: bestMatch,
        compatibilityScore: highestScore
      });
    } else {
      unmatched.push(current);
    }
  }

  // Any remaining person goes to unmatched
  if (pool.length > 0) {
    unmatched.push(pool[0]);
  }

  return { pairs, unmatched };
}
