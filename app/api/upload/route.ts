import { NextResponse } from 'next/server';
import { turso } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ==============================================================
    // 1. JIKA REQUEST DARI FILE .TXT (BULK UPLOAD)
    // ==============================================================
    if (body.type === 'bulk') {
      const lines = body.content.split('\n');
      let successCount = 0;
      let errorCount = 0;

      for (const line of lines) {
        if (!line.trim()) continue; // Skip baris kosong

        const parts = line.split('|');
        if (parts.length !== 5) continue; // Double check

        const id = parts[0].trim();
        const title = parts[1].trim();
        const embedUrl = parts[2].trim();
        let thumbnailUrl = parts[3].trim();
        const dateString = parts[4].trim();

        // Cek apakah ID sudah ada di Database (Cegah Duplikat)
        const check = await turso.execute({
          sql: "SELECT id FROM videos WHERE id = ?",
          args: [id]
        });

        if (check.rows.length > 0) {
          errorCount++;
          continue; // Lompat ke baris berikutnya
        }

        // Konversi URL Gambar ke i0.wp.com
        if (thumbnailUrl.startsWith('http')) {
          thumbnailUrl = 'https://i0.wp.com/' + thumbnailUrl.replace(/^https?:\/\//, '');
        }

        // Jika format tanggal di TXT berantakan, amankan dengan tanggal saat ini
        const finalDate = dateString ? dateString : new Date().toISOString();

        // Insert ke DB
        await turso.execute({
          sql: "INSERT INTO videos (id, title, embed_url, thumbnail_url, hitcount, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          args: [id, title, embedUrl, thumbnailUrl, 0, finalDate]
        });

        successCount++;
      }

      return NextResponse.json({ 
        success: true, 
        message: `Selesai! ${successCount} video berhasil diunggah. ${errorCount} video dilewati (ID sudah ada).` 
      }, { status: 200 });
    }

    // ==============================================================
    // 2. JIKA REQUEST DARI FORM MANUAL UPLOAD
    // ==============================================================
    if (body.type === 'manual') {
      const { title, embed_url, thumbnail_url } = body;
      const randomId = Math.random().toString(36).substring(2, 8);
      const now = new Date().toISOString();

      await turso.execute({
        sql: "INSERT INTO videos (id, title, embed_url, thumbnail_url, hitcount, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        args: [randomId, title, embed_url, thumbnail_url, 0, now]
      });

      return NextResponse.json({ success: true, id: randomId }, { status: 200 });
    }

    return NextResponse.json({ error: 'Tipe request tidak valid.' }, { status: 400 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada database.' }, { status: 500 });
  }
}
