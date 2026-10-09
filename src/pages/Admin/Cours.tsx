import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi } from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type TypeCours = 'collectif' | 'prive';

interface Cours {
  id: number;
  type: TypeCours;
  titre: string;
  description: string | null;
  coach_user_id: number | null;
  coach: string | null;
  lieu: string | null;
  date: string;
  heure_debut: string;
  heure_fin: string;
  capacite: number;
  reserves: number;
  places_restantes: number;
  statut: 'planifie' | 'annule';
  serie: boolean;
}

interface Coach { id: number; nom: string }

interface Participant {
  id: number;
  statut: 'reserve' | 'annule' | 'present' | 'absent';
  membre: string;
  telephone: string | null;
  reserve_le: string | null;
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// ─── Helpers date ─────────────────────────────────────────────────────────────

function lundiDe(d: Date): Date {
  const dt = new Date(d);
  const j = dt.getDay();
  dt.setDate(dt.getDate() + (j === 0 ? -6 : 1 - j));
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function ajouterJours(d: Date, n: number): Date {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt;
}
function iso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function court(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
function msgErreur(e: any): string {
  if (e?.errors) return Object.values(e.errors).flat().join(' ');
  return e?.message || 'Une erreur est survenue.';
}

// ─── Modal création / modification ───────────────────────────────────────────

const ModalCours: React.FC<{
  cours: Cours | null;
  dateParDefaut: string;
  coachs: Coach[];
  onClose: () => void;
  onSaved: (msg: string) => void;
}> = ({ cours, dateParDefaut, coachs, onClose, onSaved }) => {
  const edition = !!cours;
  const [type, setType] = useState<TypeCours>(cours?.type ?? 'collectif');
  const [titre, setTitre] = useState(cours?.titre ?? '');
  const [coachId, setCoachId] = useState(cours?.coach_user_id ? String(cours.coach_user_id) : '');
  const [date, setDate] = useState(cours?.date ?? dateParDefaut);
  const [debut, setDebut] = useState(cours?.heure_debut ?? '18:00');
  const [fin, setFin] = useState(cours?.heure_fin ?? '19:00');
  const [capacite, setCapacite] = useState(String(cours?.capacite ?? 15));
  const [lieu, setLieu] = useState(cours?.lieu ?? '');
  const [description, setDescription] = useState(cours?.description ?? '');
  const [semaines, setSemaines] = useState('1');
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const enregistrer = async () => {
    setErreur(null);
    if (!titre.trim()) { setErreur('Le titre est obligatoire.'); return; }
    setEnregistrement(true);
    const payload: Record<string, any> = {
      titre: titre.trim(),
      coach_user_id: coachId ? Number(coachId) : null,
      date,
      heure_debut: debut,
      heure_fin: fin,
      lieu: lieu.trim() || null,
      description: description.trim() || null,
    };
    if (type === 'collectif') payload.capacite = Number(capacite);
    try {
      let res: any;
      if (edition) {
        res = await caisseApi.put(`/admin/cours/${cours!.id}`, payload);
      } else {
        res = await caisseApi.post('/admin/cours', { ...payload, type, repeter_semaines: Number(semaines) });
      }
      onSaved(res?.message ?? 'Enregistré.');
    } catch (e: any) {
      setErreur(msgErreur(e));
    } finally {
      setEnregistrement(false);
    }
  };

  const champ = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-4">{edition ? 'Modifier le cours' : 'Nouveau cours'}</h3>

        {!edition && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {(['collectif', 'prive'] as const).map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`py-2 rounded-lg text-sm font-semibold border ${type === t ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700'}`}>
                {t === 'collectif' ? 'Cours collectif' : 'Coaching privé'}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Titre</label>
            <input className={champ} value={titre} onChange={(e) => setTitre(e.target.value)}
              placeholder={type === 'collectif' ? 'Ex. HIIT, Zumba, Cardio boxe' : 'Ex. Coaching privé'} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Coach</label>
            <select className={champ} value={coachId} onChange={(e) => setCoachId(e.target.value)}>
              <option value="">— À confirmer —</option>
              {coachs.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600">Date</label>
              <input type="date" className={champ} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Début</label>
              <input type="time" className={champ} value={debut} onChange={(e) => setDebut(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Fin</label>
              <input type="time" className={champ} value={fin} onChange={(e) => setFin(e.target.value)} />
            </div>
          </div>
          {type === 'collectif' ? (
            <div>
              <label className="text-xs font-semibold text-gray-600">Nombre de places</label>
              <input type="number" min={1} max={200} className={champ} value={capacite} onChange={(e) => setCapacite(e.target.value)} />
            </div>
          ) : (
            <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg p-2">
              Coaching privé : 1 place. Réservable uniquement par un membre ayant une séance ou un pack Personal Training non utilisé.
            </p>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-600">Lieu (optionnel)</label>
            <input className={champ} value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Ex. Salle cardio, Piscine" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Description (optionnel)</label>
            <textarea className={champ} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {!edition && (
            <div>
              <label className="text-xs font-semibold text-gray-600">Répéter chaque semaine</label>
              <select className={champ} value={semaines} onChange={(e) => setSemaines(e.target.value)}>
                <option value="1">Non, une seule fois</option>
                {[2, 4, 6, 8, 12].map((n) => <option key={n} value={n}>Oui, pendant {n} semaines</option>)}
              </select>
            </div>
          )}
        </div>

        {erreur && <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">{erreur}</div>}

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold">Fermer</button>
          <button onClick={enregistrer} disabled={enregistrement}
            className="flex-1 py-2.5 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50">
            {enregistrement ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal participants ───────────────────────────────────────────────────────

const ModalParticipants: React.FC<{ cours: Cours; onClose: () => void }> = ({ cours, onClose }) => {
  const [liste, setListe] = useState<Participant[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    try {
      const res: any = await caisseApi.get(`/admin/cours/${cours.id}/participants`);
      setListe(res.data);
    } catch (e: any) {
      setErreur(msgErreur(e));
    } finally {
      setChargement(false);
    }
  }, [cours.id]);

  useEffect(() => { charger(); }, [charger]);

  const marquer = async (p: Participant, statut: 'present' | 'absent' | 'reserve') => {
    try {
      await caisseApi.put(`/admin/reservations-cours/${p.id}`, { statut });
      setListe((l) => l.map((x) => (x.id === p.id ? { ...x, statut } : x)));
    } catch (e: any) {
      setErreur(msgErreur(e));
    }
  };

  const actifs = liste.filter((p) => p.statut !== 'annule');
  const annules = liste.filter((p) => p.statut === 'annule');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">{cours.titre}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {cours.date.split('-').reverse().join('/')} · {cours.heure_debut} – {cours.heure_fin} · {actifs.length}/{cours.capacite} inscrit(s)
        </p>

        {chargement ? (
          <p className="text-sm text-gray-400">Chargement…</p>
        ) : actifs.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun inscrit pour le moment.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {actifs.map((p) => (
              <div key={p.id} className="py-2.5 flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{p.membre}</p>
                  <p className="text-xs text-gray-400">{p.telephone ?? '—'} · réservé le {p.reserve_le}</p>
                </div>
                <button onClick={() => marquer(p, p.statut === 'present' ? 'reserve' : 'present')}
                  className={`text-xs px-2 py-1 rounded-md border ${p.statut === 'present' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200'}`}>
                  Présent
                </button>
                <button onClick={() => marquer(p, p.statut === 'absent' ? 'reserve' : 'absent')}
                  className={`text-xs px-2 py-1 rounded-md border ${p.statut === 'absent' ? 'bg-red-600 text-white border-red-600' : 'border-gray-200'}`}>
                  Absent
                </button>
              </div>
            ))}
          </div>
        )}

        {annules.length > 0 && (
          <p className="text-xs text-gray-400 mt-3">Annulé(s) : {annules.map((p) => p.membre).join(', ')}</p>
        )}
        {erreur && <div className="mt-3 text-sm text-red-700">{erreur}</div>}

        <button onClick={onClose} className="w-full mt-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold">Fermer</button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminCours: React.FC = () => {
  const navigate = useNavigate();
  const [lundi, setLundi] = useState<Date>(lundiDe(new Date()));
  const [cours, setCours] = useState<Cours[]>([]);
  const [coachs, setCoachs] = useState<Coach[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [creerLe, setCreerLe] = useState<string | null>(null);
  const [aModifier, setAModifier] = useState<Cours | null>(null);
  const [participantsDe, setParticipantsDe] = useState<Cours | null>(null);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const res: any = await caisseApi.get(`/admin/cours?semaine=${iso(lundi)}`);
      setCours(res.data);
      setCoachs(res.coachs ?? []);
    } catch (e: any) {
      setErreur(msgErreur(e));
    } finally {
      setChargement(false);
    }
  }, [lundi]);

  useEffect(() => { charger(); }, [charger]);

  const annuler = async (c: Cours) => {
    let serie = false;
    if (c.serie) {
      serie = window.confirm(
        `« ${c.titre} » se répète chaque semaine.\n\nOK = annuler cette séance ET toutes les suivantes\nAnnuler = choisir de n'annuler que cette séance`,
      );
    }
    const qui = c.reserves > 0 ? `\n${c.reserves} membre(s) inscrit(s) seront prévenus par email.` : '';
    if (!window.confirm(`Confirmer l'annulation de ${serie ? 'cette série' : 'ce cours'} ?${qui}`)) return;
    try {
      const res: any = await caisseApi.del(`/admin/cours/${c.id}${serie ? '?serie=1' : ''}`);
      setMessage(res?.message ?? 'Cours annulé.');
      charger();
    } catch (e: any) {
      setErreur(msgErreur(e));
    }
  };

  const duJour = (i: number) => cours.filter((c) => c.date === iso(ajouterJours(lundi, i)));
  const maintenant = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</button>
          <span className="text-gray-600">|</span>
          <span className="font-semibold tracking-wide">Cours & réservations</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <button onClick={() => setLundi(ajouterJours(lundi, -7))}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:border-black transition font-medium">← Semaine préc.</button>
          <span className="text-sm font-semibold text-gray-900">Semaine du {court(lundi)} au {court(ajouterJours(lundi, 6))}</span>
          <button onClick={() => setLundi(ajouterJours(lundi, 7))}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:border-black transition font-medium">Semaine suiv. →</button>
        </div>

        {message && <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-sm text-emerald-800">{message}</div>}
        {erreur && <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-700">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : (
          <div className="space-y-4">
            {JOURS.map((j, i) => {
              const jour = ajouterJours(lundi, i);
              const liste = duJour(i);
              const passe = ajouterJours(jour, 1) <= maintenant;
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{j}</span>
                      <span className="text-xs text-gray-400 ml-2">{court(jour)}</span>
                    </div>
                    {!passe && (
                      <button onClick={() => { setMessage(null); setCreerLe(iso(jour)); }}
                        className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:border-black hover:text-black transition font-medium">
                        + Cours
                      </button>
                    )}
                  </div>
                  {liste.length === 0 ? (
                    <div className="px-5 py-4 text-xs text-gray-400">Aucun cours.</div>
                  ) : liste.map((c) => (
                    <div key={c.id} className={`flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 ${c.statut === 'annule' ? 'opacity-50' : ''}`}>
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.type === 'prive' ? 'bg-amber-500' : 'bg-emerald-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {c.titre}
                          {c.type === 'prive' && <span className="text-xs text-amber-700"> · coaching privé</span>}
                          {c.statut === 'annule' && <span className="text-xs text-red-600"> · annulé</span>}
                          {c.serie && <span className="text-xs text-gray-400"> · ↻ hebdo</span>}
                        </p>
                        <p className="text-xs text-gray-400">
                          {c.heure_debut} → {c.heure_fin} · {c.coach ?? 'coach à confirmer'}{c.lieu ? ` · ${c.lieu}` : ''}
                        </p>
                      </div>
                      <button onClick={() => setParticipantsDe(c)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold ${c.reserves >= c.capacite ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {c.reserves}/{c.capacite}
                      </button>
                      {c.statut === 'planifie' && (
                        <>
                          <button onClick={() => { setMessage(null); setAModifier(c); }}
                            className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:border-black transition font-medium">Modifier</button>
                          <button onClick={() => annuler(c)}
                            className="text-xs px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium">Annuler</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(creerLe || aModifier) && (
        <ModalCours
          cours={aModifier}
          dateParDefaut={creerLe ?? iso(new Date())}
          coachs={coachs}
          onClose={() => { setCreerLe(null); setAModifier(null); }}
          onSaved={(msg) => { setCreerLe(null); setAModifier(null); setMessage(msg); charger(); }}
        />
      )}
      {participantsDe && <ModalParticipants cours={participantsDe} onClose={() => { setParticipantsDe(null); charger(); }} />}
    </div>
  );
};

export default AdminCours;
