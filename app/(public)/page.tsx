import Link from 'next/link';
import { turso } from '@/lib/db';

export const revalidate = 60; // Cache 60 detik agar Vercel irit

export default async function HomePage() {
  // Ambil daftar 12 video terbaru dari database Turso
  let videos: any[] = [];
  try {
    const res = await turso.execute("SELECT * FROM videos ORDER BY created_at DESC LIMIT 12");
    videos = res.rows;
  } catch (error) {
    console.error("Gagal mengambil data dari Turso:", error);
  }

  return (
    <div>
      {/* Bagian Header / Coming Soon */}
      <div className="jumbotron text-center" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
        <h2>🔥 Upcoming Project Video Portal</h2>
        <p className="text-muted">
          Platform streaming video sedang dalam tahap pengembangan. Tonton koleksi video terbaru kami di bawah ini!
        </p>
      </div>

      <hr />
      
      <div className="row" style={{ marginBottom: '20px' }}>
        <div className="col-md-12">
          <h3>Video Terbaru</h3>
        </div>
      </div>

      {/* Grid Daftar Video */}
      <div className="row">
        {videos.length === 0 ? (
          <div className="col-md-12 text-center">
            <p className="text-muted" style={{ padding: '50px 0' }}>
              Belum ada video yang di-upload. Silakan upload via Dashboard Admin.
            </p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id as string} className="col-md-3 col-sm-6">
              <div className="thumbnail" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                {/* Menampilkan Gambar Thumbnail */}
                <img 
                  src={(video.thumbnail_url as string) || "https://via.placeholder.com/300x170?text=No+Thumbnail"} 
                  alt={video.title as string} 
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
                />
                <div className="caption">
                  {/* Judul Video */}
                  <h4 style={{ 
                    fontSize: '16px', 
                    height: '40px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    fontWeight: 'bold'
                  }}>
                    {video.title as string}
                  </h4>
                  
                  {/* Hit Count di Homepage */}
                  <p className="text-muted" style={{ fontSize: '12px' }}>
                    <span className="glyphicon glyphicon-eye-open"></span> {(video.hitcount as number) || 0}x ditonton
                  </p>
                  
                  {/* Tombol Nonton */}
                  <Link href={`/v/${video.id}`} className="btn btn-primary btn-block">
                    Tonton Video
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
