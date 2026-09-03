import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCaisseUser } from '../../services/caisseApiClient';

/* ── Types ── */
interface Module {
  id: string;
  tag: string;
  name: string;
  desc: string;
  route: string;
  color: string;
  dimColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

/* ── SVG Icons ── */
const IconCaisse = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
    <line x1="6" y1="15" x2="9" y2="15"/>
  </svg>
);

const IconPlanning = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const IconCoach = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconMembre = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="3.5"/>
    <path d="M2 20c0-3.3 2.7-5.5 6-5.5"/>
    <circle cx="16" cy="11" r="3"/>
    <path d="M13 20c0-2.8 1.3-5 3-5s3 2.2 3 5"/>
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7v10"/>
  </svg>
);

/* ── Modules config ── */
const MODULES: Module[] = [
  {
    id: 'caisse',
    tag: 'Caisse',
    name: 'SunuCaisse',
    desc: 'Encaissements, abonnements, passes journaliers et historique des transactions.',
    route: '/caisse',
    color: '#F4C642',
    dimColor: 'rgba(244,198,66,0.12)',
    borderColor: 'rgba(244,198,66,0.3)',
    icon: <IconCaisse />,
  },
  {
    id: 'planning',
    tag: 'Planning',
    name: 'SunuPlanning',
    desc: 'Gestion des horaires de cours collectifs, rotations et disponibilités des salles.',
    route: '/admin/schedule',
    color: '#4A9EF5',
    dimColor: 'rgba(74,158,245,0.12)',
    borderColor: 'rgba(74,158,245,0.3)',
    icon: <IconPlanning />,
  },
  {
    id: 'coach',
    tag: 'Coaching',
    name: 'SunuCoach',
    desc: 'Pointage des présences, alertes retard/absence et suivi des performances des coachs.',
    route: '/admin/coaches',
    color: '#38D98A',
    dimColor: 'rgba(56,217,138,0.12)',
    borderColor: 'rgba(56,217,138,0.3)',
    icon: <IconCoach />,
  },
  {
    id: 'membre',
    tag: 'Membres',
    name: 'SunuMembre',
    desc: 'Profils, abonnements, QR codes de check-in et historique des accès membres.',
    route: '/admin/dashboard',
    color: '#A78BFA',
    dimColor: 'rgba(167,139,250,0.12)',
    borderColor: 'rgba(167,139,250,0.3)',
    icon: <IconMembre />,
  },
];

