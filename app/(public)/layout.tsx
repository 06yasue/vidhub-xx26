import '../globals.css';
import { siteConfig } from '@/config'; 
import { Metadata } from 'next';
import { turso } from '@/lib/db';
import AdDisplay from '@/components/AdDisplay';

// ================= AREA SEO SUPER =================
export const metadata: Metadata = {
  title: `${siteConfig.site_name} - Watch Exclusive & Premium Videos Online`,
  description: `Discover the best collection of high-quality videos on ${siteConfig.site_name}. Stream your favorite content online for free, anywhere and anytime.`,
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
  openGraph: {
    title: `${siteConfig.site_name} - Watch Exclusive Videos Online`,
    description: `Discover the best collection of high-quality videos on ${siteConfig.site_name}. Stream your favorite content online for free.`,
    url: '/',
    siteName: siteConfig.site_name,
    images: [
      {
        url: '/img.jpg', 
        width: 1200,
        height: 630,
        alt: `${siteConfig.site_name} Thumbnail`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.site_name} - Watch Exclusive Videos Online`,
    description: `Discover the best collection of high-quality videos on ${siteConfig.site_name}.`,
    images: ['/img.jpg'], 
  },
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  
  // ================= AMBIL DATA IKLAN DARI DATABASE =================
  let ads: any = {};
  try {
    const settingsRes = await turso.execute("SELECT * FROM settings");
    settingsRes.rows.forEach((row) => {
      ads[row.key as string] = row.value;
    });
  } catch (error) {
    console.error("Gagal konek ke Turso:", error);
  }

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        {/* IMPORT GOOGLE FONT & ICONS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
        
        <style dangerouslySetInnerHTML={{__html: `
          body { 
            background-color: #f1f5f9; 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
            margin: 0;
            padding: 0;
            overflow-x: hidden; 
            font-family: 'Poppins', sans-serif !important;
            -webkit-font-smoothing: antialiased;
          }
          
          .main-content { 
            flex: 1; 
            padding-top: 20px;
            padding-bottom: 50px;
          }
          
          /* ================= HEADER RAPI & RESPONSIVE ================= */
          .header-wrapper {
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 1000;
            width: 100%;
            padding: 12px 0;
          }
          
          .header-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0 15px;
          }
          
          .brand-area { 
            display: flex; 
            align-items: center; 
            text-decoration: none !important;
            gap: 10px;
          }
          
          .brand-area img { 
            height: 36px; 
            object-fit: contain; 
          }
          
          .brand-area b {
            color: #0f172a;
            font-size: 22px;
            letter-spacing: -0.5px;
            font-weight: 800;
            margin: 0;
            line-height: 1;
          }
          
          /* TOMBOL CREATE ACCOUNT (ANTI-NUMPUK) */
          .btn-create-account {
            background-color: #0ea5e9;
            color: #ffffff !important;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 14px;
            padding: 8px 18px;
            border-radius: 6px;
            border: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            text-decoration: none !important;
            white-space: nowrap; /* Mencegah teks turun ke baris bawah */
            transition: all 0.2s ease;
          }
          
          .btn-create-account:hover {
            background-color: #0284c7;
          }

          /* ================= FOOTER ELEGAN ================= */
          .footer-wrapper { 
            background: #0f172a; 
            color: #94a3b8; 
            padding: 20px 0; 
            margin-top: auto; 
            text-align: center; 
            border-top: 1px solid #1e293b;
          }
          
          .copyright-text {
            font-size: 13px;
            font-weight: 500;
            margin: 0;
          }
          
          /* ================= AREA IKLAN ================= */
          .ads-container {
            margin: 15px auto;
            text-align: center;
            width: 100%;
            display: flex;
            justify-content: center;
          }

          /* ================= FIX MOBILE (LAYAR KECIL) ================= */
          @media (max-width: 576px) {
            .header-inner {
              padding: 0 10px;
            }
            .brand-area img { 
              height: 28px; 
            }
            .brand-area b {
              font-size: 18px;
            }
            .btn-create-account {
              font-size: 12px;
              padding: 6px 12px;
            }
            .btn-create-account .material-icons-round {
              font-size: 16px !important;
            }
          }
        `}} />
      </head>
      <body>
        
        {/* SCRIPT ADS POPUNDER ADSTERRA DARI DATABASE (Aman dari error) */}
        {ads.ads_head && (
          <div dangerouslySetInnerHTML={{ __html: ads.ads_head }} style={{ display: 'none' }} />
        )}

        {/* HEADER AREA */}
        <header className="header-wrapper">
          <div className="container">
            <div className="header-inner">
              <a className="brand-area" href="/">
                <img src="/logo.webp" alt={`${siteConfig.site_name} Logo`} />
                <b>{siteConfig.site_name}</b>
              </a>
              
              <a 
                href={siteConfig.url_ref} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-create-account" 
              >
                <span className="material-icons-round" style={{ fontSize: '18px' }}>person_add</span>
                Create Account
              </a>
            </div>
          </div>
        </header>
        
        {/* SLOT IKLAN VISUAL BAWAH HEADER */}
        {ads.ads_head_global && (
          <div className="container ads-container" style={{ marginTop: '20px', marginBottom: '0' }}>
            <AdDisplay htmlString={ads.ads_head_global as string} />
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="container main-content">
          {children}
        </div>

        {/* FOOTER AREA */}
        <footer className="footer-wrapper">
          <div className="container">
            
            {/* SLOT IKLAN AREA FOOTER */}
            {ads.ads_footer && (
              <div className="ads-container" style={{ marginTop: '0', marginBottom: '15px' }}>
                <AdDisplay htmlString={ads.ads_footer as string} />
              </div>
            )}

            <p className="copyright-text">
              &copy; {new Date().getFullYear()} {siteConfig.site_name}. All rights reserved.
            </p>

          </div>
        </footer>
      </body>
    </html>
  );
}
