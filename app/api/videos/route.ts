import { NextResponse } from 'next/server';
import { turso } from '@/lib/db';

// Ambil daftar video (Pagination)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const offset = (page - 1) * limit;

    // Ambil limit + 1 untuk ngecek apakah masih ada halaman 'Next'
    const res = await turso.execute({
      sql: "SELECT * FROM videos ORDER BY created_at DESC LIMIT ? OFFSET ?",
      args: [limit + 1, offset]
    });

    const hasNext = res.rows.length > limit;
    const videos = res.rows.slice(0, limit); // Kembalikan max 10 saja

    return NextResponse.json({ videos, hasNext }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Hapus video
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });

    await turso.execute({
      sql: "DELETE FROM videos WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
