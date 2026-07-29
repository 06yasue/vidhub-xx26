import { notFound } from 'next/navigation';
import { turso } from '@/lib/db';

export const revalidate = 60; // Cache 60 detik (ISR)

export default async function VideoPlayer({ params }: { params: { id: string } }) {
  const res = await turso.execute({
    sql: "SELECT * FROM videos WHERE id = ?",
    args: [params.id]
  });

  const video = res.rows[0];

  if (!video) {
    notFound();
  }

  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        <h2>{video.title as string}</h2>
        <div className="embed-responsive embed-responsive-16by9" style={{ background: '#000' }}>
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
