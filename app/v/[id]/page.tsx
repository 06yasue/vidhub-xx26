import { notFound } from 'next/navigation';
import { turso } from '@/lib/db';
import HitCounter from '@/components/HitCounter';
import AdDisplay from '@/components/AdDisplay';
import { siteConfig } from '@/config';
import { Metadata } from 'next';

export const revalidate = 60; 

// ================= AREA SEO DINAMIS =================
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id: rawId } = await params;
  const actualId = rawId.split('_')[0];
  
  let video = null;
  try {
    const res = await turso.execute({
      sql: "SELECT title, thumbnail_url FROM videos WHERE id = ?",
      args: [actualId]
    });
    video = res.rows[0];
  } catch (error) {
    console.error("Gagal get meta:", error);
  }

  if (!video) return {};

  return {
    title: `${video.title} - ${siteConfig.site_name}`,
    description: `Watch and download ${video.title} full HD video for free on ${siteConfig.site_name}.`,
    openGraph: {
      title: video.title as string,
      description: `Streaming ${video.title} in HD quality.`,
      images: [{ url: video.thumbnail_url as string }],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title as string,
      images: [video.thumbnail_url as string],
    }
  };
}

// ================= KOMPONEN UTAMA =================
export default async function VideoPlayer({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id: rawId } = await params;
  const actualId = rawId.split('_')[0];

  let video: any = null;
  let ads: any = {};
  
  try {
    const videoRes = await turso.execute({
      sql: "SELECT * FROM videos WHERE id = ?",
      args: [actualId] 
    });
    video = videoRes.rows[0];

    const settingsRes = await turso.execute("SELECT * FROM settings");
    settingsRes.rows.forEach((row) => {
      ads[row.key as string] = row.value;
    });

  } catch (error) {
    console.error("Gagal konek ke Turso:", error);
  }

  if (!video) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'New';
    const date = new Date(dateString);
    // Mengubah ke format penanggalan English
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const targetOfferUrl = ads.ads_offer_link || '#';

  return (
    // Wadah master dengan minHeight 100vh agar footer otomatis ke bawah
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HitCounter videoId={actualId} />

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        * { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }
        body { background-color: #0f172a !important; margin: 0; padding: 0; color: #f8fafc; -webkit-font-smoothing: antialiased; }
        
        /* Flexbox pada main-wrapper untuk mendorong footer ke bawah */
        .main-wrapper { width: 100%; padding: 0; margin: 0 auto; display: flex; flex-direction: column; flex-grow: 1; }
        .player-panel { background-color: #1e293b; border: none; border-radius: 0; margin-bottom: 0; box-shadow: none !important; -webkit-box-shadow: none !important; }
        
        /* Modifikasi Header (Diperbesar) */
        .player-header { background-color: #0f172a; border-bottom: 1px solid #334155; padding: 16px 20px; }
        .header-top { display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .brand-logo { display: inline-flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 800; letter-spacing: 1.2px; color: #38bdf8; text-transform: uppercase; }
        .btn-register { background-color: #38bdf8; color: #0f172a !important; font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 4px; text-decoration: none !important; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; }
        .btn-register .material-icons { font-size: 18px; }
        .btn-register:hover { background-color: #7dd3fc; color: #0f172a !important; }
        .header-divider { height: 1px; background-color: #334155; margin: 12px 0; width: 100%; }
        
        .video-title { font-size: 13px; font-weight: 600; color: #ffffff; margin: 0; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; display: block; }
        .player-body-wrapper { padding: 0; position: relative; background-color: #000000; }
        .video-container { position: relative; width: 100%; padding-top: 56.25%; background-size: cover; background-position: center; cursor: pointer; overflow: hidden; }
        .badge-hd { position: absolute; top: 12px; right: 12px; background: #ef4444; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 3px; z-index: 2; letter-spacing: 0.5px; }
        .video-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.45); display: flex; justify-content: center; align-items: center; transition: background 0.2s ease; z-index: 3; }
        .video-container:hover .video-overlay { background: rgba(15, 23, 42, 0.65); }
        .yt-play-btn { width: 68px; height: 46px; background-color: #000000; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); display: flex; justify-content: center; align-items: center; cursor: pointer; transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease; }
        .video-container:hover .yt-play-btn { background-color: #020617; transform: scale(1.08); border-color: #38bdf8; }
        .loading-state { display: none; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; }
        .spinner-custom { border: 3px solid rgba(255, 255, 255, 0.2); border-top: 3px solid #38bdf8; border-radius: 50%; width: 38px; height: 38px; animation: spin 0.8s linear infinite; margin-bottom: 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-text { font-size: 12px; font-weight: 600; letter-spacing: 0.5px; color: #f8fafc; }
        .video-progress-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: rgba(255, 255, 255, 0.2); z-index: 4; }
        .progress-fill { height: 100%; width: 0%; background-color: #38bdf8; transition: width 0.15s ease; }
        .player-footer { background-color: #1e293b; padding: 16px; border-top: 1px solid #334155; }
        .video-meta-info { display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 500; color: #94a3b8; margin-bottom: 14px; }
        .meta-left { display: flex; align-items: center; gap: 6px; }
        .meta-item { display: inline-flex; align-items: center; gap: 4px; }
        .meta-dot { color: #475569; }
        .download-box-wrapper { background-color: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 12px; margin-bottom: 16px; }
        .download-info-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-size: 11px; color: #94a3b8; }
        .download-speed-badge { color: #22c55e; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .btn-download { display: flex !important; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 12px 16px; font-size: 14px; font-weight: 700; border-radius: 6px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border: none; color: #ffffff; box-shadow: none !important; -webkit-box-shadow: none !important; transition: all 0.2s ease; text-decoration: none !important; }
        .btn-download:hover { background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); color: #ffffff; transform: translateY(-1px); }
        .ads-native-container { width: 100%; text-align: center; margin-top: 10px; }
        .ads-label { display: block; font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .ads-slot { display: flex; justify-content: center; align-items: center; width: 100%; margin: 0 auto; min-height: 250px; }
        
        /* Margin-top Auto mendorong Copyright (footer) agar menempel ke dasar layar */
        .copyright-area { text-align: center; padding: 24px 16px 80px 16px; font-size: 12px; color: #64748b; font-weight: 500; background-color: #0f172a; margin-top: auto; }
        
        .floating-telegram { position: fixed; bottom: 20px; right: 20px; background-color: #0284c7; color: #ffffff; padding: 10px 18px; border-radius: 50px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; text-decoration: none !important; z-index: 9999; transition: all 0.2s ease; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5); }
        .floating-telegram:hover { background-color: #0369a1; color: #ffffff; transform: translateY(-2px); }
        
        @media (max-width: 767px) { .main-wrapper { width: 100%; padding: 0; } .player-panel { border-left: none; border-right: none; border-radius: 0; } .ads-slot { width: 100%; max-width: 300px; min-height: 250px; } }
        @media (min-width: 768px) { .main-wrapper { max-width: 720px; margin: 40px auto; padding: 0 15px; } .player-panel { border: 1px solid #334155; border-radius: 8px; overflow: hidden; } .player-header { padding: 20px 24px; } .brand-logo { font-size: 18px; gap: 12px; } .btn-register { font-size: 14px; padding: 10px 18px; } .video-title { font-size: 15px; } .yt-play-btn { width: 74px; height: 50px; border-radius: 14px; } .player-footer { padding: 20px; } .btn-download { padding: 14px 20px; font-size: 15px; } .ads-slot { width: 100%; min-height: 90px; } .copyright-area { padding: 24px 16px 40px 16px; margin-top: 40px; border-radius: 8px; } }
      `}} />

      {/* ================= SLOT IKLAN ATAS ================= */}
      {ads.ads_head_global && (
        <div className="text-center" style={{ margin: '15px auto' }}>
          <AdDisplay htmlString={ads.ads_head as string} />
        </div>
      )}

      <div className="main-wrapper">
          <div className="panel panel-default player-panel">
              
              <div className="panel-heading player-header">
                  <div className="header-top">
                      <div className="brand-logo notranslate">
                          {/* Ukuran img logo dibesarkan jadi 26x26 */}
                          <img src="/logo.webp" alt="Logo" width="26" height="26" />
                          <span>{siteConfig.site_name}</span>
                      </div>
                      <a href={siteConfig.url_ref} target="_blank" rel="noopener noreferrer" className="btn-register">
                          <span className="material-icons">person_add</span> Create Account
                      </a>
                  </div>
                  <div className="header-divider"></div>
                  <h1 className="video-title" title={video.title}>{video.title}</h1>
              </div>

              <div className="panel-body player-body-wrapper">
                  <div 
                    className="video-container" 
                    id="videoContainer"
                    style={{ backgroundImage: `url('${video.thumbnail_url}')` }}
                  >
                      <div className="badge-hd">HD 1080p</div>
                      <div className="video-overlay">
                          <button className="yt-play-btn" id="playBtn" type="button">
                              <svg className="notranslate" width="28" height="28" viewBox="0 0 24 24" fill="#ffffff"><path d="M8 5v14l11-7z"/></svg>
                          </button>
                          <div className="loading-state" id="loadingState">
                              <div className="spinner-custom"></div>
                              <div className="loading-text">Loading... <span id="loadPercent">0%</span></div>
                          </div>
                      </div>
                      <div className="video-progress-bar">
                          <div className="progress-fill" id="progressFill"></div>
                      </div>
                  </div>
              </div>

              <div className="player-footer">
                  <div className="video-meta-info">
                      <div className="meta-left">
                          <span className="meta-item notranslate">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                              <span>{formatDate(video.created_at)}</span>
                          </span>
                          <span className="meta-dot">•</span>
                          <span className="meta-item notranslate">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                              {/* View dalam format English/International (en-US) */}
                              <span>{(video.hitcount || 0).toLocaleString('en-US')} views</span>
                          </span>
                      </div>
                  </div>

                  <div className="download-box-wrapper">
                      <div className="download-info-row">
                          <span>Format: MP4 (Full HD)</span>
                          <span className="download-speed-badge">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                              Fast Server
                          </span>
                      </div>
                      <a href={targetOfferUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-download" id="downloadBtn">
                          <svg className="notranslate" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                          <span>Download Full Video</span>
                      </a>
                  </div>

                  {/* ================= SLOT IKLAN BODY ================= */}
                  <div className="ads-native-container">
                      <span className="ads-label">Advertisement</span>
                      <div className="ads-slot" id="adsSlot">
                          {ads.ads_body ? (
                              <AdDisplay htmlString={ads.ads_body as string} />
                          ) : (
                              <span className="ads-placeholder-text">Body Ad Area</span>
                          )}
                      </div>
                  </div>
              </div>
          </div>
          
          <div className="copyright-area">
              &copy; {new Date().getFullYear()} {siteConfig.site_name}. All rights reserved.
              
              {/* ================= SLOT IKLAN BAWAH (FOOTER) ================= */}
              {ads.ads_footer && (
                <div className="text-center" style={{ marginTop: '20px' }}>
                  <AdDisplay htmlString={ads.ads_footer as string} />
                </div>
              )}
          </div>
      </div>

      {/* ================= TOMBOL TELEGRAM ================= */}
      <a href="https://t.me/+J2iIovJc-CdkZTk1" className="floating-telegram" target="_blank" rel="noopener noreferrer">
          <svg className="notranslate" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          <span>Join Telegram Group</span>
      </a>

      {/* ================= SCRIPT INTERAKTIF ================= */}
      <script dangerouslySetInnerHTML={{ __html: `
          var embedUrl = "${video.embed_url}";
          var videoContainer = document.getElementById("videoContainer");
          var playBtn = document.getElementById("playBtn");
          var loadingState = document.getElementById("loadingState");
          var progressFill = document.getElementById("progressFill");
          var loadPercent = document.getElementById("loadPercent");
          var isClicked = false;

          if (videoContainer) {
              videoContainer.addEventListener("click", function() {
                  if (isClicked) return;
                  isClicked = true;

                  playBtn.style.display = "none";
                  loadingState.style.display = "flex";

                  var progress = 0;
                  var interval = setInterval(function() {
                      progress += Math.floor(Math.random() * 12) + 8;
                      if (progress >= 100) {
                          progress = 100;
                          clearInterval(interval);
                          setTimeout(function() {
                              window.location.href = embedUrl;
                          }, 300);
                      }
                      progressFill.style.width = progress + "%";
                      loadPercent.textContent = progress + "%";
                  }, 150);
              });
          }
      `}} />
    </div>
  );
}
