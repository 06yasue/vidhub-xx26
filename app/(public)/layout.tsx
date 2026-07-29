import '../globals.css';
import { siteConfig } from '@/config'; 
import { Metadata } from 'next';

// ================= AREA SEO SUPER =================
// Menggunakan Metadata API Next.js agar ter-render sempurna di <head>
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

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        <style dangerouslySetInnerHTML={{__html: `
          body { 
            background-color: #f4f7f6; 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* MENCEGAH LAYAR DIGESER KE KANAN/KIRI */
          }
          .main-content { 
            flex: 1; 
            padding-top: 20px;
          }
          
          /* HEADER STYLING */
          .navbar-custom {
            background-color: #ffffff;
            border: none;
            border-bottom: 2px solid #eaeaea;
            border-radius: 0;
            margin-bottom: 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.03);
          }
          .navbar-header-custom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .navbar-brand { 
            display: flex; 
            align-items: center; 
            padding: 15px; 
            height: auto;
          }
          .navbar-brand img { 
            height: 35px; 
            margin-right: 12px; 
            object-fit: contain; 
          }
          .navbar-brand b {
            color: #222;
            font-size: 22px;
            letter-spacing: -0.5px;
          }
          .btn-create-account {
            background-color: #3b82f6;
            color: white;
            font-weight: 600;
            padding: 8px 18px;
            border-radius: 4px;
            border: none;
            margin-right: 15px;
            transition: background-color 0.2s;
          }
          .btn-create-account:hover {
            background-color: #2563eb;
            color: white;
            text-decoration: none;
          }

          /* FOOTER STYLING */
          .footer { 
            background: #111827; 
            color: #9ca3af; 
            padding: 40px 0 20px 0; 
            margin-top: 50px; 
            text-align: center; 
            font-size: 14px; 
          }
          .footer-title {
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .footer-desc {
            max-width: 500px;
            margin: 0 auto 20px auto;
            line-height: 1.6;
          }
          .footer-links {
            margin-bottom: 15px;
          }
          .footer-links a { 
            color: #d1d5db; 
            margin: 0 12px; 
            text-decoration: none; 
            font-weight: 500;
          }
          .footer-links a:hover { 
            color: #ffffff; 
            text-decoration: underline;
          }
          .copyright {
            border-top: 1px solid #374151;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 13px;
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
                Create Account
              </a>
            </div>
          </div>
        </nav>
        
        {/* CONTENT AREA */}
        <div className="container main-content">
          {children}
        </div>

        {/* FOOTER AREA */}
        <footer className="footer">
          <div className="container">
            <div className="footer-title">{siteConfig.site_name}</div>
            <p className="footer-desc">
              Your premium destination for discovering and streaming the best video content online. Fast, secure, and always accessible.
            </p>
            <div className="footer-links">
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">DMCA</a>
              <a href="#">Contact Us</a>
            </div>
            <div className="copyright">
              &copy; {new Date().getFullYear()} {siteConfig.site_name}. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
