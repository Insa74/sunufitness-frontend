import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi, isCaisseAdmin } from '../../services/caisseApiClient';

// Coachs externes qui louent l'espace : l'accueil gère la liste de leurs clients,
// l'admin enregistre le coach, son contrat du mois (séances payées) et ses créneaux fixes.

interface Contrat {
  id: number; valable_du: string; valable_jusqu_au: string;
  seances_payees: number; seances_utilisees: number; montant_loyer: number | null;
}
interface Creneau { id?: number; jour_semaine: number; heure_debut: string; heure_fin: string; libelle?: string }
interface Client { id: number; nom: string; phone: string | null; qr_url: string | null }
interface CoachExterne {
  id: number; nom: string; phone: string | null; qr_url: string | null;
  contrat: Contrat | null; contrats_a_venir: Contrat[]; creneaux: Creneau[]; clients: Client[];
}
interface MembreResult { id: number; nom: string; phone: string; email: string }
interface LigneRapport {
  coach: { id: number; nom: string };
  seances_payees: number; seances_utilisees: number; montant_loyer: number;
  entrees_clients: number; refus_clients: number; nombre_clients: number;
}

const JOURS = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// Montants : espace insécable entre les milliers et avant la devise (ex. 100 000 F)
const fmtF = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' F';
const fmtDate = (iso: string) => iso.split('-').reverse().join('/');
const moisCourant = () => new Date().toISOString().slice(0, 7);
const bornesMois = (mois: string) => {
  const [a, m] = mois.split('-').map(Number);
  const dernier = new Date(a, m, 0).getDate();
  return { du: `${mois}-01`, au: `${mois}-${String(dernier).padStart(2, '0')}` };
};
// Numéro WhatsApp : chiffres seuls ; un numéro sénégalais à 9 chiffres reçoit l'indicatif 221
const waNumero = (phone: string | null) => {
  const chiffres = (phone ?? '').replace(/\D/g, '').replace(/^00/, '');
  return chiffres.length === 9 ? `221${chiffres}` : chiffres;
};
const lienWhatsAppQr = (c: { nom: string; phone: string | null; qr_url: string | null }) =>
  `https://wa.me/${waNumero(c.phone)}?text=${encodeURIComponent(`Bonjour ${c.nom}, voici votre QR d'accès SUNUFITNESS à présenter à l'accueil : ${c.qr_url ?? ''}`)}`;

const messageErreur = (e: unknown) => (e as { message?: string })?.message ?? 'Une erreur est survenue.';

