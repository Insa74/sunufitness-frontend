import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { apiClient } from '../../services/apiClient';
import { API } from '../../config/api';

const MemberPage: React.FC = () => {
  type Session = Record<string, any> & {
    id?: number | string;
    title?: string;
    name?: string;
    date?: string;
    time?: string;
    scheduled_at?: string;
  };

  const [user, setUser] = useState<any | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiClient.get<{ user: any; training_sessions: Session[] }>(API.endpoints.profile);
        if (!mounted) return;
        setUser(data.user);
        setSessions(data.training_sessions || []);
      } catch (e: any) {
        setError(e?.message || "Impossible de charger le profil.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
          <div className="absolute inset-0 bg-gradient-to-r from-[#3BB641]/90 via-[#3BB641]/60 to-transparent"></div>
          
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
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-[#3BB641] flex items-center justify-center overflow-hidden">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-16">

        {loading && (
          <div className="bg-white rounded-lg shadow p-6 text-gray-700">Chargement du profil…</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">{error}</div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Mes Rendez-vous Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#3BB641] rounded-full flex items-center justify-center">
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
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#3BB641]"></span>
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

          {/* Historique de paiement Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#3BB641] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Historique de paiement
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Consultez votre historique de paiement
            </p>

            {/* Payment History List */}
            <div className="space-y-4">
              <div className="text-gray-500 text-sm">L'historique de paiement sera bientôt disponible.</div>
            </div>
          </div>
        </div>

        {/* Reserve Button */}
        <div className="flex justify-center mt-12">
          <button className="bg-[#3BB641] hover:bg-[#319c39] text-white font-bold py-4 px-8 sm:px-12 rounded-lg text-lg sm:text-xl transition-colors duration-200 flex items-center gap-3">
            Réservez une séance
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MemberPage;
