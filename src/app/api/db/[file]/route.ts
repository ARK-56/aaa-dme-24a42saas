import { NextResponse } from "next/server";
import { isDbFile, readDoc, writeDoc } from "@/lib/redis";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ file: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { file } = await params;

  if (!isDbFile(file)) {
    return NextResponse.json({ error: "Unknown database file" }, { status: 400 });
  }

  try {
    const data = await readDoc(file);
    if (data === null) {
      return NextResponse.json(
        { error: "Database file not initialized" },
        { status: 404 }
      );
    }
    // The stored value is already JSON — hand it back verbatim rather than
    // parsing and re-serializing it.
    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/db] read failed:", err);
    return NextResponse.json(
      { error: "Error reading from database" },
      { status: 503 }
    );
  }
}

export async function POST(req: Request, { params }: Ctx) {
  const { file } = await params;

  if (!isDbFile(file)) {
    return NextResponse.json({ error: "Unknown database file" }, { status: 400 });
  }

  const body = await req.text();
  try {
    JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload format" },
      { status: 400 }
    );
  }

  try {
    await writeDoc(file, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/db] write failed:", err);
    return NextResponse.json(
      { error: "Error writing to database" },
      { status: 503 }
    );
  }
}