/* ── Styles ── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0B0F0D',
    color: '#EDF2EE',
    fontFamily: "'Inter', system-ui, sans-serif",
    WebkitFontSmoothing: 'antialiased',
    position: 'relative',
  },
  dotGrid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37,46,41,0.9) 1px, transparent 0)',
    backgroundSize: '28px 28px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    position: 'relative',
    zIndex: 1,
    borderBottom: '1px solid #252E29',
    background: '#141918',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoMark: {
    width: '34px',
    height: '34px',
    background: '#F4C642',
    borderRadius: '8px',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  logoTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  },
  logoBrand: {
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.13em',
    textTransform: 'uppercase' as const,
    color: '#6B7D72',
  },
  logoName: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#EDF2EE',
    letterSpacing: '-0.01em',
  },
  adminBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#1A201D',
    border: '1px solid #252E29',
    borderRadius: '40px',
    padding: '5px 12px 5px 6px',
  },
  avatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: '#F4C642',
    display: 'grid',
    placeItems: 'center',
    fontSize: '0.62rem',
    fontWeight: 700,
    color: '#0B0F0D',
    flexShrink: 0,
  },
  adminInfo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
  },
  adminName: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#EDF2EE',
  },
  adminRole: {
    fontSize: '0.65rem',
    color: '#6B7D72',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '940px',
    margin: '0 auto',
    padding: '3rem 2rem 5rem',
  },
  eyebrow: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.13em',
    textTransform: 'uppercase' as const,
    color: '#F4C642',
    marginBottom: '0.35rem',
  },
  title: {
    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
    fontWeight: 800,
    color: '#EDF2EE',
    letterSpacing: '-0.025em',
    lineHeight: 1.15,
    margin: '0 0 0.45rem',
  },
  subtitle: {
    color: '#6B7D72',
    fontSize: '0.88rem',
    lineHeight: 1.6,
    margin: '0 0 2.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.1rem',
  },
  card: {
    background: '#1A201D',
    border: '1px solid #252E29',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'border-color 0.17s ease, transform 0.17s ease, box-shadow 0.17s ease',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative' as const,
  },
  topBar: {
    height: '3px',
    borderRadius: '14px 14px 0 0',
    flexShrink: 0,
  },
  cardBody: {
    padding: '1.35rem 1.5rem 1.15rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.8rem',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  arrowWrap: {
    opacity: 0.3,
    transition: 'opacity 0.17s, transform 0.17s',
    marginTop: '2px',
  },
  tag: {
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
  moduleName: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#EDF2EE',
    letterSpacing: '-0.01em',
    marginTop: '2px',
  },
  moduleNamePrefix: {
    color: '#6B7D72',
    fontWeight: 500,
  },
  moduleDesc: {
    fontSize: '0.82rem',
    color: '#6B7D72',
    lineHeight: 1.55,
    flex: 1,
  },
  cardFooter: {
    borderTop: '1px solid #252E29',
    padding: '0.65rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.7rem',
    color: '#38D98A',
    fontWeight: 500,
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#38D98A',
    boxShadow: '0 0 0 2px rgba(56,217,138,0.2)',
    flexShrink: 0,
  },
  pageFooter: {
    marginTop: '3.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #252E29',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    fontSize: '0.7rem',
    color: '#6B7D72',
  },
};

/* ── Module Card ── */
const ModuleCard: React.FC<{ module: Module; onClick: () => void }> = ({ module, onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        borderColor: hovered ? module.borderColor : '#252E29',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 10px 28px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {/* barre couleur top */}
      <div style={{ ...styles.topBar, background: module.color }} />

      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <div style={{ ...styles.iconWrap, background: module.dimColor, color: module.color }}>
            {module.icon}
          </div>
          <div style={{ ...styles.arrowWrap, opacity: hovered ? 1 : 0.3, transform: hovered ? 'translate(3px,-3px)' : 'none', color: module.color }}>
            <IconArrow />
          </div>
        </div>

        <div>
          <div style={{ ...styles.tag, color: module.color }}>{module.tag}</div>
          <div style={styles.moduleName}>
            <span style={styles.moduleNamePrefix}>Sunu</span>
            {module.name.replace('Sunu', '')}
          </div>
        </div>

        <p style={styles.moduleDesc}>{module.desc}</p>
      </div>

      <div style={styles.cardFooter}>
        <div style={styles.status}>
          <span style={styles.statusDot} />
          En ligne
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const HubPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getCaisseUser();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      setClock(date.charAt(0).toUpperCase() + date.slice(1) + ' · ' + time);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const initials = user ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : 'AD'
    ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  return (
    <div style={styles.page}>
      <div style={styles.dotGrid} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoWrap}>
          <div style={styles.logoMark}>
            <svg viewBox="0 0 18 18" width={18} height={18} fill="none" stroke="#0B0F0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="9" x2="4" y2="9"/>
              <line x1="14" y1="9" x2="17" y2="9"/>
              <rect x="4" y="6" width="2" height="6" rx="1"/>
              <rect x="12" y="6" width="2" height="6" rx="1"/>
              <line x1="6" y1="9" x2="12" y2="9"/>
            </svg>
          </div>
          <div style={styles.logoTextWrap}>
            <span style={styles.logoBrand}>Hub Admin</span>
            <span style={styles.logoName}>SunuFitness</span>
          </div>
        </div>

        <div style={styles.adminBadge}>
          <div style={styles.avatar}>{initials}</div>
          <div style={styles.adminInfo}>
            <span style={styles.adminName}>{user ? `${user.prenom} ${user.nom}` : 'Admin'}</span>
            <span style={styles.adminRole}>{user?.role ?? 'Admin'}</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={styles.eyebrow}>Tableau de bord</div>
          <h1 style={styles.title}>Modules SunuFitness</h1>
          <p style={styles.subtitle}>Accédez à chaque outil depuis un seul endroit.</p>
        </div>

        <div style={styles.grid}>
          {MODULES.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              onClick={() => navigate(mod.route)}
            />
          ))}
        </div>

        <div style={styles.pageFooter}>
          <span>SunuFitness &mdash; Saly, Sénégal</span>
          <span>{clock}</span>
        </div>
      </main>
    </div>
  );
};

export default HubPage;
