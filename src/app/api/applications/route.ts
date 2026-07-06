import { NextRequest, NextResponse } from "next/server";
import { createApplication, hasDuplicateEmail } from "@/lib/applications-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (hasDuplicateEmail(body.email)) {
      return NextResponse.json(
        { error: "An application with this email already exists." },
        { status: 409 },
      );
    }

    const app = createApplication(body);
    return NextResponse.json({ application: app }, { status: 201 });
  } catch (err) {
    console.error("Failed to submit application:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email query parameter is required." }, { status: 400 });
  }

  const exists = hasDuplicateEmail(email);
  return NextResponse.json({ exists });
}
