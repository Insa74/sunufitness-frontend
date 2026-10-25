import React, { useState, useRef } from 'react';

// ─── Données ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'poissons',
    emoji: '🐟',
    titre: 'Poissons & Fruits de mer',
    items: ['Thiof (mérou)', 'Yeet (poisson séché)', 'Sole', 'Carpe', 'Sardines fraîches', 'Thon naturel', 'Crevettes', 'Capitaine', 'Maquereau', 'Calamars'],
  },
  {
    id: 'viandes',
    emoji: '🍗',
    titre: 'Viandes & Volailles',
    items: ['Poulet (blanc)', 'Poulet (cuisse)', 'Bœuf maigre', 'Agneau', 'Dinde', 'Foie de veau', 'Viande hachée maigre'],
  },
  {
    id: 'oeufs',
    emoji: '🥚',
    titre: 'Œufs & Produits laitiers',
    items: ['Œufs entiers', 'Blancs d\'œufs', 'Yaourt nature (sans sucre)', 'Fromage blanc 0%', 'Lait demi-écrémé', 'Kéfir nature'],
  },
  {
    id: 'legumes_ok',
    emoji: '🥦',
    titre: 'Légumes anti-ballonnements ✅',
    subtitle: 'Prioritaires — bien tolérés',
    items: ['Courgette (cuite)', 'Carotte (cuite)', 'Épinards (cuits)', 'Concombre (pelé)', 'Tomate (cuite)', 'Aubergine (grillée)', 'Potiron / courge', 'Haricots verts (cuits)', 'Blettes', 'Fenouil ⭐ anti-gaz', 'Gombo', 'Salade verte'],
  },
  {
    id: 'legumes_test',
    emoji: '⚠️',
    titre: 'Légumes à tester',
    subtitle: 'Peuvent ballonner',
    items: ['Chou (cru)', 'Brocoli (cru)', 'Chou-fleur', 'Oignon cru', 'Ail cru', 'Poireau', 'Radis', 'Poivron cru', 'Céleri'],
  },
  {
    id: 'fruits',
    emoji: '🍌',
    titre: 'Fruits',
    items: ['Banane (mûre)', 'Papaye', 'Mangue', 'Goyave', 'Orange', 'Citron vert', 'Ananas (frais)', 'Pomme (sans peau)', 'Pastèque', 'Avocat'],
  },
  {
    id: 'feculent',
    emoji: '🍚',
    titre: 'Féculents & Céréales',
    items: ['Riz blanc (cuit refroidi)', 'Riz complet', 'Attieké', 'Mil / Fonio', 'Flocons d\'avoine', 'Pain complet', 'Quinoa', 'Patate douce', 'Igname', 'Manioc (cuit)'],
  },
  {
    id: 'legumineuses',
    emoji: '🫘',
    titre: 'Légumineuses',
    subtitle: 'À tester avec précaution',
    items: ['Lentilles corail (bien cuites)', 'Niébé / haricots (bien cuits)', 'Pois chiches (bien cuits)', 'Arachides (crues)', 'Beurre de cacahuète (naturel)'],
  },
  {
    id: 'epices',
    emoji: '🌿',
    titre: 'Épices & Herbes',
    subtitle: 'Anti-inflammatoires',
    items: ['Gingembre frais ⭐', 'Curcuma ⭐', 'Menthe fraîche ⭐', 'Cumin ⭐', 'Fenouil (graines)', 'Citron (jus)', 'Persil', 'Citronnelle', 'Cannelle', 'Thym'],
  },
  {
    id: 'graisses',
    emoji: '🥜',
    titre: 'Graisses & Oléagineux',
    items: ['Avocat', 'Huile d\'olive (crue)', 'Noix de cajou', 'Amandes', 'Graines de lin', 'Graines de chia'],
  },
  {
    id: 'boissons',
    emoji: '💧',
    titre: 'Boissons',
    items: ['Eau plate', 'Eau tiède + citron (matin)', 'Tisane gingembre', 'Tisane menthe', 'Bissap (sans sucre)', 'Eau de coco (naturelle)', 'Thé vert (sans sucre)', 'Kinkéliba'],
  },
];

type Pref = 'adore' | 'tolere' | 'deteste' | null;
type State = Record<string, { pref: Pref; ballonne: boolean }>;

const initState = (): State => {
  const s: State = {};
  CATEGORIES.forEach((cat) =>
    cat.items.forEach((_, i) => {
      s[`${cat.id}_${i}`] = { pref: null, ballonne: false };
    })
  );
  return s;
};

// ─── Composant ──────────────────────────────────────────────────────────────

