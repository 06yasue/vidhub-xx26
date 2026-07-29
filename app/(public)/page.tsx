import { turso } from '@/lib/db';
import Link from 'next/link';

// Helper untuk format tanggal menjadi seperti "30 Jul 2026"
const formatDate = (dateString: string) => {
  if (!dateString) return 'Baru saja';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  // Setup Pagination
  const currentPage = parseInt(searchParams?.page || '1');
  const limit = 19; // Menampilkan 12 video per halaman (rapi untuk grid)
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

  // 3. Ambil Pengaturan Iklan (PERBAIKAN DI SINI: menggunakan LIMIT 1)
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
      {/* ================= AREA IKLAN ATAS RESPONSIVE ================= */}
      {/* Iklan ini HANYA tampil di Desktop (Disembunyikan di ukuran XS/Ponsel) */}
      {ads.ads_desktop && (
        <div className="hidden-xs text-center" style={{ marginBottom: '25px' }} dangerouslySetInnerHTML={{ __html: ads.ads_desktop as string }} />
      )}
      
      {/* Iklan ini HANYA tampil di Mobile/Ponsel (Disembunyikan di Desktop) */}
      {ads.ads_mobile && (
        <div className="visible-xs-block text-center" style={{ marginBottom: '25px' }} dangerouslySetInnerHTML={{ __html: ads.ads_mobile as string }} />
      )}


      {/* ================= AREA CARD VIDEO ================= */}
      <div className="row">
        {videos.map((vid: any) => (
          <div className="col-md-3 col-sm-4 col-xs-6" key={vid.id} style={{ marginBottom: '25px' }}>
            <Link href={`/v/${vid.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="thumbnail" style={{ 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)', 
                overflow: 'hidden',
                transition: 'transform 0.2s',
                backgroundColor: '#fff'
              }}>
                {/* Thumbnail Ratio 16:9 */}
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
                  <img 
                    src={vid.thumbnail_url} 
                    alt={vid.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                
                {/* Info Card */}
                <div className="caption" style={{ padding: '12px' }}>
                  {/* Judul: Jika kepanjangan otomatis terpotong jadi ... */}
                  <h5 style={{ 
                    margin: '0 0 8px 0', 
                    fontWeight: '600',
                    fontSize: '15px',
                    color: '#222',
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {vid.title}
                  </h5>
                  
                  {/* Area Create Date & Views */}
                  <div className="text-muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span><i className="material-icons" style={{ fontSize: '12px', verticalAlign: 'text-bottom' }}>schedule</i> {formatDate(vid.created_at)}</span>
                    <span><i className="material-icons" style={{ fontSize: '12px', verticalAlign: 'text-bottom' }}>visibility</i> {vid.hitcount || 0}</span>
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
            {/* Tombol Prev */}
            {currentPage > 1 ? (
              <Link href={`/?page=${currentPage - 1}`} className="btn btn-default" style={{ fontWeight: 'bold' }}>&laquo; Prev</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: 'bold' }}>&laquo; Prev</button>
            )}
            
            {/* Tombol Next */}
            {currentPage < totalPages ? (
              <Link href={`/?page=${currentPage + 1}`} className="btn btn-default" style={{ fontWeight: 'bold' }}>Next &raquo;</Link>
            ) : (
              <button className="btn btn-default" disabled style={{ fontWeight: 'bold' }}>Next &raquo;</button>
            )}
          </div>
          
          {/* Angka Halaman */}
          <div style={{ marginTop: '10px', color: '#777', fontSize: '15px', fontWeight: 'bold' }}>
            {currentPage} / {totalPages}
          </div>
        </div>
      )}


      {/* ================= AREA IKLAN BODY KESELURUHAN ================= */}
      {ads.ads_body && (
        <div className="text-center" style={{ marginTop: '40px', marginBottom: '10px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }} dangerouslySetInnerHTML={{ __html: ads.ads_body as string }} />
      )}

    </div>
  );
}
