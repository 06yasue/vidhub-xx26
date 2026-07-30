import '../globals.css';
// Sesuaikan path import dengan lokasi file Navbar-mu
import Navbar from './Navbar'; 

export const metadata = { title: 'Admin Dashboard' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Bootstrap 3 CDN & Google Material Icons */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          body { background-color: #f5f5f5; }
          .material-icons { vertical-align: middle; margin-right: 5px; font-size: 20px; }
          .panel { border-radius: 4px; border: 1px solid #ddd; box-shadow: none; }
          
          /* Tambahan CSS kecil memastikan tombol rapi di mode mobile */
          @media (min-width: 768px) {
            .navbar-toggle { display: none !important; }
          }
        `}} />
      </head>
      <body>
        
        {/* Navbar dipanggil di sini */}
        <Navbar />

        <div className="container" style={{ marginTop: '20px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
