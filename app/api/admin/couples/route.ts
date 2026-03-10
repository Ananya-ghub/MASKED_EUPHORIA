import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Couple from "@/models/Couple";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all couples
    const couples = await Couple.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: couples.length, data: couples }, { status: 200 });
  } catch (error) {
    console.error("Fetch couples error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch couples" },
      { status: 500 }
    );
  }
}
