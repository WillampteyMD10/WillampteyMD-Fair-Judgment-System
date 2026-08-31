// pages/portal/ledger-review.js
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LedgerReview() {
  const router = useRouter();
  const { title, author, genesis, timestamp } = router.query;

  return (
    <div style={{ backgroundColor: '#0d1117', color: '#c9d1d9', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#161b22', padding: '40px', borderRadius: '8px', border: '1px solid #238636', boxShadow: '0 0 15px rgba(35,134,54,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>🔒</div>
          <h1 style={{ color: '#3fb950', margin: 0 }}>Asset Stamped Successfully</h1>
          <p style={{ color: '#8b949e', marginTop: '5px' }}>Fair Judgment Ledger Isolation Verified</p>
        </div>

        <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '20px', borderRadius: '6px', marginBottom: '30px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong style={{ color: '#8b949e' }}>Asset Holder:</strong> {author}</p>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong style={{ color: '#8b949e' }}>Title Spec:</strong> {title}</p>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}><strong style={{ color: '#8b949e' }}>Committed Temporal Marker:</strong> {timestamp}</p>
          
          <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>Protected Input String Baseline</label>
          <div style={{ background: '#161b22', padding: '15px', borderRadius: '4px', border: '1px solid #21262d', fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto' }}>
            {genesis}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/portal" style={{ color: '#8b949e', textDecoration: 'none', fontSize: '14px' }}>← Log Out Session</Link>
          <button onClick={() => window.print()} style={{ background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📄 Print Local Copy</button>
        </div>
      </div>
    </div>
  );
}
