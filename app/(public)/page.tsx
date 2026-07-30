import { turso } from '@/lib/db';
import Link from 'next/link';
import AdDisplay from '@/components/AdDisplay'; 

const formatDate = (dateString: string) => {
  if (!dateString) return 'New';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
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
    <div>
      {/* ================= CSS KHUSUS UNTUK KUNCI IKLAN & TIPOGRAFI ================= */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Kunci responsif iklan agar script pihak ketiga tidak error ukurannya */
        .ads-desktop-wrapper { display: none; text-align: center; margin-bottom: 25px; }
        .ads-mobile-wrapper { display: block; text-align: center; margin-bottom: 25px; }
        
        @media (min-width: 768px) {
          .ads-desktop-wrapper { display: block; }
          .ads-mobile-wrapper { display: none; }
        }

        /* Styling judul di dalam card agar rapi di HP maupun Desktop */
        .video-card-title {
          margin: 0 0 6px 0;
          font-weight: 600;
          font-size: 13px; /* Ukuran font lebih pas untuk 2 kolom di HP */
          color: #1e293b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (min-width: 768px) {
          .video-card-title {
            font-size: 15px; /* Lebih besar di desktop */
            margin: 0 0 8px 0;
          }
        }
      `}} />

      {/* ================= AREA IKLAN ATAS (DIKUNCI DENGAN CSS MURNI) ================= */}
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
          /* 
            col-xs-6 = Di HP 2 Kolom
            col-sm-4 = Di Tablet 3 Kolom
            col-md-4 = Di Desktop 3 Kolom
          */
          <div className="col-xs-6 col-sm-4 col-md-4" key={vid.id} style={{ marginBottom: '20px' }}>
            <Link href={`/v/${vid.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
              
              {/* Card dengan Border Radius Sedikit (6px), Tanpa Shadow, Tanpa Hover */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                overflow: 'hidden' /* Supaya gambar ujungnya ikut melengkung sesuai border */
              }}>
                
                {/* Thumbnail 16:9 */}
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#0f172a' }}>
                  <img 
                    src={vid.thumbnail_url} 
                    alt={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                
                {/* Info Card - Simpel dan Bersih */}
                <div style={{ padding: '10px 12px' }}>
                  <h4 className="video-card-title">
                    {vid.title}
                  </h4>
                  
                  {/* Tanggal & Views */}
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
              <Link href={`/?page=${currentPage - 1}`} className="btn btn-default" style={{ fontWeight: '600', padding: '6px 14px', borderRadius: '4px' }}>&laquo; Prev</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: '600', padding: '6px 14px', borderRadius: '4px' }}>&laquo; Prev</button>
            )}
            
            {currentPage < totalPages ? (
              <Link href={`/?page=${currentPage + 1}`} className="btn btn-default" style={{ fontWeight: '600', padding: '6px 14px', borderRadius: '4px' }}>Next &raquo;</Link>
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
