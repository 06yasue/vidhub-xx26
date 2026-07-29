import { NextResponse } from 'next/server';
import { turso } from '@/lib/db';

export async function GET() {
  try {
    const res = await turso.execute("SELECT * FROM settings");
    const settings: Record<string, string> = {};
    res.rows.forEach(row => {
      settings[row.key as string] = (row.value as string) || '';
    });
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Simpan atau update setiap slot iklan ke tabel settings
    for (const [key, value] of Object.entries(data)) {
      await turso.execute({
        sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
        args: [key, value as string, value as string]
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
