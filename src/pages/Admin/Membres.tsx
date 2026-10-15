import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi, caisseApiDownload } from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type Etat = 'actif' | 'expire_bientot' | 'expire' | 'aucun';
interface EtatAbonnement { etat: Etat; jours_restants: number | null; date_fin: string | null }

interface MembreResume {
  id: number;
  first_name: string;
  last_name: string;
  nom: string;
  email: string | null;
  email_brut: string | null;
  phone: string | null;
  compte: 'actif' | 'inactif';
  etat_abonnement: EtatAbonnement;
  qr_url: string | null;
}

interface Abonnement {
  id: number; titre: string; produit: string; acces: boolean;
  debut: string | null; fin: string | null; statut: string; en_cours: boolean;
  montant: number; paiement: string | null; cree_le: string | null;
}
interface Reservation { id: number; cours: string; type: string; date: string; statut: string }
interface Fiche extends MembreResume {
  address: string | null; cree_le: string | null;
  abonnements: Abonnement[]; reservations: Reservation[];
}

interface ListeReponse {
  data: MembreResume[];
  meta: { page: number; pages: number; total: number; par_page: number };
  compteurs: { total: number; actifs: number; expire_bientot: number; expires: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtXOF = (n: number) => new Intl.NumberFormat('fr-SN').format(n) + ' XOF';

function msgErreur(e: any): string {
  if (e?.errors) return Object.values(e.errors).flat().join(' ');
  return e?.message || 'Une erreur est survenue.';
}

/** Numéro au format international pour wa.me (Sénégal par défaut). */
function waNumber(phone?: string | null): string {
  let d = (phone ?? '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 9) d = '221' + d;
  return d;
}

function lienWhatsappQr(m: MembreResume): string {
  const lignes = [
    `Bonjour ${m.first_name} ! Voici votre QR code d'accès SUNUFITNESS :`,
    m.qr_url ?? '',
    'Présentez-le à l\'entrée de la salle.',
  ];
  if (m.etat_abonnement.date_fin) lignes.push(`Abonnement valable jusqu'au ${m.etat_abonnement.date_fin}.`);
  return `https://wa.me/${waNumber(m.phone)}?text=${encodeURIComponent(lignes.join('\n'))}`;
}

const BadgeEtat: React.FC<{ etat: EtatAbonnement }> = ({ etat }) => {
  const j = etat.jours_restants;
  const s: Record<Etat, { cls: string; label: string }> = {
    actif:          { cls: 'bg-green-100 text-green-700',   label: '✓ Actif' },
    expire_bientot: { cls: 'bg-orange-100 text-orange-700', label: `⚠ Expire bientôt${j !== null ? ` (${j} j)` : ''}` },
    expire:         { cls: 'bg-red-100 text-red-700',       label: '✕ Expiré' },
    aucun:          { cls: 'bg-gray-100 text-gray-500',     label: 'Sans abonnement' },
  };
  const st = s[etat.etat];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${st.cls}`}
      title={etat.date_fin ? `Fin : ${etat.date_fin}` : undefined}>
      {st.label}
    </span>
  );
};

const LIBELLE_RESA: Record<string, string> = { reserve: 'Réservé', annule: 'Annulé', present: 'Présent', absent: 'Absent' };

// ─── Fiche membre (panneau) ───────────────────────────────────────────────────

const FicheMembre: React.FC<{ id: number; onClose: () => void; onSaved: () => void }> = ({ id, onClose, onSaved }) => {
  const navigate = useNavigate();
  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [edition, setEdition] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', address: '', statut: 'actif' });
  const [enCours, setEnCours] = useState(false);

  const charger = useCallback(async () => {
    try {
      const res: any = await caisseApi.get(`/admin/membres/${id}`);
      const f: Fiche = res.data;
      setFiche(f);
      setForm({
        first_name: f.first_name ?? '', last_name: f.last_name ?? '',
        email: f.email_brut ?? '', phone: f.phone ?? '', address: f.address ?? '', statut: f.compte,
      });
    } catch (e: any) {
      setErreur(msgErreur(e));
    }
  }, [id]);

  useEffect(() => { charger(); }, [charger]);

  const enregistrer = async () => {
    setEnCours(true); setErreur(null); setMessage(null);
    try {
      await caisseApi.put(`/admin/membres/${id}`, {
        ...form,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
      });
      setMessage('✓ Membre mis à jour.');
      setEdition(false);
      await charger();
      onSaved();
    } catch (e: any) {
      setErreur(msgErreur(e));
    } finally {
      setEnCours(false);
    }
  };

  const envoyerQrEmail = async () => {
    setEnCours(true); setErreur(null); setMessage(null);
    try {
      const res: any = await caisseApi.post(`/admin/members/${id}/send-qr`);
      setMessage(res?.message ?? 'QR envoyé.');
    } catch (e: any) {
      setErreur(msgErreur(e));
    } finally {
      setEnCours(false);
    }
  };

  const champ = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black';

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-lg">{fiche?.nom ?? 'Membre'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>

        {!fiche ? (
          <p className="p-5 text-sm text-gray-400">{erreur ?? 'Chargement…'}</p>
        ) : (
          <div className="p-5 space-y-5">
            {message && <div className="text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-2">{message}</div>}
            {erreur && <div className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg p-2">{erreur}</div>}

            {/* État */}
            <div className="flex flex-wrap items-center gap-2">
              <BadgeEtat etat={fiche.etat_abonnement} />
              {fiche.etat_abonnement.date_fin && <span className="text-xs text-gray-500">jusqu'au {fiche.etat_abonnement.date_fin}</span>}
              <span className={`text-xs px-2 py-0.5 rounded-full ${fiche.compte === 'actif' ? 'bg-blue-50 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                Compte espace membre : {fiche.compte === 'actif' ? 'activé' : 'désactivé'}
              </span>
            </div>

            {/* Coordonnées */}
            <section className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">Coordonnées</h4>
                {!edition && <button onClick={() => setEdition(true)} className="text-xs px-2.5 py-1 border border-gray-300 rounded-lg hover:border-black">Modifier</button>}
              </div>
              {edition ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input className={champ} placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
                    <input className={champ} placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                  </div>
                  <input className={champ} placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input className={champ} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input className={champ} placeholder="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.statut === 'actif'} onChange={(e) => setForm({ ...form, statut: e.target.checked ? 'actif' : 'inactif' })} />
                    Compte espace membre activé <span className="text-xs text-gray-400">(décoché : le membre ne peut plus se connecter au site)</span>
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => { setEdition(false); charger(); }} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-semibold">Annuler</button>
                    <button onClick={enregistrer} disabled={enCours} className="flex-1 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50">Enregistrer</button>
                  </div>
                </div>
              ) : (
                <dl className="text-sm space-y-1">
                  <div className="flex justify-between"><dt className="text-gray-500">Téléphone</dt><dd>{fiche.phone || '—'}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd className="truncate ml-4">{fiche.email || '—'}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Adresse</dt><dd>{fiche.address || '—'}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Inscrit le</dt><dd>{fiche.cree_le || '—'}</dd></div>
                </dl>
              )}
            </section>

            {/* QR */}
            {fiche.qr_url && (
              <section className="space-y-2">
                <h4 className="font-semibold text-sm">QR d'accès</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={envoyerQrEmail} disabled={enCours || !fiche.email}
                    title={!fiche.email ? 'Pas d\'email enregistré' : undefined}
                    className="py-2.5 rounded-xl border border-gray-200 text-sm font-semibold disabled:opacity-40">✉️ Envoyer par email</button>
                  <a href={lienWhatsappQr(fiche)} target="_blank" rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold text-center">Envoyer sur WhatsApp</a>
                </div>
                <a href={fiche.qr_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 underline">Voir la page QR du membre</a>
              </section>
            )}

            {/* Abonnements */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">Historique des abonnements ({fiche.abonnements.length})</h4>
                <button onClick={() => navigate(`/admin/subscriptions?member_id=${fiche.id}`)} className="text-xs underline text-gray-500">Corriger</button>
              </div>
              {fiche.abonnements.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun abonnement.</p>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
                  {fiche.abonnements.map((a) => (
                    <div key={a.id} className="px-3 py-2 text-sm flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{a.titre}</p>
                        <p className="text-xs text-gray-400">{a.debut ?? '—'} → {a.fin ?? 'sans fin'} · {a.paiement ?? '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold">{fmtXOF(a.montant)}</p>
                        <p className={`text-[11px] ${a.en_cours ? 'text-green-700' : a.statut === 'canceled' ? 'text-red-600' : 'text-gray-400'}`}>
                          {a.en_cours ? 'en cours' : a.statut === 'canceled' ? 'annulé' : a.statut === 'expired' ? 'terminé' : a.statut}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Réservations */}
            {fiche.reservations.length > 0 && (
              <section>
                <h4 className="font-semibold text-sm mb-2">Dernières réservations de cours</h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
                  {fiche.reservations.map((r) => (
                    <div key={r.id} className="px-3 py-2 text-sm flex justify-between">
                      <span>{r.cours} <span className="text-xs text-gray-400">· {r.date}</span></span>
                      <span className="text-xs text-gray-500">{LIBELLE_RESA[r.statut] ?? r.statut}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTRES: { val: '' | Etat; label: string }[] = [
  { val: '', label: 'Tous' },
  { val: 'actif', label: 'Actifs' },
  { val: 'expire_bientot', label: 'Expire bientôt' },
  { val: 'expire', label: 'Expirés' },
  { val: 'aucun', label: 'Sans abonnement' },
];

const AdminMembres: React.FC = () => {
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState('');
  const [rechercheEnvoyee, setRechercheEnvoyee] = useState('');
  const [etat, setEtat] = useState<'' | Etat>('');
  const [page, setPage] = useState(1);
  const [liste, setListe] = useState<ListeReponse | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ficheId, setFicheId] = useState<number | null>(null);
  const [export_, setExport] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const params = useCallback((p?: number) => {
    const sp = new URLSearchParams();
    if (rechercheEnvoyee) sp.set('search', rechercheEnvoyee);
    if (etat) sp.set('etat', etat);
    if (p) sp.set('page', String(p));
    return sp.toString();
  }, [rechercheEnvoyee, etat]);

  const charger = useCallback(async () => {
    setChargement(true); setErreur(null);
    try {
      const res = await caisseApi.get<ListeReponse>(`/admin/membres?${params(page)}`);
      setListe(res);
    } catch (e: any) {
      setErreur(msgErreur(e));
    } finally {
      setChargement(false);
    }
  }, [params, page]);

  useEffect(() => { charger(); }, [charger]);

  const taper = (v: string) => {
    setRecherche(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { setPage(1); setRechercheEnvoyee(v.trim()); }, 400);
  };

  const exporter = async () => {
    setExport(true);
    try {
      await caisseApiDownload(`/admin/membres/export-pdf?${params()}`, `membres_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e: any) {
      setErreur(msgErreur(e));
    } finally {
      setExport(false);
    }
  };

  const c = liste?.compteurs;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</button>
          <span className="text-gray-600">|</span>
          <span className="font-semibold tracking-wide">Membres</span>
        </div>
        <button onClick={exporter} disabled={export_} className="bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/20 transition disabled:opacity-50">
          {export_ ? 'Export…' : '⬇ Export PDF'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {c && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['Membres', c.total, 'text-gray-900'],
              ['Abonnement actif', c.actifs, 'text-green-700'],
              ['Expire bientôt', c.expire_bientot, 'text-orange-600'],
              ['Expirés', c.expires, 'text-red-600'],
            ].map(([l, v, cls]) => (
              <div key={l as string} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-500">{l}</p>
                <p className={`text-2xl font-bold ${cls}`}>{v as number}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <input value={recherche} onChange={(e) => taper(e.target.value)}
            placeholder="Rechercher par nom, téléphone ou email…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
          <div className="flex flex-wrap gap-2">
            {FILTRES.map((f) => (
              <button key={f.val} onClick={() => { setEtat(f.val); setPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full border ${etat === f.val ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {erreur && <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-700">{erreur}</div>}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {chargement && !liste ? (
            <p className="p-8 text-center text-gray-400 text-sm">Chargement…</p>
          ) : !liste || liste.data.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm">Aucun membre trouvé.</p>
          ) : (
            <div className={`divide-y divide-gray-50 ${chargement ? 'opacity-50' : ''}`}>
              {liste.data.map((m) => (
                <button key={m.id} onClick={() => setFicheId(m.id)}
                  className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {m.nom}
                      {m.compte === 'inactif' && <span className="ml-2 text-[11px] text-gray-400">(compte désactivé)</span>}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{m.phone || '—'}{m.email ? ` · ${m.email}` : ''}</p>
                  </div>
                  <BadgeEtat etat={m.etat_abonnement} />
                  <span className="text-gray-300">›</span>
                </button>
              ))}
            </div>
          )}
          {liste && liste.meta.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 text-sm">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">← Préc.</button>
              <span className="text-gray-500">Page {liste.meta.page} / {liste.meta.pages} · {liste.meta.total} membre(s)</span>
              <button disabled={page >= liste.meta.pages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Suiv. →</button>
            </div>
          )}
        </div>
      </div>

      {ficheId !== null && <FicheMembre id={ficheId} onClose={() => setFicheId(null)} onSaved={charger} />}
    </div>
  );
};

export default AdminMembres;
