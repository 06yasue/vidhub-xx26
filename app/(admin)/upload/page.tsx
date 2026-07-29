'use client'
import { useState } from 'react';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    setResultUrl('');
    setCopied(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      embed_url: formData.get('embed_url'),
      thumbnail_url: formData.get('thumbnail_url')
    };

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const json = await res.json();
      
      if (res.ok) {
        setMessage({ text: 'Video berhasil disimpan!', type: 'success' });
        // Generate URL full (contoh: https://tes.vercel.app/v/abc123)
        setResultUrl(`${window.location.origin}/v/${json.id}`);
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ text: 'Gagal menyimpan: ' + json.error, type: 'danger' });
      }
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan sistem', type: 'danger' });
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
        <h3>Upload Video Baru</h3>
        
        {/* Notifikasi tanpa Alert JS */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="panel panel-default">
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
              <div className="form-group">
                <label>URL Thumbnail</label>
                <input type="url" name="thumbnail_url" className="form-control" required placeholder="https://..." />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Video'}
              </button>
            </form>
          </div>
        </div>

        {/* Kotak Hasil Generate URL & Tombol Copy */}
        {resultUrl && (
          <div className="well">
            <h4>URL Video Anda:</h4>
            <div className="input-group">
              <input type="text" className="form-control" readOnly value={resultUrl} />
              <span className="input-group-btn">
                <button className={`btn btn-${copied ? 'success' : 'default'}`} type="button" onClick={handleCopy}>
                  {copied ? 'Tersalin!' : 'Copy URL'}
                </button>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
