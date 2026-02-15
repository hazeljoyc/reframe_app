import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, emotion, intensity, mode, activatedAction, aiResponse } = body;
    const sessionId = randomUUID();
    // TODO: persist to database
    return NextResponse.json({ sessionId });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
