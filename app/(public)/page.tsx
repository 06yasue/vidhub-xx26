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
    <div style={{ padding: '0 10px' }}>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      {/* ================= AREA IKLAN ================= */}
      {/* Menggunakan inline style block agar iklan desktop dan mobile tampil presisi */}
      {ads.ads_desktop && (
        <div style={{ display: 'block' }} className="text-center visible-lg visible-md hidden-xs hidden-sm">
          <AdDisplay style={{ marginBottom: '25px', display: 'inline-block' }} htmlString={ads.ads_desktop as string} />
        </div>
      )}
      
      {ads.ads_mobile && (
        <div style={{ display: 'block' }} className="text-center hidden-lg hidden-md visible-xs visible-sm">
          <AdDisplay style={{ marginBottom: '25px', display: 'inline-block' }} htmlString={ads.ads_mobile as string} />
        </div>
      )}

      {/* ================= AREA CARD VIDEO (DIPERBESAR) ================= */}
      <div className="row">
        {videos.map((vid: any) => (
          /* 
            col-md-4 = 3 Kolom besar di Desktop (Card jadi jauh lebih lebar/besar, tidak secuil)
            col-sm-6 = 2 Kolom di Tablet
            col-xs-6 = 2 Kolom di HP sesuai request awal Anda
          */
          <div className="col-md-4 col-sm-6 col-xs-6" key={vid.id} style={{ marginBottom: '25px', paddingLeft: '8px', paddingRight: '8px' }}>
            <Link href={`/v/${vid.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                {/* Thumbnail 16:9 yang lebih luas */}
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
                  <img 
                    src={vid.thumbnail_url} 
                    alt={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {/* Badge Play */}
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: '6px', padding: '3px 7px', color: '#fff', display: 'flex', alignItems: 'center' }}>
                    <i className="material-icons" style={{ fontSize: '18px' }}>play_arrow</i>
                  </div>
                </div>
                
                {/* Info Card dengan ruang lega */}
                <div style={{ padding: '14px 16px' }}>
                  <h4 style={{ 
                    margin: '0 0 10px 0', 
                    fontWeight: '700',
                    fontSize: '16px',
                    color: '#1a202c',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden' 
                  }}>
                    {vid.title}
                  </h4>
                  
                  {/* Tanggal & Views */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#718096' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="material-icons" style={{ fontSize: '15px' }}>schedule</i> 
                      {formatDate(vid.created_at)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="material-icons" style={{ fontSize: '15px' }}>visibility</i> 
                      {vid.hitcount || 0}
                    </span>
                  </div>
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
        <div className="text-center" style={{ marginTop: '30px', marginBottom: '40px' }}>
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
          <div style={{ marginTop: '12px', color: '#4a5568', fontSize: '15px', fontWeight: 'bold' }}>
            Halaman {currentPage} dari {totalPages}
          </div>
        </div>
      )}

      {/* ================= IKLAN BODY ================= */}
      {ads.ads_body && (
        <div className="text-center" style={{ marginTop: '30px', marginBottom: '20px' }}>
          <AdDisplay style={{ display: 'inline-block' }} htmlString={ads.ads_body as string} />
        </div>
      )}
    </div>
  );
}
