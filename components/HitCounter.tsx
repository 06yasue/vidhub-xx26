'use client'
import { useEffect } from 'react';

export default function HitCounter({ videoId }: { videoId: string }) {
  useEffect(() => {
    // Tembak API untuk menambah hitcount saat halaman pertama dimuat
    fetch('/api/hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: videoId })
    });
  }, [videoId]);

  return null; // Komponen berjalan di background (tidak nampak di UI)
}
