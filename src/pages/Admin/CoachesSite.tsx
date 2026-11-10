import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi } from '../../services/caisseApiClient';
import { CoachProfileAdmin, initiales } from '../../utils/coachProfile';

// Nos coaches : gestion des profils affichés sur la page publique /nos-coaches.
// Indépendant de la gestion des coachs (PIN, pointage) de /admin/coaches.

const champ = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black';
const TYPES_PHOTO = ['image/jpeg', 'image/png', 'image/webp'];
const TAILLE_MAX = 2 * 1024 * 1024;
const BIO_MAX = 2000;

function msgErreur(e: any): string {
  if (e?.errors) return Object.values(e.errors).flat().join(' ');
  // Réponse non JSON (ex. 413 du serveur si la photo dépasse la limite PHP)
  if (e instanceof SyntaxError) return 'Réponse inattendue du serveur (photo trop lourde ?). Réessaie avec une image plus légère.';
  return e?.message || 'Une erreur est survenue.';
}

const Vignette: React.FC<{ nom: string; url: string | null; taille?: string }> = ({ nom, url, taille = 'w-12 h-12' }) => {
  const [echec, setEchec] = useState(false);
  useEffect(() => setEchec(false), [url]);
  if (url && !echec) {
    return <img src={url} alt={nom} onError={() => setEchec(true)} className={`${taille} rounded-full object-cover flex-shrink-0 border`} />;
  }
  return (
    <span className={`${taille} rounded-full bg-[#2c5f4f] text-white font-bold text-sm flex items-center justify-center flex-shrink-0`} aria-hidden="true">
      {initiales(nom)}
    </span>
  );
};

// ─── Formulaire ajout / modification ──────────────────────────────────────────

const Formulaire: React.FC<{
  profil: CoachProfileAdmin | null;
  onEnregistre: (msg: string) => void;
  onAnnuler: () => void;
  onErreur: (m: string) => void;
}> = ({ profil, onEnregistre, onAnnuler, onErreur }) => {
  const [nom, setNom] = useState(profil?.display_name ?? '');
  const [specialite, setSpecialite] = useState(profil?.specialty ?? '');
  const [bio, setBio] = useState(profil?.bio ?? '');
  const [publie, setPublie] = useState(profil?.is_published ?? true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const inputPhoto = useRef<HTMLInputElement>(null);

  // Aperçu local de la photo choisie, libéré au changement et au démontage
  useEffect(() => {
    if (!photo) { setApercu(null); return; }
    const url = URL.createObjectURL(photo);
    setApercu(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const choisirPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && !TYPES_PHOTO.includes(f.type)) {
      onErreur('Format de photo non accepté : JPEG, PNG ou WebP uniquement.');
      e.target.value = '';
      return;
    }
    if (f && f.size > TAILLE_MAX) {
      onErreur('Photo trop lourde : 2 Mo maximum.');
      e.target.value = '';
      return;
    }
    setPhoto(f);
  };

  const retirerPhotoChoisie = () => {
    setPhoto(null);
    if (inputPhoto.current) inputPhoto.current.value = '';
  };

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) { onErreur('Indique le nom du coach.'); return; }
    const form = new FormData();
    form.append('display_name', nom.trim());
    form.append('specialty', specialite.trim());
    form.append('bio', bio.trim());
    form.append('is_published', publie ? '1' : '0');
    if (photo) form.append('photo', photo);
    setEnvoi(true);
    try {
      if (profil) {
        // PHP ne lit pas le multipart en PUT : POST + _method=PUT (method spoofing Laravel)
        form.append('_method', 'PUT');
        await caisseApi.postForm(`/admin/coach-profiles/${profil.id}`, form);
        onEnregistre('Profil modifié.');
      } else {
        await caisseApi.postForm('/admin/coach-profiles', form);
        onEnregistre('Coach ajouté.');
      }
    } catch (err) {
      onErreur(msgErreur(err));
    } finally {
      setEnvoi(false);
    }
  };

  const photoAffichee = apercu ?? profil?.photo_url ?? null;

  return (
    <form onSubmit={enregistrer} className="bg-white rounded-2xl border p-4 space-y-3">
      <h2 className="font-bold">{profil ? `Modifier : ${profil.display_name}` : 'Ajouter un coach'}</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col items-center gap-2 sm:w-40">
          <Vignette nom={nom || '?'} url={photoAffichee} taille="w-28 h-28" />
          <label className="text-xs px-3 py-1.5 rounded-md border cursor-pointer hover:bg-gray-50">
            {photoAffichee ? 'Changer la photo' : 'Choisir une photo'}
            <input ref={inputPhoto} type="file" accept="image/jpeg,image/png,image/webp" onChange={choisirPhoto} className="hidden" />
          </label>
          {photo && <button type="button" onClick={retirerPhotoChoisie} className="text-xs text-gray-500 underline">Annuler ce choix</button>}
          <p className="text-[11px] text-gray-400 text-center">JPEG, PNG ou WebP, 2 Mo max. Recadrée en carré.</p>
        </div>

        <div className="flex-1 space-y-3">
          <input className={`${champ} w-full`} placeholder="Nom affiché *" maxLength={150} required
            value={nom} onChange={(e) => setNom(e.target.value)} />
          <input className={`${champ} w-full`} placeholder="Spécialité (ex. Musculation, Yoga, Natation)" maxLength={150}
            value={specialite} onChange={(e) => setSpecialite(e.target.value)} />
          <div>
            <textarea className={`${champ} w-full min-h-[120px]`} placeholder="Présentation (parcours, diplômes, approche…)" maxLength={BIO_MAX}
              value={bio} onChange={(e) => setBio(e.target.value)} />
            <p className="text-right text-[11px] text-gray-400">{bio.length}/{BIO_MAX}</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={publie} onChange={(e) => setPublie(e.target.checked)} />
            Publié sur le site
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        {profil && <button type="button" onClick={onAnnuler} className="px-3 py-2 rounded-lg border text-sm">Annuler</button>}
        <button type="submit" disabled={envoi} className="px-4 py-2 rounded-lg bg-[#2c5f4f] text-white text-sm font-semibold disabled:opacity-50">
          {envoi ? 'Enregistrement…' : profil ? 'Enregistrer' : '+ Ajouter'}
        </button>
      </div>
    </form>
  );
};

