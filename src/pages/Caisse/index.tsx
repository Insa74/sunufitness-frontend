import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CAISSE_TOKEN_KEY,
  CAISSE_USER_KEY,
  caisseApi,
  type CaisseUser,
} from '../../services/caisseApiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee {
  id: number; nom: string; prenom: string;
  role: string; couleur: string; initiales: string;
}
interface MembreResult {
  id: number; nom: string; first_name: string; last_name: string;
  email: string; phone: string; abonne_actif: boolean;
}
interface Product {
  id: number; slug: string; nom: string; prix: number; devise: string;
  type: 'duree' | 'seance'; duree_valeur: number | null; duree_unite: string | null;
}
interface Recu {
  recu_numero: string; date: string; statut: string;
  membre: { id: number; nom: string; email: string; phone: string };
  produit: { nom: string; type: string; slug: string };
  montant: number; devise: string; mode_paiement: string;
  date_fin: string | null; abonne_actif: boolean; is_renewal: boolean; enregistre_par: string; centre: string;
}
interface TransactionJour {
  id: number; recu_numero: string; membre: string; produit: string;
  type_produit: string; montant: number; mode_paiement: string;
  date_fin: string | null; statut: string; is_renewal: boolean; enregistre_par: string; heure: string;
}
interface JourData {
  date: string; total_jour: number; currency: string;
  par_mode: Record<string, { nombre: number; total: number }>;
  transactions: TransactionJour[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt    = (n: number) => new Intl.NumberFormat('fr-SN').format(n);
const fmtXOF = (n: number) => fmt(n) + ' XOF';
const modeLabel: Record<string, string> = { wave: 'Wave', orange_money: 'Orange Money', cash: 'Cash' };
const modeColor:  Record<string, string> = {
  wave: 'bg-blue-100 text-blue-700', orange_money: 'bg-orange-100 text-orange-700', cash: 'bg-green-100 text-green-700',
};

const Badge: React.FC<{ actif: boolean }> = ({ actif }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
    {actif ? '✓ Abonné actif' : 'Sans abonnement'}
  </span>
);
const ModeBadge: React.FC<{ mode: string }> = ({ mode }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${modeColor[mode] ?? 'bg-gray-100 text-gray-600'}`}>
    {modeLabel[mode] ?? mode}
  </span>
);

// ─── Écran PIN ────────────────────────────────────────────────────────────────

const PinScreen: React.FC<{ employee: Employee; onSuccess: (user: CaisseUser, token: string) => void; onBack: () => void }> = ({ employee, onSuccess, onBack }) => {
  const [pin, setPin]       = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const addDigit = useCallback((d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError('');
    if (next.length === 4) submitPin(next);
  }, [pin]);

  const submitPin = async (p: string) => {
    setLoading(true); setError('');
    try {
      const res = await caisseApi.post<{ success: boolean; token: string; user: CaisseUser }>('/caisse/login', {
        user_id: employee.id, pin: p,
      });
      localStorage.setItem(CAISSE_TOKEN_KEY, res.token);
      localStorage.setItem(CAISSE_USER_KEY, JSON.stringify(res.user));
      onSuccess(res.user, res.token);
    } catch {
      setError('PIN incorrect. Réessayez.');
      setPin('');
    } finally { setLoading(false); }
  };

  const digits = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white text-sm">← Retour</button>

      {/* Avatar */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3"
        style={{ backgroundColor: employee.couleur }}>
        {employee.initiales}
      </div>
      <p className="text-white text-xl font-semibold mb-1">{employee.prenom}</p>
      <p className="text-gray-400 text-sm mb-8">Entrez votre code PIN</p>

      {/* Points PIN */}
      <div className="flex gap-4 mb-8">
        {[0,1,2,3].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length > i ? 'bg-white border-white' : 'border-gray-500'}`} />
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {loading && <p className="text-gray-400 text-sm mb-4">Vérification…</p>}

      {/* Clavier */}
      <div className="grid grid-cols-3 gap-3 w-64">
        {digits.map((d, i) => (
          <button key={i} onClick={() => {
            if (d === '⌫') { setPin(p => p.slice(0,-1)); setError(''); }
            else if (d) addDigit(d);
          }}
            disabled={loading || (!d && d !== '0')}
            className={`h-16 rounded-2xl text-xl font-semibold transition
              ${d === '' ? 'invisible' : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'}
              ${d === '⌫' ? 'text-gray-400' : ''}`}>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Écran sélection employé ──────────────────────────────────────────────────

const EmployeeScreen: React.FC<{ onSelect: (e: Employee) => void }> = ({ onSelect }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    caisseApi.get<{ success: boolean; data: Employee[] }>('/caisse/employees')
      .then(r => setEmployees(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">SUNUFITNESS</p>
        <h1 className="text-white text-2xl font-bold">Caisse</h1>
        <p className="text-gray-400 text-sm mt-1">Sélectionnez votre profil</p>
      </div>

      {loading ? (
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {employees.map(e => (
            <button key={e.id} onClick={() => onSelect(e)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/15 transition active:scale-95">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
                style={{ backgroundColor: e.couleur }}>
                {e.initiales}
              </div>
              <p className="text-white text-xs font-medium text-center leading-tight">{e.prenom}</p>
              {e.role === 'admin' && (
                <span className="text-xs text-yellow-400 font-medium">Admin</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Modal Reçu ───────────────────────────────────────────────────────────────

const RecuModal: React.FC<{ recu: Recu; onNew: () => void; onClose: () => void }> = ({ recu, onNew, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
      <div className="bg-black text-white rounded-t-2xl px-6 py-4 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest">SUNUFITNESS — Saly</p>
        <p className="text-2xl font-bold mt-1">Reçu</p>
        <p className="text-gray-300 text-sm mt-0.5">{recu.recu_numero}</p>
      </div>
      <div className="px-6 py-5 space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{recu.date}</span></div>
        <div className="border-t pt-3">
          <p className="text-xs text-gray-400 uppercase mb-1">Membre</p>
          <p className="font-semibold">{recu.membre.nom}</p>
          {recu.membre.phone && <p className="text-xs text-gray-400">{recu.membre.phone}</p>}
        </div>
        <div className="border-t pt-3">
          <p className="text-xs text-gray-400 uppercase mb-1">Produit</p>
          <p className="font-semibold">{recu.produit.nom}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${recu.produit.type==='duree' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
            {recu.produit.type==='duree' ? 'Accès durée' : 'Séance'}
          </span>
          {recu.is_renewal && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 ml-1">Renouvellement</span>
          )}
        </div>
        {recu.date_fin && (
          <div className="border-t pt-3 flex justify-between">
            <span className="text-gray-500">Expire le</span>
            <span className="font-semibold text-orange-600">{recu.date_fin}</span>
          </div>
        )}
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="text-gray-500">Paiement</span><ModeBadge mode={recu.mode_paiement} />
        </div>
        <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-xl font-bold">{fmtXOF(recu.montant)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 pt-1">
          <span>Par : {recu.enregistre_par}</span><Badge actif={recu.abonne_actif} />
        </div>
      </div>
      <div className="px-6 pb-5 flex gap-3">
        <button onClick={onNew} className="flex-1 bg-black text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-800 transition">+ Nouvelle vente</button>
        <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-3 font-semibold text-sm text-gray-600 hover:bg-gray-50 transition">Fermer</button>
      </div>
    </div>
  </div>
);

// ─── Modal Nouveau Membre ─────────────────────────────────────────────────────

const NouveauMembreModal: React.FC<{ onCreated: (m: MembreResult) => void; onClose: () => void }> = ({ onCreated, onClose }) => {
  const [form, setForm]   = useState({ first_name:'', last_name:'', phone:'', email:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({...f,[k]:e.target.value}));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim()||!form.last_name.trim()){setError('Prénom et nom requis.');return;}
    setLoading(true);setError(null);
    try {
      const password = Math.random().toString(36).slice(-8)+'Sf1!';
      await caisseApi.post('/register',{
        first_name:form.first_name.trim(),last_name:form.last_name.trim(),
        phone:form.phone.trim()||null,
        email:form.email.trim()||`${form.first_name.toLowerCase()}.${form.last_name.toLowerCase()}.${Date.now()}@sunufitness.local`,
        password,password_confirmation:password,
      });
      const search = await caisseApi.get<{success:boolean;data:MembreResult[]}>(`/caisse/membres/search?q=${encodeURIComponent(form.first_name.trim())}`);
      const created = search.data?.find(m=>m.first_name.toLowerCase()===form.first_name.trim().toLowerCase()&&m.last_name.toLowerCase()===form.last_name.trim().toLowerCase())??search.data?.[0];
      if (created) onCreated(created);
      else setError('Membre créé. Recherchez-le manuellement.');
    } catch(e:any){
      const msg=e?.errors?Object.values(e.errors as Record<string,string[]>).flat().join(' '):e?.message??'Erreur.';
      setError(msg);
    } finally{setLoading(false);}
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-bold">Nouveau membre</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Prénom *</label>
              <input value={form.first_name} onChange={set('first_name')} placeholder="Prénom"
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Nom *</label>
              <input value={form.last_name} onChange={set('last_name')} placeholder="Nom"
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Téléphone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="+221 77 000 00 00" type="tel"
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Email <span className="text-gray-400">(optionnel)</span></label>
            <input value={form.email} onChange={set('email')} placeholder="email@exemple.com" type="email"
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-800 disabled:opacity-40 transition">
            {loading ? 'Création…' : 'Créer et continuer →'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Interface caisse principale ──────────────────────────────────────────────

const CaisseInterface: React.FC<{ caisseUser: CaisseUser; onLogout: () => void }> = ({ caisseUser, onLogout }) => {
  const navigate = useNavigate();
  const [step, setStep]           = useState<'search'|'product'|'payment'|'done'>('search');
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState<MembreResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [membre, setMembre]       = useState<MembreResult|null>(null);
  const [products]                = useState<Product[]>(buildProducts());
  const [prodTab, setProdTab]     = useState<'tous'|'duree'|'seance'>('tous');
  const [product, setProduct]     = useState<Product|null>(null);
  const [mode, setMode]           = useState<'wave'|'orange_money'|'cash'|''>('');
  const [isRenewal, setIsRenewal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string|null>(null);
  const [recu, setRecu]           = useState<Recu|null>(null);
  const [jourData, setJourData]   = useState<JourData|null>(null);
  const [showJour, setShowJour]   = useState(false);
  const [showNewMembre, setShowNewMembre] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  const isAdmin = caisseUser.role === 'admin';

  const handleSearch = (q: string) => {
    setQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.trim().length < 2) { setResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await caisseApi.get<{success:boolean;data:MembreResult[]}>(`/caisse/membres/search?q=${encodeURIComponent(q.trim())}`);
        setResults(res.data??[]);
      } catch { setResults([]); } finally { setSearching(false); }
    }, 350);
  };

  const selectMembre = (m: MembreResult) => { setMembre(m); setResults([]); setQuery(''); setStep('product'); };
  const selectProduct = (p: Product) => { setProduct(p); setStep('payment'); };

  const submitTransaction = async () => {
    if (!membre||!product||!mode) return;
    setSubmitting(true); setError(null);
    try {
      const res = await caisseApi.post<{success:boolean;data:Recu}>('/caisse/transactions',{
        member_id:membre.id, product_id:product.id, mode_paiement:mode, is_renewal:isRenewal,
      });
      setRecu(res.data); setStep('done');
    } catch(e:any){ setError(e?.message??'Erreur lors de la transaction.'); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => { setStep('search');setMembre(null);setProduct(null);setMode('');setIsRenewal(false);setRecu(null);setError(null);setQuery('');setResults([]); };

  const loadJour = async () => {
    try { const r = await caisseApi.get<JourData>('/caisse/transactions/jour'); setJourData(r); setShowJour(true); }
    catch { setError('Impossible de charger le journal.'); }
  };

  const handleLogout = async () => {
    try { await caisseApi.post('/caisse/logout'); } catch {}
    localStorage.removeItem(CAISSE_TOKEN_KEY);
    localStorage.removeItem(CAISSE_USER_KEY);
    onLogout();
  };

  const produitsFiltres = products.filter(p => prodTab==='tous'||p.type===prodTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-lg font-bold">Caisse SUNUFITNESS</h1>
          <p className="text-xs text-gray-400">{caisseUser.nom} · {isAdmin ? 'Admin' : 'Coach'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadJour} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">Journal</button>
          <button onClick={() => navigate('/coach/membres')} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">🏋️ Membres</button>
          {isAdmin && (
            <button onClick={() => navigate('/admin')} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">Dashboard</button>
          )}
          <button onClick={handleLogout} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">🔒 Changer</button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          {(['search','product','payment'] as const).map((s,i) => {
            const labels = ['① Membre','② Produit','③ Paiement'];
            const done = ['search','product','payment','done'].indexOf(step) > i;
            const active = step === s;
            return (
              <React.Fragment key={s}>
                {i>0 && <span className="text-gray-300">›</span>}
                <span className={`font-medium ${active?'text-black':done?'text-green-600':'text-gray-400'}`}>
                  {done&&!active?'✓ ':''}{labels[i]}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* ── Étape 1 : Recherche membre ── */}
        {step==='search' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Rechercher un membre</h2>
              <button onClick={() => setShowNewMembre(true)}
                className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition">
                + Nouveau membre
              </button>
            </div>
            <div className="relative">
              <input type="text" value={query} onChange={e => handleSearch(e.target.value)}
                placeholder="Nom, prénom, téléphone, email…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus autoComplete="off" />
              {searching && <div className="absolute right-3 top-3"><div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" /></div>}
            </div>
            {results.length > 0 && (
              <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {results.map(m => (
                  <button key={m.id} onClick={() => selectMembre(m)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left border-b last:border-0 transition">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{m.nom}</p>
                      <p className="text-xs text-gray-400">{m.phone||m.email}</p>
                    </div>
                    <Badge actif={m.abonne_actif} />
                  </button>
                ))}
              </div>
            )}
            {query.length>=2 && !searching && results.length===0 && (
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-400 mb-2">Aucun membre trouvé pour « {query} »</p>
                <button onClick={() => setShowNewMembre(true)} className="text-sm text-black underline font-medium">
                  Créer un nouveau compte membre →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Étape 2 : Produit ── */}
        {step==='product' && membre && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{membre.nom}</p>
                <p className="text-xs text-gray-400">{membre.phone||membre.email}</p>
              </div>
              <div className="flex items-center gap-2"><Badge actif={membre.abonne_actif} /><button onClick={resetForm} className="text-xs text-gray-400 hover:text-gray-600">✕</button></div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Choisir un produit</h2>
              <div className="flex gap-2 mb-4">
                {(['tous','duree','seance'] as const).map(t => (
                  <button key={t} onClick={() => setProdTab(t)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${prodTab===t?'bg-black text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t==='tous'?'Tous':t==='duree'?'Abonnements':'Séances'}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {produitsFiltres.map(p => (
                  <button key={p.id} onClick={() => selectProduct(p)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-100 rounded-xl hover:border-black hover:shadow-sm text-left transition">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{p.nom}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${p.type==='duree'?'bg-blue-50 text-blue-600':'bg-purple-50 text-purple-600'}`}>
                        {p.type==='duree'?'Accès':'Séance'}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{fmtXOF(p.prix)}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Étape 3 : Paiement ── */}
        {step==='payment' && membre && product && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Membre</span><span className="font-medium">{membre.nom}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Produit</span><span className="font-medium">{product.nom}</span></div>
              <div className="flex justify-between text-sm font-bold border-t pt-2"><span>Montant</span><span className="text-lg">{fmtXOF(product.prix)}</span></div>
            </div>
            <label className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:border-gray-300 transition">
              <input type="checkbox" checked={isRenewal} onChange={e => setIsRenewal(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-sm font-medium text-gray-900">Renouvellement (client existant)</span>
            </label>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Mode de paiement</h2>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {(['wave','orange_money','cash'] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`py-4 rounded-xl border-2 font-medium text-sm text-center transition ${mode===m?'border-black bg-black text-white':'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                    {m==='wave'?'🌊 Wave':m==='orange_money'?'🟠 Orange':'💵 Cash'}
                  </button>
                ))}
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mb-4">{error}</div>}
              <div className="flex gap-3">
                <button onClick={() => {setStep('product');setMode('');setError(null);}}
                  className="flex-1 border border-gray-200 rounded-xl py-3 font-semibold text-sm text-gray-600 hover:bg-gray-50 transition">← Retour</button>
                <button onClick={submitTransaction} disabled={!mode||submitting}
                  className="flex-2 flex-grow-[2] bg-black text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  {submitting?'Traitement…':`Valider · ${fmtXOF(product.prix)}`}
                </button>
              </div>
            </div>
          </>
        )}

        {step==='done' && recu && <RecuModal recu={recu} onNew={resetForm} onClose={() => { resetForm(); }} />}
      </div>

      {showNewMembre && <NouveauMembreModal onCreated={m => {setShowNewMembre(false);selectMembre(m);}} onClose={() => setShowNewMembre(false)} />}

      {/* Journal du jour */}
      {showJour && jourData && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div><h3 className="font-bold">Journal du jour</h3><p className="text-xs text-gray-400">{jourData.date}</p></div>
              <button onClick={() => setShowJour(false)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-b grid grid-cols-3 gap-2">
              {Object.entries(jourData.par_mode).map(([m,d]) => (
                <div key={m} className="text-center"><ModeBadge mode={m} /><p className="text-xs font-semibold mt-1">{fmtXOF(d.total)}</p><p className="text-xs text-gray-400">{d.nombre} vente{d.nombre>1?'s':''}</p></div>
              ))}
            </div>
            <div className="px-5 py-2 bg-black text-white flex justify-between text-sm font-semibold">
              <span>Total du jour</span><span>{fmtXOF(jourData.total_jour)}</span>
            </div>
            <div className="overflow-y-auto flex-1">
              {jourData.transactions.length===0 ? (
                <p className="text-center text-gray-400 text-sm py-8">Aucune transaction aujourd'hui.</p>
              ) : jourData.transactions.map(t => (
                <div key={t.id} className={`flex items-center justify-between px-5 py-3 border-b last:border-0 ${t.statut==='annulee'?'opacity-50':''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.membre}</p>
                    <p className="text-xs text-gray-400 truncate">{t.produit} · {t.heure}</p>
                    {t.is_renewal && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 mr-1">Renouvellement</span>}
                    {t.statut==='annulee' && <span className="text-xs text-red-500">Annulée</span>}
                  </div>
                  <div className="text-right ml-3"><p className="text-sm font-bold">{fmtXOF(t.montant)}</p><ModeBadge mode={t.mode_paiement} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function buildProducts(): Product[] {
  return [
    {id:1,slug:'daypass',nom:'Day Pass',prix:5000,devise:'XOF',type:'duree',duree_valeur:1,duree_unite:'day'},
    {id:2,slug:'pass_semaine',nom:'Pass Semaine',prix:15000,devise:'XOF',type:'duree',duree_valeur:7,duree_unite:'day'},
    {id:3,slug:'pass_deux_semaines',nom:'Pass 2 Semaines',prix:22000,devise:'XOF',type:'duree',duree_valeur:14,duree_unite:'day'},
    {id:4,slug:'mensuel',nom:'Mensuel',prix:30000,devise:'XOF',type:'duree',duree_valeur:1,duree_unite:'month'},
    {id:5,slug:'mensuel_abonnement',nom:'Mensuel Abonnement',prix:40000,devise:'XOF',type:'duree',duree_valeur:1,duree_unite:'month'},
    {id:6,slug:'kidsfitness_1',nom:'Kids Fitness 1 enfant',prix:15000,devise:'XOF',type:'duree',duree_valeur:1,duree_unite:'month'},
    {id:7,slug:'kidsfitness_2',nom:'Kids Fitness 2 enfants',prix:22000,devise:'XOF',type:'duree',duree_valeur:1,duree_unite:'month'},
    {id:8,slug:'trimestriel',nom:'Trimestriel',prix:80000,devise:'XOF',type:'duree',duree_valeur:3,duree_unite:'month'},
    {id:9,slug:'semestriel',nom:'Semestriel',prix:150000,devise:'XOF',type:'duree',duree_valeur:6,duree_unite:'month'},
    {id:10,slug:'annuel',nom:'Annuel',prix:270000,devise:'XOF',type:'duree',duree_valeur:12,duree_unite:'month'},
    {id:11,slug:'seance_aquagym',nom:'Séance Aquagym',prix:3500,devise:'XOF',type:'seance',duree_valeur:null,duree_unite:null},
    {id:12,slug:'seance_natation',nom:'Séance Natation',prix:5000,devise:'XOF',type:'seance',duree_valeur:null,duree_unite:null},
    {id:13,slug:'seance_personal_training',nom:'Personal Training',prix:20000,devise:'XOF',type:'seance',duree_valeur:null,duree_unite:null},
    {id:14,slug:'seance_nutrition',nom:'Consultation Nutrition',prix:25000,devise:'XOF',type:'seance',duree_valeur:null,duree_unite:null},
  ];
}

// ─── Page principale avec gestion de session ──────────────────────────────────

const CaissePage: React.FC = () => {
  const [screen, setScreen]       = useState<'employees'|'pin'|'caisse'>('employees');
  const [selectedEmp, setSelectedEmp] = useState<Employee|null>(null);
  const [caisseUser, setCaisseUser]   = useState<CaisseUser|null>(null);

  useEffect(() => {
    const token = localStorage.getItem(CAISSE_TOKEN_KEY);
    const userStr = localStorage.getItem(CAISSE_USER_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as CaisseUser;
        setCaisseUser(user);
        setScreen('caisse');
      } catch {
        localStorage.removeItem(CAISSE_TOKEN_KEY);
        localStorage.removeItem(CAISSE_USER_KEY);
      }
    }
  }, []);

  if (screen === 'employees') {
    return <EmployeeScreen onSelect={e => { setSelectedEmp(e); setScreen('pin'); }} />;
  }

  if (screen === 'pin' && selectedEmp) {
    return <PinScreen employee={selectedEmp} onSuccess={(user) => { setCaisseUser(user); setScreen('caisse'); }} onBack={() => setScreen('employees')} />;
  }

  if (screen === 'caisse' && caisseUser) {
    return <CaisseInterface caisseUser={caisseUser} onLogout={() => { setCaisseUser(null); setScreen('employees'); }} />;
  }

  return null;
};

export default CaissePage;
