import { turso } from '@/lib/db';
import Link from 'next/link';
// IMPORT KOMPONEN IKLAN (Sesuaikan path-nya jika beda folder)
import AdDisplay from '@/components/AdDisplay'; 

// Helper untuk format tanggal menjadi seperti "30 Jul 2026"
const formatDate = (dateString: string) => {
  if (!dateString) return 'Baru saja';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  // Setup Pagination
  const currentPage = parseInt(searchParams?.page || '1');
  const limit = 12; // Menampilkan 12 video per halaman
  const offset = (currentPage - 1) * limit;

  // 1. Ambil Video dari Database
  const videosRes = await turso.execute({
    sql: "SELECT * FROM videos ORDER BY created_at DESC LIMIT ? OFFSET ?",
    args: [limit, offset]
  });
  const videos = videosRes.rows;

  // 2. Hitung Total Halaman untuk Paginasi
  const countRes = await turso.execute("SELECT COUNT(*) as total FROM videos");
  const totalVideos = Number(countRes.rows[0].total);
  const totalPages = Math.ceil(totalVideos / limit) || 1;

  // 3. Ambil Pengaturan Iklan
  let ads: any = {};
  try {
    const settingsRes = await turso.execute("SELECT * FROM settings LIMIT 1");
    if (settingsRes.rows.length > 0) {
      ads = settingsRes.rows[0];
    }
  } catch (error) {
    console.error("Gagal mengambil data settings:", error);
  }

  return (
    <div>
      {/* Jangan lupa pasang Material Icons di <head> layout utama Anda (layout.tsx) */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      {/* ================= AREA IKLAN ATAS RESPONSIVE ================= */}
      {/* Pake AdDisplay agar script Adsterra dari DB tereksekusi */}
      {ads.ads_desktop && (
        <AdDisplay 
          className="hidden-xs text-center" 
          style={{ marginBottom: '25px' }} 
          htmlString={ads.ads_desktop as string} 
        />
      )}
      
      {ads.ads_mobile && (
        <AdDisplay 
          className="visible-xs-block text-center" 
          style={{ marginBottom: '25px' }} 
          htmlString={ads.ads_mobile as string} 
        />
      )}

      {/* ================= AREA CARD VIDEO ================= */}
      <div className="row">
        {videos.map((vid: any) => (
          /* col-md-3 = 4 kolom Desktop | col-xs-6 = 2 kolom HP */
          <div className="col-md-3 col-sm-4 col-xs-6" key={vid.id} style={{ marginBottom: '25px' }}>
            <Link href={`/v/${vid.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="thumbnail" style={{ 
                border: '1px solid #eaeaea', 
                borderRadius: '10px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: '#fff',
                padding: '0' // Hilangkan padding bawaan bootstrap thumbnail
              }}>
                {/* Thumbnail Ratio 16:9 */}
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#111' }}>
                  <img 
                    src={vid.thumbnail_url} 
                    alt={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {/* Ikon Play overlay (Opsional, biar kayak web video beneran) */}
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '2px 6px', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <i className="material-icons" style={{ fontSize: '14px' }}>play_arrow</i>
                  </div>
                </div>
                
                {/* Info Card */}
                <div className="caption" style={{ padding: '12px 14px' }}>
                  {/* Judul */}
                  <h5 style={{ 
                    margin: '0 0 8px 0', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    color: '#222',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // Potong jadi 2 baris kalau kepanjangan
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', 
                  }}>
                    {vid.title}
                  </h5>
                  
                  {/* Area Create Date & Views dengan Ikon Font */}
                  <div className="text-muted" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
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

        {videos.length === 0 && (
           <div className="col-12 text-center text-muted" style={{ padding: '50px 0' }}>
             Belum ada video yang diunggah.
           </div>
        )}
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
            Halaman {currentPage} dari {totalPages}
          </div>
        </div>
      )}

      {/* ================= AREA IKLAN BODY KESELURUHAN ================= */}
      {ads.ads_body && (
        <AdDisplay 
          className="text-center" 
          style={{ marginTop: '40px', marginBottom: '10px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }} 
          htmlString={ads.ads_body as string} 
        />
      )}
    </div>
  );
}
