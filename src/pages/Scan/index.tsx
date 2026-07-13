import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { apiUrl } from '../../config/api';

type CheckinResult = {
  success: boolean;
  member?: {
    id: number;
    nom: string;
    phone: string | null;
    actif: boolean;
    statut_abonnement: string;
    expiration: string | null;
    titre_abonnement: string | null;
  };
  message?: string;
};

type ScanState = 'scanning' | 'loading' | 'result' | 'error';

const RESULT_DISPLAY_MS = 4000;

const ScanPage: React.FC = () => {
  const scannerRef  = useRef<Html5Qrcode | null>(null);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScanningRef = useRef(false);

  const [state, setState]   = useState<ScanState>('scanning');
  const [result, setResult] = useState<CheckinResult | null>(null);

  const startScanner = () => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;
    isScanningRef.current = false;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 260, height: 260 } },
      (decodedText) => {
        if (isScanningRef.current) return;
        isScanningRef.current = true;
        handleScan(decodedText);
      },
      () => {}
    ).catch(() => {
      setState('error');
      setResult({ success: false, message: 'Impossible d\'accéder à la caméra. Vérifiez les permissions.' });
    });
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
  };

  const handleScan = async (decodedText: string) => {
    // Le QR contient le token brut (64 char hex)
    const token = decodedText.trim();

    await stopScanner();
    setState('loading');

    try {
      const res  = await fetch(apiUrl(`/checkin/${token}`), {
        headers: { Accept: 'application/json' },
      });
      const data: CheckinResult = await res.json();

      setResult(data);
      setState(data.success ? 'result' : 'error');
    } catch {
      setResult({ success: false, message: 'Erreur réseau. Réessayez.' });
      setState('error');
    }

    timerRef.current = setTimeout(() => {
      setResult(null);
      setState('scanning');
      startScanner();
    }, RESULT_DISPLAY_MS);
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const resetToScan = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setResult(null);
    setState('scanning');
    startScanner();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.logo}>SUNUFITNESS</span>
          <p style={styles.subtitle}>Scan QR Code membre</p>
        </div>

        {/* Viewfinder caméra — toujours dans le DOM pour Html5Qrcode */}
        <div
          id="qr-reader"
          style={{
            ...styles.reader,
            display: state === 'scanning' ? 'block' : 'none',
          }}
        />

        {state === 'loading' && (
          <div style={styles.feedbackBox}>
            <div style={styles.spinner} />
            <p style={{ color: '#4a5568', marginTop: 16 }}>Vérification…</p>
          </div>
        )}

        {(state === 'result' || state === 'error') && result && (
          <ResultCard result={result} onReset={resetToScan} />
        )}

        {state === 'scanning' && (
          <p style={styles.hint}>Pointez la caméra vers le QR code du membre</p>
        )}
      </div>
    </div>
  );
};

const ResultCard: React.FC<{ result: CheckinResult; onReset: () => void }> = ({ result, onReset }) => {
  const actif  = result.success && result.member?.actif;
  const color  = actif ? '#16a34a' : '#dc2626';
  const bgColor = actif ? '#f0fdf4' : '#fef2f2';
  const border  = actif ? '#bbf7d0' : '#fecaca';

  return (
    <div style={{ ...styles.resultBox, backgroundColor: bgColor, borderColor: border }}>
      <div style={{ ...styles.statusIcon, backgroundColor: color }}>
        {actif ? '✓' : '✗'}
      </div>

      {result.success && result.member ? (
        <>
          <h2 style={{ ...styles.memberName, color }}>{result.member.nom}</h2>

          <p style={{ ...styles.statusBadge, color, borderColor: color }}>
            {actif ? 'Abonnement actif' : 'Abonnement expiré'}
          </p>

          {result.member.titre_abonnement && (
            <p style={styles.detail}>{result.member.titre_abonnement}</p>
          )}

          {result.member.expiration && (
            <p style={styles.detail}>
              {actif ? 'Expire le' : 'Expiré le'} : <strong>{result.member.expiration}</strong>
            </p>
          )}

          {result.member.phone && (
            <p style={styles.detail}>Tél : {result.member.phone}</p>
          )}
        </>
      ) : (
        <>
          <h2 style={{ ...styles.memberName, color: '#dc2626' }}>QR invalide</h2>
          <p style={styles.detail}>{result.message ?? 'Ce QR code n\'est pas reconnu.'}</p>
        </>
      )}

      <button style={{ ...styles.resetBtn, backgroundColor: color }} onClick={onReset}>
        Scanner un autre membre
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  },
  header: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
    padding: '24px 20px 20px',
    textAlign: 'center',
  },
  logo: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 2,
    fontFamily: 'sans-serif',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'sans-serif',
  },
  reader: {
    width: '100%',
  },
  feedbackBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #059669',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: '#718096',
    padding: '12px 16px 20px',
    fontFamily: 'sans-serif',
  },
  resultBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 24px',
    border: '2px solid',
    margin: 16,
    borderRadius: 12,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 16,
  },
  memberName: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'sans-serif',
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: 600,
    border: '1px solid',
    borderRadius: 20,
    padding: '4px 16px',
    marginBottom: 16,
    fontFamily: 'sans-serif',
  },
  detail: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'sans-serif',
  },
  resetBtn: {
    marginTop: 20,
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'sans-serif',
  },
};

export default ScanPage;
