import '../globals.css';
import { siteConfig } from '@/config'; // Pastikan path ini benar mengarah ke config.ts

export const metadata = { title: siteConfig.site_name };

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        <style dangerouslySetInnerHTML={{__html: `
          body { 
            background-color: #f4f7f6; 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
          }
          .main-content { flex: 1; }
          .navbar-brand { display: flex; align-items: center; padding: 10px 15px; }
          .navbar-brand img { height: 30px; margin-right: 10px; object-fit: contain; }
          .footer { 
            background: #222; 
            color: #999; 
            padding: 30px 0; 
            margin-top: 50px; 
            text-align: center; 
            font-size: 14px; 
          }
          .footer a { color: #ccc; margin: 0 10px; text-decoration: none; }
          .footer a:hover { color: #fff; }
        `}} />
      </head>
      <body>
        {/* HEADER AREA */}
        <nav className="navbar navbar-default" style={{ borderRadius: 0, marginBottom: '30px', backgroundColor: '#fff' }}>
          <div className="container">
            <div className="navbar-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <a className="navbar-brand" href="/">
                {/* Pastikan kamu punya file logo.png di dalam folder public */}
                <img src="/logo.webp" alt="Logo" />
                <b style={{ color: '#333' }}>{siteConfig.site_name}</b>
              </a>
              
              {/* TOMBOL CREATE ACCOUNT KANAN MENGGUNAKAN URL REF DARI CONFIG */}
              <a 
                href={siteConfig.url_ref} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary" 
                style={{ margin: '8px 15px 8px 0', fontWeight: 'bold' }}
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
            <p>&copy; {new Date().getFullYear()} {siteConfig.site_name}. All rights reserved.</p>
            <div style={{ marginTop: '10px' }}>
              <a href="#">Terms of Service</a> | 
              <a href="#">Privacy Policy</a> | 
              <a href="#">DMCA</a> |
              <a href="#">Contact Us</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
