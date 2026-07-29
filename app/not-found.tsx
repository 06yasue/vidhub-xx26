import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        <title>404 - Halaman Tidak Ditemukan</title>
      </head>
      <body>
        <div className="container text-center" style={{ marginTop: '100px' }}>
          <h1 style={{ fontSize: '80px', fontWeight: 'bold', color: '#d9534f' }}>404</h1>
          <h2>Halaman Tidak Ditemukan</h2>
          <p className="text-muted">Maaf, video atau halaman yang kamu cari tidak ada atau sudah dihapus.</p>
          <br />
          <Link href="/" className="btn btn-primary btn-lg">
            Kembali ke Beranda
          </Link>
        </div>
      </body>
    </html>
  );
}
