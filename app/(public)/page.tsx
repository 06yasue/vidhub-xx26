'use client'
import { useState } from 'react';

export default function UploadPage() {
  // State Manual Upload
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [copied, setCopied] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  // State Bulk Upload (TXT)
  const [txtLoading, setTxtLoading] = useState(false);
  const [txtMessage, setTxtMessage] = useState({ text: '', type: '' });

  const IMGBB_API_KEY = 'f44379100f284593d7a3f7bf708c8a59';

  // ===================== HANDLER MANUAL UPLOAD =====================
  const handleSubmitManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    setResultUrl('');

    const formData = new FormData(e.currentTarget);
    let finalThumbnailUrl = imageUrl;

    try {
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

      if (!finalThumbnailUrl) throw new Error('URL atau file Thumbnail wajib diisi!');

      setMessage({ text: 'Menyimpan data video...', type: 'info' });
      const data = {
        type: 'manual', // Penanda untuk API
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

  // ===================== HANDLER BULK UPLOAD (TXT) =====================
  const handleTxtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTxtMessage({ text: 'Membaca file...', type: 'info' });
    setTxtLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      let isValid = true;
      let errorLine = 0;

      // Validasi ketat format data per baris
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Abaikan baris kosong

        const parts = line.split('|');
        // Harus pas 5 bagian: ID | Title | Link | Thumbnail | Date
        if (parts.length !== 5) {
          isValid = false;
          errorLine = i + 1;
          break;
        }
      }

      if (!isValid) {
        setTxtMessage({ 
          text: `Format salah pada baris ke-${errorLine}! Pastikan formatnya tepat: ID|Title|Website link|Main thumbnail|Publish date, time`, 
          type: 'danger' 
        });
        setTxtLoading(false);
        e.target.value = ''; // Reset input file
        return;
      }

      // Jika valid, kirim ke API
      try {
        setTxtMessage({ text: 'Memproses dan menyimpan data ke database...', type: 'info' });
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'bulk', content: text }),
        });

        const json = await res.json();
        
        if (res.ok) {
          setTxtMessage({ text: json.message, type: 'success' });
          e.target.value = ''; // Reset file input setelah sukses
        } else {
          throw new Error(json.error);
        }
      } catch (error: any) {
        setTxtMessage({ text: error.message || 'Gagal mengunggah file TXT.', type: 'danger' });
      } finally {
        setTxtLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        
        {/* ================= PANEL 1: MANUAL UPLOAD ================= */}
        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ borderRadius: '0' }}>
            {message.text}
          </div>
        )}

        <div className="panel panel-default" style={{ borderRadius: '0', border: '1px solid #e2e8f0' }}>
          <div className="panel-heading" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <h3 className="panel-title" style={{ fontWeight: '600' }}>
              <span className="material-icons" style={{ fontSize: '18px', verticalAlign: 'text-bottom' }}>edit</span> Upload Manual
            </h3>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmitManual}>
              <div className="form-group">
                <label>Judul Video</label>
                <input type="text" name="title" className="form-control" style={{ borderRadius: '0' }} required placeholder="Contoh: Video Kucing" />
              </div>
              
              <div className="form-group">
                <label>URL Embed (Iframe src)</label>
                <input type="url" name="embed_url" className="form-control" style={{ borderRadius: '0' }} required placeholder="https://..." />
              </div>

              <hr />
              <label>Thumbnail Video (Pilih salah satu)</label>
              
              <div className="form-group">
                <label className="text-muted" style={{ fontWeight: 'normal' }}>1. Upload Gambar langsung:</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control" 
                  style={{ borderRadius: '0' }}
                  onChange={(e) => {
                    if(e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                      setImageUrl('');
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
                  style={{ borderRadius: '0' }}
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageFile(null);
                  }} 
                  placeholder="https://..." 
                  disabled={!!imageFile} 
                />
              </div>

              <hr />
              <button type="submit" className="btn btn-primary btn-block" style={{ borderRadius: '0' }} disabled={loading}>
                {loading ? 'Memproses...' : 'Simpan Video'}
              </button>
            </form>
          </div>
        </div>

        {resultUrl && (
          <div className="panel panel-success" style={{ borderRadius: '0' }}>
            <div className="panel-heading">Berhasil! Ini URL Video Anda:</div>
            <div className="panel-body">
              <div className="input-group">
                <input type="text" className="form-control" style={{ borderRadius: '0' }} readOnly value={resultUrl} />
                <span className="input-group-btn">
                  <button className={`btn btn-${copied ? 'success' : 'default'}`} style={{ borderRadius: '0' }} type="button" onClick={handleCopy}>
                    {copied ? 'Tersalin!' : 'Copy URL'}
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= PANEL 2: BULK UPLOAD TXT ================= */}
        <div style={{ marginTop: '40px' }}></div>
        
        {txtMessage.text && (
          <div className={`alert alert-${txtMessage.type}`} style={{ borderRadius: '0' }}>
            {txtMessage.text}
          </div>
        )}

        <div className="panel panel-default" style={{ borderRadius: '0', border: '1px solid #e2e8f0' }}>
          <div className="panel-heading" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <h3 className="panel-title" style={{ fontWeight: '600' }}>
              <span className="material-icons" style={{ fontSize: '18px', verticalAlign: 'text-bottom' }}>file_upload</span> Upload Massal (.txt)
            </h3>
          </div>
          <div className="panel-body">
            <div className="alert alert-warning" style={{ borderRadius: '0', fontSize: '13px' }}>
              <strong>Perhatian!</strong> Format setiap baris dalam file .txt HARUS persis seperti ini:<br/>
              <code>ID|Title|Website link|Main thumbnail|Publish date, time</code><br/>
              <em>Contoh: 1234|Video Lucu|https://web.com/vid|https://gambar.jpg|2026-07-15 23:10:25</em>
            </div>
            
            <div className="form-group">
              <label>Pilih File .txt</label>
              <input 
                type="file" 
                accept=".txt"
                className="form-control" 
                style={{ borderRadius: '0' }}
                onChange={handleTxtUpload} 
                disabled={txtLoading}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
