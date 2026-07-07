import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi, getCaisseUser } from '../../services/caisseApiClient';

interface MembresData  { total_membres: number; membres_actifs: number; membres_inactifs: number; }
interface AbonnesData  { abonnes_actifs: number; abonnes_inactifs: number; nouveaux_aujourdhui: number; nouveaux_semaine: number; nouveaux_mois: number; actifs_aujourdhui: number; actifs_semaine: number; actifs_mois: number; }
interface ProduitItem  { product_slug: string; nom: string; type: 'duree' | 'seance'; nombre: number; total: number; }
interface RevenusData  { revenu_jour: number; revenu_semaine: number; revenu_mois: number; revenu_mois_precedent: number; evolution_pct: number | null; revenu_abonnements_seul: number; revenu_seances_seul: number; revenu_par_produit: ProduitItem[]; }
interface ObjectifItem { id: number; periode: string; type: string; description: string | null; valeur_cible: number; valeur_actuelle: number; progression_pct: number; jours_restants: number; atteint: boolean; }

const fmt    = (n: number) => new Intl.NumberFormat('fr-SN').format(n);
const fmtXOF = (n: number) => fmt(n) + ' XOF';

const StatCard: React.FC<{ label: string; value: string; sub?: string; icon: string; color: string; small?: boolean }> = ({ label, value, sub, icon, color, small }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${color}`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className={`font-bold text-gray-900 mt-0.5 truncate ${small ? 'text-lg' : 'text-2xl'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-8">
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</h2>
    {children}
  </div>
);

const ProgressBar: React.FC<{ pct: number; atteint: boolean }> = ({ pct, atteint }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
    <div className={`h-2 rounded-full transition-all ${atteint ? 'bg-green-500' : 'bg-black'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
  </div>
);

const Evo: React.FC<{ pct: number | null; prev: number }> = ({ pct, prev }) => {
  if (pct === null) return <span className="text-xs text-gray-400">Mois préc. : {fmtXOF(prev)}</span>;
  const pos = pct >= 0;
  return (
    <span className={`text-xs font-semibold ${pos ? 'text-green-600' : 'text-red-500'}`}>
      {pos ? '▲' : '▼'} {Math.abs(pct)}% vs mois préc. ({fmtXOF(prev)})
    </span>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getCaisseUser();

  const [membres,   setMembres]   = useState<MembresData | null>(null);
  const [abonnes,   setAbonnes]   = useState<AbonnesData | null>(null);
  const [revenus,   setRevenus]   = useState<RevenusData | null>(null);
  const [objectifs, setObjectifs] = useState<ObjectifItem[]>([]);
  const [periode,   setPeriode]   = useState('');
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [tab,       setTab]       = useState<'tous' | 'duree' | 'seance'>('tous');

  useEffect(() => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) { navigate('/caisse'); return; }
    Promise.all([
      caisseApi.get<any>('/dashboard/membres'),
      caisseApi.get<any>('/dashboard/abonnes'),
      caisseApi.get<any>('/dashboard/revenus'),
      caisseApi.get<any>('/dashboard/objectifs'),
    ]).then(([m, a, r, o]) => {
      setMembres(m.data);
      setAbonnes(a.data);
      setRevenus(r.data);
      setObjectifs(o.data ?? []);
      setPeriode(r.periode ?? '');
    }).catch(() => setError('Impossible de charger les données.')).finally(() => setLoading(false));
  }, []);

  const periodLabel = periode ? new Date(periode + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';

  const produitsFiltres = revenus?.revenu_par_produit.filter(p => tab === 'tous' || p.type === tab) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm transition-colors">← Retour</button>
          <span className="text-gray-600">|</span>
          <span className="font-semibold tracking-wide">SUNUFITNESS — Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/subscriptions')} className="bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/20 transition">
            📋 Abonnements
          </button>
          <button onClick={() => navigate('/caisse')} className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
            🏪 Caisse
          </button>
          <span className="text-xs text-gray-400 capitalize">{periodLabel}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
        <p className="text-gray-400 text-sm mb-8">Statistiques en temps réel — calculées depuis la base de données</p>

        {loading && <div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" /></div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 text-sm">{error}</div>}

        {!loading && !error && membres && abonnes && revenus && (
          <>
            {/* REVENUS */}
            <Section title="Revenus fitness">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Aujourd'hui"   value={fmtXOF(revenus.revenu_jour)}    icon="💵" color="bg-green-50" />
                <StatCard label="Cette semaine" value={fmtXOF(revenus.revenu_semaine)} icon="📅" color="bg-green-50" />
                <StatCard
                  label={`Ce mois — ${periodLabel}`}
                  value={fmtXOF(revenus.revenu_mois)}
                  icon="💰" color="bg-green-100"
                  sub={revenus.evolution_pct !== null ? `${revenus.evolution_pct > 0 ? '+' : ''}${revenus.evolution_pct}% vs mois préc. (${fmtXOF(revenus.revenu_mois_precedent)})` : `Mois préc. : ${fmtXOF(revenus.revenu_mois_precedent)}`}
                />
              </div>

              {/* Split abonnements vs séances */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Abonnements (accès salle)</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{fmtXOF(revenus.revenu_abonnements_seul)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">10 produits avec durée</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: revenus.revenu_mois > 0 ? `${(revenus.revenu_abonnements_seul / revenus.revenu_mois) * 100}%` : '0%' }} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Séances (aquagym, natation…)</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{fmtXOF(revenus.revenu_seances_seul)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">4 produits à la séance</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div className="h-1.5 rounded-full bg-purple-500" style={{ width: revenus.revenu_mois > 0 ? `${(revenus.revenu_seances_seul / revenus.revenu_mois) * 100}%` : '0%' }} />
                  </div>
                </div>
              </div>

              {/* Détail par produit */}
              <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Détail par produit — {periodLabel}</p>
                  <div className="flex gap-1">
                    {(['tous', 'duree', 'seance'] as const).map(t => (
                      <button key={t} onClick={() => setTab(t)}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${tab === t ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {t === 'tous' ? 'Tous' : t === 'duree' ? 'Abonnements' : 'Séances'}
                      </button>
                    ))}
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-50">
                      <th className="text-left pb-2 font-medium">Produit</th>
                      <th className="text-center pb-2 font-medium">Type</th>
                      <th className="text-right pb-2 font-medium">Qté</th>
                      <th className="text-right pb-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {produitsFiltres.map(p => (
                      <tr key={p.product_slug} className={p.nombre === 0 ? 'opacity-40' : ''}>
                        <td className="py-2 text-gray-700">{p.nom}</td>
                        <td className="py-2 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.type === 'duree' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            {p.type === 'duree' ? 'Abonnement' : 'Séance'}
                          </span>
                        </td>
                        <td className="py-2 text-right text-gray-500">{p.nombre}</td>
                        <td className="py-2 text-right font-semibold text-gray-900">{p.total > 0 ? fmtXOF(p.total) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-100">
                    <tr>
                      <td className="pt-3 text-sm font-semibold text-gray-700" colSpan={2}>Total</td>
                      <td className="pt-3 text-right font-semibold text-gray-700">{produitsFiltres.reduce((s, p) => s + p.nombre, 0)}</td>
                      <td className="pt-3 text-right font-bold text-gray-900">{fmtXOF(produitsFiltres.reduce((s, p) => s + p.total, 0))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Section>

            {/* MEMBRES */}
            <Section title="Membres (comptes créés)">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total membres"   value={fmt(membres.total_membres)}   icon="👤" color="bg-gray-100" sub="Comptes enregistrés" />
                <StatCard label="Abonnés actifs"  value={fmt(membres.membres_actifs)}  icon="✅" color="bg-blue-50"  sub="Abonnement valide aujourd'hui" />
                <StatCard label="Sans abonnement" value={fmt(membres.membres_inactifs)} icon="⏸️" color="bg-orange-50" sub="Pas d'abonnement actif" />
              </div>
            </Section>

            {/* ABONNEMENTS */}
            <Section title="Abonnements">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Nouveaux aujourd'hui"      value={fmt(abonnes.nouveaux_aujourdhui)} icon="🆕" color="bg-purple-50" sub={`Actifs: ${fmt(abonnes.actifs_aujourdhui)}`} />
                <StatCard label="Nouveaux cette semaine"    value={fmt(abonnes.nouveaux_semaine)}    icon="📆" color="bg-purple-50" sub={`Actifs: ${fmt(abonnes.actifs_semaine)}`} />
                <StatCard label={`Nouveaux en ${periodLabel}`} value={fmt(abonnes.nouveaux_mois)}   icon="📈" color="bg-purple-100" sub={`Actifs: ${fmt(abonnes.actifs_mois)}`} />
              </div>
            </Section>

            {/* OBJECTIFS */}
            <Section title="Objectifs">
              {objectifs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-400 text-sm">
                  Aucun objectif actif. Créez-en un via POST /api/dashboard/objectifs.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {objectifs.map(obj => (
                    <div key={obj.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                            {obj.type === 'revenus' ? 'Objectif revenus' : 'Objectif abonnés'} — {obj.periode}
                          </p>
                          {obj.description && <p className="text-sm text-gray-600 mt-0.5">{obj.description}</p>}
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${obj.atteint ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {obj.atteint ? '✓ Atteint' : `J-${obj.jours_restants}`}
                        </span>
                      </div>
                      <div className="mt-3 flex items-end justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {obj.type === 'revenus' ? fmtXOF(obj.valeur_actuelle) : fmt(obj.valeur_actuelle)}
                        </span>
                        <span className="text-sm text-gray-400">
                          / {obj.type === 'revenus' ? fmtXOF(obj.valeur_cible) : fmt(obj.valeur_cible)}
                        </span>
                      </div>
                      <ProgressBar pct={obj.progression_pct} atteint={obj.atteint} />
                      <p className="text-right text-xs text-gray-400 mt-1">{obj.progression_pct}%</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <p className="text-center text-xs text-gray-400 mt-10">
              Données en temps réel depuis api.sunufitness.com
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
