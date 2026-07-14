import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl, API } from '../../config/api';
import MemberQrCode from '../../components/common/MemberQrCode';

type CheckinMember = {
  id: number;
  nom: string;
  actif: boolean;
  statut_abonnement: string;
  expiration: string | null;
  titre_abonnement: string | null;
};

type State = 'loading' | 'ready' | 'error';

const MyQrPage: React.FC = () => {
  const params = useParams();
  const token = params.token ?? '';
  const [state, setState] = useState<State>('loading');
  const [member, setMember] = useState<CheckinMember | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(apiUrl(API.qr.checkin(token)), {
          headers: { Accept: 'application/json' },
        });
        const data = await res.json();
        if (!mounted) return;
        if (data.success) {
          setMember(data.member);
          setState('ready');
        } else {
          setState('error');
        }
      } catch {
        if (mounted) setState('error');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#05835e] to-[#047857] px-6 py-5 text-center">
          <span className="text-white font-extrabold tracking-widest text-lg">SUNUFITNESS</span>
          <p className="text-white/85 text-sm mt-1">Mon QR code d'accès</p>
        </div>

        <div className="p-6 sm:p-8">
          {state === 'loading' && (
            <p className="text-center text-gray-500 py-10">Chargement…</p>
          )}

          {state === 'error' && (
            <div className="text-center py-10">
              <p className="text-red-600 font-semibold mb-1">QR code invalide</p>
              <p className="text-gray-500 text-sm">Ce lien n'est plus valide ou a expiré.</p>
            </div>
          )}

          {state === 'ready' && member && (
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-bold text-gray-900 mb-1">{member.nom}</h2>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full mb-6 ${
                  member.actif
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {member.actif ? 'Abonnement actif' : 'Abonnement expiré'}
              </span>

              <MemberQrCode token={token} size={220} />

              <p className="text-xs text-gray-500 text-center mt-6">
                Présentez ce QR code à l'accueil de la salle pour valider votre entrée.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQrPage;
