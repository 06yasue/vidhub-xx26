'use client';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-default" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
      <div className="container">
        <div className="navbar-header">
          {/* Tombol Hamburger (Hanya muncul di mobile) */}
          <button 
            type="button" 
            className="navbar-toggle" 
            onClick={() => setIsOpen(!isOpen)}
            style={{ display: 'block' }} // Pastikan tampil di ukuran kecil
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          
          <a className="navbar-brand" href="/" target="_blank">
            <span className="material-icons">open_in_new</span> Lihat Web
          </a>
        </div>

        {/* Area Menu - Class 'in' dari Bootstrap 3 digunakan untuk membuka menu */}
        <div className={`collapse navbar-collapse ${isOpen ? 'in' : ''}`}>
          <ul className="nav navbar-nav">
            <li><a href="/list"><span className="material-icons">list</span> Daftar Video</a></li>
            <li><a href="/upload"><span className="material-icons">cloud_upload</span> Upload Baru</a></li>
            <li><a href="/settings"><span className="material-icons">settings</span> Pengaturan</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
