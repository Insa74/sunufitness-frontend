import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTabletteToken, tabletteApi, TABLETTE_TOKEN_KEY } from '../../services/tabletteApiClient';
import { CONTRAT, REGLEMENT } from './textes';

// ─── Tablette d'inscription à l'accueil ───────────────────────────────────────
// Le client choisit sa formule, remplit ses informations, accepte le contrat et signe.
// L'inscription part « à encaisser » dans la Caisse : l'accueil confirme le paiement.

interface Produit {
  id: number; slug: string; nom: string; prix: number; prix_reference?: number | null;
  type: 'duree' | 'seance'; duree_valeur: number | null; duree_unite: string | null;
}
interface ProduitsReponse {
  success: boolean; data: Produit[];
  multi_mois: { slugs: string[]; max: number };
  multi_seances: { slugs: string[]; max: number };
}
interface MembreTrouve { id: number; prenom: string; nom_initiale: string; a_un_email: boolean }
type Mode = 'wave' | 'orange_money' | 'cash';
type Etape = 'accueil' | 'telephone' | 'formule' | 'coordonnees' | 'sante' | 'contrat' | 'paiement' | 'merci';

const INACTIVITE_MS = 3 * 60 * 1000; // retour à l'accueil après 3 min sans toucher l'écran
const fmtF = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/\s/g, ' ') + ' F';
const MODES: { id: Mode; label: string; aide: string }[] = [
  { id: 'wave', label: 'Wave', aide: 'Vous payez par Wave à l\'accueil.' },
  { id: 'orange_money', label: 'Orange Money', aide: 'Vous payez par Orange Money à l\'accueil.' },
  { id: 'cash', label: 'Espèces', aide: 'Vous payez en espèces à l\'accueil.' },
];

const dureeLabel = (p: Produit): string => {
  if (p.type === 'seance') return p.duree_valeur && p.duree_valeur > 1 ? `${p.duree_valeur} séances` : 'Séance';
  const n = p.duree_valeur ?? 1;
  if (p.duree_unite === 'day') return n === 1 ? '1 jour' : `${n} jours`;
  if (p.duree_unite === 'week') return n === 1 ? '1 semaine' : `${n} semaines`;
  if (p.duree_unite === 'year') return n === 1 ? '1 an' : `${n} ans`;
  return `${n} mois`;
};
const estPromo = (p: Produit) => p.slug.startsWith('promo_') || (p.prix_reference ?? 0) > p.prix;

// ─── Signature au doigt ───────────────────────────────────────────────────────

