import { notFound } from 'next/navigation';
import { turso } from '@/lib/db';
import HitCounter from '@/components/HitCounter';

export const revalidate = 60; // Cache 60 detik

export default async function VideoPlayer({ params }: { params: { id: string } }) {
  const res = await turso.execute({
    sql: "SELECT * FROM videos WHERE id = ?",
    args: [params.id]
  });

  const video = res.rows[0];

  // Jika ID video tidak ditemukan -> Lempar langsung ke halaman 404
  if (!video) {
    notFound();
  }

  return (
    <div className="row">
      {/* Jalankan peningkat hit count secara otomatis */}
      <HitCounter videoId={params.id} />

      <div className="col-md-8 col-md-offset-2">
        <h2>{video.title as string}</h2>
        
        {/* Tampilan Hit Count */}
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
