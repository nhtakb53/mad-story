import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;
    const fileName = `${type}.json`;

    if (!fileName) {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
    }

    const filePath = path.join(DATA_DIR, fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;
    const fileName = `${type}.json`;

    if (!fileName) {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 });
    }

    const data = await request.json();
    const filePath = path.join(DATA_DIR, fileName);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing data:", error);
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
