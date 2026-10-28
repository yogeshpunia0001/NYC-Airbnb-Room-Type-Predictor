import { NextResponse } from "next/server";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.FASTAPI_URL ||
  "http://localhost:8000"
).replace(/\/+$/, "");

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${BACKEND_URL}/`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        online: true,
        service: data.service || "NYC Airbnb Classification API",
        url: BACKEND_URL,
      });
    }
  } catch {
    // FastAPI is not running or unreachable
  }

  return NextResponse.json({
    online: false,
    service: "Client Fallback Mode (FastAPI Standby)",
    url: BACKEND_URL,
  });
}
