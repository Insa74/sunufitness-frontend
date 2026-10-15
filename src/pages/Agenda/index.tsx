import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi } from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type TypeRdv = 'personal_training' | 'nutrition' | 'entretien';

interface Personne { id: number; nom: string; prenom: string; role: string; couleur: string }
interface Creneau { user_id: number; date: string; debut: string; fin: string; label: string | null }
interface CoursOcc { id: number; type: string; titre: string; user_id: number; date: string; debut: string; fin: string }
interface Rdv {
  id: number;
  type: TypeRdv;
  type_libelle: string;
  titre: string | null;
  date: string;
  heure_debut: string;
  heure_fin: string;
  participants: { id: number; nom: string }[];
  member_id: number | null;
  client: string | null;
  client_nom: string | null;
  client_telephone: string | null;
  client_email: string | null;
  lieu: string | null;
  notes: string | null;
  organisateur: string | null;
  organisateur_id: number | null;
}
interface Semaine {
  week_start: string;
  moi: number;
  types: Record<TypeRdv, string>;
  equipe: Personne[];
  creneaux: Creneau[];
  rendez_vous: Rdv[];
  cours: CoursOcc[];
}
interface MembreTrouve { id: number; nom: string; email: string | null; phone: string | null }

const TYPES: { id: TypeRdv; label: string; couleur: string }[] = [
  { id: 'personal_training', label: 'Personal training', couleur: '#F97316' },
  { id: 'nutrition', label: 'Coaching nutrition', couleur: '#22C55E' },
  { id: 'entretien', label: 'Entretien', couleur: '#6366F1' },
];
const couleurType = (t: string) => TYPES.find((x) => x.id === t)?.couleur ?? '#6B7280';

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const H_DEBUT = 6;   // 06:00
const H_FIN = 22;    // 22:00 (fermeture)
const PX_HEURE = 52;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
const enMin = (h: string) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
const enHeure = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
function msgErreur(e: any): string {
  if (e?.errors) return Object.values(e.errors).flat().join(' ');
  return e?.message || 'Une erreur est survenue.';
}
function lienWhatsApp(tel: string, texte: string): string {
  let num = tel.replace(/[^\d]/g, '');
  if (num.length === 9) num = '221' + num;
  return `https://wa.me/${num}?text=${encodeURIComponent(texte)}`;
}

type Intervalle = [number, number];

/** Intervalles libres d'une personne un jour donné : planning moins occupations. */
function libresDe(uid: number, date: string, s: Semaine): Intervalle[] {
  let libres: Intervalle[] = s.creneaux
    .filter((c) => c.user_id === uid && c.date === date)
    .map((c) => [enMin(c.debut), enMin(c.fin)] as Intervalle)
    .sort((a, b) => a[0] - b[0]);
  const occupes: Intervalle[] = [
    ...s.rendez_vous.filter((r) => r.date === date && r.participants.some((p) => p.id === uid))
      .map((r) => [enMin(r.heure_debut), enMin(r.heure_fin)] as Intervalle),
    ...s.cours.filter((c) => c.date === date && c.user_id === uid)
      .map((c) => [enMin(c.debut), enMin(c.fin)] as Intervalle),
  ];
  for (const [od, of] of occupes) {
    libres = libres.flatMap(([d, f]): Intervalle[] => {
      if (of <= d || od >= f) return [[d, f]];
      const res: Intervalle[] = [];
      if (od > d) res.push([d, od]);
      if (of < f) res.push([of, f]);
      return res;
    });
  }
  return libres;
}
function intersection(a: Intervalle[], b: Intervalle[]): Intervalle[] {
  const res: Intervalle[] = [];
  for (const [ad, af] of a) for (const [bd, bf] of b) {
    const d = Math.max(ad, bd), f = Math.min(af, bf);
    if (f > d) res.push([d, f]);
  }
  return res.sort((x, y) => x[0] - y[0]);
}

// ─── Modal rendez-vous ────────────────────────────────────────────────────────

interface Prefill { date: string; debut: string; fin: string; participants: number[] }

