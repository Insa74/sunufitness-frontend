import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCaisseToken } from '../../services/caisseApiClient';
import { DISTANCES, FORMULES, libelleDistance, libelleFormule, marathonUrl } from '../../config/marathon';

// Inscrits à la Prépa Marathon (admin). Les routes sont sur le backend admin (marathonUrl),
// appelées avec le token PIN de la caisse.

interface Inscription {
  id: number;
  prenom: string;
  nom: string;
  telephone: string;
  email: string | null;
  distance: string;
  formule: string;
  inscription_officielle_confirmee: boolean;
  notes: string | null;
  created_at: string;
}

class ErreurApi extends Error {
  constructor(message: string, public status: number) { super(message); }
}

// Pas caisseApi : son 401 efface la session caisse. Ici un refus du backend admin ne doit
// pas déconnecter des autres modules, on affiche juste un message.
async function marathonAdmin(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getCaisseToken();
  const res = await fetch(marathonUrl(path), {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = res.status === 401 || res.status === 403
      ? 'Accès refusé par le serveur : reconnecte-toi avec ton PIN sur /caisse (compte admin).'
      : data?.errors ? Object.values(data.errors).flat().join(' ') : (data?.message || 'Une erreur est survenue.');
    throw new ErreurApi(message, res.status);
  }
  return res;
}

// Accepte un tableau direct, { data: [...] } ou un paginateur Laravel { data: { data: [...] } }.
function extraireListe(json: any): Inscription[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.data)) return json.data.data;
  return [];
}

function waNumber(phone: string): string {
  let d = phone.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 9) d = '221' + d;
  return d;
}

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const champ = 'border border-gray-200 rounded-lg px-3 py-2 text-base sm:text-sm bg-white focus:outline-none focus:border-black';

// ─── Case « inscription officielle » + notes (partagés tableau / cartes) ─────

const CaseOfficielle: React.FC<{ i: Inscription; onChange: (v: boolean) => void }> = ({ i, onChange }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
    <input type="checkbox" checked={i.inscription_officielle_confirmee} onChange={(e) => onChange(e.target.checked)}
      className="h-5 w-5 accent-emerald-600" />
    <span className={`text-sm ${i.inscription_officielle_confirmee ? 'text-emerald-700 font-semibold' : 'text-gray-600'}`}>
      {i.inscription_officielle_confirmee ? 'Confirmée' : 'Non confirmée'}
    </span>
  </label>
);

