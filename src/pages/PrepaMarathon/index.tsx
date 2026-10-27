import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CompteARebours from '../../components/marathon/CompteARebours';
import CompteurCoureurs from '../../components/marathon/CompteurCoureurs';
import {
  DATE_COURSE_LIBELLE, DEBUT_PREPA_LIBELLE, DISTANCES, FORMULES, WHATSAPP_AFFICHE,
  Distance, Formule, libelleDistance, lienWhatsApp, marathonUrl,
} from '../../config/marathon';

// ─── Contenu ──────────────────────────────────────────────────────────────────

const PILIERS = [
  { icone: '🏃', titre: 'Séances de course encadrées', texte: 'Endurance, fractionné et sorties longues, adaptés à ta distance et à ton niveau.' },
  { icone: '💪', titre: 'Renforcement musculaire du coureur', texte: 'Gainage, jambes et mobilité pour courir plus fort et limiter les blessures.' },
  { icone: '🥗', titre: 'Plan nutrition & hydratation', texte: 'Quoi manger pendant la prépa, la veille et le jour J, et comment bien t\'hydrater.' },
  { icone: '🧠', titre: 'Préparation mentale', texte: 'Gérer l\'effort, l\'allure et le stress pour aller au bout de ta course.' },
];

// ─── Formulaire ───────────────────────────────────────────────────────────────

type Champ = 'prenom' | 'nom' | 'telephone' | 'email' | 'distance' | 'formule';
type Erreurs = Partial<Record<Champ, string>>;

const OBLIGATOIRE: Record<Champ, string> = {
  prenom: 'Indique ton prénom.',
  nom: 'Indique ton nom.',
  telephone: 'Indique ton numéro WhatsApp.',
  email: 'Indique ton adresse email.',
  distance: 'Choisis ta distance.',
  formule: 'Choisis ta formule.',
};

// Le backend renvoie ses messages de validation en anglais : on les traduit par champ.
function traduire(champ: Champ, message: string): string {
  if (/required/i.test(message)) return OBLIGATOIRE[champ];
  if (/valid email/i.test(message)) return 'Adresse email invalide.';
  if (/already been taken/i.test(message)) {
    return champ === 'telephone' ? 'Ce numéro est déjà inscrit à la Prépa Marathon.' : 'Cette valeur est déjà utilisée.';
  }
  if (/selected .* is invalid/i.test(message)) return 'Choisis une option dans la liste.';
  const max = message.match(/greater than (\d+) characters/i);
  if (max) return `${max[1]} caractères maximum.`;
  if (champ === 'telephone') return 'Numéro de téléphone invalide.';
  return 'Valeur invalide.';
}

const CHAMPS: Champ[] = ['prenom', 'nom', 'telephone', 'email', 'distance', 'formule'];

const champTexte = 'w-full rounded-xl border bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-marathon-lime';

const MessageErreur: React.FC<{ id: string; message?: string }> = ({ id, message }) =>
  message ? <p id={id} className="mt-1.5 text-sm font-medium text-red-300">{message}</p> : null;

// ─── Page ─────────────────────────────────────────────────────────────────────

