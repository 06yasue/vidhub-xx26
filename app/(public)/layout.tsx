import '../globals.css';
import { siteConfig } from '@/config'; 
import { Metadata } from 'next';
import { turso } from '@/lib/db';
import AdDisplay from '@/components/AdDisplay'; // Pastikan komponen ini tersedia

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

// Ubah menjadi async function agar bisa memanggil database
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
        {/* IMPORT GOOGLE MATERIAL ICONS */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        
        {/* SLOT IKLAN MURNI DI DALAM TAG HEAD (Jika diperlukan dari DB) */}
        {ads.ads_head && (
          <script dangerouslySetInnerHTML={{ __html: ads.ads_head }} />
        )}

        <style dangerouslySetInnerHTML={{__html: `
          body { 
            background-color: #f8fafc; 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* MENCEGAH LAYAR DIGESER KE KANAN/KIRI */
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .main-content { 
            flex: 1; 
            padding-top: 20px;
            padding-bottom: 40px;
          }
          
          /* HEADER STYLING DENGAN DESAIN BARU */
          .navbar-custom {
            background-color: #ffffff;
            border: none;
            border-radius: 0;
            margin-bottom: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          .navbar-header-custom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 70px;
          }
          .navbar-brand { 
            display: flex; 
            align-items: center; 
            padding: 0 15px; 
            height: 100%;
          }
          .navbar-brand img { 
            height: 40px; 
            margin-right: 12px; 
            object-fit: contain; 
          }
          .navbar-brand b {
            color: #0f172a;
            font-size: 24px;
            letter-spacing: -0.5px;
            font-weight: 800;
          }
          
          /* TOMBOL CREATE ACCOUNT DENGAN ICON */
          .btn-create-account {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white !important;
            font-weight: 600;
            font-size: 14px;
            padding: 10px 22px;
            border-radius: 50px;
            border: none;
            margin-right: 15px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
            text-decoration: none !important;
          }
          .btn-create-account:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
            color: white;
          }

          /* FOOTER STYLING MINIMALIS */
          .footer { 
            background: #0f172a; 
            color: #94a3b8; 
            padding: 30px 0; 
            margin-top: auto; 
            text-align: center; 
          }
          .copyright {
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
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
        
        {/* HEADER AREA */}
        <nav className="navbar navbar-default navbar-custom">
          <div className="container">
            <div className="navbar-header navbar-header-custom">
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
                {/* ICON DARI GOOGLE FONTS */}
                <span className="material-icons" style={{ fontSize: '18px' }}>person_add</span>
                Create Account
              </a>
            </div>
          </div>
        </nav>
        
        {/* SLOT IKLAN VISUAL BAWAH HEADER (Membaca ads_head_global) */}
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
        <footer className="footer">
          <div className="container">
            
            {/* SLOT IKLAN AREA FOOTER (Membaca ads_footer) */}
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
