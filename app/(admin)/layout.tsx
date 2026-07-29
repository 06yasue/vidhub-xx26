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
        `}} />
      </head>
      <body>
        <nav className="navbar navbar-default" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="/" target="_blank">
                <span className="material-icons">open_in_new</span> Lihat Web
              </a>
            </div>
            <ul className="nav navbar-nav">
              <li><a href="/list"><span className="material-icons">list</span> Daftar Video</a></li>
              <li><a href="/upload"><span className="material-icons">cloud_upload</span> Upload Baru</a></li>
              <li><a href="/settings"><span className="material-icons">settings</span> Pengaturan</a></li>
            </ul>
          </div>
        </nav>
        <div className="container" style={{ marginTop: '20px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
