import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { caisseApi, getCaisseUser, isCaisseStaff } from '../../services/caisseApiClient';

// Décision renvoyée par POST /acces/scan (employé connecté par PIN).
type Decision = {
  autorise: boolean;
  alerte: boolean;
  motif: string;
  titre: string;
  message: string;
  details: Record<string, string | number | null>;
};

type CheckinResult = {
  success: boolean;
  decision?: Decision;
  member?: {
    id: number;
    nom: string;
    phone: string | null;
    etat_abonnement?: { etat: string; jours_restants: number | null; date_fin: string | null };
  };
  message?: string;
  introuvable?: boolean; // QR inconnu (404) : seul cas affiché « QR invalide »
};

type ScanState = 'scanning' | 'loading' | 'result' | 'error';

const RESULT_DISPLAY_MS = 4000;

// Le scan est réservé au personnel connecté (même session PIN que la Caisse) :
// c'est lui qui enregistre l'entrée et décompte les packs.
const ScanPage: React.FC = () => {
  const [connecte, setConnecte] = useState(isCaisseStaff());

  useEffect(() => {
    const onExpire = () => setConnecte(false);
    window.addEventListener('caisse:session-expired', onExpire);
    return () => window.removeEventListener('caisse:session-expired', onExpire);
  }, []);

  if (!connecte) return <ConnexionRequise />;
  return <Scanner />;
};

const ConnexionRequise: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.logo}>SUNUFITNESS</span>
          <p style={styles.subtitle}>Scan QR Code membre</p>
        </div>
        <div style={styles.feedbackBox}>
          <p style={{ ...styles.memberName, color: '#1a202c' }}>Connexion requise</p>
          <p style={styles.detail}>Le scan des entrées est réservé à l'équipe. Connectez-vous avec votre code PIN.</p>
          <button style={{ ...styles.resetBtn, backgroundColor: '#059669' }} onClick={() => navigate('/caisse?retour=/scan')}>
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

const Scanner: React.FC = () => {
  const employe = getCaisseUser();
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
      const data = await caisseApi.post<CheckinResult>('/acces/scan', { token });
      setResult(data);
      setState(data.success ? 'result' : 'error');
    } catch (e: unknown) {
      // Réponse de l'API (success: false) : on garde son message en français (ex. « QR invalide ou inconnu. »).
      // Sinon (réseau coupé, session expirée, trop de scans) : message clair, jamais « QR invalide ».
      const err = e as { success?: boolean; message?: string };
      if (err?.success === false && err.message) {
        setResult({ success: false, message: err.message, introuvable: err.message.startsWith('QR invalide') });
      } else {
        setResult({ success: false, message: 'Problème de connexion. Réessayez de scanner ce QR.' });
      }
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
          {employe && <p style={styles.employe}>Scan par {employe.prenom || employe.nom}</p>}
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
  const decision = result.success ? result.decision : undefined;
  const autorise = !!decision?.autorise;
  const alerte   = autorise && !!decision?.alerte;
  // Vert : autorisé — orange : autorisé avec alerte (ex. forfait du coach dépassé) — rouge : refusé
  const color   = alerte ? '#d97706' : autorise ? '#16a34a' : '#dc2626';
  const bgColor = alerte ? '#fffbeb' : autorise ? '#f0fdf4' : '#fef2f2';
  const border  = alerte ? '#fde68a' : autorise ? '#bbf7d0' : '#fecaca';
  const details = decision?.details ?? {};

  return (
    <div style={{ ...styles.resultBox, backgroundColor: bgColor, borderColor: border }}>
      <div style={{ ...styles.statusIcon, backgroundColor: color }}>
        {alerte ? '!' : autorise ? '✓' : '✗'}
      </div>

      {decision && result.member ? (
        <>
          <h2 style={{ ...styles.memberName, color }}>{result.member.nom}</h2>

          <p style={{ ...styles.statusBadge, color, borderColor: color }}>{decision.titre}</p>

          <p style={styles.detail}>{decision.message}</p>

          {details.valable_jusqu_au && (
            <p style={styles.detail}>Pack valable jusqu'au <strong>{details.valable_jusqu_au}</strong></p>
          )}

          {decision.motif === 'abonnement' && result.member.etat_abonnement?.date_fin && (
            <p style={styles.detail}>Expire le : <strong>{result.member.etat_abonnement.date_fin}</strong></p>
          )}

          {result.member.phone && (
            <p style={styles.detail}>Tél : {result.member.phone}</p>
          )}
        </>
      ) : (
        <>
          <h2 style={{ ...styles.memberName, color: '#dc2626' }}>{result.introuvable ? 'QR invalide' : 'Scan non vérifié'}</h2>
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
  employe: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 6,
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
