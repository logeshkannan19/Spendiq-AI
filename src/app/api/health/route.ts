import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ ok: true, service: "spendiq-ai", ts: new Date().toISOString() });
}

