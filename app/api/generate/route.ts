import { NextResponse } from "next/server";
import { mockOutlines } from "./data/mockOutlines";
import { GenerateRequest, GenerateResponse } from "./types";

export async function POST(req: Request): Promise<Response> {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.topic) {
      return NextResponse.json<GenerateResponse>(
        { success: false, error: "Topic is required." },
        { status: 400 }
      );
    }

    const lowerCaseTopic = body.topic.toLowerCase();

    if (lowerCaseTopic !== "discrete mathematics") {
      return NextResponse.json<GenerateResponse>(
        {
          success: false,
          error: "Only 'Discrete Mathematics' is available in the demo.",
        },
        { status: 400 }
      );
    }

    const data = mockOutlines.discreteMathematics;

    return NextResponse.json<GenerateResponse>({ success: true, data });
  } catch (error) {
    return NextResponse.json<GenerateResponse>(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const courses = Object.keys(mockOutlines).map((key) => ({
    id: key,
    name: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
  }));

  return NextResponse.json({ success: true, courses });
}
