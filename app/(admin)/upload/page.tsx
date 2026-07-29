'use client'
import { useState } from 'react';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [copied, setCopied] = useState(false);
  
  // State untuk gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const IMGBB_API_KEY = 'f44379100f284593d7a3f7bf708c8a59';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    setResultUrl('');

    const formData = new FormData(e.currentTarget);
    let finalThumbnailUrl = imageUrl;

    try {
      // 1. Jika user memilih file gambar, upload ke ImgBB dulu
      if (imageFile) {
        setMessage({ text: 'Mengunggah gambar ke ImgBB...', type: 'info' });
        const imgData = new FormData();
        imgData.append('image', imageFile);
        
        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: imgData
        });
        const imgJson = await imgRes.json();
        
        if (imgJson.success) {
          finalThumbnailUrl = imgJson.data.url;
        } else {
          throw new Error('Gagal upload gambar ke ImgBB');
        }
      }

      // Pastikan ada URL gambar (dari manual input atau ImgBB)
      if (!finalThumbnailUrl) throw new Error('URL atau file Thumbnail wajib diisi!');

      // 2. Simpan data video ke database Turso
      setMessage({ text: 'Menyimpan data video...', type: 'info' });
      const data = {
        title: formData.get('title'),
        embed_url: formData.get('embed_url'),
        thumbnail_url: finalThumbnailUrl
      };

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const json = await res.json();
      
      if (res.ok) {
        setMessage({ text: 'Video berhasil disimpan!', type: 'success' });
        setResultUrl(`${window.location.origin}/v/${json.id}`);
        (e.target as HTMLFormElement).reset();
        setImageFile(null);
        setImageUrl('');
      } else {
        throw new Error(json.error);
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Terjadi kesalahan sistem', type: 'danger' });
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title"><span className="material-icons">cloud_upload</span> Upload Video Baru</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Judul Video</label>
                <input type="text" name="title" className="form-control" required placeholder="Contoh: Video Lucu" />
              </div>
              
              <div className="form-group">
                <label>URL Embed (Iframe src)</label>
                <input type="url" name="embed_url" className="form-control" required placeholder="https://..." />
              </div>

              <hr />
              <label>Thumbnail Video (Pilih salah satu)</label>
              
              <div className="form-group">
                <label className="text-muted" style={{ fontWeight: 'normal' }}>1. Upload Gambar langsung:</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control" 
                  onChange={(e) => {
                    if(e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                      setImageUrl(''); // Reset manual URL jika upload file
                    }
                  }} 
                />
              </div>

              <p className="text-center"><b>ATAU</b></p>

              <div className="form-group">
                <label className="text-muted" style={{ fontWeight: 'normal' }}>2. Masukkan URL Gambar Manual:</label>
                <input 
                  type="url" 
                  className="form-control" 
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageFile(null); // Reset file jika input URL
                  }} 
                  placeholder="https://..." 
                  disabled={!!imageFile} // Nonaktifkan jika sudah milih file
                />
              </div>

              <hr />
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Memproses...' : 'Simpan Video'}
              </button>
            </form>
          </div>
        </div>

        {resultUrl && (
          <div className="panel panel-success">
            <div className="panel-heading">Berhasil! Ini URL Video Anda:</div>
            <div className="panel-body">
              <div className="input-group">
                <input type="text" className="form-control" readOnly value={resultUrl} />
                <span className="input-group-btn">
                  <button className={`btn btn-${copied ? 'success' : 'default'}`} type="button" onClick={handleCopy}>
                    {copied ? 'Tersalin!' : 'Copy URL'}
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
