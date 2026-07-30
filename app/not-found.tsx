import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        <title>404 - Page Not Found</title>
      </head>
      <body>
        <div className="container text-center" style={{ marginTop: '100px' }}>
          <h1 style={{ fontSize: '80px', fontWeight: 'bold', color: '#d9534f' }}>404</h1>
          <h2>Page Not Found</h2>
          <p className="text-muted">Sorry, the video or page you are looking for does not exist or has been deleted..</p>
          <br />
          <Link href="/" className="btn btn-primary btn-lg">
            Back home
          </Link>
        </div>
      </body>
    </html>
  );
}
