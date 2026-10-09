import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { apiClient } from '../../services/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type TypeCours = 'collectif' | 'prive';

interface CoursItem {
  id: number;
  type: TypeCours;
  titre: string;
  description: string | null;
  coach: string | null;
  lieu: string | null;
  date: string;          // YYYY-MM-DD
  heure_debut: string;   // HH:MM
  heure_fin: string;
  statut_cours: string;
  capacite: number;
  places_restantes: number;
  passe: boolean;
  annulable: boolean;
  limite_annulation: string;
  ma_reservation: { id: number; statut: string } | null;
}

interface Meta {
  abonnement_actif: boolean;
  etat_abonnement: { etat: string; jours_restants: number | null; date_fin: string | null };
  credits_coaching: number;
  delai_annulation_h: number;
}

interface ListeReponse { success: boolean; data: CoursItem[]; meta: Meta }
interface ActionReponse { success: boolean; message: string; data: CoursItem; meta: Meta }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VERT = '#05835e';

function libelleJour(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const auj = new Date();
  auj.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - auj.getTime()) / 86400000);
  const txt = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const cap = txt.charAt(0).toUpperCase() + txt.slice(1);
  if (diff === 0) return `Aujourd'hui · ${cap}`;
  if (diff === 1) return `Demain · ${cap}`;
  return cap;
}

function estReservationActive(c: CoursItem): boolean {
  return !!c.ma_reservation && c.ma_reservation.statut !== 'annule';
}

const LIBELLE_STATUT: Record<string, string> = {
  reserve: 'Réservé',
  annule: 'Annulé',
  present: 'Présent',
  absent: 'Absent',
};

// ─── Carte d'un cours ─────────────────────────────────────────────────────────

