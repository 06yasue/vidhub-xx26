import { NextResponse } from 'next/server';
import { turso } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { title, embed_url, thumbnail_url } = await req.json();
    
    // Bikin ID acak 6 karakter (contoh: abc123)
    const randomId = Math.random().toString(36).substring(2, 8);

    await turso.execute({
      sql: "INSERT INTO videos (id, title, embed_url, thumbnail_url) VALUES (?, ?, ?, ?)",
      args: [randomId, title, embed_url, thumbnail_url]
    });

    return NextResponse.json({ success: true, id: randomId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
