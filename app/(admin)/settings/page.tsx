'use client'
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [ads, setAds] = useState({
    ads_head: '',
    ads_body: '',
    ads_mobile: '',
    ads_desktop: '',
    ads_footer: '',
    ads_offer_link: ''
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setAds({
          ads_head: data.ads_head || '',
          ads_body: data.ads_body || '',
          ads_mobile: data.ads_mobile || '',
          ads_desktop: data.ads_desktop || '',
          ads_footer: data.ads_footer || '',
          ads_offer_link: data.ads_offer_link || ''
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setAds({ ...ads, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ads)
      });

      if (res.ok) {
        setMessage({ text: 'Pengaturan slot iklan berhasil disimpan!', type: 'success' });
      } else {
        setMessage({ text: 'Gagal menyimpan pengaturan.', type: 'danger' });
      }
    } catch {
      setMessage({ text: 'Terjadi kesalahan sistem.', type: 'danger' });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center" style={{ marginTop: '50px' }}>Loading data...</div>;
  }


  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title"><span className="material-icons">public</span> Iklan Global (Head & Footer)</h3>
            </div>
            <div className="panel-body">
              <div className="form-group">
                <label>Iklan Area Head (Script Adsterra / Monetag)</label>
                <textarea name="ads_head" className="form-control" rows={3} value={ads.ads_head} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Iklan Area Footer</label>
                <textarea name="ads_footer" className="form-control" rows={3} value={ads.ads_footer} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title"><span className="material-icons">smart_display</span> Iklan Area Video Player</h3>
            </div>
            <div className="panel-body">
              <div className="form-group">
                <label>Iklan Area Body (Bawah Video Player)</label>
                <textarea name="ads_body" className="form-control" rows={3} value={ads.ads_body} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Iklan Khusus Ponsel / Mobile</label>
                <textarea name="ads_mobile" className="form-control" rows={3} value={ads.ads_mobile} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Iklan Khusus Desktop</label>
                <textarea name="ads_desktop" className="form-control" rows={3} value={ads.ads_desktop} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Offer Link / Direct Link Iklan</label>
                <input type="url" name="ads_offer_link" className="form-control" value={ads.ads_offer_link} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            <span className="material-icons">save</span> {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </form>
        <br />
      </div>
    </div>
  );
}