const ChampNotes: React.FC<{ i: Inscription; onSave: (notes: string) => Promise<boolean> }> = ({ i, onSave }) => {
  const [valeur, setValeur] = useState(i.notes ?? '');
  const [etat, setEtat] = useState<'' | 'envoi' | 'ok'>('');

  useEffect(() => { setValeur(i.notes ?? ''); }, [i.notes]);
  useEffect(() => { if (etat === 'ok') { const t = setTimeout(() => setEtat(''), 2000); return () => clearTimeout(t); } }, [etat]);

  const enregistrer = async () => {
    if (valeur === (i.notes ?? '')) return;
    setEtat('envoi');
    setEtat((await onSave(valeur)) ? 'ok' : '');
  };

  return (
    <div className="relative">
      <textarea value={valeur} onChange={(e) => setValeur(e.target.value)} onBlur={enregistrer} rows={2} maxLength={1000}
        placeholder="Notes…" className={`${champ} w-full min-w-[180px] resize-y`} />
      {etat && <span className="absolute bottom-2 right-2 text-[11px] text-gray-500">{etat === 'envoi' ? 'Enregistrement…' : '✓ Enregistré'}</span>}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminMarathon: React.FC = () => {
  const navigate = useNavigate();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [distance, setDistance] = useState('');
  const [formule, setFormule] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [export_, setExport] = useState(false);

  const filtres = () => {
    const p = new URLSearchParams();
    if (distance) p.set('distance', distance);
    if (formule) p.set('formule', formule);
    const q = p.toString();
    return q ? `?${q}` : '';
  };

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const res = await marathonAdmin(`/admin/marathon/inscriptions${filtres()}`);
      setInscriptions(extraireListe(await res.json()));
      setErreur(null);
    } catch (e: any) {
      setErreur(e?.message || 'Impossible de charger les inscrits.');
    } finally {
      setChargement(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, formule]);

  useEffect(() => { charger(); }, [charger]);

  const modifier = async (id: number, champs: Partial<Pick<Inscription, 'inscription_officielle_confirmee' | 'notes'>>): Promise<boolean> => {
    const avant = inscriptions;
    setInscriptions((l) => l.map((i) => (i.id === id ? { ...i, ...champs } : i)));
    try {
      await marathonAdmin(`/admin/marathon/inscriptions/${id}`, { method: 'PATCH', body: JSON.stringify(champs) });
      return true;
    } catch (e: any) {
      setInscriptions(avant);
      setErreur(e?.message || 'Modification impossible.');
      return false;
    }
  };

  const exporterCsv = async () => {
    setExport(true);
    try {
      const res = await marathonAdmin(`/admin/marathon/inscriptions/export-csv${filtres()}`, { headers: { Accept: 'text/csv' } });
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url;
      a.download = `inscrits-marathon-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setErreur(e?.message || 'Export impossible.');
    } finally {
      setExport(false);
    }
  };

  const confirmees = inscriptions.filter((i) => i.inscription_officielle_confirmee).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/admin')} className="text-sm text-gray-300 hover:text-white">← Hub</button>
        <h1 className="font-bold">Inscrits marathon</h1>
        <a href="/prepa-marathon" target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">Voir ↗</a>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Totaux */}
        <section className="bg-white rounded-2xl border p-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{distance || formule ? 'Inscrits (filtrés)' : 'Total inscrits'}</p>
            <p className="text-3xl font-bold text-gray-900">{inscriptions.length}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Inscription officielle</p>
            <p className="text-3xl font-bold text-emerald-700">{confirmees}<span className="text-base text-gray-400"> / {inscriptions.length}</span></p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DISTANCES.map((d) => (
              <span key={d.value} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                {d.label} : <strong>{inscriptions.filter((i) => i.distance === d.value).length}</strong>
              </span>
            ))}
          </div>
        </section>

        {/* Filtres + export */}
        <section className="flex flex-col sm:flex-row gap-2">
          <select value={distance} onChange={(e) => setDistance(e.target.value)} className={`${champ} sm:w-48`} aria-label="Filtrer par distance">
            <option value="">Toutes les distances</option>
            {DISTANCES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <select value={formule} onChange={(e) => setFormule(e.target.value)} className={`${champ} sm:w-56`} aria-label="Filtrer par formule">
            <option value="">Toutes les formules</option>
            {FORMULES.map((f) => <option key={f.value} value={f.value}>{f.titre}</option>)}
          </select>
          <button onClick={exporterCsv} disabled={export_}
            className="sm:ml-auto px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50">
            {export_ ? 'Export…' : '⬇ Exporter CSV'}
          </button>
        </section>

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm flex items-start justify-between gap-3">
            <span>{erreur}</span>
            <button onClick={() => setErreur(null)} className="text-red-400" aria-label="Fermer">✕</button>
          </div>
        )}

        {chargement && inscriptions.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Chargement…</p>
        ) : inscriptions.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Aucun inscrit{distance || formule ? ' pour ces filtres' : ' pour le moment'}.</p>
        ) : (
          <>
            {/* Ordinateur : tableau */}
            <div className="hidden md:block bg-white rounded-2xl border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Téléphone</th>
                    <th className="px-4 py-3">Distance</th>
                    <th className="px-4 py-3">Formule</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Inscription officielle</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {inscriptions.map((i) => (
                    <tr key={i.id} className="align-top">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{i.prenom} {i.nom}</span>
                        {i.email && <span className="block text-xs text-gray-500">{i.email}</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a href={`https://wa.me/${waNumber(i.telephone)}`} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">{i.telephone}</a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold">{libelleDistance(i.distance)}</td>
                      <td className="px-4 py-3">{libelleFormule(i.formule)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{fmtDate(i.created_at)}</td>
                      <td className="px-4 py-3"><CaseOfficielle i={i} onChange={(v) => modifier(i.id, { inscription_officielle_confirmee: v })} /></td>
                      <td className="px-4 py-3 w-64"><ChampNotes i={i} onSave={(notes) => modifier(i.id, { notes: notes.trim() || null })} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile : cartes */}
            <ul className="md:hidden space-y-3">
              {inscriptions.map((i) => (
                <li key={i.id} className="bg-white rounded-2xl border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{i.prenom} {i.nom}</p>
                      <a href={`https://wa.me/${waNumber(i.telephone)}`} target="_blank" rel="noreferrer" className="text-sm text-emerald-700">{i.telephone}</a>
                      {i.email && <p className="text-xs text-gray-500 truncate">{i.email}</p>}
                    </div>
                    <span className="text-lg font-bold text-gray-900 whitespace-nowrap">{libelleDistance(i.distance)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{libelleFormule(i.formule)} · inscrit le {fmtDate(i.created_at)}</p>
                  <CaseOfficielle i={i} onChange={(v) => modifier(i.id, { inscription_officielle_confirmee: v })} />
                  <ChampNotes i={i} onSave={(notes) => modifier(i.id, { notes: notes.trim() || null })} />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminMarathon;
