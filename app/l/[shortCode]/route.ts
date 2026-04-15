import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;
  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const parsed = new URL(link.url);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return NextResponse.json(
        { error: "Invalid redirect target" },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid redirect target" },
      { status: 400 },
    );
  }

  return NextResponse.redirect(link.url, { status: 302 });
}
