import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Single from "@/models/Single";
import Match from "@/models/Match";
import { generateMatches } from "@/utils/matchingAlgorithm";

export async function POST() {
  try {
    await dbConnect();

    // Fetch all eligible singles (who want a pair and are checked in)
    const singles = await Single.find({ wantsPair: true, checkedIn: true });
    
    // Generate matches based on criteria
    const { pairs, unmatched } = generateMatches(singles);

    const savedPairs = [];

    // Persist matches to the database
    for (const pair of pairs) {
      // Create new match document
      const newMatch = await Match.create({
        person1Name: pair.person1.name,
        person1RegNo: pair.person1.regno,
        person2Name: pair.person2.name,
        person2RegNo: pair.person2.regno,
        compatibilityScore: pair.compatibilityScore
      });

      // Update the singles to mark them as no longer needing a pair 
      // (so they don't get matched again if the algorithm runs twice)
      await Single.updateMany(
        { regno: { $in: [pair.person1.regno, pair.person2.regno] } },
        { wantsPair: false }
      );

      savedPairs.push(newMatch);
    }

    return NextResponse.json({ 
      success: true, 
      totalPaired: savedPairs.length * 2,
      totalPairs: savedPairs.length,
      unmatchedCount: unmatched.length,
      pairs: savedPairs, 
      unmatched 
    }, { status: 201 });
  } catch (error) {
    console.error("Match generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate matches" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const matches = await Match.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: matches.length, data: matches }, { status: 200 });
  } catch (error) {
    console.error("Fetch matches error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
