// Helper to determine if gender preferences align
function isGenderCompatible(user1: any, user2: any): boolean {
  const u1Match = user1.preferredMatch === "Anyone" || user1.preferredMatch === user2.gender;
  const u2Match = user2.preferredMatch === "Anyone" || user2.preferredMatch === user1.gender;
  
  return u1Match && u2Match;
}

// Scoring algorithm to match two users based on questionnaire answers
function calculateScore(user1: any, user2: any): number {
  let score = 0;

  // Deal breaker conflict check (-3)
  if (user1.dealBreaker === "Too quiet" && user2.personalityType === "Very Introverted") score -= 3;
  if (user1.dealBreaker === "Too loud" && user2.personalityType === "Very Extroverted") score -= 3;
  if (user1.dealBreaker === "Not dancing" && user2.danceComfort === "I prefer not to dance") score -= 3;
  
  if (user2.dealBreaker === "Too quiet" && user1.personalityType === "Very Introverted") score -= 3;
  if (user2.dealBreaker === "Too loud" && user1.personalityType === "Very Extroverted") score -= 3;
  if (user2.dealBreaker === "Not dancing" && user1.danceComfort === "I prefer not to dance") score -= 3;

  // Positive Compatibility Scoring
  if (user1.promVibe === user2.promVibe) score += 3;
  if (user1.musicPreference === user2.musicPreference) score += 2;
  if (user1.personalityType === user2.personalityType) score += 2;
  if (user1.energyLevel === user2.energyLevel) score += 2;
  if (user1.humorStyle === user2.humorStyle) score += 1;
  if (user1.danceComfort === user2.danceComfort) score += 1;
  if (user1.partnerExpectation === user2.partnerExpectation) score += 2;

  return score;
}

export function generateMatches(singles: any[]) {
  // 1. Only eligible participants: wantsPair = true, checkedIn = true
  const eligibleSingles = singles.filter(s => s.wantsPair && s.checkedIn);
  
  const edges = [];

  // 2. Global Optimization: Calculate compatibility scores between every eligible pair
  for (let i = 0; i < eligibleSingles.length; i++) {
    for (let j = i + 1; j < eligibleSingles.length; j++) {
      const u1 = eligibleSingles[i];
      const u2 = eligibleSingles[j];
      
      // Strict gender preference check before even calculating score
      if (isGenderCompatible(u1, u2)) {
        const score = calculateScore(u1, u2);
        edges.push({
          u: i,
          v: j,
          score,
          // Tie Resolution: Randomly select if still tied
          rand: Math.random()
        });
      }
    }
  }

  // 3. Sort pairs: highest mutual compatibility score first, then random tiebreak
  edges.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.rand - a.rand; // Randomize ties (tie resolution rule 2)
  });

  const matchedIndices = new Set<number>();
  const pairs = [];

  // 4. Construct compatibility matches
  for (const edge of edges) {
    if (!matchedIndices.has(edge.u) && !matchedIndices.has(edge.v)) {
      matchedIndices.add(edge.u);
      matchedIndices.add(edge.v);
      pairs.push({
        person1: eligibleSingles[edge.u],
        person2: eligibleSingles[edge.v],
        compatibilityScore: edge.score
      });
    }
  }

  // 5. Aggregate unmatched users
  const unmatched = [];
  for (let i = 0; i < eligibleSingles.length; i++) {
    if (!matchedIndices.has(i)) {
      unmatched.push(eligibleSingles[i]);
    }
  }

  return { pairs, unmatched };
}
