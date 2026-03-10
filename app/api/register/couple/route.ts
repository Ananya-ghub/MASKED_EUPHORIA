import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Couple from "@/models/Couple";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    await dbConnect();

    const couple = await Couple.create(body);

    return NextResponse.json({ success: true, data: couple }, { status: 201 });
  } catch (error) {
    console.error("Couple registration error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register couple" },
      { status: 500 }
    );
  }
}
