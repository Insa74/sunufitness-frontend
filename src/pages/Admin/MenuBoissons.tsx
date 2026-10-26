import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { caisseApi } from '../../services/caisseApiClient';

// Gestion du menu des boissons du bar (admin) + QR code à imprimer.

interface Boisson { id: number; nom: string; prix: number; disponible: boolean; ordre: number }
interface Categorie { id: number; nom: string; ordre: number; boissons: Boisson[] }

const URL_MENU = 'https://sunufitness.com/menu-boissons';
const champ = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black';

function msgErreur(e: any): string {
  if (e?.errors) return Object.values(e.errors).flat().join(' ');
  return e?.message || 'Une erreur est survenue.';
}

// ─── Ligne boisson (affichage / édition) ──────────────────────────────────────

const LigneBoisson: React.FC<{
  b: Boisson;
  premier: boolean;
  dernier: boolean;
  onMonter: () => void;
  onDescendre: () => void;
  onChange: (msg?: string) => void;
  onErreur: (m: string) => void;
}> = ({ b, premier, dernier, onMonter, onDescendre, onChange, onErreur }) => {
  const [edition, setEdition] = useState(false);
  const [nom, setNom] = useState(b.nom);
  const [prix, setPrix] = useState(String(b.prix));
  const [confirmSuppr, setConfirmSuppr] = useState(false);

  const enregistrer = async () => {
    try {
      await caisseApi.put(`/admin/menu-boissons/boissons/${b.id}`, { nom: nom.trim(), prix: Number(prix) });
      setEdition(false);
      onChange('Boisson modifiée.');
    } catch (e) { onErreur(msgErreur(e)); }
  };
  const basculer = async () => {
    try {
      await caisseApi.put(`/admin/menu-boissons/boissons/${b.id}`, { disponible: !b.disponible });
      onChange(b.disponible ? 'Marquée épuisée (masquée du menu).' : 'De nouveau disponible.');
    } catch (e) { onErreur(msgErreur(e)); }
  };
  const supprimer = async () => {
    try {
      await caisseApi.del(`/admin/menu-boissons/boissons/${b.id}`);
      onChange('Boisson supprimée.');
    } catch (e) { onErreur(msgErreur(e)); }
  };

  if (edition) {
    return (
      <li className="py-2 flex flex-wrap items-center gap-2">
        <input className={`${champ} flex-1 min-w-[140px]`} value={nom} onChange={(e) => setNom(e.target.value)} />
        <input className={`${champ} w-28`} type="number" min={0} value={prix} onChange={(e) => setPrix(e.target.value)} />
        <span className="text-sm text-gray-500">F</span>
        <button onClick={enregistrer} className="px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold">OK</button>
        <button onClick={() => { setEdition(false); setNom(b.nom); setPrix(String(b.prix)); }} className="px-3 py-2 rounded-lg border text-sm">Annuler</button>
      </li>
    );
  }

  return (
    <li className={`py-2 flex flex-wrap items-center gap-2 ${b.disponible ? '' : 'opacity-50'}`}>
      <div className="flex flex-col">
        <button disabled={premier} onClick={onMonter} className="text-xs leading-none text-gray-400 disabled:opacity-20" aria-label="Monter">▲</button>
        <button disabled={dernier} onClick={onDescendre} className="text-xs leading-none text-gray-400 disabled:opacity-20" aria-label="Descendre">▼</button>
      </div>
      <span className="flex-1 min-w-[120px] text-sm font-medium">
        {b.nom}{!b.disponible && <span className="ml-2 text-xs text-red-600 font-semibold">ÉPUISÉ</span>}
      </span>
      <span className="text-sm font-bold w-24 text-right">{b.prix.toLocaleString('fr-FR')} F</span>
      <button onClick={basculer} className="text-xs px-2 py-1 rounded-md border">{b.disponible ? 'Épuisé' : 'Disponible'}</button>
      <button onClick={() => setEdition(true)} className="text-xs px-2 py-1 rounded-md border">Modifier</button>
      {confirmSuppr ? (
        <>
          <button onClick={supprimer} className="text-xs px-2 py-1 rounded-md bg-red-600 text-white">Supprimer ?</button>
          <button onClick={() => setConfirmSuppr(false)} className="text-xs px-2 py-1 rounded-md border">Non</button>
        </>
      ) : (
        <button onClick={() => setConfirmSuppr(true)} className="text-xs px-2 py-1 rounded-md border text-red-600">✕</button>
      )}
    </li>
  );
};

// ─── Bloc catégorie ───────────────────────────────────────────────────────────

