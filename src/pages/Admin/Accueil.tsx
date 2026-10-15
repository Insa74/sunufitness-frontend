import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi, getCaisseUser } from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Kpis {
  membres_total: number; abonnes_actifs: number; expirent_bientot: number;
  revenu_jour: number; revenu_mois: number; revenu_mois_precedent: number;
  evolution_pct: number | null; passages_jour: number;
}
interface Jour { date: string; libelle: string; ventes: number; nb_ventes: number; entrees: number; refus: number }
interface Relance { id: number; nom: string; prenom: string; phone: string | null; date_fin: string | null; jours_restants: number | null }
interface CoursJour { id: number; titre: string; type: string; horaire: string; coach: string | null; reserves: number; capacite: number }
interface CoachJour { nom: string; horaire: string; arrivee: string | null; depart: string | null; retard: number }
interface Accueil {
  mis_a_jour: string; kpis: Kpis; semaine: Jour[];
  a_relancer: Relance[]; cours_jour: CoursJour[]; coachs_jour: CoachJour[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VERT = '#05835e';
const fmt = (n: number) => new Intl.NumberFormat('fr-SN').format(n);
const fmtXOF = (n: number) => fmt(n) + ' XOF';

function waNumber(phone?: string | null): string {
  let d = (phone ?? '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 9) d = '221' + d;
  return d;
}

function lienRelance(r: Relance): string {
  const quand = r.jours_restants !== null && r.jours_restants <= 1 ? 'demain' : `le ${r.date_fin}`;
  const texte = `Bonjour ${r.prenom} ! Votre abonnement SUNUFITNESS se termine ${quand}. `
    + 'Pensez à le renouveler pour continuer à vous entraîner sans interruption. À bientôt à la salle ! 💪';
  return `https://wa.me/${waNumber(r.phone)}?text=${encodeURIComponent(texte)}`;
}

// ─── Composants ───────────────────────────────────────────────────────────────

const Carte: React.FC<{ label: string; valeur: string; sous?: React.ReactNode; icone: string; fond: string; onClick?: () => void }> =
  ({ label, valeur, sous, icone, fond, onClick }) => (
    <button onClick={onClick} disabled={!onClick}
      className={`text-left rounded-2xl border p-5 flex items-start justify-between gap-3 ${fond} ${onClick ? 'hover:shadow-md transition cursor-pointer' : 'cursor-default'}`}>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1 truncate">{valeur}</p>
        {sous && <div className="text-xs text-gray-600 mt-1">{sous}</div>}
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center text-2xl flex-shrink-0">{icone}</div>
    </button>
  );

/** Histogramme d'une seule série (pas de légende : le titre la nomme). */
const Barres: React.FC<{ titre: string; jours: Jour[]; valeur: (j: Jour) => number; format: (n: number) => string; detail?: (j: Jour) => string; vide: string }> =
  ({ titre, jours, valeur, format, detail, vide }) => {
    const max = Math.max(1, ...jours.map(valeur));
    const total = jours.reduce((s, j) => s + valeur(j), 0);
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{titre}</h3>
          <span className="text-xs text-gray-500">7 jours : <strong className="text-gray-900">{format(total)}</strong></span>
        </div>
        {total === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">{vide}</p>
        ) : (
          <div className="flex items-end gap-2 h-36">
            {jours.map((j) => {
              const v = valeur(j);
              const h = v === 0 ? 0 : Math.max(4, Math.round((v / max) * 100));
              return (
                <div key={j.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div className="absolute -top-1 -translate-y-full opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gray-900 text-white text-[11px] rounded-md px-2 py-1 whitespace-nowrap z-10">
                    {j.libelle} · {format(v)}{detail ? ` · ${detail(j)}` : ''}
                  </div>
                  <span className="text-[10px] text-gray-500 mb-1">{v > 0 ? (v >= 1000 ? `${Math.round(v / 1000)}k` : v) : ''}</span>
                  <div className="w-full max-w-[36px] rounded-t" style={{ height: `${h}%`, backgroundColor: VERT }} />
                </div>
              );
            })}
          </div>
        )}
        <div className="flex gap-2 mt-2 border-t border-gray-100 pt-2">
          {jours.map((j) => <span key={j.date} className="flex-1 text-center text-[10px] text-gray-500">{j.libelle}</span>)}
        </div>
      </div>
    );
  };

const MENU: { label: string; icone: string; route: string }[] = [
  { label: 'Tableau de bord', icone: '📊', route: '/admin/dashboard' },
  { label: 'Membres', icone: '👥', route: '/admin/membres' },
  { label: 'Abonnements', icone: '📋', route: '/admin/subscriptions' },
  { label: 'Cours', icone: '🏋️', route: '/admin/cours' },
  { label: 'Coachs', icone: '🧑‍🏫', route: '/admin/coaches' },
  { label: 'Planning', icone: '🗓️', route: '/admin/schedule' },
  { label: 'Agenda', icone: '📅', route: '/agenda' },
  { label: 'Statistiques', icone: '📈', route: '/admin/statistiques' },
  { label: 'Caisse', icone: '🏪', route: '/caisse' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminAccueil: React.FC = () => {
  const navigate = useNavigate();
  const user = getCaisseUser();
  const [data, setData] = useState<Accueil | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) { navigate('/caisse'); return; }
    caisseApi.get<Accueil & { success: boolean }>('/admin/accueil')
      .then(setData)
      .catch((e: any) => setErreur(e?.message === 'Unauthenticated.'
        ? 'Session expirée : reconnecte-toi avec ton PIN sur la caisse.'
        : (e?.message || 'Impossible de charger le tableau de bord.')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const k = data?.kpis;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Menu latéral (ordinateur) */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 text-white" style={{ background: `linear-gradient(180deg, ${VERT} 0%, #046b4d 100%)` }}>
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-lg font-bold tracking-wide">SUNUFITNESS</p>
          <p className="text-xs text-white/70">Administration</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {MENU.map((m) => (
            <button key={m.route} onClick={() => navigate(m.route)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${m.route === '/admin/dashboard' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <span>{m.icone}</span>{m.label}
            </button>
          ))}
        </nav>
        <button onClick={() => navigate('/admin')} className="m-3 px-3 py-2 rounded-xl text-xs text-white/80 hover:bg-white/10 text-left">← Hub</button>
      </aside>

      <main className="flex-1 min-w-0">
        {/* Menu horizontal (mobile/tablette) */}
        <div className="lg:hidden bg-black text-white px-4 py-3 flex gap-2 overflow-x-auto">
          {MENU.map((m) => (
            <button key={m.route} onClick={() => navigate(m.route)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap ${m.route === '/admin/dashboard' ? 'bg-white text-black' : 'bg-white/10'}`}>
              {m.icone} {m.label}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-sm text-gray-500">Bonjour {user?.prenom ?? ''} — voici l'essentiel d'aujourd'hui.</p>
            </div>
            {data && <p className="text-xs text-gray-500">Mis à jour le <strong>{data.mis_a_jour}</strong></p>}
          </div>

          {erreur && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">{erreur}</div>}
          {!data && !erreur && <p className="text-center text-gray-400 py-20">Chargement…</p>}

          {data && k && (
            <>
              {/* Chiffres clés */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Carte label="Abonnés actifs" valeur={fmt(k.abonnes_actifs)} icone="✅" fond="bg-emerald-50 border-emerald-100"
                  sous={<>sur {fmt(k.membres_total)} membres inscrits</>} onClick={() => navigate('/admin/membres')} />
                <Carte label="Expirent sous 7 jours" valeur={fmt(k.expirent_bientot)} icone="⏳" fond="bg-orange-50 border-orange-100"
                  sous="à relancer (liste ci-dessous)" />
                <Carte label="Entrées aujourd'hui" valeur={fmt(k.passages_jour)} icone="🚪" fond="bg-blue-50 border-blue-100"
                  sous="membres scannés à l'entrée" />
                <Carte label="Ventes aujourd'hui" valeur={fmtXOF(k.revenu_jour)} icone="💵" fond="bg-purple-50 border-purple-100"
                  sous={<>
                    Mois : <strong>{fmtXOF(k.revenu_mois)}</strong>
                    {k.evolution_pct !== null && (
                      <span className={k.evolution_pct >= 0 ? 'text-green-700' : 'text-red-600'}>
                        {' '}{k.evolution_pct >= 0 ? '▲' : '▼'} {Math.abs(k.evolution_pct)} %
                      </span>
                    )}
                  </>} />
              </div>

              {/* Actions rapides */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['🏪', 'Nouvelle vente', '/caisse'],
                  ['👤', 'Chercher un membre', '/admin/membres'],
                  ['🏋️', 'Nouveau cours', '/admin/cours'],
                  ['🗓️', 'Planning coachs', '/admin/schedule'],
                ].map(([i, l, r]) => (
                  <button key={r} onClick={() => navigate(r)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm py-4 flex flex-col items-center gap-1 hover:shadow-md transition">
                    <span className="text-2xl">{i}</span>
                    <span className="text-sm font-semibold text-gray-800">{l}</span>
                  </button>
                ))}
              </div>

              {/* 7 derniers jours */}
              <div className="grid lg:grid-cols-2 gap-4">
                <Barres titre="Entrées à la salle (scans QR)" jours={data.semaine} valeur={(j) => j.entrees}
                  format={(n) => `${fmt(n)} entrée${n > 1 ? 's' : ''}`}
                  detail={(j) => (j.refus ? `${j.refus} refus (abonnement expiré)` : '')}
                  vide="Pas encore de scans enregistrés. Les entrées s'afficheront dès les prochains scans au /scan." />
                <Barres titre="Ventes (caisse et en ligne)" jours={data.semaine} valeur={(j) => j.ventes}
                  format={fmtXOF} detail={(j) => `${j.nb_ventes} vente${j.nb_ventes > 1 ? 's' : ''}`}
                  vide="Aucune vente sur les 7 derniers jours." />
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                {/* À relancer */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">⏳ À relancer — abonnement qui se termine</h3>
                    <span className="text-xs text-gray-500">{data.a_relancer.length} membre(s)</span>
                  </div>
                  {data.a_relancer.length === 0 ? (
                    <p className="p-6 text-sm text-gray-400 text-center">Aucun abonnement ne se termine dans les 7 prochains jours.</p>
                  ) : (
                    <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                      {data.a_relancer.map((r) => (
                        <div key={r.id} className="px-5 py-3 flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{r.nom}</p>
                            <p className="text-xs text-gray-500">
                              fin le {r.date_fin ?? '—'}
                              {r.jours_restants !== null && <span className={r.jours_restants <= 2 ? 'text-red-600 font-semibold' : ''}> · {r.jours_restants} j</span>}
                              {r.phone ? ` · ${r.phone}` : ''}
                            </p>
                          </div>
                          {r.phone ? (
                            <a href={lienRelance(r)} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#25D366] text-white whitespace-nowrap">WhatsApp</a>
                          ) : (
                            <span className="text-[11px] text-gray-400">pas de numéro</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Aujourd'hui */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">🏋️ Cours du jour</h3>
                      <button onClick={() => navigate('/admin/cours')} className="text-xs text-gray-500 underline">Voir</button>
                    </div>
                    {data.cours_jour.length === 0 ? (
                      <p className="p-5 text-sm text-gray-400">Aucun cours aujourd'hui.</p>
                    ) : data.cours_jour.map((c) => (
                      <div key={c.id} className="px-5 py-3 border-b border-gray-50 last:border-0">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{c.titre}</span>
                          <span className="text-gray-500">{c.reserves}/{c.capacite}</span>
                        </div>
                        <p className="text-xs text-gray-500">{c.horaire}{c.coach ? ` · ${c.coach}` : ''}</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (c.reserves / Math.max(1, c.capacite)) * 100)}%`, backgroundColor: VERT }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">🧑‍🏫 Coachs du jour</h3>
                      <button onClick={() => navigate('/admin/schedule')} className="text-xs text-gray-500 underline">Planning</button>
                    </div>
                    {data.coachs_jour.length === 0 ? (
                      <p className="p-5 text-sm text-gray-400">Aucun créneau planifié aujourd'hui.</p>
                    ) : data.coachs_jour.map((c, i) => (
                      <div key={i} className="px-5 py-3 border-b border-gray-50 last:border-0 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{c.nom}</p>
                          <p className="text-xs text-gray-500">{c.horaire}</p>
                        </div>
                        {c.arrivee ? (
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${c.retard > 15 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            ✓ {c.arrivee}{c.depart ? ` → ${c.depart}` : ''}{c.retard > 15 ? ` (+${c.retard} min)` : ''}
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap">pas pointé</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAccueil;