// ─── Recherche d'un membre existant (même recherche que la Caisse) ─────────────
const RechercheMembre: React.FC<{ placeholder: string; onChoisir: (m: MembreResult) => void }> = ({ placeholder, onChoisir }) => {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<MembreResult[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chercher = (v: string) => {
    setQ(v);
    if (timer.current) clearTimeout(timer.current);
    if (v.trim().length < 2) { setRes([]); return; }
    timer.current = setTimeout(async () => {
      try {
        const r = await caisseApi.get<{ data: MembreResult[] }>(`/caisse/membres/search?q=${encodeURIComponent(v.trim())}`);
        setRes(r.data ?? []);
      } catch { setRes([]); }
    }, 350);
  };

  return (
    <div className="space-y-1">
      <input value={q} onChange={e => chercher(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
      {res.map(m => (
        <button key={m.id} onClick={() => { onChoisir(m); setQ(''); setRes([]); }}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-100">
          <span className="text-sm font-medium">{m.nom}</span>
          <span className="text-xs text-gray-400 ml-2">{m.phone || m.email}</span>
        </button>
      ))}
    </div>
  );
};

// ─── Éditeur des créneaux fixes (admin) ───────────────────────────────────────
const EditeurCreneaux: React.FC<{ initial: Creneau[]; onEnregistrer: (c: Creneau[]) => Promise<void>; onAnnuler: () => void }> = ({ initial, onEnregistrer, onAnnuler }) => {
  const [lignes, setLignes] = useState<Creneau[]>(initial.length ? initial.map(c => ({ ...c })) : [{ jour_semaine: 2, heure_debut: '18:00', heure_fin: '19:00' }]);
  const [envoi, setEnvoi] = useState(false);
  const maj = (i: number, champ: keyof Creneau, v: string) =>
    setLignes(ls => ls.map((l, k) => k === i ? { ...l, [champ]: champ === 'jour_semaine' ? Number(v) : v } : l));

  return (
    <div className="space-y-2">
      {lignes.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <select value={l.jour_semaine} onChange={e => maj(i, 'jour_semaine', e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-2 text-sm flex-1">
            {JOURS.slice(1).map((j, k) => <option key={j} value={k + 1}>{j}</option>)}
          </select>
          <input type="time" value={l.heure_debut} onChange={e => maj(i, 'heure_debut', e.target.value)} className="border border-gray-200 rounded-lg px-2 py-2 text-sm" />
          <span className="text-gray-400">–</span>
          <input type="time" value={l.heure_fin} onChange={e => maj(i, 'heure_fin', e.target.value)} className="border border-gray-200 rounded-lg px-2 py-2 text-sm" />
          <button onClick={() => setLignes(ls => ls.filter((_, k) => k !== i))} aria-label="Supprimer le créneau" className="text-gray-400 hover:text-red-600 px-1">✕</button>
        </div>
      ))}
      <button onClick={() => setLignes(ls => [...ls, { jour_semaine: 4, heure_debut: '18:00', heure_fin: '19:00' }])}
        className="text-xs text-emerald-700 font-medium">+ Ajouter un créneau</button>
      <div className="flex gap-2 pt-1">
        <button onClick={onAnnuler} className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600">Annuler</button>
        <button disabled={envoi} onClick={async () => { setEnvoi(true); try { await onEnregistrer(lignes); } finally { setEnvoi(false); } }}
          className="flex-1 bg-black text-white rounded-xl py-2 text-sm font-semibold disabled:opacity-40">Enregistrer</button>
      </div>
    </div>
  );
};

// ─── Formulaire de contrat mensuel (admin) ────────────────────────────────────
const FormContrat: React.FC<{ onEnregistrer: (v: { valable_du: string; valable_jusqu_au: string; nombre_seances: number; montant_loyer: number | null }) => Promise<void>; onAnnuler: () => void }> = ({ onEnregistrer, onAnnuler }) => {
  const [mois, setMois] = useState(moisCourant());
  const [seances, setSeances] = useState('8');
  const [loyer, setLoyer] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const { du, au } = bornesMois(mois);

  return (
    <div className="space-y-2">
      <label className="block text-xs text-gray-500">Mois
        <input type="month" value={mois} onChange={e => setMois(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm" />
      </label>
      <p className="text-xs text-gray-500">Du {fmtDate(du)} au {fmtDate(au)}</p>
      <div className="flex gap-2">
        <label className="block text-xs text-gray-500 flex-1">Séances payées
          <input type="number" min={1} value={seances} onChange={e => setSeances(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm" />
        </label>
        <label className="block text-xs text-gray-500 flex-1">Loyer (F, facultatif)
          <input type="number" min={0} value={loyer} onChange={e => setLoyer(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm" />
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onAnnuler} className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600">Annuler</button>
        <button disabled={envoi || !(Number(seances) > 0)}
          onClick={async () => {
            setEnvoi(true);
            try { await onEnregistrer({ valable_du: du, valable_jusqu_au: au, nombre_seances: Number(seances), montant_loyer: loyer === '' ? null : Number(loyer) }); }
            finally { setEnvoi(false); }
          }}
          className="flex-1 bg-black text-white rounded-xl py-2 text-sm font-semibold disabled:opacity-40">Enregistrer le contrat</button>
      </div>
    </div>
  );
};

// ─── Carte d'un coach externe ─────────────────────────────────────────────────
const CarteCoach: React.FC<{ coach: CoachExterne; admin: boolean; onMaj: (c: CoachExterne) => void; onRetire: () => void; onErreur: (m: string) => void }> = ({ coach, admin, onMaj, onRetire, onErreur }) => {
  const [mode, setMode] = useState<'' | 'contrat' | 'creneaux' | 'client'>('');
  const appel = async (fn: () => Promise<{ data: CoachExterne }>) => {
    try { const r = await fn(); onMaj(r.data); setMode(''); } catch (e) { onErreur(messageErreur(e)); }
  };
  const c = coach.contrat;
  const depasse = !!c && c.seances_utilisees > c.seances_payees;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{coach.nom}</p>
          {coach.phone && <p className="text-xs text-gray-400">{coach.phone}</p>}
        </div>
        {coach.qr_url && coach.phone && (
          <a href={lienWhatsAppQr(coach)} target="_blank" rel="noreferrer" className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg">QR WhatsApp</a>
        )}
      </div>

      {/* Contrat du mois */}
      <div>
        <p className="text-xs text-gray-400 uppercase mb-1">Contrat en cours</p>
        {c ? (
          <div className={`rounded-xl px-3 py-2 text-sm ${depasse ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>
            <p className="font-semibold">Séances : {c.seances_utilisees} / {c.seances_payees}{depasse && ' — forfait dépassé'}</p>
            <p className="text-xs">Du {fmtDate(c.valable_du)} au {fmtDate(c.valable_jusqu_au)}{c.montant_loyer != null && ` · Loyer ${fmtF(c.montant_loyer)}`}</p>
          </div>
        ) : (
          <p className="rounded-xl px-3 py-2 text-sm bg-red-50 text-red-700">Aucun contrat en cours : le coach et ses clients sont refusés au scan.</p>
        )}
        {coach.contrats_a_venir.map(a => (
          <p key={a.id} className="text-xs text-gray-500 mt-1">
            À venir : {a.seances_payees} séances du {fmtDate(a.valable_du)} au {fmtDate(a.valable_jusqu_au)}
            {admin && <button className="ml-2 text-red-600" onClick={() => { if (window.confirm('Annuler ce contrat à venir ?')) appel(() => caisseApi.del(`/admin/coachs-externes/contrats/${a.id}`)); }}>Annuler</button>}
          </p>
        ))}
        {admin && c && (
          <button className="text-xs text-red-600 mt-1" onClick={() => { if (window.confirm('Annuler ce contrat ? Le coach et ses clients seront refusés au scan.')) appel(() => caisseApi.del(`/admin/coachs-externes/contrats/${c.id}`)); }}>
            Annuler ce contrat
          </button>
        )}
        {admin && (mode === 'contrat'
          ? <div className="mt-2"><FormContrat onAnnuler={() => setMode('')} onEnregistrer={v => appel(() => caisseApi.post(`/admin/coachs-externes/${coach.id}/contrats`, v))} /></div>
          : <button onClick={() => setMode('contrat')} className="block text-xs text-emerald-700 font-medium mt-2">+ Nouveau contrat mensuel</button>)}
      </div>

      {/* Créneaux fixes */}
      <div>
        <p className="text-xs text-gray-400 uppercase mb-1">Créneaux (accès 15 min avant le début)</p>
        {mode === 'creneaux' ? (
          <EditeurCreneaux initial={coach.creneaux} onAnnuler={() => setMode('')}
            onEnregistrer={l => appel(() => caisseApi.put(`/admin/coachs-externes/${coach.id}/creneaux`, {
              creneaux: l.map(({ jour_semaine, heure_debut, heure_fin }) => ({ jour_semaine, heure_debut, heure_fin })),
            }))} />
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {coach.creneaux.length
                ? coach.creneaux.map(cr => <span key={cr.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{cr.libelle}</span>)
                : <span className="text-xs text-red-600">Aucun créneau : tout scan est refusé.</span>}
            </div>
            {admin && <button onClick={() => setMode('creneaux')} className="text-xs text-emerald-700 font-medium mt-2">Modifier les créneaux</button>}
          </>
        )}
      </div>

      {/* Clients */}
      <div>
        <p className="text-xs text-gray-400 uppercase mb-1">Clients ({coach.clients.length})</p>
        <div className="space-y-1">
          {coach.clients.map(cl => (
            <div key={cl.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <div>
                <p className="text-sm font-medium">{cl.nom}</p>
                {cl.phone && <p className="text-xs text-gray-400">{cl.phone}</p>}
              </div>
              <div className="flex items-center gap-2">
                {cl.qr_url && cl.phone && (
                  <a href={lienWhatsAppQr(cl)} target="_blank" rel="noreferrer" className="text-xs text-green-700 font-medium">QR WhatsApp</a>
                )}
                <button className="text-xs text-red-600" onClick={() => { if (window.confirm(`Retirer ${cl.nom} des clients de ${coach.nom} ?`)) appel(() => caisseApi.del(`/coachs-externes/${coach.id}/clients/${cl.id}`)); }}>Retirer</button>
              </div>
            </div>
          ))}
        </div>
        {mode === 'client' ? (
          <div className="mt-2 space-y-1">
            <RechercheMembre placeholder="Nom ou téléphone du client…" onChoisir={m => appel(() => caisseApi.post(`/coachs-externes/${coach.id}/clients`, { member_id: m.id }))} />
            <p className="text-xs text-gray-500">Le client doit avoir une fiche. Sinon, créez-la d'abord dans la Caisse avec « + Nouveau membre ».</p>
            <button onClick={() => setMode('')} className="text-xs text-gray-500 underline">Fermer</button>
          </div>
        ) : (
          <button onClick={() => setMode('client')} className="text-xs text-emerald-700 font-medium mt-2">+ Ajouter un client</button>
        )}
      </div>

      {admin && (
        <button className="text-xs text-gray-400 hover:text-red-600"
          onClick={() => { if (window.confirm(`${coach.nom} ne sera plus coach externe et ses clients seront détachés. Continuer ?`)) onRetire(); }}>
          Retirer ce coach externe
        </button>
      )}
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────
const CoachsExternesPage: React.FC = () => {
  const navigate = useNavigate();
  const admin = isCaisseAdmin();
  const [coachs, setCoachs] = useState<CoachExterne[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [declarer, setDeclarer] = useState(false);
  const [mois, setMois] = useState(moisCourant());
  const [rapport, setRapport] = useState<LigneRapport[] | null>(null);

  const charger = useCallback(async () => {
    try {
      const r = await caisseApi.get<{ data: CoachExterne[] }>('/coachs-externes');
      setCoachs(r.data ?? []);
    } catch (e) { setErreur(messageErreur(e)); setCoachs([]); }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  useEffect(() => {
    if (!admin) return;
    caisseApi.get<{ data: LigneRapport[] }>(`/admin/coachs-externes/rapport?mois=${mois}`)
      .then(r => setRapport(r.data ?? []))
      .catch(() => setRapport([]));
  }, [admin, mois, coachs]);

  const majCoach = (c: CoachExterne) => setCoachs(cs => (cs ?? []).map(x => x.id === c.id ? c : x));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">Coachs externes</p>
          <p className="text-xs text-gray-400">Location de l'espace · contrôle au scan</p>
        </div>
        <button onClick={() => navigate('/caisse')} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg">← Caisse</button>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-4">
        {erreur && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex justify-between">
            <span>{erreur}</span><button onClick={() => setErreur(null)}>✕</button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-xs text-gray-600 space-y-1">
          <p>• <strong>Client externe</strong> : accès seulement pendant un créneau de son coach (15 min avant le début jusqu'à la fin), si le contrat du coach est en cours. Refus sinon (sauf s'il a son propre pack de cours en cours).</p>
          <p>• <strong>Coach externe</strong> : même règle ; chaque jour d'entrée compte une séance de son forfait.</p>
        </div>

        {admin && (declarer ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
            <p className="text-sm font-semibold">Déclarer un coach externe</p>
            <RechercheMembre placeholder="Nom ou téléphone du coach…" onChoisir={async m => {
              try { await caisseApi.post('/admin/coachs-externes', { member_id: m.id }); setDeclarer(false); charger(); }
              catch (e) { setErreur(messageErreur(e)); }
            }} />
            <p className="text-xs text-gray-500">Le coach doit avoir une fiche. Sinon, créez-la d'abord dans la Caisse avec « + Nouveau membre ».</p>
            <button onClick={() => setDeclarer(false)} className="text-xs text-gray-500 underline">Fermer</button>
          </div>
        ) : (
          <button onClick={() => setDeclarer(true)} className="w-full bg-black text-white rounded-xl py-3 text-sm font-semibold">+ Déclarer un coach externe</button>
        ))}

        {coachs === null && <p className="text-center text-sm text-gray-500 py-8">Chargement…</p>}
        {coachs?.length === 0 && <p className="text-center text-sm text-gray-500 py-8">Aucun coach externe pour le moment.</p>}
        {coachs?.map(c => (
          <CarteCoach key={c.id} coach={c} admin={admin} onMaj={majCoach} onErreur={setErreur}
            onRetire={async () => {
              try { await caisseApi.del(`/admin/coachs-externes/${c.id}`); charger(); }
              catch (e) { setErreur(messageErreur(e)); }
            }} />
        ))}

        {admin && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Rapport du mois</p>
              <input type="month" value={mois} onChange={e => setMois(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-sm" />
            </div>
            {rapport?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 text-left">
                      <th className="py-1 pr-2">Coach</th><th className="py-1 pr-2">Séances</th>
                      <th className="py-1 pr-2">Entrées clients</th><th className="py-1 pr-2">Refus</th><th className="py-1">Loyer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rapport.map(l => (
                      <tr key={l.coach.id} className="border-t border-gray-100">
                        <td className="py-1.5 pr-2 font-medium">{l.coach.nom}</td>
                        <td className={`py-1.5 pr-2 ${l.seances_utilisees > l.seances_payees ? 'text-amber-700 font-semibold' : ''}`}>{l.seances_utilisees} / {l.seances_payees}</td>
                        <td className="py-1.5 pr-2">{l.entrees_clients}</td>
                        <td className="py-1.5 pr-2">{l.refus_clients}</td>
                        <td className="py-1.5">{l.montant_loyer ? fmtF(l.montant_loyer) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-xs text-gray-500">Aucune donnée pour ce mois.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachsExternesPage;
