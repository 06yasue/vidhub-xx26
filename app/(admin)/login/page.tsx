'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success' | ''; message: string }>({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Access granted. Redirecting...' });
        // Redirect ke halaman dashboard kamu (misalnya halaman /list)
        setTimeout(() => {
          router.push('/list'); 
          router.refresh();
        }, 1000);
      } else {
        setStatus({ type: 'error', message: data.message || 'Authentication failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f4f4f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: '#ffffff', 
        padding: '40px',
        border: '1px solid #e4e4e7',
        borderRadius: '0', /* KUNCI: Tanpa Lengkungan */
        boxShadow: 'none'  /* KUNCI: Tanpa Bayangan */
      }}>
        
        <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', fontWeight: 'bold', color: '#18181b', textAlign: 'center' }}>
          ADMIN PORTAL
        </h2>

        {/* AREA NOTIFIKASI CUSTOM (TANPA ALERT JS) */}
        {status.message && (
          <div style={{
            padding: '12px 15px',
            marginBottom: '20px',
            backgroundColor: status.type === 'error' ? '#fee2e2' : '#dcfce3',
            color: status.type === 'error' ? '#991b1b' : '#166534',
            border: `1px solid ${status.type === 'error' ? '#f87171' : '#86efac'}`,
            borderRadius: '0', /* Tetap Flat */
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#52525b', textTransform: 'uppercase' }}>
              Email Address
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #d4d4d8',
                borderRadius: '0', /* Tetap Flat */
                outline: 'none',
                fontSize: '15px',
                backgroundColor: '#fafafa',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#000000'}
              onBlur={(e) => e.target.style.borderColor = '#d4d4d8'}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#52525b', textTransform: 'uppercase' }}>
              Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #d4d4d8',
                borderRadius: '0', /* Tetap Flat */
                outline: 'none',
                fontSize: '15px',
                backgroundColor: '#fafafa',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#000000'}
              onBlur={(e) => e.target.style.borderColor = '#d4d4d8'}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0', /* Tetap Flat */
              fontSize: '15px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
