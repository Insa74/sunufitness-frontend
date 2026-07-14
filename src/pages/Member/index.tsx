import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MemberQrCode from '../../components/common/MemberQrCode';
import { apiClient } from '../../services/apiClient';
import { API } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const MemberPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  type Session = Record<string, any> & {
    id?: number | string;
    title?: string;
    name?: string;
    date?: string;
    time?: string;
    scheduled_at?: string;
  };

  type Subscription = {
    id: number;
    type: string;
    title: string;
    amount: number;
    currency: string;
    start_date: string;
    end_date: string;
    auto_renew: boolean;
    status: string;
    payment_method?: string;
    created_at?: string;
  };

  const [user, setUser] = useState<any | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [isAccountInactive, setIsAccountInactive] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiClient.get<{ user: any; training_sessions: Session[]; subscriptions: Subscription[] }>(API.endpoints.profile);
        if (!mounted) return;
        setUser(data.user);
        setSessions(data.training_sessions || []);
        setSubscriptions(data.subscriptions || []);
      } catch (e: any) {
        const msg = e?.message || "Impossible de charger le profil.";
        // Check if the error is about inactive account
        if (msg.toLowerCase().includes("n'est pas actif") || msg.toLowerCase().includes('pas actif')) {
          setIsAccountInactive(true);
          setShowInactiveModal(true);
        } else {
          setError(msg);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle logout: call backend then clear local auth and redirect
  const handleLogout = async () => {
    try {
      // Call API to invalidate token/session on the server
      await apiClient.post(API.endpoints.logout, {});
    } catch (e) {
      // Even if server call fails, proceed to clear client state
      console.warn('Logout API call failed, proceeding to clear client session');
    } finally {
      logout();
      navigate('/');
    }
  };

  function formatDateTime(s: Session) {
    const raw = s.date_time || s.scheduled_at || s.date;
    if (!raw) return '';
    try {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
      }
    } catch {}
    return [s.date, s.time].filter(Boolean).join(' à ');
  }

  function formatStatus(val?: string) {
    const v = (val || '').toString().toLowerCase();
    switch (v) {
      case 'pending':
      case 'en_attente':
        return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
      case 'confirmed':
      case 'confirmee':
      case 'confirmé':
        return { label: 'Confirmée', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
      case 'annulee':
      case 'annulé':
        return { label: 'Annulée', color: 'bg-red-100 text-red-700' };
      case 'completed':
      case 'terminee':
      case 'terminé':
        return { label: 'Terminée', color: 'bg-blue-100 text-blue-800' };
      default:
        return { label: val || '—', color: 'bg-gray-100 text-gray-700' };
    }
  }

  function coachName(s: Session) {
    return (s as any)?.coach?.full_name || 'Coach';
  }
  function durationText(s?: Session) {
    const d = s?.duration ?? s?.duration_minutes ?? s?.duration_min;
    if (!d && d !== 0) return undefined;
    const n = Number(d);
    if (!isNaN(n) && n > 0) return `${n} min`;
    return undefined;
  }

  function formatSubscriptionStatus(status: string) {
    const s = status.toLowerCase();
    switch (s) {
      case 'active':
      case 'actif':
        return { label: 'Actif', color: 'bg-green-100 text-green-800' };
      case 'expired':
      case 'expiré':
        return { label: 'Expiré', color: 'bg-red-100 text-red-700' };
      case 'pending':
      case 'en_attente':
        return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
      case 'cancelled':
      case 'annulé':
        return { label: 'Annulé', color: 'bg-gray-100 text-gray-700' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700' };
    }
  }

  function getDaysUntilExpiration(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffMs = end.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  function formatPrice(amount: number, currency: string = 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch {}
    return dateString;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="relative w-full h-[250px] sm:h-[280px] md:h-[320px] lg:h-[350px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/membre/member_bg.png')" }}
        >
          {/* Green Gradient Overlay - Strong left, fade right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#05835e]/90 via-[#05835e]/60 to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full text-white px-4 sm:px-6 lg:px-8">
<div className="flex-1 flex items-center justify-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center">
                ESPACE MEMBRE
              </h1>
            </div>
            
          </div>
        </div>
        
        {/* User Profile Section - Avatar and Info side by side */}
        <div className="absolute bottom-0 left-4 sm:left-6 lg:left-8 transform translate-y-1/2 z-20 flex items-start gap-8">
          {/* User Avatar with Big White Background */}
          <div className="relative flex-shrink-0">
            {/* Large white background circle */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-white shadow-2xl flex items-center justify-center">
              {/* Inner avatar circle */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-[#05835e] flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/membre/user.png" 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* User Info next to avatar - positioned higher and smaller */}
          <div className="text-left mt-4 sm:mt-6 lg:mt-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
              {user ? `Bonjour, ${user.first_name ?? user.name ?? ''} ${user.last_name ?? ''}`.trim() : 'Bonjour'}
            </h2>
            <p className="text-white/90 text-base sm:text-lg">
              {user?.email || ''}
            </p>
            {user && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/90 text-[#05835e] hover:bg-white shadow font-semibold text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
                  </svg>
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-16">

        {loading && (
          <div className="bg-white rounded-lg shadow p-6 text-gray-700">Chargement du profil…</div>
        )}
        {isAccountInactive && !showInactiveModal && (
          <div className="bg-red-500 border border-red-600 text-white rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Compte Inactif</h3>
                <p className="text-white/90">Votre compte n'est pas encore activé. Veuillez contacter l'administration pour plus d'informations.</p>
              </div>
              <button
                onClick={() => setShowInactiveModal(true)}
                className="flex-shrink-0 px-4 py-2 bg-white text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors"
              >
                Plus d'infos
              </button>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">{error}</div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Mes Rendez-vous Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#05835e] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Mes Rendez-vous
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Consultez vos différents rendez-vous afin de les respecter
            </p>

            {/* Appointments List */}
            <div className="space-y-4">
              {(sessions.length > 0 ? sessions : []).map((s) => {
                const dt = formatDateTime(s);
                const coach = coachName(s);
                const loc = (s as any).location || (s as any).lieu;
                const st = formatStatus((s as any).status);
                const dur = durationText(s);
                return (
                  <div key={(s.id ?? Math.random()).toString()} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#05835e]"></span>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {s.title || s.name || 'Séance'}
                          </h4>
                        </div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
                          {dt && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                              <span className="font-medium text-gray-600">Date:</span>
                              <span className="text-gray-800">{dt}</span>
                            </div>
                          )}
                          {coach && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"/></svg>
                              <span className="font-medium text-gray-600">Coach:</span>
                              <span className="text-gray-800">{coach}</span>
                            </div>
                          )}
                          {loc && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.242a8 8 0 1111.314 0z"/></svg>
                              <span className="font-medium text-gray-600">Lieu:</span>
                              <span className="text-gray-800">{loc}</span>
                            </div>
                          )}
                          {dur && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              <span className="font-medium text-gray-600">Durée:</span>
                              <span className="text-gray-800">{dur}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${st.color}`}>{st.label}</span>
                    </div>
                  </div>
                );
              })}
              {!loading && sessions.length === 0 && (
                <div className="text-gray-500 text-sm">Aucun rendez-vous pour le moment.</div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        {user?.qr_token && (
          <div className="mt-8 lg:mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#05835e] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h5v5H3V3zm0 13h5v5H3v-5zM13 3h5v5h-5V3zm5 13h.01M13 13h2m-2 5h2m3-5h.01M13 8h5" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Mon QR Code d'accès
                </h3>
              </div>

              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Présentez ce QR code à l'accueil pour valider votre entrée rapidement.
              </p>

              <MemberQrCode token={user.qr_token} size={220} />
            </div>
          </div>
        )}

        {/* Subscriptions Section */}
        <div className="mt-8 lg:mt-12">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#05835e] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Mes Abonnements
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Consultez vos abonnements actifs et leur date d'expiration
            </p>

            {/* Subscriptions List */}
            <div className="space-y-4">
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => {
                  const statusInfo = formatSubscriptionStatus(sub.status);
                  const daysLeft = getDaysUntilExpiration(sub.end_date);
                  const isExpired = ['expired', 'expiré'].includes(sub.status.toLowerCase());
                  const showExpiryWarning = daysLeft >= 0 && daysLeft <= 7;
                  return (
                    <div key={sub.id} className="p-4 sm:p-5 bg-gradient-to-r from-green-50 to-white rounded-lg border-l-4 border-[#05835e] hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                              {sub.title}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#05835e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-semibold text-gray-700">Montant:</span>
                              <span className="text-gray-900 font-bold">{formatPrice(sub.amount, sub.currency)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#05835e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-semibold text-gray-700">Début:</span>
                              <span className="text-gray-900">{formatDate(sub.start_date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#05835e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-semibold text-gray-700">Fin:</span>
                              <span className="text-gray-900">{formatDate(sub.end_date)}</span>
                            </div>
                            
                            {sub.payment_method && (
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#05835e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <span className="font-semibold text-gray-700">Paiement:</span>
                                <span className="text-gray-900 capitalize">{sub.payment_method.replace('_', ' ')}</span>
                              </div>
                            )}
                            
                            {sub.auto_renew && (
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#05835e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="text-[#05835e] font-semibold">Renouvellement automatique</span>
                              </div>
                            )}
                          </div>

                          {showExpiryWarning && (
                            <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2 text-sm font-medium">
                              <span>⚠️</span>
                              <span>Votre abonnement expire dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}</span>
                            </div>
                          )}

                          <div className="mt-4">
                            <button
                              onClick={() => navigate('/services')}
                              className={`inline-flex items-center gap-2 font-semibold py-2 px-5 rounded-lg text-sm transition-colors duration-200 ${
                                isExpired
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-[#05835e] hover:bg-[#3d6d4f] text-white'
                              }`}
                            >
                              {isExpired ? 'Renouveler maintenant' : 'Renouveler'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <p className="text-gray-500 text-sm mb-4">Aucun abonnement actif pour le moment.</p>
                  <button
                    onClick={() => navigate('/services')}
                    className="inline-flex items-center gap-2 bg-[#05835e] hover:bg-[#3d6d4f] text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Souscrire à un abonnement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reserve Button */}
        <div className="flex justify-center mt-12">
          <button onClick={() => navigate('/services')} className="bg-[#05835e] hover:bg-[#3d6d4f] text-white font-bold py-4 px-8 sm:px-12 rounded-lg text-lg sm:text-xl transition-colors duration-200 flex items-center gap-3">
            Réservez une séance
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      <Footer />

      {/* Inactive Account Modal */}
      {showInactiveModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 transform animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
              Compte non activé
            </h3>

            {/* Message */}
            <div className="text-center mb-4">
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Votre compte a bien été créé.
              </p>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                Après vérification de vos informations, votre compte sera approuvé par un administrateur. Une fois validé, vous pourrez accéder facilement à votre espace membre.
              </p>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                Merci de votre compréhension.
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-gray-800 mb-2 text-center">
                Pour toute question ou information complémentaire, veuillez nous contacter ou vous rendre à la salle :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#05835e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <span className="font-medium">Tél :</span> 789573842 et 710196868
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#05835e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="font-medium">E-mail :</span> info@sunufitness.com
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#05835e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">Adresse :</span> 10 Route de Ngaparou Saly Sénégal
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-[#05835e] hover:bg-[#3d6d4f] text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05835e]"
              >
                Se déconnecter
              </button>
              <button
                onClick={() => setShowInactiveModal(false)}
                className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MemberPage;
