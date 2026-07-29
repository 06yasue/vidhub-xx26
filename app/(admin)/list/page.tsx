'use client'
import { useState, useEffect } from 'react';

export default function ListPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchVideos = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?page=${p}`);
      const data = await res.json();
      setVideos(data.videos || []);
      setHasNext(data.hasNext || false);
    } catch (err) {
      setMessage('Gagal memuat data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus video "${title}"?`);
    if (!confirmDelete) return;

    setMessage('Menghapus...');
    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Video dihapus.');
        fetchVideos(page); // Reload tabel
      } else {
        setMessage('Gagal menghapus video.');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan sistem.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCopy = (id: string) => {
    const url = `${window.location.origin}/v/${id}`;
    navigator.clipboard.writeText(url);
    setMessage(`URL ${id} tersalin!`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        {message && <div className="alert alert-info">{message}</div>}
        
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title"><span className="material-icons">list</span> Daftar Video Tersimpan</h3>
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th width="80">Thumb</th>
                  <th>Judul Video</th>
                  <th width="80">Views</th>
                  <th width="200">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center">Memuat data...</td></tr>
                ) : videos.length === 0 ? (
                  <tr><td colSpan={4} className="text-center">Tidak ada video ditemukan.</td></tr>
                ) : (
                  videos.map((vid) => (
                    <tr key={vid.id}>
                      <td>
                        <img src={vid.thumbnail_url} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} alt="Thumb" />
                      </td>
                      <td style={{ verticalAlign: 'middle', fontWeight: 'bold' }}>{vid.title}</td>
                      <td style={{ verticalAlign: 'middle' }}>{vid.hitcount || 0}</td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <button className="btn btn-default btn-sm" onClick={() => handleCopy(vid.id)} style={{ marginRight: '5px' }}>
                          <span className="material-icons" style={{ fontSize: '14px' }}>content_copy</span> Copy URL
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(vid.id, vid.title)}>
                          <span className="material-icons" style={{ fontSize: '14px' }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Next / Prev */}
          <div className="panel-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              className="btn btn-default" 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1 || loading}
            >
              &laquo; Prev
            </button>
            <span>Halaman {page}</span>
            <button 
              className="btn btn-default" 
              onClick={() => setPage(p => p + 1)} 
              disabled={!hasNext || loading}
            >
              Next &raquo;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
