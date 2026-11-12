import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caisseApi } from '../../services/caisseApiClient';
import {
  CLE_FONDATEUR,
  FONDATEUR_DEFAUT,
  PHOTO_FONDATEUR_DEFAUT,
  SiteBlockAdmin,
} from '../../utils/fondateur';

// Fondateur : gestion de la section « Fondateur » de la page publique /about.
// Bloc absent ou masqué : la page À propos affiche le texte par défaut (FONDATEUR_DEFAUT).

const champ = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black';
const TYPES_PHOTO = ['image/jpeg', 'image/png', 'image/webp'];
const TAILLE_MAX = 2 * 1024 * 1024;
const NOM_MAX = 60;
const SOUS_TITRE_MAX = 255;
const TEXTE_MAX = 10000;
const URL_BLOC = `/admin/site-blocks/${CLE_FONDATEUR}`;

function msgErreur(e: any): string {
  if (e?.errors) return Object.values(e.errors).flat().join(' ');
  // Réponse non JSON (ex. 413 du serveur si la photo dépasse la limite PHP)
  if (e instanceof SyntaxError) return 'Réponse inattendue du serveur (photo trop lourde ?). Réessaie avec une image plus légère.';
  return e?.message || 'Une erreur est survenue.';
}

// ─── Formulaire ───────────────────────────────────────────────────────────────

