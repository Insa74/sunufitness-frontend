import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAISSE_TOKEN_KEY, CAISSE_USER_KEY, caisseApi } from '../../services/caisseApiClient';
import { TABLETTE_TOKEN_KEY } from '../../services/tabletteApiClient';

// Inscriptions faites par les clients sur la tablette : l'accueil encaisse, puis la vente
// est créée dans la Caisse (même reçu, même QR que pour une vente normale).

type Mode = 'wave' | 'orange_money' | 'cash';
interface Inscription {
  id: number; type: 'nouveau' | 'renouvellement'; nom: string; phone: string; email: string | null;
  produit: string; montant: number; mode_paiement_choisi: Mode; sante_remarques: string | null; heure: string; date: string;
}

const fmtF = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/\s/g, ' ') + ' F';
const MODES: Record<Mode, string> = { wave: 'Wave', orange_money: 'Orange Money', cash: 'Espèces' };

/** Bouton d'en-tête « À encaisser (n) » + panneau de la liste. `onRecu` affiche le reçu de la vente créée. */
export const InscriptionsTablette: React.FC<{ onRecu: (recu: unknown) => void }> = ({ onRecu }) => {
  const [liste, setListe] = useState<Inscription[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [modes, setModes] = useState<Record<number, Mode>>({});
  const [enCours, setEnCours] = useState<number | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(() => {
    caisseApi.get<{ data: Inscription[] }>('/caisse/inscriptions-tablette')
      .then(r => setListe(r.data ?? []))
      .catch(() => { /* hors ligne : on garde la dernière liste */ });
  }, []);

  useEffect(() => {
    charger();
    const t = setInterval(charger, 20000);
    return () => clearInterval(t);
  }, [charger]);

  const encaisser = async (i: Inscription) => {
    setErreur(null); setEnCours(i.id);
    try {
      const r = await caisseApi.post<{ data: unknown }>(`/caisse/inscriptions-tablette/${i.id}/valider`, {
        mode_paiement: modes[i.id] ?? i.mode_paiement_choisi,
      });
      setOuvert(false);
      charger();
      onRecu(r.data);
    } catch (e) {
      const err = e as { message?: string; errors?: Record<string, string[]> };
      setErreur(err.errors ? Object.values(err.errors).flat().join(' ') : err.message ?? 'Encaissement impossible.');
      charger();
    } finally { setEnCours(null); }
  };

  const annuler = async (i: Inscription) => {
    if (!window.confirm(`Annuler l'inscription de ${i.nom} ? (client parti sans payer, doublon…)`)) return;
    setErreur(null);
    try { await caisseApi.post(`/caisse/inscriptions-tablette/${i.id}/annuler`); charger(); }
    catch (e) { setErreur((e as { message?: string }).message ?? 'Annulation impossible.'); }
  };

  return (
    <>
      <button onClick={() => { setOuvert(true); charger(); }}
        className={`text-xs px-3 py-1.5 rounded-lg transition ${liste.length ? 'bg-amber-400 text-black font-semibold animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}>
        À encaisser{liste.length ? ` (${liste.length})` : ''}
      </button>
      {ouvert && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mt-10">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold">Inscriptions tablette à encaisser</h3>
                <p className="text-xs text-gray-500">Encaissez seulement après avoir reçu l'argent.</p>
              </div>
              <button onClick={() => setOuvert(false)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="p-4 space-y-3">
              {erreur && <p className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{erreur}</p>}
              {liste.length === 0 && <p className="text-sm text-gray-500 text-center py-6">Aucune inscription en attente.</p>}
              {liste.map(i => (
                <div key={i.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-semibold">{i.nom}</p>
                      <p className="text-xs text-gray-500">{i.phone} · {i.type === 'nouveau' ? 'Nouveau client' : 'Renouvellement'} · {i.heure}</p>
                    </div>
                    <p className="font-bold whitespace-nowrap">{fmtF(i.montant)}</p>
                  </div>
                  <p className="text-sm">{i.produit}</p>
                  {i.sante_remarques && <p className="text-xs bg-amber-50 text-amber-800 rounded-lg px-3 py-2">Santé : {i.sante_remarques}</p>}
                  <div className="flex gap-2">
                    {(Object.keys(MODES) as Mode[]).map(m => (
                      <button key={m} onClick={() => setModes(s => ({ ...s, [i.id]: m }))}
                        className={`flex-1 text-xs py-2 rounded-lg border ${(modes[i.id] ?? i.mode_paiement_choisi) === m ? 'bg-black text-white border-black' : 'border-gray-200'}`}>
                        {MODES[m]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => annuler(i)} className="px-3 py-2 text-sm rounded-lg bg-gray-100">Annuler</button>
                    <button disabled={enCours !== null} onClick={() => encaisser(i)}
                      className="flex-1 py-2 text-sm font-semibold rounded-lg bg-black text-white disabled:opacity-40">
                      {enCours === i.id ? 'Encaissement…' : `Paiement reçu · ${fmtF(i.montant)}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/** Transforme cet appareil en tablette client : la session caisse de l'appareil est fermée. */
export const ActiverTablette: React.FC = () => {
  const navigate = useNavigate();
  const activer = async () => {
    if (!window.confirm('Cet appareil va devenir la tablette d\'inscription des clients. La Caisse sera fermée sur cet appareil. Continuer ?')) return;
    try {
      const r = await caisseApi.post<{ token: string }>('/caisse/tablette/activer');
      localStorage.setItem(TABLETTE_TOKEN_KEY, r.token);
      localStorage.removeItem(CAISSE_TOKEN_KEY);
      localStorage.removeItem(CAISSE_USER_KEY);
      navigate('/tablette');
    } catch (e) {
      window.alert((e as { message?: string }).message ?? 'Activation impossible.');
    }
  };
  return (
    <button onClick={activer} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">Tablette client</button>
  );
};