const ZoneSignature: React.FC<{ onChange: (png: string | null) => void }> = ({ onChange }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dessine = useRef(false);
  const vide = useRef(true);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#111';
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvas.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };
  const debut = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    canvas.current!.setPointerCapture(e.pointerId);
    dessine.current = true;
    const p = point(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };
  const trace = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dessine.current) return;
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    const p = point(e);
    ctx.lineTo(p.x, p.y); ctx.stroke();
    vide.current = false;
  };
  const fin = () => {
    if (!dessine.current) return;
    dessine.current = false;
    if (!vide.current) onChange(canvas.current!.toDataURL('image/png'));
  };
  const effacer = () => {
    const c = canvas.current;
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height);
    vide.current = true;
    onChange(null);
  };

  return (
    <div>
      <canvas ref={canvas} width={700} height={220}
        onPointerDown={debut} onPointerMove={trace} onPointerUp={fin} onPointerLeave={fin}
        className="w-full h-44 bg-white border-2 border-dashed border-gray-300 rounded-2xl touch-none" />
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-gray-500">Signez avec le doigt dans le cadre.</span>
        <button type="button" onClick={effacer} className="text-gray-600 underline">Effacer</button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const TablettePage: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<boolean>(!!getTabletteToken());
  const [catalogue, setCatalogue] = useState<ProduitsReponse | null>(null);
  const [etape, setEtape] = useState<Etape>('accueil');
  const [type, setType] = useState<'nouveau' | 'renouvellement'>('nouveau');
  const [membre, setMembre] = useState<MembreTrouve | null>(null);
  const [produit, setProduit] = useState<Produit | null>(null);
  const [quantite, setQuantite] = useState(1);
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', email: '', address: '' });
  const [apte, setApte] = useState(false);
  const [remarques, setRemarques] = useState('');
  const [accepteContrat, setAccepteContrat] = useState(false);
  const [accepteReglement, setAccepteReglement] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [fin, setFin] = useState<{ prenom: string; montant: number; mode: Mode } | null>(null);
  const [sortie, setSortie] = useState(false);
  const [pin, setPin] = useState('');
  const inactivite = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recommencer = useCallback(() => {
    setEtape('accueil'); setType('nouveau'); setMembre(null); setProduit(null); setQuantite(1);
    setForm({ first_name: '', last_name: '', phone: '', email: '', address: '' });
    setApte(false); setRemarques(''); setAccepteContrat(false); setAccepteReglement(false);
    setSignature(null); setMode(null); setErreur(null); setFin(null);
  }, []);

  // Jeton retiré ou révoqué : la tablette n'est plus activée.
  useEffect(() => {
    const off = () => setActive(false);
    window.addEventListener('tablette:desactivee', off);
    return () => window.removeEventListener('tablette:desactivee', off);
  }, []);

  useEffect(() => {
    if (!active) return;
    tabletteApi.get<ProduitsReponse>('/tablette/produits').then(setCatalogue).catch(() => setErreur('Impossible de charger les formules.'));
  }, [active]);

  // Retour automatique à l'accueil : après 3 min d'inactivité, ou 20 s après le message de fin.
  useEffect(() => {
    const relancer = () => {
      if (inactivite.current) clearTimeout(inactivite.current);
      inactivite.current = setTimeout(recommencer, etape === 'merci' ? 20000 : INACTIVITE_MS);
    };
    relancer();
    window.addEventListener('pointerdown', relancer);
    return () => {
      window.removeEventListener('pointerdown', relancer);
      if (inactivite.current) clearTimeout(inactivite.current);
    };
  }, [etape, recommencer]);

  const multiMois = !!produit && !!catalogue?.multi_mois.slugs.includes(produit.slug);
  const multiSeances = !!produit && !!catalogue?.multi_seances.slugs.includes(produit.slug);
  const quantiteMax = multiSeances ? catalogue?.multi_seances.max ?? 1 : catalogue?.multi_mois.max ?? 1;
  const total = produit ? produit.prix * (multiMois || multiSeances ? quantite : 1) : 0;

  const chercher = async () => {
    setErreur(null); setEnvoi(true);
    try {
      const r = await tabletteApi.post<{ trouve: boolean; membre?: MembreTrouve }>('/tablette/membre', { phone: form.phone });
      if (r.trouve && r.membre) { setMembre(r.membre); setEtape('formule'); }
      else setErreur('Nous ne trouvons pas ce numéro. Vérifiez-le, ou revenez en arrière et choisissez « Première inscription ».');
    } catch { setErreur('Recherche impossible. Demandez à l\'accueil.'); }
    finally { setEnvoi(false); }
  };

  const envoyer = async () => {
    if (!produit || !mode || !signature) return;
    setErreur(null); setEnvoi(true);
    try {
      const r = await tabletteApi.post<{ data: { prenom: string; montant: number; mode_paiement: Mode } }>('/tablette/inscriptions', {
        type,
        member_id: membre?.id ?? null,
        first_name: type === 'nouveau' ? form.first_name.trim() : null,
        last_name: type === 'nouveau' ? form.last_name.trim() : null,
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        product_id: produit.id,
        ...(multiMois && quantite > 1 ? { nombre_mois: quantite } : {}),
        ...(multiSeances && quantite > 1 ? { nombre_seances: quantite } : {}),
        mode_paiement: mode,
        apte_sport: apte,
        sante_remarques: remarques.trim() || null,
        accepte_contrat: accepteContrat,
        accepte_reglement: accepteReglement,
        signature,
      });
      setFin({ prenom: r.data.prenom, montant: r.data.montant, mode: r.data.mode_paiement });
      setEtape('merci');
    } catch (e) {
      const err = e as { message?: string; errors?: Record<string, string[]> };
      setErreur(err.errors ? Object.values(err.errors).flat().join(' ') : err.message ?? 'Envoi impossible. Demandez à l\'accueil.');
    } finally { setEnvoi(false); }
  };

  const quitter = async () => {
    setErreur(null);
    try {
      await tabletteApi.post('/tablette/quitter', { pin });
      localStorage.removeItem(TABLETTE_TOKEN_KEY);
      navigate('/caisse');
    } catch (e) {
      setErreur((e as { message?: string }).message ?? 'Code PIN incorrect.');
    }
  };

  // ─── Écrans ───────────────────────────────────────────────────────────────

  if (!active) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Tablette non activée</h1>
          <p className="text-gray-300">Sur cette tablette, ouvrez la Caisse, connectez-vous avec votre PIN, puis appuyez sur « Tablette client ».</p>
          <button onClick={() => navigate('/caisse')} className="bg-white text-black font-semibold px-6 py-3 rounded-xl">Ouvrir la Caisse</button>
        </div>
      </div>
    );
  }

  const bouton = 'w-full py-4 rounded-2xl text-lg font-semibold transition disabled:opacity-30';
  const champ = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-black';
  const retour = (vers: Etape) => (
    <button type="button" onClick={() => { setErreur(null); setEtape(vers); }} className="text-gray-500 text-base">← Retour</button>
  );
  const blocErreur = erreur && <p className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-base">{erreur}</p>;

  let contenu: React.ReactNode = null;

  if (etape === 'accueil') {
    contenu = (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Bienvenue chez SUNUFITNESS</h1>
        <p className="text-lg text-gray-600">Inscrivez-vous ou renouvelez votre formule en quelques minutes.</p>
        <div className="grid gap-4 pt-4">
          <button onClick={() => { setType('nouveau'); setEtape('formule'); }} className={`${bouton} bg-black text-white`}>Première inscription</button>
          <button onClick={() => { setType('renouvellement'); setEtape('telephone'); }} className={`${bouton} bg-gray-100 text-gray-900`}>Je suis déjà membre</button>
        </div>
      </div>
    );
  } else if (etape === 'telephone') {
    contenu = (
      <div className="space-y-5">
        {retour('accueil')}
        <h2 className="text-2xl font-bold">Votre numéro de téléphone</h2>
        <input inputMode="tel" autoFocus className={champ} placeholder="77 123 45 67" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        {blocErreur}
        <button disabled={form.phone.replace(/\D/g, '').length < 7 || envoi} onClick={chercher} className={`${bouton} bg-black text-white`}>
          {envoi ? 'Recherche…' : 'Continuer'}
        </button>
      </div>
    );
  } else if (etape === 'formule') {
    const produits = [...(catalogue?.data ?? [])].sort((a, b) => Number(estPromo(b)) - Number(estPromo(a)));
    const groupes: { titre: string; liste: Produit[] }[] = [
      { titre: 'Abonnements', liste: produits.filter(p => p.type === 'duree') },
      { titre: 'Séances et packs', liste: produits.filter(p => p.type === 'seance') },
    ];
    contenu = (
      <div className="space-y-5">
        {retour(type === 'renouvellement' ? 'telephone' : 'accueil')}
        <h2 className="text-2xl font-bold">{membre ? `Bonjour ${membre.prenom} ! ` : ''}Choisissez votre formule</h2>
        {groupes.map(g => g.liste.length > 0 && (
          <div key={g.titre} className="space-y-2">
            <p className="text-sm font-semibold text-gray-500 uppercase">{g.titre}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {g.liste.map(p => (
                <button key={p.id} onClick={() => { setProduit(p); setQuantite(1); }}
                  className={`text-left p-4 rounded-2xl border-2 transition ${produit?.id === p.id ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  <p className="font-semibold">{p.nom}</p>
                  <p className="text-sm text-gray-500">{dureeLabel(p)}</p>
                  <p className="mt-1 text-lg font-bold">
                    {fmtF(p.prix)}
                    {(p.prix_reference ?? 0) > p.prix && <span className="ml-2 text-sm font-normal text-gray-400 line-through">{fmtF(p.prix_reference!)}</span>}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
        {/* Barre du bas : quantité (si la formule le permet) et bouton, toujours visibles */}
        <div className="sticky bottom-0 -mx-6 px-6 pt-3 pb-4 bg-white border-t border-gray-100 space-y-3">
          {produit && (multiMois || multiSeances) && (
            <div className="flex items-center justify-between">
              <p className="font-semibold">{multiSeances ? 'Nombre de séances' : 'Nombre de mois'}</p>
              <div className="flex items-center gap-4">
                <button aria-label="Moins" onClick={() => setQuantite(q => Math.max(1, q - 1))} disabled={quantite <= 1} className="w-12 h-12 rounded-full border text-2xl disabled:opacity-30">−</button>
                <span className="w-8 text-center text-2xl font-bold">{quantite}</span>
                <button aria-label="Plus" onClick={() => setQuantite(q => Math.min(quantiteMax, q + 1))} disabled={quantite >= quantiteMax} className="w-12 h-12 rounded-full border text-2xl disabled:opacity-30">+</button>
              </div>
            </div>
          )}
          <button disabled={!produit} onClick={() => setEtape(type === 'nouveau' ? 'coordonnees' : 'sante')} className={`${bouton} bg-black text-white`}>
            {produit ? `Continuer · ${fmtF(total)}` : 'Choisissez une formule'}
          </button>
        </div>
      </div>
    );
  } else if (etape === 'coordonnees') {
    const ok = form.first_name.trim() && form.last_name.trim() && form.phone.replace(/\D/g, '').length >= 7;
    contenu = (
      <div className="space-y-4">
        {retour('formule')}
        <h2 className="text-2xl font-bold">Vos informations</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={champ} placeholder="Prénom *" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
          <input className={champ} placeholder="Nom *" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
        </div>
        <input inputMode="tel" className={champ} placeholder="Téléphone *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <input inputMode="email" className={champ} placeholder="E-mail (pour recevoir votre QR code)" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <input className={champ} placeholder="Adresse (quartier, ville)" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
        <button disabled={!ok} onClick={() => setEtape('sante')} className={`${bouton} bg-black text-white`}>Continuer</button>
      </div>
    );
  } else if (etape === 'sante') {
    contenu = (
      <div className="space-y-5">
        {retour(type === 'nouveau' ? 'coordonnees' : 'formule')}
        <h2 className="text-2xl font-bold">Votre santé</h2>
        {type === 'renouvellement' && !membre?.a_un_email && (
          <input inputMode="email" className={champ} placeholder="Votre e-mail (pour recevoir votre QR code)" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        )}
        <label className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4 text-lg">
          <input type="checkbox" checked={apte} onChange={e => setApte(e.target.checked)} className="w-7 h-7 mt-0.5 accent-black" />
          <span>Je déclare être apte à pratiquer une activité sportive.</span>
        </label>
        <textarea rows={3} className={champ} placeholder="Blessure, douleur, traitement ou contre-indication à signaler au coach (facultatif)"
          value={remarques} onChange={e => setRemarques(e.target.value)} />
        <button disabled={!apte} onClick={() => setEtape('contrat')} className={`${bouton} bg-black text-white`}>Continuer</button>
      </div>
    );
  } else if (etape === 'contrat') {
    contenu = (
      <div className="space-y-4">
        {retour('sante')}
        <h2 className="text-2xl font-bold">Contrat et règlement</h2>
        <div className="max-h-[38vh] overflow-y-auto bg-gray-50 rounded-2xl p-4 space-y-4 text-base">
          <p className="font-bold">Contrat d'abonnement</p>
          {CONTRAT.map(s => (
            <div key={s.titre}>
              <p className="font-semibold">{s.titre}</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">{s.points.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
          <p className="font-bold pt-2">Règlement intérieur</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">{REGLEMENT.map(t => <li key={t}>{t}</li>)}</ul>
          <p className="text-sm text-gray-500">Le texte complet est disponible à l'accueil.</p>
        </div>
        <label className="flex items-center gap-4 text-lg">
          <input type="checkbox" checked={accepteContrat} onChange={e => setAccepteContrat(e.target.checked)} className="w-7 h-7 accent-black" />
          J'accepte le contrat d'abonnement.
        </label>
        <label className="flex items-center gap-4 text-lg">
          <input type="checkbox" checked={accepteReglement} onChange={e => setAccepteReglement(e.target.checked)} className="w-7 h-7 accent-black" />
          J'accepte le règlement intérieur.
        </label>
        <ZoneSignature onChange={setSignature} />
        <button disabled={!accepteContrat || !accepteReglement || !signature} onClick={() => setEtape('paiement')} className={`${bouton} bg-black text-white`}>Continuer</button>
      </div>
    );
  } else if (etape === 'paiement' && produit) {
    contenu = (
      <div className="space-y-5">
        {retour('contrat')}
        <h2 className="text-2xl font-bold">Paiement</h2>
        <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
          <p className="text-gray-600">{produit.nom}{(multiMois || multiSeances) && quantite > 1 ? ` × ${quantite}${multiMois ? ' mois' : ''}` : ''}</p>
          <p className="text-3xl font-bold">{fmtF(total)}</p>
        </div>
        <p className="text-lg">Comment allez-vous payer ?</p>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`py-5 rounded-2xl border-2 text-lg font-semibold ${mode === m.id ? 'border-black bg-black text-white' : 'border-gray-200'}`}>{m.label}</button>
          ))}
        </div>
        {blocErreur}
        <button disabled={!mode || envoi} onClick={envoyer} className={`${bouton} bg-black text-white`}>
          {envoi ? 'Envoi…' : 'Valider mon inscription'}
        </button>
        <p className="text-sm text-gray-500 text-center">Votre inscription sera active dès que l'accueil aura reçu votre paiement.</p>
      </div>
    );
  } else if (etape === 'merci' && fin) {
    contenu = (
      <div className="space-y-6 text-center">
        <div className="text-6xl">✓</div>
        <h2 className="text-3xl font-bold">Merci {fin.prenom} !</h2>
        <p className="text-xl">Présentez-vous à l'accueil pour régler <span className="font-bold">{fmtF(fin.montant)}</span> ({MODES.find(m => m.id === fin.mode)?.label}).</p>
        <p className="text-gray-600">Votre QR code d'accès vous sera envoyé dès la confirmation du paiement.</p>
        <button onClick={recommencer} className={`${bouton} bg-gray-100 text-gray-900`}>Terminer</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 select-none">
      <div className="max-w-2xl mx-auto px-6 py-8">{contenu}</div>

      {/* Sortie du mode tablette : réservée au personnel (PIN) */}
      <button onClick={() => { setSortie(true); setPin(''); setErreur(null); }} aria-label="Personnel"
        className="fixed bottom-3 right-3 w-10 h-10 rounded-full text-gray-300 text-xl">⋯</button>
      {sortie && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs space-y-4">
            <p className="font-bold">Quitter le mode tablette</p>
            <input type="password" inputMode="numeric" maxLength={4} autoFocus className={champ} placeholder="PIN du personnel"
              value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} />
            {blocErreur}
            <div className="flex gap-2">
              <button onClick={() => setSortie(false)} className="flex-1 py-3 rounded-xl bg-gray-100">Annuler</button>
              <button disabled={pin.length !== 4} onClick={quitter} className="flex-1 py-3 rounded-xl bg-black text-white disabled:opacity-30">Quitter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablettePage;