const Formulaire: React.FC<{
  bloc: SiteBlockAdmin | null;
  onEnregistre: (msg: string, avertissement?: string) => void;
  onErreur: (m: string) => void;
}> = ({ bloc, onEnregistre, onErreur }) => {
  const [nom, setNom] = useState(bloc?.title ?? FONDATEUR_DEFAUT.title);
  const [sousTitre, setSousTitre] = useState(bloc ? bloc.subtitle ?? '' : FONDATEUR_DEFAUT.subtitle ?? '');
  const [texte, setTexte] = useState(bloc?.body ?? FONDATEUR_DEFAUT.body);
  const [publie, setPublie] = useState(bloc?.is_published ?? true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(null);
  const [photoEchec, setPhotoEchec] = useState(false);
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
    setPhotoEchec(false);
    setPhoto(f);
  };

  const retirerPhotoChoisie = () => {
    setPhoto(null);
    if (inputPhoto.current) inputPhoto.current.value = '';
  };

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) { onErreur('Indique le nom du fondateur.'); return; }
    if (!texte.trim()) { onErreur('Le texte de présentation ne peut pas être vide.'); return; }
    setEnvoi(true);
    try {
      await caisseApi.put(URL_BLOC, {
        title: nom.trim(),
        subtitle: sousTitre.trim() || null,
        body: texte.trim(),
        is_published: publie,
      });
    } catch (err) {
      onErreur(msgErreur(err));
      setEnvoi(false);
      return;
    }
    // La photo s'envoie à part : le bloc existe forcément après le PUT
    if (photo) {
      const form = new FormData();
      form.append('photo', photo);
      try {
        await caisseApi.postForm(`${URL_BLOC}/photo`, form);
      } catch (err) {
        setEnvoi(false);
        onEnregistre('Texte enregistré.', `Texte enregistré, mais la photo n'a pas pu être envoyée : ${msgErreur(err)}`);
        return;
      }
    }
    setEnvoi(false);
    onEnregistre(photo ? 'Section et photo enregistrées.' : 'Section enregistrée.');
  };

  const photoServeur = !photoEchec && bloc?.photo_url ? bloc.photo_url : PHOTO_FONDATEUR_DEFAUT;
  const photoAffichee = apercu ?? photoServeur;

  return (
    <form onSubmit={enregistrer} className="bg-white rounded-2xl border p-4 space-y-3">
      <h2 className="font-bold">Section « Fondateur » de la page À propos</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col items-center gap-2 sm:w-44">
          <img
            src={photoAffichee}
            alt={nom || 'Fondateur'}
            onError={() => setPhotoEchec(true)}
            className="w-36 h-44 rounded-xl object-cover border"
          />
          <label className="text-xs px-3 py-1.5 rounded-md border cursor-pointer hover:bg-gray-50">
            Changer la photo
            <input ref={inputPhoto} type="file" accept="image/jpeg,image/png,image/webp" onChange={choisirPhoto} className="hidden" />
          </label>
          {photo && <button type="button" onClick={retirerPhotoChoisie} className="text-xs text-gray-500 underline">Annuler ce choix</button>}
          <p className="text-[11px] text-gray-400 text-center">JPEG, PNG ou WebP, 2 Mo max. Format portrait conseillé.</p>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <input className={`${champ} w-full`} placeholder="Nom affiché *" maxLength={NOM_MAX} required
              value={nom} onChange={(e) => setNom(e.target.value)} />
            <p className="text-right text-[11px] text-gray-400">{nom.length}/{NOM_MAX} — affiché sur une seule ligne</p>
          </div>
          <input className={`${champ} w-full`} placeholder="Sous-titre (ex. Fondateur de SUNUFITNESS)" maxLength={SOUS_TITRE_MAX}
            value={sousTitre} onChange={(e) => setSousTitre(e.target.value)} />
          <div>
            <textarea className={`${champ} w-full min-h-[240px]`} placeholder="Présentation *" maxLength={TEXTE_MAX} required
              value={texte} onChange={(e) => setTexte(e.target.value)} />
            <p className="text-right text-[11px] text-gray-400">{texte.length}/{TEXTE_MAX} — les retours à la ligne sont conservés</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={publie} onChange={(e) => setPublie(e.target.checked)} />
            Publié sur le site
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={envoi} className="px-4 py-2 rounded-lg bg-[#2c5f4f] text-white text-sm font-semibold disabled:opacity-50">
          {envoi ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminFondateur: React.FC = () => {
  const navigate = useNavigate();
  const [bloc, setBloc] = useState<SiteBlockAdmin | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // Change de valeur pour réinitialiser le formulaire avec les données rechargées
  const [cleFormulaire, setCleFormulaire] = useState(0);

  const charger = useCallback(async () => {
    try {
      const res = await caisseApi.get<{ data: SiteBlockAdmin | null }>(URL_BLOC);
      setBloc(res.data ?? null);
      setCleFormulaire((k) => k + 1);
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

  // L'avertissement (ex. photo refusée) est posé après le rechargement, qui efface l'erreur
  const apresEnregistrement = async (msg: string, avertissement?: string) => {
    setToast(msg);
    await charger();
    if (avertissement) setErreur(avertissement);
  };

  const basculer = async () => {
    if (!bloc) return;
    try {
      await caisseApi.patch(`${URL_BLOC}/publish`);
      setToast(bloc.is_published ? 'Section masquée : la page affiche le texte par défaut.' : 'Section publiée sur le site.');
      setErreur(null);
      charger();
    } catch (e) { setErreur(msgErreur(e)); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/admin')} className="text-sm text-gray-300 hover:text-white">← Hub</button>
        <h1 className="font-bold">Fondateur (site)</h1>
        <a href="/about" target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">Voir ↗</a>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        {erreur && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{erreur}</div>}

        {chargement ? (
          <p className="text-sm text-gray-500">Chargement…</p>
        ) : (
          <>
            <section className="bg-white rounded-2xl border p-4 flex flex-wrap items-center gap-3 text-sm">
              {bloc === null ? (
                <span className="text-gray-600">
                  Pas encore enregistré : la page À propos affiche le texte par défaut, repris ci-dessous.
                </span>
              ) : (
                <>
                  {bloc.is_published
                    ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold">PUBLIÉ</span>
                    : <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-bold">MASQUÉ</span>}
                  <span className="flex-1 min-w-[160px] text-gray-600">
                    {bloc.is_published ? 'La page À propos affiche ce contenu.' : 'La page À propos affiche le texte par défaut.'}
                  </span>
                  <button onClick={basculer} className="text-xs px-2 py-1 rounded-md border">{bloc.is_published ? 'Masquer' : 'Publier'}</button>
                </>
              )}
            </section>

            <Formulaire key={cleFormulaire} bloc={bloc} onEnregistre={apresEnregistrement} onErreur={setErreur} />
          </>
        )}

        <p className="text-xs text-gray-400">Le badge « 20+ ans » et l'encadré Contact de la page À propos ne sont pas modifiables ici. « Masquer » ne retire pas la section : la page réaffiche le texte par défaut.</p>
      </main>

      {toast && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">{toast}</div>}
    </div>
  );
};

export default AdminFondateur;
