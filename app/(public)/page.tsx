import { turso } from '@/lib/db';
import Link from 'next/link';
// Pastikan Anda sudah membuat komponen AdDisplay seperti instruksi sebelumnya
import AdDisplay from '@/components/AdDisplay'; 

// Helper format tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return 'Baru';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams?.page || '1');
  const limit = 12; 
  const offset = (currentPage - 1) * limit;

  // 1. Ambil Video
  const videosRes = await turso.execute({
    sql: "SELECT * FROM videos ORDER BY created_at DESC LIMIT ? OFFSET ?",
    args: [limit, offset]
  });
  const videos = videosRes.rows;

  const countRes = await turso.execute("SELECT COUNT(*) as total FROM videos");
  const totalVideos = Number(countRes.rows[0].total);
  const totalPages = Math.ceil(totalVideos / limit) || 1;

  // 2. PERBAIKAN FATAL: Ambil Pengaturan Iklan dengan format Key-Value
  let ads: any = {};
  try {
    const settingsRes = await turso.execute("SELECT * FROM settings");
    // Looping semua baris, lalu masukkan ke dalam object ads
    settingsRes.rows.forEach((row) => {
      ads[row.key as string] = row.value;
    });
  } catch (error) {
    console.error("Gagal mengambil data settings:", error);
  }

  return (
    <div>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      {/* ================= AREA IKLAN ================= */}
      {/* Sekarang ads.ads_desktop dan ads.ads_mobile pasti terbaca karena logic di atas sudah benar */}
      {ads.ads_desktop && (
        <AdDisplay className="hidden-xs text-center" style={{ marginBottom: '25px' }} htmlString={ads.ads_desktop as string} />
      )}
      
      {ads.ads_mobile && (
        <AdDisplay className="visible-xs-block text-center" style={{ marginBottom: '25px' }} htmlString={ads.ads_mobile as string} />
      )}

      {/* ================= AREA CARD VIDEO ================= */}
      <div className="row">
        {videos.map((vid: any) => (
          <div className="col-md-3 col-sm-4 col-xs-6" key={vid.id} style={{ marginBottom: '20px' }}>
            <Link href={`/v/${vid.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s'
              }}>
                {/* Thumbnail Edge-to-Edge */}
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
                  <img 
                    src={vid.thumbnail_url} 
                    alt={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {/* Ikon Play di sudut kanan bawah thumbnail */}
                  <div style={{ position: 'absolute', bottom: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '2px 5px', color: '#fff', display: 'flex', alignItems: 'center' }}>
                    <i className="material-icons" style={{ fontSize: '16px' }}>play_arrow</i>
                  </div>
                </div>
                
                {/* Info Card (Padding dirapikan agar teks tidak terlalu mepet atau longgar) */}
                <div style={{ padding: '10px 12px' }}>
                  <h5 style={{ 
                    margin: '0 0 10px 0', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#222',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden' 
                  }}>
                    {vid.title}
                  </h5>
                  
                  {/* Ikon dan Teks disejajarkan dengan flexbox & gap agar tidak nempel */}
                  <div className="text-muted" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
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
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ================= AREA PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="text-center" style={{ marginTop: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
            {currentPage > 1 ? (
              <Link href={`/?page=${currentPage - 1}`} className="btn btn-default" style={{ fontWeight: 'bold' }}>&laquo; Prev</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: 'bold' }}>&laquo; Prev</button>
            )}
            
            {currentPage < totalPages ? (
              <Link href={`/?page=${currentPage + 1}`} className="btn btn-default" style={{ fontWeight: 'bold' }}>Next &raquo;</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: 'bold' }}>Next &raquo;</button>
            )}
          </div>
          <div style={{ marginTop: '10px', color: '#777', fontSize: '14px', fontWeight: 'bold' }}>
            {currentPage} / {totalPages}
          </div>
        </div>
      )}

      {/* ================= IKLAN BODY ================= */}
      {ads.ads_body && (
        <AdDisplay className="text-center" style={{ marginTop: '20px', marginBottom: '10px' }} htmlString={ads.ads_body as string} />
      )}
    </div>
  );
}
