// pages/portal/dashboard.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PortalDashboard() {
  const router = useRouter();
  const { user } = router.query;
  const [projectTitle, setProjectTitle] = useState('');
  const [genesisSpark, setGenesisSpark] = useState('');

  const handleSubmitToLedger = (e) => {
    e.preventDefault();
    // Prepare payload structure mapping directly to the "Creator Defense Intake" fields
    const payload = {
      author: user || 'Anonymous Student',
      title: projectTitle,
      genesis: genesisSpark,
      timestamp: new Date().toISOString()
    };
    
    // Smooth, safe transition to the receipt ledger state
    router.push({
      pathname: '/portal/ledger-review',
      query: payload
    });
  };

  return (
    <div style={{ backgroundColor: '#0d1117', color: '#c9d1d9', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#161b22', padding: '30px', borderRadius: '8px', border: '1px solid #30363d' }}>
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid #30363d', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#58a6ff', margin: 0 }}>🛡️ Intake Workspace</h1>
            <p style={{ color: '#8b949e', margin: '5px 0 0 0' }}>Authenticated Operator: <strong>{user || 'Secured Session'}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmitToLedger}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Project / Intellectual Asset Title</label>
            <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Enter the definitive name of your creation" style={{ width: '100%', padding: '12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>1. Human Genesis (The Original Spark/Outline)</label>
            <textarea value={genesisSpark} onChange={(e) => setGenesisSpark(e.target.value)} rows="8" placeholder="Establish your human idea baseline explicitly here before secondary processing..." style={{ width: '100%', padding: '12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', boxSizing: 'border-box', fontFamily: 'monospace', resize: 'vertical' }} required></textarea>
          </div>

          <div style={{ background: 'rgba(56,139,253,0.1)', border: '1px solid rgba(56,139,253,0.2)', padding: '15px', borderRadius: '6px', marginBottom: '30px', fontSize: '14px', color: '#58a6ff' }}>
            ℹ️ Submitting this form anchors your intent. The transaction will automatically populate the isolated worker layer queue.
          </div>

          <button type="submit" style={{ background: '#1f6feb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Commit & Certify Intent Layer</button>
        </form>
      </div>
    </div>
  );
}
