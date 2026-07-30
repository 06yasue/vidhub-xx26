import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Daftar rute admin yang ingin kamu kunci
  const isProtectedAdminRoute = 
    path.startsWith('/list') || 
    path.startsWith('/settings') || 
    path.startsWith('/upload');

  if (isProtectedAdminRoute) {
    // Cek apakah ada cookie sesi admin
    const session = request.cookies.get('admin_session')?.value;
    
    // Jika tidak ada atau salah, tendang kembali ke halaman login
    if (session !== 'authenticated') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Konfigurasi ini memastikan middleware hanya mengecek rute tertentu agar web tetap cepat
export const config = {
  matcher: ['/list/:path*', '/settings/:path*', '/upload/:path*'],
};
