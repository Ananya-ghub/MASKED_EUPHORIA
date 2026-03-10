import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Single from "@/models/Single";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all singles
    const singles = await Single.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: singles.length, data: singles }, { status: 200 });
  } catch (error) {
    console.error("Fetch singles error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch singles" },
      { status: 500 }
    );
  }
}
