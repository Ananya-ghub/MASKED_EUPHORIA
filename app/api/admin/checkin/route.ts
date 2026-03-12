import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Single from "@/models/Single";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { regno, checkedIn } = body;

    if (!regno) {
      return NextResponse.json({ success: false, message: "Registration number is required" }, { status: 400 });
    }

    const updatedSingle = await Single.findOneAndUpdate(
      { regno },
      { checkedIn },
      { new: true }
    );

    if (!updatedSingle) {
      return NextResponse.json({ success: false, message: "Participant not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSingle }, { status: 200 });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update check-in status" },
      { status: 500 }
    );
  }
}
