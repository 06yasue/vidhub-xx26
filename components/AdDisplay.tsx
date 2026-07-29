'use client'; // Wajib ada agar script bisa dieksekusi di browser

import { useEffect, useRef } from 'react';

export default function AdDisplay({ htmlString, className = "", style = {} }: { htmlString: string, className?: string, style?: any }) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && htmlString) {
      // Bersihkan div
      adRef.current.innerHTML = '';
      // Eksekusi script HTML dari database
      const fragment = document.createRange().createContextualFragment(htmlString);
      adRef.current.appendChild(fragment);
    }
  }, [htmlString]);

  return <div className={className} style={style} ref={adRef} />;
}
