// pages/portal/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PortalLogin() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Sandbox validation: Ready for secure API routing integration
    if (studentId.trim() && password.trim()) {
      // Temporarily routing to local session dashboard safely
      router.push('/portal/dashboard?user=' + encodeURIComponent(studentId));
    } else {
      setError('Please enter valid institutional credentials.');
    }
  };

  return (
    <div style={{ backgroundColor: '#0d1117', color: '#c9d1d9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#161b22', padding: '40px', borderRadius: '8px', border: '1px solid #30363d', width: '100%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <h2 style={{ color: '#58a6ff', textAlign: 'center', marginBottom: '10px' }}>⚖ WillampteyMD Portal</h2>
        <p style={{ color: '#8b949e', textAlign: 'center', fontSize: '14px', marginBottom: '30px' }}>Secure Human Genesis Multi-User Gateway</p>
        
        {error && <div style={{ color: '#f85149', background: 'rgba(248,81,73,0.1)', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', border: '1px solid rgba(248,81,73,0.2)' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#c9d1d9' }}>Student Authorization ID</label>
            <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g., WMD-2026-XYZ" style={{ width: '100%', padding: '10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} required />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#c9d1d9' }}>Secure Access Passcode</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} required />
          </div>
          
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#238636', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>Authenticate Session</button>
        </form>
      </div>
    </div>
  );
}
