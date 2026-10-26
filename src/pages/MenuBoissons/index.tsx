import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../config/api';

// Menu public des boissons du bar (accès par QR code posé au bar).
// Contenu géré par l'admin sur /admin/menu-boissons.

interface Boisson { id: number; nom: string; description: string | null; prix: number; nouveau: boolean }
interface Categorie { id: number; nom: string; note: string | null; boissons: Boisson[] }

// Commandes uniquement par téléphone
const TEL_AFFICHE = '+221 71 019 68 68';
const TEL_LIEN = 'tel:+221710196868';
const EMAIL = 'info@sunufitness.com';

const prixF = (n: number) => `${n.toLocaleString('fr-FR').replace(/ | /g, ' ')} F`;

const MenuBoissonsPage: React.FC = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    document.title = 'Menu du bar — SUNUFITNESS';
    fetch(apiUrl('/menu-boissons'), { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setCategories(d.data ?? []))
      .catch(() => setErreur(true))
      .finally(() => setChargement(false));
  }, []);

  const allerA = (id: number) =>
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#2c5f4f]">
      <header className="bg-white border-b border-[#e8e2d6] px-4 pt-6 pb-4 text-center">
        <a href="/" aria-label="SUNUFITNESS — accueil">
          <img src="/images/log.png" alt="SUNUFITNESS" className="h-12 mx-auto object-contain" />
        </a>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Menu du bar</h1>
        <p className="text-sm text-[#b89968] font-medium">Mindset, Nutrition &amp; Sport</p>
        <a href={TEL_LIEN}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2c5f4f] text-white px-5 py-2.5 font-semibold shadow-sm">
          📞 Commander : {TEL_AFFICHE}
        </a>
        <p className="mt-2 text-xs text-gray-500">Commandes uniquement par téléphone</p>
      </header>

      {categories.length > 1 && (
        <nav className="sticky top-0 z-10 bg-[#f5f5f0]/95 backdrop-blur border-b border-[#e8e2d6]">
          <div className="max-w-xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button key={c.id} onClick={() => allerA(c.id)}
                className="shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold bg-white border border-[#d4a574]/60 text-[#2c5f4f]">
                {c.nom}
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className="max-w-xl mx-auto px-4 pt-6 pb-28 space-y-8">
        {chargement && <p className="text-center text-sm text-gray-500">Chargement du menu…</p>}
        {erreur && <p className="text-center text-sm text-gray-500">Le menu n'est pas disponible pour le moment. Demande au bar !</p>}
        {!chargement && !erreur && categories.length === 0 && (
          <p className="text-center text-sm text-gray-500">Le menu sera bientôt en ligne.</p>
        )}

        {categories.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-16">
            <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-[#b89968] pb-1 mb-3">{c.nom}</h2>
            {c.note && (
              <p className="-mt-1 mb-3 inline-block text-xs font-semibold bg-[#f5c400]/30 text-[#2c5f4f] px-2 py-1 rounded">⏰ {c.note}</p>
            )}
            <ul className="space-y-3">
              {c.boissons.map((b) => (
                <li key={b.id}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">
                      {b.nom}
                      {b.nouveau && <span className="ml-2 align-middle text-[10px] px-1.5 py-0.5 rounded bg-[#e11d74] text-white font-bold">NOUVEAU</span>}
                    </span>
                    <span className="flex-1 border-b border-dotted border-[#2c5f4f]/30 translate-y-[-3px]" />
                    <span className="font-bold whitespace-nowrap">{prixF(b.prix)}</span>
                  </div>
                  {b.description && <p className="text-xs text-gray-600 mt-0.5 pr-16">{b.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <section className="max-w-xl mx-auto px-4 pb-8">
        <div className="rounded-2xl bg-white border border-[#e8e2d6] p-5 text-center">
          <h2 className="font-bold text-lg">Envie d'aller plus loin ?</h2>
          <p className="text-sm text-gray-600 mt-1">Découvrez nos abonnements, cours collectifs, coaching et autres services.</p>
          <a href="/services"
            className="mt-4 inline-block rounded-full bg-[#b89968] text-white px-5 py-2.5 font-semibold">
            Nos abonnements et services →
          </a>
          <div className="mt-5 pt-4 border-t border-[#e8e2d6] text-sm space-y-1">
            <p>📞 <a href={TEL_LIEN} className="font-semibold underline">{TEL_AFFICHE}</a> <span className="text-gray-500">(commandes)</span></p>
            <p>✉️ <a href={`mailto:${EMAIL}`} className="font-semibold underline">{EMAIL}</a></p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          Prix en francs CFA · <a href="/" className="underline">sunufitness.com</a>
        </p>
      </section>

      {/* Barre d'appel fixe en bas de l'écran (téléphone) */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-[#e8e2d6] px-4 py-3">
        <a href={TEL_LIEN}
          className="max-w-xl mx-auto flex items-center justify-center gap-2 rounded-full bg-[#2c5f4f] text-white py-3 font-semibold">
          📞 Appeler pour commander
        </a>
      </div>
    </div>
  );
};

export default MenuBoissonsPage;