const CarteCours: React.FC<{
  cours: CoursItem;
  meta: Meta | null;
  enCours: boolean;
  onReserver: (c: CoursItem) => void;
  onAnnuler: (c: CoursItem) => void;
}> = ({ cours, meta, enCours, onReserver, onAnnuler }) => {
  const reserve = estReservationActive(cours);
  const complet = cours.places_restantes <= 0;
  const prive = cours.type === 'prive';
  const coursAnnule = cours.statut_cours === 'annule';

  let bouton: React.ReactNode = null;
  if (coursAnnule) {
    bouton = <span className="text-sm font-semibold text-red-600">Cours annulé</span>;
  } else if (cours.passe) {
    bouton = cours.ma_reservation
      ? <span className="text-sm text-gray-500">{LIBELLE_STATUT[cours.ma_reservation.statut] ?? cours.ma_reservation.statut}</span>
      : null;
  } else if (reserve) {
    bouton = cours.annulable ? (
      <button
        disabled={enCours}
        onClick={() => onAnnuler(cours)}
        className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
      >
        Annuler
      </button>
    ) : (
      <span className="text-xs text-gray-500 text-right">Annulation impossible<br />(moins de {meta?.delai_annulation_h ?? 2} h avant)</span>
    );
  } else if (complet) {
    bouton = <span className="px-4 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm font-semibold">Complet</span>;
  } else {
    const bloque = prive ? (meta?.credits_coaching ?? 0) < 1 : !meta?.abonnement_actif;
    bouton = (
      <button
        disabled={enCours || bloque}
        onClick={() => onReserver(cours)}
        title={bloque ? (prive ? 'Forfait coaching privé nécessaire' : 'Abonnement actif nécessaire') : undefined}
        className="px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: VERT }}
      >
        Réserver
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${reserve ? 'border-[#05835e] ring-1 ring-[#05835e]/30' : 'border-gray-200'}`}>
      <div className="text-center w-16 flex-shrink-0">
        <div className="text-lg font-bold text-gray-900">{cours.heure_debut}</div>
        <div className="text-xs text-gray-500">{cours.heure_fin}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900">{cours.titre}</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${prive ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {prive ? 'Coaching privé' : 'Cours collectif'}
          </span>
          {reserve && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#05835e] text-white">✓ Réservé</span>}
        </div>
        <div className="text-sm text-gray-600 mt-0.5">
          {cours.coach ? `avec ${cours.coach}` : 'Coach à confirmer'}
          {cours.lieu ? ` · ${cours.lieu}` : ''}
        </div>
        {!prive && !cours.passe && !coursAnnule && (
          <div className={`text-xs mt-1 ${complet ? 'text-red-600' : cours.places_restantes <= 3 ? 'text-amber-700' : 'text-gray-500'}`}>
            {complet ? 'Complet' : `${cours.places_restantes} place${cours.places_restantes > 1 ? 's' : ''} restante${cours.places_restantes > 1 ? 's' : ''} sur ${cours.capacite}`}
          </div>
        )}
        {cours.description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{cours.description}</div>}
      </div>
      <div className="flex-shrink-0">{bouton}</div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const [cours, setCours] = useState<CoursItem[]>([]);
  const [mesResa, setMesResa] = useState<CoursItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [filtre, setFiltre] = useState<'tous' | TypeCours>('tous');
  const [onglet, setOnglet] = useState<'planning' | 'mes'>('planning');
  const [chargement, setChargement] = useState(true);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const charger = useCallback(async () => {
    setErreur(null);
    try {
      const [liste, mes] = await Promise.all([
        apiClient.get<ListeReponse>('/cours'),
        apiClient.get<ListeReponse>('/cours/mes-reservations'),
      ]);
      setCours(liste.data);
      setMeta(liste.meta);
      setMesResa(mes.data);
    } catch (e: any) {
      setErreur(e?.message || 'Impossible de charger les cours.');
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const agir = async (c: CoursItem, action: 'reserver' | 'annuler') => {
    if (action === 'annuler' && !window.confirm(`Annuler ta réservation pour « ${c.titre} » à ${c.heure_debut} ?`)) return;
    setEnCours(true);
    setErreur(null);
    setMessage(null);
    try {
      const res = await apiClient.post<ActionReponse>(`/cours/${c.id}/${action}`);
      setMessage(action === 'reserver'
        ? `✅ Réservation confirmée : ${c.titre}, ${libelleJour(c.date).toLowerCase()} à ${c.heure_debut}.`
        : `Réservation annulée : ${c.titre}.`);
      setMeta(res.meta);
      await charger();
    } catch (e: any) {
      setErreur(e?.message || 'Une erreur est survenue.');
      await charger();
    } finally {
      setEnCours(false);
    }
  };

  const coursFiltres = useMemo(
    () => cours.filter((c) => filtre === 'tous' || c.type === filtre),
    [cours, filtre],
  );

  const parJour = useMemo(() => {
    const groupes: Record<string, CoursItem[]> = {};
    coursFiltres.forEach((c) => { (groupes[c.date] ||= []).push(c); });
    return Object.entries(groupes).sort(([a], [b]) => a.localeCompare(b));
  }, [coursFiltres]);

  const aVenir = mesResa.filter((c) => !c.passe && c.statut_cours !== 'annule' && estReservationActive(c));
  const historique = mesResa.filter((c) => !aVenir.includes(c));

  const etat = meta?.etat_abonnement;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="text-white px-4 sm:px-6 lg:px-8 py-10" style={{ background: `linear-gradient(135deg, ${VERT} 0%, #046b4d 100%)` }}>
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/member')} className="text-white/80 hover:text-white text-sm mb-3">← Espace membre</button>
          <h1 className="text-3xl sm:text-4xl font-bold">Réserver un cours</h1>
          <p className="text-white/90 mt-2">Cours collectifs et séances de coaching privé des 14 prochains jours.</p>
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Bandeau statut */}
        {meta && (
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <div className={`rounded-xl p-4 border ${meta.abonnement_actif ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="text-xs uppercase tracking-wide text-gray-500">Cours collectifs</div>
              {meta.abonnement_actif ? (
                <div className="font-semibold text-emerald-800 mt-1">
                  ✓ Abonnement actif{etat?.date_fin ? ` jusqu'au ${etat.date_fin}` : ''}
                </div>
              ) : (
                <div className="mt-1">
                  <div className="font-semibold text-red-700">Abonnement non actif</div>
                  <button onClick={() => navigate('/services')} className="text-sm underline text-red-700 mt-1">Voir les abonnements</button>
                </div>
              )}
            </div>
            <div className={`rounded-xl p-4 border ${meta.credits_coaching > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-xs uppercase tracking-wide text-gray-500">Coaching privé</div>
              <div className="font-semibold text-gray-800 mt-1">
                {meta.credits_coaching > 0
                  ? `${meta.credits_coaching} séance${meta.credits_coaching > 1 ? 's' : ''} disponible${meta.credits_coaching > 1 ? 's' : ''}`
                  : 'Aucune séance disponible — forfait à acheter à la caisse'}
              </div>
            </div>
          </div>
        )}

        {message && <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm">{message}</div>}
        {erreur && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{erreur}</div>}

        {/* Onglets */}
        <div className="flex gap-2 mb-4">
          {([['planning', 'Planning des cours'], ['mes', `Mes réservations${aVenir.length ? ` (${aVenir.length})` : ''}`]] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setOnglet(k)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${onglet === k ? 'text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
              style={onglet === k ? { backgroundColor: VERT } : undefined}
            >
              {l}
            </button>
          ))}
        </div>

        {chargement ? (
          <div className="text-center text-gray-500 py-16">Chargement…</div>
        ) : onglet === 'planning' ? (
          <>
            <div className="flex gap-2 mb-4 text-sm">
              {([['tous', 'Tous'], ['collectif', 'Cours collectifs'], ['prive', 'Coaching privé']] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setFiltre(k)}
                  className={`px-3 py-1.5 rounded-full border ${filtre === k ? 'border-[#05835e] text-[#05835e] font-semibold bg-emerald-50' : 'border-gray-200 text-gray-600 bg-white'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {parJour.length === 0 ? (
              <div className="text-center text-gray-500 py-16 bg-white rounded-xl border border-gray-200">
                Aucun cours programmé pour le moment.
              </div>
            ) : (
              <div className="space-y-6">
                {parJour.map(([jour, liste]) => (
                  <section key={jour}>
                    <h2 className="text-sm font-bold text-gray-700 mb-2">{libelleJour(jour)}</h2>
                    <div className="space-y-2">
                      {liste.map((c) => (
                        <CarteCours key={c.id} cours={c} meta={meta} enCours={enCours}
                          onReserver={(x) => agir(x, 'reserver')} onAnnuler={(x) => agir(x, 'annuler')} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-bold text-gray-700 mb-2">À venir</h2>
              {aVenir.length === 0 ? (
                <div className="text-gray-500 text-sm bg-white rounded-xl border border-gray-200 p-4">Aucune réservation à venir.</div>
              ) : (
                <div className="space-y-2">
                  {aVenir.map((c) => (
                    <div key={c.id}>
                      <div className="text-xs text-gray-500 mb-1">{libelleJour(c.date)}</div>
                      <CarteCours cours={c} meta={meta} enCours={enCours}
                        onReserver={(x) => agir(x, 'reserver')} onAnnuler={(x) => agir(x, 'annuler')} />
                    </div>
                  ))}
                </div>
              )}
            </section>
            {historique.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-700 mb-2">Historique (30 derniers jours)</h2>
                <div className="space-y-2 opacity-80">
                  {historique.map((c) => (
                    <div key={c.id}>
                      <div className="text-xs text-gray-500 mb-1">{libelleJour(c.date)}</div>
                      <CarteCours cours={{ ...c, passe: true }} meta={meta} enCours={enCours}
                        onReserver={() => undefined} onAnnuler={() => undefined} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-8">
          Annulation possible jusqu'à {meta?.delai_annulation_h ?? 2} h avant le début du cours. Une séance de coaching privé annulée à temps est recréditée.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationPage;