const PrepaMarathonPage: React.FC = () => {
  const [form, setForm] = useState({ prenom: '', nom: '', telephone: '', email: '', distance: '' as Distance | '', formule: '' as Formule | '' });
  const [honeypot, setHoneypot] = useState('');
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [erreurGlobale, setErreurGlobale] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [inscrit, setInscrit] = useState<{ prenom: string; distance: Distance } | null>(null);

  const maj = (champ: Champ, valeur: string) => {
    setForm((f) => ({ ...f, [champ]: valeur }));
    if (erreurs[champ]) setErreurs((e) => ({ ...e, [champ]: undefined }));
  };

  const valider = (): Erreurs => {
    const e: Erreurs = {};
    if (!form.prenom.trim()) e.prenom = OBLIGATOIRE.prenom;
    if (!form.nom.trim()) e.nom = OBLIGATOIRE.nom;
    if (!form.telephone.trim()) e.telephone = OBLIGATOIRE.telephone;
    else if (form.telephone.replace(/\D/g, '').length < 9) e.telephone = 'Numéro de téléphone invalide.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Adresse email invalide.';
    if (!form.distance) e.distance = OBLIGATOIRE.distance;
    if (!form.formule) e.formule = OBLIGATOIRE.formule;
    return e;
  };

  const envoyer = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErreurGlobale(null);
    const e = valider();
    setErreurs(e);
    if (Object.keys(e).length > 0) {
      document.getElementById(`marathon-${Object.keys(e)[0]}`)?.focus();
      return;
    }

    setEnvoi(true);
    try {
      const res = await fetch(marathonUrl('/marathon/inscriptions'), {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: form.prenom.trim(),
          nom: form.nom.trim(),
          telephone: form.telephone.trim(),
          ...(form.email.trim() ? { email: form.email.trim() } : {}),
          distance: form.distance,
          formule: form.formule,
          honeypot,
        }),
      });

      if (res.ok) {
        setInscrit({ prenom: form.prenom.trim(), distance: form.distance as Distance });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const data = await res.json().catch(() => null);
      if (res.status === 422 && data?.errors) {
        const traduites: Erreurs = {};
        for (const champ of CHAMPS) {
          const msg = data.errors[champ]?.[0];
          if (msg) traduites[champ] = traduire(champ, msg);
        }
        setErreurs(traduites);
        if (Object.keys(traduites).length === 0) setErreurGlobale('Ton inscription n\'a pas pu être enregistrée. Vérifie tes informations et réessaie.');
      } else if (res.status === 429) {
        setErreurGlobale('Trop de tentatives. Patiente une minute puis réessaie.');
      } else {
        setErreurGlobale('Une erreur est survenue. Réessaie dans un instant ou écris-nous sur WhatsApp.');
      }
    } catch {
      setErreurGlobale('Connexion impossible. Vérifie ta connexion internet et réessaie.');
    } finally {
      setEnvoi(false);
    }
  };

  const aria = (champ: Champ) => ({
    id: `marathon-${champ}`,
    'aria-invalid': !!erreurs[champ],
    'aria-describedby': erreurs[champ] ? `marathon-${champ}-erreur` : undefined,
  });
  const bordure = (champ: Champ) => (erreurs[champ] ? 'border-red-400' : 'border-transparent');

  // ─── Écran de confirmation ──────────────────────────────────────────────────

  if (inscrit) {
    const distance = DISTANCES.find((d) => d.value === inscrit.distance)!;
    return (
      <div className="min-h-screen bg-marathon-nuit text-white">
        <Header />
        <main className="mx-auto max-w-xl px-4 pb-16 pt-[92px] text-center sm:px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-marathon-lime text-3xl text-marathon-nuit">✓</div>
          <h1 className="mt-5 font-condensed text-4xl sm:text-5xl font-extrabold uppercase leading-none">
            Bienvenue dans la team, {inscrit.prenom} !
          </h1>
          <p className="mt-4 text-white/80">
            Ta place dans la Team SUNUFITNESS est enregistrée ({libelleDistance(inscrit.distance)}).
            Dernière étape : valide ton inscription officielle au Marathon du Sénégal.
          </p>

          <a href={distance.lienOfficiel} target="_blank" rel="noopener noreferrer"
            className="mt-8 block w-full rounded-2xl bg-marathon-lime px-6 py-5 font-condensed text-2xl font-bold uppercase leading-tight text-marathon-nuit hover:brightness-95">
            Valider mon inscription officielle
            <span className="mt-1 block font-sans text-sm font-semibold normal-case opacity-80">{distance.label} · {distance.detail} · marathondusenegal.com</span>
          </a>

          <a href={lienWhatsApp()} target="_blank" rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-[#25D366] px-6 py-4 font-semibold text-white hover:brightness-95">
            <i className="fab fa-whatsapp text-2xl" aria-hidden="true" />
            Écrire à la team sur WhatsApp
          </a>
          <p className="mt-2 text-xs text-white/50">{WHATSAPP_AFFICHE}</p>

          <p className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            La prépa commence le <strong className="text-marathon-lime">{DEBUT_PREPA_LIBELLE}</strong>.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Présentation + formulaire ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-marathon-nuit text-white">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-[92px] sm:px-6 sm:pb-16">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-marathon-lime">
          Marathon du Sénégal · Saly · {DATE_COURSE_LIBELLE}
        </p>
        <h1 className="mt-3 font-condensed text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.95]">
          Prépa marathon <span className="text-marathon-lime">SUNUFITNESS</span>
        </h1>
        <p className="mt-4 max-w-xl text-base sm:text-lg text-white/80">
          3 mois de préparation, 3 séances par semaine, pour prendre le départ du 5, 10, 21 ou 42 km avec la Team SUNU.
        </p>
        <p className="mt-5 inline-block rounded-full border border-marathon-lime/40 bg-marathon-lime/10 px-4 py-2 text-sm">
          Début de la prépa : <strong className="text-marathon-lime">{DEBUT_PREPA_LIBELLE}</strong>
        </p>
        <CompteARebours className="mt-7" />
        <a href="#inscription"
          className="mt-8 block w-full sm:inline-block sm:w-auto rounded-xl bg-marathon-lime px-8 py-4 text-center font-condensed text-xl font-bold uppercase tracking-wide text-marathon-nuit hover:brightness-95">
          Je rejoins la team
        </a>
        <CompteurCoureurs className="mt-5" />
      </section>

      {/* 4 piliers */}
      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-condensed text-3xl sm:text-4xl font-bold uppercase">Les 4 piliers de la prépa</h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {PILIERS.map((p) => (
              <div key={p.titre} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="text-3xl" aria-hidden="true">{p.icone}</span>
                <h3 className="mt-3 font-semibold text-white">{p.titre}</h3>
                <p className="mt-1 text-sm text-white/70">{p.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire (les formules sont choisies directement dedans) */}
      <section id="inscription" className="scroll-mt-[70px] border-t border-white/10">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-condensed text-3xl sm:text-4xl font-bold uppercase">Je rejoins la team</h2>
          <p className="mt-2 text-sm text-white/70">Inscription en 1 minute.</p>

          <form onSubmit={envoyer} noValidate className="mt-8 space-y-6">
            {/* Formule */}
            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Ta formule</legend>
              <div id="marathon-formule" tabIndex={-1} className="grid grid-cols-1 gap-3 md:grid-cols-3 outline-none"
                aria-describedby={erreurs.formule ? 'marathon-formule-erreur' : undefined}>
                {FORMULES.map((f) => {
                  const choisie = form.formule === f.value;
                  return (
                    <label key={f.value}
                      className={`relative cursor-pointer rounded-2xl border-2 p-4 transition ${choisie ? 'border-marathon-lime bg-marathon-lime/15' : f.enAvant ? 'border-marathon-lime/50 bg-white/5' : 'border-white/15 bg-white/5'}`}>
                      <input type="radio" name="formule" value={f.value} checked={choisie} onChange={() => maj('formule', f.value)} className="sr-only" />
                      {f.enAvant && (
                        <span className="absolute -top-3 left-4 rounded-full bg-marathon-lime px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-marathon-nuit">Membres SUNU</span>
                      )}
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/60">{f.titre}</span>
                        <span className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 ${choisie ? 'border-marathon-lime bg-marathon-lime' : 'border-white/40'}`} aria-hidden="true" />
                      </span>
                      <span className={`mt-1 block font-condensed text-2xl font-bold uppercase ${f.enAvant || choisie ? 'text-marathon-lime' : 'text-white'}`}>{f.prix}</span>
                      <span className="block text-sm text-white/70">{f.precision}</span>
                    </label>
                  );
                })}
              </div>
              <MessageErreur id="marathon-formule-erreur" message={erreurs.formule} />
            </fieldset>

            {/* Distance */}
            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Ta distance</legend>
              <div id="marathon-distance" tabIndex={-1} className="grid grid-cols-2 gap-3 sm:grid-cols-4 outline-none"
                aria-describedby={erreurs.distance ? 'marathon-distance-erreur' : undefined}>
                {DISTANCES.map((d) => {
                  const choisie = form.distance === d.value;
                  return (
                    <label key={d.value}
                      className={`cursor-pointer rounded-2xl border-2 px-3 py-4 text-center transition ${choisie ? 'border-marathon-lime bg-marathon-lime text-marathon-nuit' : 'border-white/15 bg-white/5'}`}>
                      <input type="radio" name="distance" value={d.value} checked={choisie} onChange={() => maj('distance', d.value)} className="sr-only" />
                      <span className="block font-condensed text-3xl font-bold leading-none">{d.label}</span>
                      <span className={`mt-1 block text-xs ${choisie ? 'text-marathon-nuit/80' : 'text-white/60'}`}>{d.detail}</span>
                    </label>
                  );
                })}
              </div>
              <MessageErreur id="marathon-distance-erreur" message={erreurs.distance} />
            </fieldset>

            {/* Identité */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="marathon-prenom" className="mb-1.5 block text-sm font-semibold">Prénom</label>
                <input {...aria('prenom')} type="text" autoComplete="given-name" maxLength={100} value={form.prenom}
                  onChange={(e) => maj('prenom', e.target.value)} className={`${champTexte} ${bordure('prenom')}`} />
                <MessageErreur id="marathon-prenom-erreur" message={erreurs.prenom} />
              </div>
              <div>
                <label htmlFor="marathon-nom" className="mb-1.5 block text-sm font-semibold">Nom</label>
                <input {...aria('nom')} type="text" autoComplete="family-name" maxLength={100} value={form.nom}
                  onChange={(e) => maj('nom', e.target.value)} className={`${champTexte} ${bordure('nom')}`} />
                <MessageErreur id="marathon-nom-erreur" message={erreurs.nom} />
              </div>
            </div>

            <div>
              <label htmlFor="marathon-telephone" className="mb-1.5 block text-sm font-semibold">Téléphone WhatsApp</label>
              <input {...aria('telephone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="77 123 45 67" maxLength={30}
                value={form.telephone} onChange={(e) => maj('telephone', e.target.value)} className={`${champTexte} ${bordure('telephone')}`} />
              <MessageErreur id="marathon-telephone-erreur" message={erreurs.telephone} />
            </div>

            <div>
              <label htmlFor="marathon-email" className="mb-1.5 block text-sm font-semibold">
                Email <span className="font-normal text-white/50">(facultatif)</span>
              </label>
              <input {...aria('email')} type="email" inputMode="email" autoComplete="email" maxLength={150}
                value={form.email} onChange={(e) => maj('email', e.target.value)} className={`${champTexte} ${bordure('email')}`} />
              <MessageErreur id="marathon-email-erreur" message={erreurs.email} />
            </div>

            {/* Anti-robot : hors écran (pas display:none, que certains robots ignorent), ignoré des lecteurs d'écran et du clavier */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
              <label htmlFor="marathon-site">Ne pas remplir ce champ</label>
              <input id="marathon-site" type="text" name="honeypot" tabIndex={-1} autoComplete="off"
                value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            {erreurGlobale && (
              <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">{erreurGlobale}</p>
            )}

            <button type="submit" disabled={envoi}
              className="w-full rounded-xl bg-marathon-lime px-6 py-4 font-condensed text-2xl font-bold uppercase tracking-wide text-marathon-nuit hover:brightness-95 disabled:opacity-60">
              {envoi ? 'Envoi…' : 'Je rejoins la team'}
            </button>
            <p className="text-center text-xs text-white/50">
              Une question ? WhatsApp <a href={lienWhatsApp()} target="_blank" rel="noopener noreferrer" className="underline">{WHATSAPP_AFFICHE}</a>
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrepaMarathonPage;
