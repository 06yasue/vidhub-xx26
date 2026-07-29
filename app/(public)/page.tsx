import { turso } from '@/lib/db';
import Link from 'next/link';
import AdDisplay from '@/components/AdDisplay'; 

const formatDate = (dateString: string) => {
  if (!dateString) return 'Baru';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams?.page || '1');
  const limit = 12; 
  const offset = (currentPage - 1) * limit;

  const videosRes = await turso.execute({
    sql: "SELECT * FROM videos ORDER BY created_at DESC LIMIT ? OFFSET ?",
    args: [limit, offset]
  });
  const videos = videosRes.rows;

  const countRes = await turso.execute("SELECT COUNT(*) as total FROM videos");
  const totalVideos = Number(countRes.rows[0].total);
  const totalPages = Math.ceil(totalVideos / limit) || 1;

  let ads: any = {};
  try {
    const settingsRes = await turso.execute("SELECT * FROM settings");
    settingsRes.rows.forEach((row) => {
      ads[row.key as string] = row.value;
    });
  } catch (error) {
    console.error("Gagal mengambil data settings:", error);
  }

  return (
    /* Menggunakan container-fluid untuk mengatasi bug layar bisa digeser ke samping (horizontal scroll) */
    <div className="container-fluid" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      {/* CSS Tambahan untuk efek Hover Card & Tombol Play di Tengah */}
      <style dangerouslySetInnerHTML={{__html: `
        .video-card {
          background-color: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: block;
          text-decoration: none !important;
          color: inherit !important;
        }
        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.15);
        }
        .thumb-wrapper {
          position: relative;
          padding-top: 56.25%;
          background-color: #000;
          overflow: hidden;
        }
        .thumb-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .video-card:hover .thumb-img {
          transform: scale(1.05);
        }
        .play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(220, 38, 38, 0.85); /* Warna merah ala YouTube */
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .video-card:hover .play-btn {
          background-color: rgba(220, 38, 38, 1);
          transform: translate(-50%, -50%) scale(1.1);
        }
        .video-title {
          margin: 0 0 10px 0;
          font-weight: 700;
          font-size: 15px;
          color: #1a202c;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}} />

      {/* ================= AREA IKLAN ================= */}
      {/* Dihapus style display:block agar tidak bentrok dengan class responsive Bootstrap */}
      {ads.ads_desktop && (
        <div className="text-center hidden-xs hidden-sm" style={{ marginBottom: '25px' }}>
          <AdDisplay htmlString={ads.ads_desktop as string} />
        </div>
      )}
      
      {ads.ads_mobile && (
        <div className="text-center hidden-md hidden-lg" style={{ marginBottom: '25px' }}>
          <AdDisplay htmlString={ads.ads_mobile as string} />
        </div>
      )}

      {/* ================= AREA CARD VIDEO ================= */}
      <div className="row">
        {videos.map((vid: any) => (
          <div className="col-md-4 col-sm-6 col-xs-6" key={vid.id} style={{ marginBottom: '25px' }}>
            <Link href={`/v/${vid.id}`} className="video-card">
              
              {/* Thumbnail 16:9 */}
              <div className="thumb-wrapper">
                <img 
                  src={vid.thumbnail_url} 
                  alt={vid.title} 
                  className="thumb-img"
                />
                {/* Badge Play di Tengah */}
                <div className="play-btn">
                  <i className="material-icons" style={{ fontSize: '28px' }}>play_arrow</i>
                </div>
              </div>
              
              {/* Info Card */}
              <div style={{ padding: '14px 16px' }}>
                <h4 className="video-title">
                  {vid.title}
                </h4>
                
                {/* Tanggal & Views */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#718096' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="material-icons" style={{ fontSize: '14px' }}>schedule</i> 
                    {formatDate(vid.created_at)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="material-icons" style={{ fontSize: '14px' }}>visibility</i> 
                    {vid.hitcount || 0}
                  </span>
                </div>
              </div>

            </Link>
          </div>
        ))}

        {videos.length === 0 && (
           <div className="col-xs-12 text-center text-muted" style={{ padding: '50px 0' }}>
             Belum ada video yang diunggah.
           </div>
        )}
      </div>

      {/* ================= AREA PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="text-center" style={{ marginTop: '20px', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
            {currentPage > 1 ? (
              <Link href={`/?page=${currentPage - 1}`} className="btn btn-default" style={{ fontWeight: 'bold', padding: '8px 16px' }}>&laquo; Prev</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: 'bold', padding: '8px 16px' }}>&laquo; Prev</button>
            )}
            
            {currentPage < totalPages ? (
              <Link href={`/?page=${currentPage + 1}`} className="btn btn-default" style={{ fontWeight: 'bold', padding: '8px 16px' }}>Next &raquo;</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: 'bold', padding: '8px 16px' }}>Next &raquo;</button>
            )}
          </div>
          <div style={{ marginTop: '12px', color: '#4a5568', fontSize: '14px', fontWeight: 'bold' }}>
            Halaman {currentPage} dari {totalPages}
          </div>
        </div>
      )}

      {/* ================= IKLAN BODY ================= */}
      {ads.ads_body && (
        <div className="text-center" style={{ marginTop: '30px', marginBottom: '20px' }}>
          <AdDisplay htmlString={ads.ads_body as string} />
        </div>
      )}
    </div>
  );
}
