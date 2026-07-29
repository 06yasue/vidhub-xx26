export const metadata = { title: 'Admin Dashboard' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Bootstrap 3 CDN */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
      </head>
      <body>
        <nav className="navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="/upload">Admin Panel</a>
            </div>
          </div>
        </nav>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