// ─── Ligne de la liste ────────────────────────────────────────────────────────

const LigneProfil: React.FC<{
  p: CoachProfileAdmin;
  premier: boolean;
  dernier: boolean;
  onMonter: () => void;
  onDescendre: () => void;
  onBasculer: () => void;
  onModifier: () => void;
  onSupprimer: () => void;
}> = ({ p, premier, dernier, onMonter, onDescendre, onBasculer, onModifier, onSupprimer }) => {
  const [confirmSuppr, setConfirmSuppr] = useState(false);
  return (
    <li className={`py-3 flex flex-wrap items-center gap-3 ${p.is_published ? '' : 'opacity-60'}`}>
      <div className="flex flex-col">
        <button disabled={premier} onClick={onMonter} className="text-xs leading-none text-gray-400 disabled:opacity-20" aria-label="Monter">▲</button>
        <button disabled={dernier} onClick={onDescendre} className="text-xs leading-none text-gray-400 disabled:opacity-20" aria-label="Descendre">▼</button>
      </div>
      <Vignette nom={p.display_name} url={p.photo_url} />
      <span className="flex-1 min-w-[140px] text-sm">
        <span className="font-medium">{p.display_name}</span>
        {p.is_published
          ? <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold">PUBLIÉ</span>
          : <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-bold">MASQUÉ</span>}
        {p.specialty && <span className="block text-xs text-[#b89968] font-medium">{p.specialty}</span>}
      </span>
      <button onClick={onBasculer} className="text-xs px-2 py-1 rounded-md border">{p.is_published ? 'Masquer' : 'Publier'}</button>
      <button onClick={onModifier} className="text-xs px-2 py-1 rounded-md border">Modifier</button>
      {confirmSuppr ? (
        <>
          <span className="text-xs text-red-600">Supprimer ce profil ?</span>
          <button onClick={onSupprimer} className="text-xs px-2 py-1 rounded-md bg-red-600 text-white">Oui</button>
          <button onClick={() => setConfirmSuppr(false)} className="text-xs px-2 py-1 rounded-md border">Non</button>
        </>
      ) : (
        <button onClick={() => setConfirmSuppr(true)} className="text-xs px-2 py-1 rounded-md border text-red-600" aria-label="Supprimer">✕</button>
      )}
    </li>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminCoachesSite: React.FC = () => {
  const navigate = useNavigate();
  const [profils, setProfils] = useState<CoachProfileAdmin[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [enEdition, setEnEdition] = useState<CoachProfileAdmin | null>(null);
  // Change de valeur pour remettre le formulaire d'ajout à zéro après un enregistrement
  const [cleFormulaire, setCleFormulaire] = useState(0);

  const charger = useCallback(async () => {
    try {
      const res = await caisseApi.get<{ data: CoachProfileAdmin[] }>('/admin/coach-profiles');
      setProfils(res.data ?? []);
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

  const apresEnregistrement = (msg: string) => {
    setToast(msg);
    setErreur(null);
    setEnEdition(null);
    setCleFormulaire((k) => k + 1);
    charger();
  };

  const deplacer = async (p: CoachProfileAdmin, sens: 'move-up' | 'move-down') => {
    try {
      const res = await caisseApi.patch<{ data: CoachProfileAdmin[] }>(`/admin/coach-profiles/${p.id}/${sens}`);
      setProfils(res.data ?? []);
      setErreur(null);
    } catch (e) { setErreur(msgErreur(e)); }
  };

  const basculer = async (p: CoachProfileAdmin) => {
    try {
      await caisseApi.patch(`/admin/coach-profiles/${p.id}/publish`);
      setToast(p.is_published ? 'Profil masqué du site.' : 'Profil publié sur le site.');
      setErreur(null);
      charger();
    } catch (e) { setErreur(msgErreur(e)); }
  };

  const supprimer = async (p: CoachProfileAdmin) => {
    try {
      await caisseApi.del(`/admin/coach-profiles/${p.id}`);
      if (enEdition?.id === p.id) setEnEdition(null);
      setToast('Profil supprimé.');
      setErreur(null);
      charger();
    } catch (e) { setErreur(msgErreur(e)); }
  };

  const modifier = (p: CoachProfileAdmin) => {
    setEnEdition(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/admin')} className="text-sm text-gray-300 hover:text-white">← Hub</button>
        <h1 className="font-bold">Coaches (site)</h1>
        <a href="/nos-coaches" target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">Voir ↗</a>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        {erreur && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{erreur}</div>}

        <Formulaire
          key={enEdition ? `edition-${enEdition.id}` : `ajout-${cleFormulaire}`}
          profil={enEdition}
          onEnregistre={apresEnregistrement}
          onAnnuler={() => setEnEdition(null)}
          onErreur={setErreur}
        />

        <section className="bg-white rounded-2xl border p-4">
          <h2 className="font-bold mb-1">
            Profils <span className="text-sm font-normal text-gray-400">({profils.length})</span>
          </h2>
          {chargement && <p className="text-sm text-gray-500">Chargement…</p>}
          {!chargement && profils.length === 0 && !erreur && (
            <p className="text-sm text-gray-500">Aucun coach pour l'instant. Ajoute le premier avec le formulaire ci-dessus.</p>
          )}
          <ul className="divide-y">
            {profils.map((p, i) => (
              <LigneProfil key={p.id} p={p}
                premier={i === 0} dernier={i === profils.length - 1}
                onMonter={() => deplacer(p, 'move-up')} onDescendre={() => deplacer(p, 'move-down')}
                onBasculer={() => basculer(p)} onModifier={() => modifier(p)} onSupprimer={() => supprimer(p)} />
            ))}
          </ul>
        </section>

        <p className="text-xs text-gray-400">L'ordre de cette liste est celui de la page publique « Nos coaches ». « Masquer » retire le coach du site sans le supprimer. Ces profils sont indépendants des comptes coachs (PIN, pointage).</p>
      </main>

      {toast && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">{toast}</div>}
    </div>
  );
};

export default AdminCoachesSite;