const PreferencesPage: React.FC = () => {
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  const [poids, setPoids] = useState('');
  const [objectif, setObjectif] = useState('Perdre en tour de ventre — problèmes de ballonnements');
  const [prefs, setPrefs] = useState<State>(initState());
  const [ballonnements, setBallonnements] = useState('');
  const [remarques, setRemarques] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const topRef = useRef<HTMLDivElement>(null);

  const total = Object.keys(prefs).length;
  const filled = Object.values(prefs).filter((v) => v.pref !== null).length;
  const progress = Math.round((filled / total) * 100);

  const setPref = (key: string, val: Pref) => {
    setPrefs((prev) => ({ ...prev, [key]: { ...prev[key], pref: prev[key].pref === val ? null : val } }));
  };

  const toggleBallonne = (key: string) => {
    setPrefs((prev) => ({ ...prev, [key]: { ...prev[key], ballonne: !prev[key].ballonne } }));
  };

  const toggleCat = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #0a4f3e 100%)' }}>
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#0F6E56] mb-2">Merci {nom || ''} !</h2>
          <p className="text-gray-600 mb-4">Ta fiche de préférences a été enregistrée. Coach Insa va l'analyser avant votre prochaine séance.</p>
          <div className="bg-[#f0faf6] rounded-xl p-4 text-sm text-[#0F6E56] font-medium">
            📊 {filled} aliments renseignés sur {total}
          </div>
          <p className="text-xs text-gray-400 mt-4">SUNUFITNESS · Saly, Sénégal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" ref={topRef}>
      {/* Header sticky */}
      <div className="sticky top-0 z-50 shadow-sm" style={{ background: '#0F6E56' }}>
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest">SUNUFITNESS</p>
              <h1 className="text-white font-bold text-base leading-tight">Fiche Préférences Alimentaires</h1>
            </div>
            <div className="text-right">
              <span className="text-white font-bold text-lg">{progress}%</span>
              <p className="text-white/70 text-xs">{filled}/{total}</p>
            </div>
          </div>
          {/* Barre de progression */}
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: '#b89968' }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 pb-12">
        {/* Légende */}
        <div className="my-4 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="bg-green-50 p-3 text-center">
              <div className="text-xl mb-1">✅</div>
              <p className="text-green-700 font-semibold text-xs">J'adore</p>
              <p className="text-green-600 text-xs">Aliment favori</p>
            </div>
            <div className="bg-amber-50 p-3 text-center">
              <div className="text-xl mb-1">🟡</div>
              <p className="text-amber-700 font-semibold text-xs">Je tolère</p>
              <p className="text-amber-600 text-xs">Acceptable</p>
            </div>
            <div className="bg-red-50 p-3 text-center">
              <div className="text-xl mb-1">❌</div>
              <p className="text-red-700 font-semibold text-xs">Je déteste</p>
              <p className="text-red-600 text-xs">Impossible</p>
            </div>
          </div>
          <div className="bg-orange-50 p-2 text-center border-t border-orange-100">
            <p className="text-orange-700 text-xs">⚠️ Appuie aussi sur <strong>⚠️</strong> si un aliment te donne des <em>ballonnements ou gaz</em></p>
          </div>
        </div>

        {/* Infos cliente */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h2 className="font-bold text-[#0F6E56] text-sm mb-3 uppercase tracking-wide">👤 Tes informations</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Prénom & Nom</label>
              <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex : Fatou Diallo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Âge</label>
                <input value={age} onChange={e => setAge(e.target.value)} placeholder="Ex : 34 ans" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Poids actuel</label>
                <input value={poids} onChange={e => setPoids(e.target.value)} placeholder="Ex : 72 kg" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Objectif</label>
              <input value={objectif} onChange={e => setObjectif(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]" />
            </div>
          </div>
        </div>

        {/* Catégories */}
        {CATEGORIES.map((cat) => {
          const catFilled = cat.items.filter((_, i) => prefs[`${cat.id}_${i}`]?.pref !== null).length;
          const isOpen = open[cat.id] !== false; // ouvert par défaut
          return (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden">
              <button type="button" onClick={() => toggleCat(cat.id)} className="w-full flex items-center justify-between px-4 py-3 text-left">
                <div>
                  <span className="font-bold text-gray-800 text-sm">{cat.emoji} {cat.titre}</span>
                  {cat.subtitle && <p className="text-xs text-gray-400">{cat.subtitle}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{catFilled}/{cat.items.length}</span>
                  <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-50">
                  {cat.items.map((item, i) => {
                    const key = `${cat.id}_${i}`;
                    const state = prefs[key];
                    return (
                      <div key={key} className={`flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0 ${state.ballonne ? 'bg-orange-50' : ''}`}>
                        <span className="text-sm text-gray-700 flex-1 pr-2">{item}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* J'adore */}
                          <button type="button" onClick={() => setPref(key, 'adore')}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${state.pref === 'adore' ? 'bg-green-100 ring-2 ring-green-400 scale-110' : 'bg-gray-100 opacity-50'}`}>
                            ✅
                          </button>
                          {/* Je tolère */}
                          <button type="button" onClick={() => setPref(key, 'tolere')}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${state.pref === 'tolere' ? 'bg-amber-100 ring-2 ring-amber-400 scale-110' : 'bg-gray-100 opacity-50'}`}>
                            🟡
                          </button>
                          {/* Je déteste */}
                          <button type="button" onClick={() => setPref(key, 'deteste')}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${state.pref === 'deteste' ? 'bg-red-100 ring-2 ring-red-400 scale-110' : 'bg-gray-100 opacity-50'}`}>
                            ❌
                          </button>
                          {/* Ballonne */}
                          <button type="button" onClick={() => toggleBallonne(key)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${state.ballonne ? 'bg-orange-100 ring-2 ring-orange-400 scale-110' : 'bg-gray-100 opacity-40'}`}>
                            ⚠️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Notes */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h2 className="font-bold text-[#0F6E56] text-sm mb-3 uppercase tracking-wide">📝 Remarques</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Aliments qui te ballonnent le plus (précise) :</label>
              <textarea value={ballonnements} onChange={e => setBallonnements(e.target.value)} rows={3} placeholder="Ex : les haricots me ballonnent beaucoup..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56] resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Autres remarques / allergies :</label>
              <textarea value={remarques} onChange={e => setRemarques(e.target.value)} rows={3} placeholder="Ex : allergie aux arachides, je ne mange pas de porc..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56] resize-none" />
            </div>
          </div>
        </div>

        {/* Bouton soumettre */}
        <button type="submit"
          className="w-full py-4 rounded-xl font-bold text-white text-base shadow-lg transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #0a4f3e 100%)' }}>
          ✅ Envoyer ma fiche à Coach Insa
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">SUNUFITNESS · Coach Insa Gaye · Saly, Sénégal</p>
      </form>
    </div>
  );
};

export default PreferencesPage;