const ModalRdv: React.FC<{
  rdv: Rdv | null;
  prefill: Prefill;
  equipe: Personne[];
  moi: number;
  onClose: () => void;
  onSaved: (msg: string) => void;
}> = ({ rdv, prefill, equipe, moi, onClose, onSaved }) => {
  const edition = !!rdv;
  const [type, setType] = useState<TypeRdv>(rdv?.type ?? 'personal_training');
  const [titre, setTitre] = useState(rdv?.titre ?? '');
  const [date, setDate] = useState(rdv?.date ?? prefill.date);
  const [debut, setDebut] = useState(rdv?.heure_debut ?? prefill.debut);
  const [fin, setFin] = useState(rdv?.heure_fin ?? prefill.fin);
  const [participants, setParticipants] = useState<number[]>(rdv ? rdv.participants.map((p) => p.id) : prefill.participants);
  const [modeClient, setModeClient] = useState<'aucun' | 'membre' | 'libre'>(
    rdv?.member_id ? 'membre' : rdv?.client_nom ? 'libre' : 'aucun',
  );
  const [membre, setMembre] = useState<MembreTrouve | null>(
    rdv?.member_id ? { id: rdv.member_id, nom: rdv.client ?? '', email: rdv.client_email, phone: rdv.client_telephone } : null,
  );
  const [recherche, setRecherche] = useState('');
  const [resultats, setResultats] = useState<MembreTrouve[]>([]);
  const [clientNom, setClientNom] = useState(rdv?.client_nom ?? '');
  const [clientTel, setClientTel] = useState(rdv?.member_id ? '' : rdv?.client_telephone ?? '');
  const [clientEmail, setClientEmail] = useState(rdv?.member_id ? '' : rdv?.client_email ?? '');
  const [lieu, setLieu] = useState(rdv?.lieu ?? '');
  const [notes, setNotes] = useState(rdv?.notes ?? '');
  const [prevenirClient, setPrevenirClient] = useState(true);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [avertissement, setAvertissement] = useState<string | null>(null);
  const [confirmAnnul, setConfirmAnnul] = useState(false);

  useEffect(() => {
    if (modeClient !== 'membre' || recherche.trim().length < 2) { setResultats([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await caisseApi.get<{ data: MembreTrouve[] }>(`/caisse/membres/search?q=${encodeURIComponent(recherche.trim())}`);
        setResultats(res.data ?? []);
      } catch { setResultats([]); }
    }, 400);
    return () => clearTimeout(t);
  }, [recherche, modeClient]);

  const duree = (min: number) => setFin(enHeure(Math.min(enMin(debut) + min, 24 * 60 - 1)));
  const basculer = (id: number) =>
    setParticipants((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const enregistrer = async (forcer = false) => {
    setErreur(null);
    if (participants.length === 0) { setErreur('Choisis au moins une personne de l\'équipe.'); return; }
    if (modeClient === 'membre' && !membre) { setErreur('Choisis le membre (ou passe en « Autre personne »).'); return; }
    if (modeClient === 'libre' && !clientNom.trim()) { setErreur('Indique le nom de la personne.'); return; }
    setEnCours(true);
    const payload: Record<string, any> = {
      type,
      titre: titre.trim() || null,
      date,
      heure_debut: debut,
      heure_fin: fin,
      participants,
      member_id: modeClient === 'membre' ? membre?.id : null,
      client_nom: modeClient === 'libre' ? clientNom.trim() : null,
      client_telephone: modeClient === 'libre' ? clientTel.trim() || null : null,
      client_email: modeClient === 'libre' ? clientEmail.trim() || null : null,
      lieu: lieu.trim() || null,
      notes: notes.trim() || null,
      prevenir_client: prevenirClient,
      forcer,
    };
    try {
      const res: any = edition
        ? await caisseApi.put(`/agenda/rendez-vous/${rdv!.id}`, payload)
        : await caisseApi.post('/agenda/rendez-vous', payload);
      onSaved(res?.message ?? 'Enregistré.');
    } catch (e: any) {
      if (e?.code === 'hors_planning') setAvertissement(e.message);
      else setErreur(msgErreur(e));
    } finally {
      setEnCours(false);
    }
  };

  const annuler = async () => {
    setEnCours(true);
    setErreur(null);
    try {
      const res: any = await caisseApi.del(`/agenda/rendez-vous/${rdv!.id}`);
      onSaved(res?.message ?? 'Rendez-vous annulé.');
    } catch (e: any) {
      setErreur(msgErreur(e));
      setEnCours(false);
    }
  };

  const telClient = modeClient === 'membre' ? membre?.phone : clientTel;
  const nomClient = modeClient === 'membre' ? membre?.nom : clientNom;
  const champ = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black';
  const labelType = TYPES.find((t) => t.id === type)?.label ?? '';
  const dateLisible = new Date(date + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-4">{edition ? 'Rendez-vous' : 'Nouveau rendez-vous'}</h3>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {TYPES.map((t) => (
            <button key={t.id} onClick={() => setType(t.id)}
              className="py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold border"
              style={type === t.id ? { background: t.couleur, borderColor: t.couleur, color: '#fff' } : { borderColor: '#E5E7EB', color: '#374151' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Avec qui dans l'équipe ?</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {equipe.map((p) => {
                const actif = participants.includes(p.id);
                return (
                  <button key={p.id} onClick={() => basculer(p.id)}
                    className="px-3 py-1.5 rounded-full text-sm border font-medium"
                    style={actif ? { background: p.couleur, borderColor: p.couleur, color: '#fff' } : { borderColor: '#E5E7EB', color: '#374151' }}>
                    {p.prenom}{p.id === moi ? ' (moi)' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600">Date</label>
              <input type="date" className={champ} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Début</label>
              <input type="time" step={900} className={champ} value={debut} onChange={(e) => setDebut(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Fin</label>
              <input type="time" step={900} className={champ} value={fin} onChange={(e) => setFin(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            {[30, 45, 60, 90].map((m) => (
              <button key={m} onClick={() => duree(m)} className="text-xs px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
                {m < 60 ? `${m} min` : m === 60 ? '1 h' : '1 h 30'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Client / personne reçue</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {([['aucun', 'Personne'], ['membre', 'Un membre'], ['libre', 'Autre personne']] as const).map(([m, l]) => (
                <button key={m} onClick={() => setModeClient(m)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border ${modeClient === m ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700'}`}>
                  {l}
                </button>
              ))}
            </div>
            {modeClient === 'membre' && (
              <div className="mt-2">
                {membre ? (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <span><strong>{membre.nom}</strong>{membre.phone ? ` · ${membre.phone}` : ''}</span>
                    <button className="text-xs text-gray-500 underline" onClick={() => { setMembre(null); setRecherche(''); }}>Changer</button>
                  </div>
                ) : (
                  <>
                    <input className={champ} placeholder="Nom, téléphone ou email (2 lettres min.)" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
                    {resultats.length > 0 && (
                      <div className="border border-gray-100 rounded-lg mt-1 divide-y max-h-40 overflow-y-auto">
                        {resultats.map((m) => (
                          <button key={m.id} onClick={() => { setMembre(m); setResultats([]); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                            {m.nom} <span className="text-gray-400">{m.phone ?? ''}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {modeClient === 'libre' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <input className={champ} placeholder="Nom" value={clientNom} onChange={(e) => setClientNom(e.target.value)} />
                <input className={champ} placeholder="Téléphone" value={clientTel} onChange={(e) => setClientTel(e.target.value)} />
                <input className={champ} placeholder="Email (facultatif)" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-600">Titre (facultatif)</label>
              <input className={champ} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex. Bilan de départ, Entretien coach" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Lieu (facultatif)</label>
              <input className={champ} value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Ex. Bureau, Salle 2" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Notes internes</label>
            <textarea className={champ} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {modeClient !== 'aucun' && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={prevenirClient} onChange={(e) => setPrevenirClient(e.target.checked)} />
              Prévenir le client par email (s'il a une adresse)
            </label>
          )}
        </div>

        {avertissement && (
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
            <p>⚠️ {avertissement}</p>
            <div className="flex gap-2 mt-2">
              <button disabled={enCours} onClick={() => { setAvertissement(null); enregistrer(true); }}
                className="px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs font-semibold">Fixer quand même</button>
              <button onClick={() => setAvertissement(null)} className="px-3 py-1.5 rounded-md border border-amber-300 text-xs">Changer l'horaire</button>
            </div>
          </div>
        )}
        {erreur && <p className="mt-4 text-sm text-red-600">{erreur}</p>}

        <div className="flex flex-wrap gap-2 mt-5">
          <button disabled={enCours} onClick={() => enregistrer(false)}
            className="flex-1 bg-black text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50">
            {enCours ? '…' : edition ? 'Enregistrer' : 'Fixer le rendez-vous'}
          </button>
          <button onClick={onClose} className="px-4 rounded-lg border border-gray-200 text-sm">Fermer</button>
        </div>

        {telClient && nomClient && (
          <a href={lienWhatsApp(telClient, `Bonjour ${nomClient.split(' ')[0]}, c'est SUNUFITNESS. Votre rendez-vous (${labelType}) est prévu le ${dateLisible} de ${debut} à ${fin}. À bientôt !`)}
            target="_blank" rel="noreferrer"
            className="mt-3 block text-center rounded-lg border border-green-500 text-green-700 py-2 text-sm font-semibold">
            Envoyer la confirmation sur WhatsApp
          </a>
        )}

        {edition && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {rdv?.organisateur && <p className="text-xs text-gray-400 mb-2">Fixé par {rdv.organisateur}</p>}
            {!confirmAnnul ? (
              <button onClick={() => setConfirmAnnul(true)} className="text-sm text-red-600 font-semibold">Annuler ce rendez-vous</button>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span>Annuler et prévenir les personnes concernées ?</span>
                <button disabled={enCours} onClick={annuler} className="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-semibold">Oui, annuler</button>
                <button onClick={() => setConfirmAnnul(false)} className="px-3 py-1 rounded-md border text-xs">Non</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Trouver un créneau ───────────────────────────────────────────────────────

const TrouverCreneau: React.FC<{
  semaine: Semaine;
  jours: Date[];
  onChoisir: (p: Prefill) => void;
  onClose: () => void;
}> = ({ semaine, jours, onChoisir, onClose }) => {
  const [qui, setQui] = useState<number[]>([semaine.moi].filter((id) => semaine.equipe.some((p) => p.id === id)));
  const [duree, setDuree] = useState(60);

  const propositions = useMemo(() => {
    if (qui.length === 0) return [];
    const maintenant = new Date();
    const aujourdHui = iso(maintenant);
    const minNow = maintenant.getHours() * 60 + maintenant.getMinutes();
    return jours.map((j) => {
      const date = iso(j);
      if (date < aujourdHui) return { date, j, creneaux: [] as Intervalle[] };
      let communs = libresDe(qui[0], date, semaine);
      for (const uid of qui.slice(1)) communs = intersection(communs, libresDe(uid, date, semaine));
      if (date === aujourdHui) communs = communs.map(([d, f]) => [Math.max(d, Math.ceil(minNow / 15) * 15), f] as Intervalle);
      return { date, j, creneaux: communs.filter(([d, f]) => f - d >= duree) };
    });
  }, [qui, duree, semaine, jours]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-1">Trouver un créneau</h3>
        <p className="text-sm text-gray-500 mb-4">Choisis les personnes : on te montre quand elles sont toutes libres cette semaine (au planning et sans rendez-vous ni cours).</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {semaine.equipe.map((p) => {
            const actif = qui.includes(p.id);
            return (
              <button key={p.id} onClick={() => setQui((q) => (actif ? q.filter((x) => x !== p.id) : [...q, p.id]))}
                className="px-3 py-1.5 rounded-full text-sm border font-medium"
                style={actif ? { background: p.couleur, borderColor: p.couleur, color: '#fff' } : { borderColor: '#E5E7EB', color: '#374151' }}>
                {p.prenom}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-gray-600">Durée :</span>
          {[30, 45, 60, 90].map((m) => (
            <button key={m} onClick={() => setDuree(m)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${duree === m ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>
              {m < 60 ? `${m} min` : m === 60 ? '1 h' : '1 h 30'}
            </button>
          ))}
        </div>

        {qui.length === 0 ? (
          <p className="text-sm text-gray-400">Choisis au moins une personne.</p>
        ) : (
          <div className="space-y-3">
            {propositions.map(({ date, j, creneaux }) => (
              <div key={date}>
                <p className="text-xs font-bold text-gray-500 uppercase">
                  {j.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
                {creneaux.length === 0 ? (
                  <p className="text-sm text-gray-300">Aucun créneau commun</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {creneaux.map(([d, f]) => (
                      <button key={d}
                        onClick={() => onChoisir({ date, debut: enHeure(d), fin: enHeure(d + duree), participants: qui })}
                        className="px-3 py-1.5 rounded-lg border border-green-300 bg-green-50 text-green-800 text-sm hover:bg-green-100">
                        {enHeure(d)} – {enHeure(f)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="mt-5 w-full rounded-lg border border-gray-200 py-2 text-sm">Fermer</button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AgendaPage: React.FC = () => {
  const navigate = useNavigate();
  const [lundi, setLundi] = useState<Date>(() => lundiDe(new Date()));
  const [jourIdx, setJourIdx] = useState<number>(() => { const j = new Date().getDay(); return j === 0 ? 6 : j - 1; });
  const [semaine, setSemaine] = useState<Semaine | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [masques, setMasques] = useState<number[]>([]);
  const [modal, setModal] = useState<{ rdv: Rdv | null; prefill: Prefill } | null>(null);
  const [chercheur, setChercheur] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const jours = useMemo(() => Array.from({ length: 7 }, (_, i) => ajouterJours(lundi, i)), [lundi]);
  const dateJour = iso(jours[jourIdx]);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const res = await caisseApi.get<Semaine>(`/agenda?week=${iso(lundi)}`);
      setSemaine(res);
    } catch (e: any) {
      setErreur(e?.message === 'Unauthenticated.' ? 'Session expirée : reconnecte-toi avec ton PIN sur /caisse.' : msgErreur(e));
    } finally {
      setChargement(false);
    }
  }, [lundi]);

  useEffect(() => { charger(); }, [charger]);
  useEffect(() => {
    const fin = () => navigate('/caisse');
    window.addEventListener('caisse:session-expired', fin);
    return () => window.removeEventListener('caisse:session-expired', fin);
  }, [navigate]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); } }, [toast]);

  const visibles = (semaine?.equipe ?? []).filter((p) => !masques.includes(p.id));
  const rdvJour = (semaine?.rendez_vous ?? []).filter((r) => r.date === dateJour);
  const mesRdv = (semaine?.rendez_vous ?? []).filter((r) => r.participants.some((p) => p.id === semaine?.moi));

  const ouvrirNouveau = (p?: Partial<Prefill>) => setModal({
    rdv: null,
    prefill: {
      date: p?.date ?? dateJour,
      debut: p?.debut ?? '10:00',
      fin: p?.fin ?? '11:00',
      participants: p?.participants ?? (semaine ? [semaine.moi].filter((id) => semaine.equipe.some((x) => x.id === id)) : []),
    },
  });

  const clicColonne = (uid: number, e: React.MouseEvent<HTMLDivElement>) => {
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
    const min = H_DEBUT * 60 + Math.floor((y / PX_HEURE) * 60 / 30) * 30;
    ouvrirNouveau({ date: dateJour, debut: enHeure(min), fin: enHeure(Math.min(min + 60, H_FIN * 60)), participants: [uid] });
  };

  const bloc = (debut: string, fin: string) => {
    const d = Math.max(enMin(debut), H_DEBUT * 60);
    const f = Math.min(enMin(fin), H_FIN * 60);
    return { top: ((d - H_DEBUT * 60) / 60) * PX_HEURE, height: Math.max(((f - d) / 60) * PX_HEURE, 18) };
  };

  const heures = Array.from({ length: H_FIN - H_DEBUT + 1 }, (_, i) => H_DEBUT + i);
  const finSemaine = ajouterJours(lundi, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/admin')} className="text-sm text-gray-300 hover:text-white">← Hub</button>
        <h1 className="font-bold">Agenda de l'équipe</h1>
        <span className="w-12" />
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setLundi(ajouterJours(lundi, -7))} className="px-3 py-1.5 rounded-lg bg-white border text-sm">‹</button>
            <span className="text-sm font-semibold">
              {lundi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} – {finSemaine.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button onClick={() => setLundi(ajouterJours(lundi, 7))} className="px-3 py-1.5 rounded-lg bg-white border text-sm">›</button>
            <button onClick={() => { setLundi(lundiDe(new Date())); const j = new Date().getDay(); setJourIdx(j === 0 ? 6 : j - 1); }}
              className="px-3 py-1.5 rounded-lg bg-white border text-sm">Aujourd'hui</button>
          </div>
          <div className="flex gap-2">
            <button disabled={!semaine} onClick={() => setChercheur(true)} className="px-3 py-2 rounded-lg bg-white border text-sm font-semibold">🔎 Trouver un créneau</button>
            <button disabled={!semaine} onClick={() => ouvrirNouveau()} className="px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold">+ Rendez-vous</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {jours.map((j, i) => {
            const nb = (semaine?.rendez_vous ?? []).filter((r) => r.date === iso(j)).length;
            return (
              <button key={i} onClick={() => setJourIdx(i)}
                className={`rounded-lg py-2 text-center text-xs sm:text-sm ${i === jourIdx ? 'bg-black text-white' : 'bg-white border text-gray-700'}`}>
                <div className="font-semibold">{JOURS[i]}</div>
                <div>{j.getDate()}</div>
                {nb > 0 && <div className={`text-[10px] ${i === jourIdx ? 'text-gray-300' : 'text-gray-400'}`}>{nb} rdv</div>}
              </button>
            );
          })}
        </div>

        {semaine && (
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className="text-gray-500">Afficher :</span>
            {semaine.equipe.map((p) => {
              const masque = masques.includes(p.id);
              return (
                <button key={p.id} onClick={() => setMasques((m) => (masque ? m.filter((x) => x !== p.id) : [...m, p.id]))}
                  className={`px-2.5 py-1 rounded-full border ${masque ? 'opacity-40' : ''}`}
                  style={{ borderColor: p.couleur, color: p.couleur }}>
                  {p.prenom}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300" /> Disponible (au planning)</span>
          {TYPES.map((t) => <span key={t.id} className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: t.couleur }} /> {t.label}</span>)}
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-700" /> Cours</span>
        </div>

        {erreur && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{erreur}</div>}
        {chargement && !semaine && <p className="text-sm text-gray-500">Chargement…</p>}

        {semaine && (
          <div className="bg-white rounded-2xl border overflow-x-auto">
            <div className="flex" style={{ minWidth: 56 + visibles.length * 120 }}>
              {/* Heures */}
              <div className="w-14 shrink-0 border-r">
                <div className="h-10 border-b" />
                <div className="relative" style={{ height: (H_FIN - H_DEBUT) * PX_HEURE }}>
                  {heures.map((h) => (
                    <div key={h} className="absolute right-1 text-[10px] text-gray-400 -translate-y-1/2" style={{ top: (h - H_DEBUT) * PX_HEURE }}>
                      {String(h).padStart(2, '0')}:00
                    </div>
                  ))}
                </div>
              </div>

              {visibles.map((p) => (
                <div key={p.id} className="flex-1 min-w-[120px] border-r last:border-r-0">
                  <div className="h-10 border-b flex items-center justify-center gap-1.5 text-sm font-semibold sticky top-0 bg-white">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.couleur }} />
                    {p.prenom}
                  </div>
                  <div className="relative cursor-pointer" style={{ height: (H_FIN - H_DEBUT) * PX_HEURE }} onClick={(e) => clicColonne(p.id, e)}>
                    {heures.map((h) => (
                      <div key={h} className="absolute left-0 right-0 border-t border-gray-100" style={{ top: (h - H_DEBUT) * PX_HEURE }} />
                    ))}
                    {semaine.creneaux.filter((c) => c.user_id === p.id && c.date === dateJour).map((c, i) => (
                      <div key={i} className="absolute left-0 right-0 bg-green-50 border-y border-green-200" style={bloc(c.debut, c.fin)}>
                        {c.label && <span className="text-[10px] text-green-700 px-1">{c.label}</span>}
                      </div>
                    ))}
                    {semaine.cours.filter((c) => c.user_id === p.id && c.date === dateJour).map((c) => (
                      <div key={`c${c.id}`} onClick={(e) => e.stopPropagation()}
                        className="absolute left-1 right-1 rounded-md bg-gray-700 text-white text-[11px] px-1.5 py-0.5 overflow-hidden" style={bloc(c.debut, c.fin)}>
                        <div className="font-semibold truncate">{c.titre}</div>
                        <div>{c.debut}–{c.fin}</div>
                      </div>
                    ))}
                    {rdvJour.filter((r) => r.participants.some((x) => x.id === p.id)).map((r) => (
                      <div key={`r${r.id}`}
                        onClick={(e) => { e.stopPropagation(); setModal({ rdv: r, prefill: { date: r.date, debut: r.heure_debut, fin: r.heure_fin, participants: [] } }); }}
                        className="absolute left-1 right-1 rounded-md text-white text-[11px] px-1.5 py-0.5 overflow-hidden shadow-sm hover:brightness-110"
                        style={{ ...bloc(r.heure_debut, r.heure_fin), background: couleurType(r.type) }}>
                        <div className="font-semibold truncate">{r.client ?? r.titre ?? r.type_libelle}</div>
                        <div className="truncate">{r.heure_debut}–{r.heure_fin} · {r.type_libelle}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {semaine && <p className="text-xs text-gray-400">Astuce : touche une zone vide dans la colonne d'une personne pour lui fixer un rendez-vous à cette heure.</p>}

        {semaine && (
          <section className="bg-white rounded-2xl border p-4">
            <h2 className="font-bold mb-3">Mes rendez-vous cette semaine</h2>
            {mesRdv.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun rendez-vous.</p>
            ) : (
              <ul className="divide-y">
                {mesRdv.map((r) => (
                  <li key={r.id}>
                    <button className="w-full text-left py-2 flex items-center gap-3"
                      onClick={() => setModal({ rdv: r, prefill: { date: r.date, debut: r.heure_debut, fin: r.heure_fin, participants: [] } })}>
                      <span className="w-2 h-8 rounded" style={{ background: couleurType(r.type) }} />
                      <span className="flex-1 text-sm">
                        <strong>{new Date(r.date + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })} · {r.heure_debut}–{r.heure_fin}</strong>
                        <span className="block text-gray-500">{r.type_libelle}{r.client ? ` avec ${r.client}` : ''}{r.participants.length > 1 ? ` · équipe : ${r.participants.map((x) => x.nom).join(', ')}` : ''}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      {modal && semaine && (
        <ModalRdv rdv={modal.rdv} prefill={modal.prefill} equipe={semaine.equipe} moi={semaine.moi}
          onClose={() => setModal(null)}
          onSaved={(msg) => { setModal(null); setToast(msg); charger(); }} />
      )}
      {chercheur && semaine && (
        <TrouverCreneau semaine={semaine} jours={jours}
          onClose={() => setChercheur(false)}
          onChoisir={(p) => { setChercheur(false); ouvrirNouveau(p); }} />
      )}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">{toast}</div>
      )}
    </div>
  );
};

export default AgendaPage;
