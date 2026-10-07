import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'src', 'data', 'featured.json');

export async function GET() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read featured' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const featured = await req.json();
    fs.writeFileSync(dataFile, JSON.stringify(featured, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to write featured' }, { status: 500 });
  }
}
