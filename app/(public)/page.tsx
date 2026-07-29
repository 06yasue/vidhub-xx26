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
      {/* ================= AREA IKLAN ================= */}
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
          /* 
            col-xs-12 = DI HP akan jadi BESAR, memakan 1 kolom penuh, tidak kecil lagi.
            col-sm-6  = Di Tablet 2 baris
            col-md-4  = Di Desktop 3 baris
          */
          <div className="col-md-4 col-sm-6 col-xs-12" key={vid.id} style={{ marginBottom: '25px' }}>
            <Link href={`/v/${vid.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
              
              {/* Card Tanpa Border Radius (Kotak), Tanpa Shadow, Tanpa Hover */}
              <div style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd', 
              }}>
                
                {/* Thumbnail 16:9 Tanpa Tombol Play */}
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
                  <img 
                    src={vid.thumbnail_url} 
                    alt={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                
                {/* Info Card - Simpel dan Bersih */}
                <div style={{ padding: '12px 15px' }}>
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#222',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden' 
                  }}>
                    {vid.title}
                  </h4>
                  
                  {/* Tanggal & Views */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#666' }}>
                    <span>{formatDate(vid.created_at)}</span>
                    <span>{vid.hitcount || 0} Views</span>
                  </div>
                </div>

              </div>
            </Link>
          </div>
        ))}
        
        {videos.length === 0 && (
           <div className="col-xs-12 text-center text-muted" style={{ padding: '50px 0' }}>
             No videos available yet.
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
          <div style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
            Page {currentPage} of {totalPages}
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
