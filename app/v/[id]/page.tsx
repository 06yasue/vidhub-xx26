import { notFound } from 'next/navigation';
import { turso } from '@/lib/db';
import HitCounter from '@/components/HitCounter';

export const revalidate = 60; // Cache 60 detik

export default async function VideoPlayer({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Await params (Sangat penting untuk Next.js 16)
  const { id } = await params;

  let video = null;

  // 2. Gunakan try-catch agar jika DB bermasalah web tidak langsung crash 500
  try {
    const res = await turso.execute({
      sql: "SELECT * FROM videos WHERE id = ?",
      args: [id]
    });
    video = res.rows[0];
  } catch (error) {
    console.error("Gagal konek ke Turso:", error);
  }

  // 3. Jika video tidak ditemukan / DB error, lempar ke Halaman 404
  if (!video) {
    notFound();
  }

  return (
    <div className="row">
      {/* Hit counter di background */}
      <HitCounter videoId={id} />

      <div className="col-md-8 col-md-offset-2">
        <h2>{video.title as string}</h2>
        
        <p className="text-muted" style={{ marginBottom: '15px' }}>
          <span className="glyphicon glyphicon-eye-open"></span> {(video.hitcount as number) || 0} x ditonton
        </p>

        <div className="embed-responsive embed-responsive-16by9" style={{ background: '#000', marginBottom: '20px' }}>
          <iframe 
            className="embed-responsive-item" 
            src={video.embed_url as string} 
            allowFullScreen>
          </iframe>
        </div>
      </div>
    </div>
  );
}
