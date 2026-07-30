import { turso } from '@/lib/db';
import Link from 'next/link';
import AdDisplay from '@/components/AdDisplay'; 

// =====================================================================
// Mematikan Cache Next.js agar selalu memuat data terbaru
// =====================================================================
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const formatDate = (dateString: string) => {
  if (!dateString) return 'New';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Fungsi untuk membuat URL ramah SEO (Contoh: video-lucu-banget)
const makeSlug = (text: any) => {
  if (!text) return '';
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// Menggunakan props default dan di-await untuk kompatibilitas Next.js terbaru
export default async function HomePage(props: any) {
  // Await searchParams untuk mengatasi bug pagination
  const sp = await props.searchParams;
  const currentPage = parseInt(sp?.page || '1');
  
  const limit = 12; 
  const offset = (currentPage - 1) * limit;

  let videos = [];
  let totalPages = 1;

  try {
    const videosRes = await turso.execute({
      sql: "SELECT * FROM videos ORDER BY created_at DESC LIMIT ? OFFSET ?",
      args: [limit, offset]
    });
    videos = videosRes.rows;

    const countRes = await turso.execute("SELECT COUNT(*) as total FROM videos");
    const totalVideos = Number(countRes.rows[0]?.total || 0);
    totalPages = Math.ceil(totalVideos / limit) || 1;
  } catch (error) {
    console.error("Gagal mengambil data video:", error);
  }

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
    <div>
      <style dangerouslySetInnerHTML={{__html: `
        .ads-desktop-wrapper { display: none !important; text-align: center; margin-bottom: 25px; }
        .ads-mobile-wrapper { display: block !important; text-align: center; margin-bottom: 25px; }
        
        @media (min-width: 768px) {
          .ads-desktop-wrapper { display: block !important; }
          .ads-mobile-wrapper { display: none !important; }
        }

        /* Container text video dibuat fixed height agar tinggi card sama semua */
        .video-info-container {
          padding: 10px 12px;
          height: 75px; /* Kunci tinggi area teks */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Styling judul di dalam card (Maksimal 2 baris + Titik-titik) */
        .video-card-title {
          margin: 0;
          font-weight: 600;
          font-size: 13px;
          color: #1e293b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Potong setelah 2 baris */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        @media (min-width: 768px) {
          .video-info-container {
            height: 80px; /* Sedikit lebih tinggi di desktop */
          }
          .video-card-title {
            font-size: 14px;
          }
        }
      `}} />

      {/* ================= AREA IKLAN ATAS ================= */}
      {ads.ads_desktop && (
        <div className="ads-desktop-wrapper">
          <AdDisplay htmlString={ads.ads_desktop as string} />
        </div>
      )}
      
      {ads.ads_mobile && (
        <div className="ads-mobile-wrapper">
          <AdDisplay htmlString={ads.ads_mobile as string} />
        </div>
      )}

      {/* ================= AREA HEADER KONTEN ================= */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px'
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: '700', 
          color: '#0f172a' 
        }}>
          ✨ Free Sex Videos
        </h2>
      </div>

      {/* ================= AREA CARD VIDEO ================= */}
      <div className="row">
        {videos.map((vid: any) => (
          <div className="col-xs-6 col-sm-4 col-md-4" key={vid.id} style={{ marginBottom: '20px' }}>
            {/* prefetch={false} membantu mencegah bug pagination cache */}
            <Link 
              href={`/v/${vid.id}_${makeSlug(vid.title)}`} 
              prefetch={false}
              style={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}
            >
              
              <div style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                
                {/* Thumbnail 16:9 */}
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#0f172a' }}>
                  {/* Jika URL dari DB kosong, otomatis panggil /noimg.jpg */}
                  <img 
                    src={(vid.thumbnail_url as string) || '/noimg.jpg'} 
                    alt={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                
                {/* Info Card dengan Tinggi Tetap (Sama Rata) */}
                <div className="video-info-container">
                  <h4 className="video-card-title" title={vid.title}>
                    {vid.title}
                  </h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                    <span>{formatDate(vid.created_at)}</span>
                    <span>{(vid.hitcount || 0).toLocaleString()} Views</span>
                  </div>
                </div>

              </div>
            </Link>
          </div>
        ))}
        
        {videos.length === 0 && (
           <div className="col-xs-12 text-center text-muted" style={{ padding: '50px 0', fontSize: '15px' }}>
             No videos available yet.
           </div>
        )}
      </div>

      {/* ================= AREA PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="text-center" style={{ marginTop: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            {currentPage > 1 ? (
              <Link href={`/?page=${currentPage - 1}`} prefetch={false} className="btn btn-default" style={{ fontWeight: '600', padding: '6px 14px', borderRadius: '4px' }}>&laquo; Prev</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: '600', padding: '6px 14px', borderRadius: '4px' }}>&laquo; Prev</button>
            )}
            
            {currentPage < totalPages ? (
              <Link href={`/?page=${currentPage + 1}`} prefetch={false} className="btn btn-default" style={{ fontWeight: '600', padding: '6px 14px', borderRadius: '4px' }}>Next &raquo;</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: '600', padding: '6px 14px', borderRadius: '4px' }}>Next &raquo;</button>
            )}
          </div>
          <div style={{ marginTop: '10px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* ================= IKLAN BODY ================= */}
      {ads.ads_body && (
        <div className="text-center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <AdDisplay htmlString={ads.ads_body as string} />
        </div>
      )}
    </div>
  );
}
