import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 0 },
    });
    if (!res.ok) return new NextResponse("Failed", { status: res.status });

    const blob = await res.arrayBuffer();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=7200",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
