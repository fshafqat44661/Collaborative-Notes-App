import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// This is a simple file-based DB simulation
const dataFilePath = path.join(process.cwd(), "data", "notes.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, "utf8");
    const notes = JSON.parse(fileContent);
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  // Logic to save to file or DB (Prisma/Postgres) would go here
  // For now, we return success to mimic backend behavior
  return NextResponse.json({ message: "Note saved", data: body });
}
