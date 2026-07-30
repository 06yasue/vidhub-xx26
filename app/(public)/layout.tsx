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
            padding-top: 30px;
            padding-bottom: 50px;
          }
          
          /* ================= HEADER PREMIUM ================= */
          .navbar-custom {
            background-color: #ffffff;
            border: none;
            border-radius: 0;
            margin-bottom: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          .navbar-header-custom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 75px;
          }
          .navbar-brand { 
            display: flex; 
            align-items: center; 
            padding: 0; 
            height: 100%;
            text-decoration: none !important;
          }
          .navbar-brand img { 
            height: 42px; 
            margin-right: 14px; 
            object-fit: contain; 
          }
          .navbar-brand b {
            color: #0f172a;
            font-size: 24px;
            letter-spacing: -0.3px;
            font-weight: 800;
          }
          
          /* TOMBOL CREATE ACCOUNT */
          .btn-create-account {
            background-color: #0ea5e9;
            color: #ffffff !important;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 14px;
            padding: 10px 24px;
            border-radius: 8px;
            border: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none !important;
          }
          .btn-create-account:hover {
            background-color: #0284c7;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
          }

          /* ================= FOOTER MINIMALIS ================= */
          .footer { 
            background: #0f172a; 
            color: #94a3b8; 
            padding: 25px 0; 
            margin-top: auto; 
            text-align: center; 
            font-family: 'Poppins', sans-serif;
          }
          .copyright {
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.3px;
          }
          
          /* ================= AREA IKLAN ================= */
          .ads-container {
            margin: 20px auto;
            text-align: center;
            width: 100%;
            display: flex;
            justify-content: center;
          }
        `}} />
      </head>
      <body>
        
        {/* SCRIPT ADS POPUNDER ADSTERRA DLL DARI DATABASE */}
        {/* Diletakkan di body dalam format raw HTML agar tag <script> bawaan Adsterra tidak error */}
        {ads.ads_head && (
          <div dangerouslySetInnerHTML={{ __html: ads.ads_head }} style={{ display: 'none' }} />
        )}

        {/* HEADER AREA */}
        <nav className="navbar navbar-default navbar-custom">
          <div className="container">
            <div className="navbar-header-custom">
              <a className="navbar-brand" href="/">
                <img src="/logo.webp" alt={`${siteConfig.site_name} Logo`} />
                <b>{siteConfig.site_name}</b>
              </a>
              
              <a 
                href={siteConfig.url_ref} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-create-account" 
              >
                <span className="material-icons-round" style={{ fontSize: '20px' }}>person_add</span>
                Create Account
              </a>
            </div>
          </div>
        </nav>
        
        {/* SLOT IKLAN VISUAL BAWAH HEADER */}
        {ads.ads_head_global && (
          <div className="container ads-container" style={{ marginTop: '25px', marginBottom: '0' }}>
            <AdDisplay htmlString={ads.ads_head_global as string} />
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="container main-content">
          {children}
        </div>

        {/* FOOTER AREA */}
        <footer className="footer">
          <div className="container">
            
            {/* SLOT IKLAN AREA FOOTER */}
            {ads.ads_footer && (
              <div className="ads-container" style={{ marginTop: '0', marginBottom: '20px' }}>
                <AdDisplay htmlString={ads.ads_footer as string} />
              </div>
            )}

            <div className="copyright">
              &copy; {new Date().getFullYear()} {siteConfig.site_name}. All rights reserved.
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}
