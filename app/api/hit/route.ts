import { NextResponse } from 'next/server';
import { turso } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await turso.execute({
      sql: "UPDATE videos SET hitcount = hitcount + 1 WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
