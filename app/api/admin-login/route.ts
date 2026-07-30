import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Mengambil data rahasia dari Vercel/ENV
    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (email === validEmail && password === validPassword) {
      // PERBAIKAN: Gunakan await cookies() untuk Next.js versi terbaru
      const cookieStore = await cookies();
      
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 minggu
        path: '/',
      });
      
      return NextResponse.json({ success: true, message: 'Login successful!' });
    }

    return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error occurred.' }, { status: 500 });
  }
}
