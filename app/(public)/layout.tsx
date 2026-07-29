export const metadata = { title: 'Video Portal' };
import '../globals.css';
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Bootstrap 3 CDN */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
      </head>
      <body>
        <nav className="navbar navbar-inverse">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">My Video Portal</a>
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
