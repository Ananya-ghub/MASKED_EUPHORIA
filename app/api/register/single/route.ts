import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Single from "@/models/Single";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    await dbConnect();

    // If wantsPair is false, we can strip out questionnaire answers just in case
    if (!body.wantsPair) {
      const { wantsPair, name, regno, email, phone } = body;
      const single = await Single.create({ wantsPair, name, regno, email, phone });
      return NextResponse.json({ success: true, data: single }, { status: 201 });
    }

    const single = await Single.create(body);

    return NextResponse.json({ success: true, data: single }, { status: 201 });
  } catch (error) {
    console.error("Single registration error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register single user" },
      { status: 500 }
    );
  }
}