const BlocCategorie: React.FC<{
  c: Categorie;
  premier: boolean;
  dernier: boolean;
  onMonter: () => void;
  onDescendre: () => void;
  onChange: (msg?: string) => void;
  onErreur: (m: string) => void;
}> = ({ c, premier, dernier, onMonter, onDescendre, onChange, onErreur }) => {
  const [renommer, setRenommer] = useState(false);
  const [nomCat, setNomCat] = useState(c.nom);
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [confirmSuppr, setConfirmSuppr] = useState(false);

  const ajouter = async () => {
    if (!nom.trim() || prix === '') { onErreur('Indique le nom et le prix de la boisson.'); return; }
    try {
      await caisseApi.post('/admin/menu-boissons/boissons', { categorie_id: c.id, nom: nom.trim(), prix: Number(prix) });
      setNom(''); setPrix('');
      onChange('Boisson ajoutée.');
    } catch (e) { onErreur(msgErreur(e)); }
  };
  const enregistrerNom = async () => {
    try {
      await caisseApi.put(`/admin/menu-boissons/categories/${c.id}`, { nom: nomCat.trim() });
      setRenommer(false);
      onChange('Catégorie renommée.');
    } catch (e) { onErreur(msgErreur(e)); }
  };
  const supprimer = async () => {
    try {
      await caisseApi.del(`/admin/menu-boissons/categories/${c.id}`);
      onChange('Catégorie supprimée.');
    } catch (e) { onErreur(msgErreur(e)); }
  };
  const deplacerBoisson = async (i: number, sens: -1 | 1) => {
    const ids = c.boissons.map((b) => b.id);
    [ids[i], ids[i + sens]] = [ids[i + sens], ids[i]];
    try {
      await caisseApi.put('/admin/menu-boissons/ordre', { categorie_id: c.id, boissons: ids });
      onChange();
    } catch (e) { onErreur(msgErreur(e)); }
  };

  return (
    <section className="bg-white rounded-2xl border p-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="flex flex-col">
          <button disabled={premier} onClick={onMonter} className="text-xs leading-none text-gray-400 disabled:opacity-20" aria-label="Monter">▲</button>
          <button disabled={dernier} onClick={onDescendre} className="text-xs leading-none text-gray-400 disabled:opacity-20" aria-label="Descendre">▼</button>
        </div>
        {renommer ? (
          <>
            <input className={`${champ} flex-1`} value={nomCat} onChange={(e) => setNomCat(e.target.value)} />
            <button onClick={enregistrerNom} className="px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold">OK</button>
            <button onClick={() => { setRenommer(false); setNomCat(c.nom); }} className="px-3 py-2 rounded-lg border text-sm">Annuler</button>
          </>
        ) : (
          <>
            <h2 className="flex-1 font-bold text-lg">{c.nom} <span className="text-sm font-normal text-gray-400">({c.boissons.length})</span></h2>
            <button onClick={() => setRenommer(true)} className="text-xs px-2 py-1 rounded-md border">Renommer</button>
            {confirmSuppr ? (
              <>
                <span className="text-xs text-red-600">Supprimer la catégorie et ses {c.boissons.length} boisson(s) ?</span>
                <button onClick={supprimer} className="text-xs px-2 py-1 rounded-md bg-red-600 text-white">Oui</button>
                <button onClick={() => setConfirmSuppr(false)} className="text-xs px-2 py-1 rounded-md border">Non</button>
              </>
            ) : (
              <button onClick={() => setConfirmSuppr(true)} className="text-xs px-2 py-1 rounded-md border text-red-600">Supprimer</button>
            )}
          </>
        )}
      </div>

      <ul className="divide-y">
        {c.boissons.map((b, i) => (
          <LigneBoisson key={`${b.id}-${b.nom}-${b.prix}-${b.disponible}`} b={b}
            premier={i === 0} dernier={i === c.boissons.length - 1}
            onMonter={() => deplacerBoisson(i, -1)} onDescendre={() => deplacerBoisson(i, 1)}
            onChange={onChange} onErreur={onErreur} />
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-dashed">
        <input className={`${champ} flex-1 min-w-[140px]`} placeholder="Nouvelle boisson (ex. Jus de bissap)" value={nom}
          onChange={(e) => setNom(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ajouter()} />
        <input className={`${champ} w-28`} type="number" min={0} placeholder="Prix" value={prix}
          onChange={(e) => setPrix(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ajouter()} />
        <span className="text-sm text-gray-500">F</span>
        <button onClick={ajouter} className="px-3 py-2 rounded-lg bg-[#05835e] text-white text-sm font-semibold">+ Ajouter</button>
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminMenuBoissons: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [nouvelleCat, setNouvelleCat] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  const charger = useCallback(async () => {
    try {
      const res = await caisseApi.get<{ data: Categorie[] }>('/admin/menu-boissons');
      setCategories(res.data ?? []);
      setErreur(null);
    } catch (e: any) {
      setErreur(e?.message === 'Unauthenticated.' ? 'Session expirée : reconnecte-toi avec ton PIN sur /caisse.' : msgErreur(e));
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);
  useEffect(() => {
    const fin = () => navigate('/caisse');
    window.addEventListener('caisse:session-expired', fin);
    return () => window.removeEventListener('caisse:session-expired', fin);
  }, [navigate]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const apresChangement = (msg?: string) => { if (msg) setToast(msg); setErreur(null); charger(); };

  const ajouterCategorie = async () => {
    if (!nouvelleCat.trim()) return;
    try {
      await caisseApi.post('/admin/menu-boissons/categories', { nom: nouvelleCat.trim() });
      setNouvelleCat('');
      apresChangement('Catégorie ajoutée.');
    } catch (e) { setErreur(msgErreur(e)); }
  };

  const deplacerCategorie = async (i: number, sens: -1 | 1) => {
    const ids = categories.map((c) => c.id);
    [ids[i], ids[i + sens]] = [ids[i + sens], ids[i]];
    try {
      await caisseApi.put('/admin/menu-boissons/ordre', { categories: ids });
      charger();
    } catch (e) { setErreur(msgErreur(e)); }
  };

  const telechargerQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qr-menu-boissons-sunufitness.png';
    a.click();
  };

  const imprimerQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>QR menu du bar</title>
      <style>body{font-family:Arial,sans-serif;text-align:center;padding:40px;color:#2c5f4f}
      h1{margin:0 0 4px;font-size:32px}p{margin:0 0 24px;color:#b89968;font-weight:bold}
      img.qr{width:300px;height:300px}small{display:block;margin-top:16px;color:#555;font-size:14px}</style></head>
      <body><img src="/images/log.png" style="height:60px" alt="SUNUFITNESS"><h1>Menu du bar</h1>
      <p>Scannez pour voir nos boissons et nos prix</p>
      <img class="qr" src="${canvas.toDataURL('image/png')}" alt="QR code"><small>sunufitness.com/menu-boissons</small>
      <script>window.onload=function(){window.print()}</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/admin')} className="text-sm text-gray-300 hover:text-white">← Hub</button>
        <h1 className="font-bold">Menu du bar</h1>
        <a href="/menu-boissons" target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">Voir ↗</a>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <section className="bg-white rounded-2xl border p-4 flex flex-col sm:flex-row items-center gap-4">
          <div ref={qrRef} className="p-2 bg-white border rounded-lg">
            <QRCodeCanvas value={URL_MENU} size={140} level="M" marginSize={2} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-bold">QR code du menu</h2>
            <p className="text-sm text-gray-500 mb-3">À imprimer et poser sur le bar et les tables. Il ouvre {URL_MENU.replace('https://', '')} — il reste valable même quand tu changes les prix.</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <button onClick={imprimerQr} className="px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold">🖨️ Imprimer</button>
              <button onClick={telechargerQr} className="px-3 py-2 rounded-lg border text-sm font-semibold">Télécharger (PNG)</button>
            </div>
          </div>
        </section>

        {erreur && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{erreur}</div>}
        {chargement && <p className="text-sm text-gray-500">Chargement…</p>}

        {!chargement && categories.length === 0 && !erreur && (
          <p className="text-sm text-gray-500">Commence par créer une catégorie (ex. Jus frais, Smoothies, Shakes protéinés, Cafés, Eaux).</p>
        )}

        {categories.map((c, i) => (
          <BlocCategorie key={`${c.id}-${c.nom}`} c={c}
            premier={i === 0} dernier={i === categories.length - 1}
            onMonter={() => deplacerCategorie(i, -1)} onDescendre={() => deplacerCategorie(i, 1)}
            onChange={apresChangement} onErreur={setErreur} />
        ))}

        <section className="bg-white rounded-2xl border border-dashed p-4 flex flex-wrap gap-2">
          <input className={`${champ} flex-1 min-w-[160px]`} placeholder="Nouvelle catégorie (ex. Smoothies)" value={nouvelleCat}
            onChange={(e) => setNouvelleCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ajouterCategorie()} />
          <button onClick={ajouterCategorie} className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold">+ Catégorie</button>
        </section>

        <p className="text-xs text-gray-400">« Épuisé » masque la boisson du menu public sans la supprimer. Les flèches ▲▼ changent l'ordre d'affichage.</p>
      </main>

      {toast && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">{toast}</div>}
    </div>
  );
};

export default AdminMenuBoissons;
