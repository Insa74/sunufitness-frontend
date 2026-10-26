import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../config/api';

// Menu public des boissons du bar (accès par QR code posé au bar).
// Contenu géré par l'admin sur /admin/menu-boissons.

interface Boisson { id: number; nom: string; prix: number }
interface Categorie { id: number; nom: string; boissons: Boisson[] }

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

      <main className="max-w-xl mx-auto px-4 py-6 space-y-8">
        {chargement && <p className="text-center text-sm text-gray-500">Chargement du menu…</p>}
        {erreur && <p className="text-center text-sm text-gray-500">Le menu n'est pas disponible pour le moment. Demande au bar !</p>}
        {!chargement && !erreur && categories.length === 0 && (
          <p className="text-center text-sm text-gray-500">Le menu sera bientôt en ligne.</p>
        )}

        {categories.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-16">
            <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-[#b89968] pb-1 mb-3">{c.nom}</h2>
            <ul className="space-y-3">
              {c.boissons.map((b) => (
                <li key={b.id} className="flex items-baseline gap-2">
                  <span className="font-medium">{b.nom}</span>
                  <span className="flex-1 border-b border-dotted border-[#2c5f4f]/30 translate-y-[-3px]" />
                  <span className="font-bold whitespace-nowrap">{prixF(b.prix)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <footer className="text-center text-xs text-gray-500 pb-8">
        Prix en francs CFA · <a href="/" className="underline">sunufitness.com</a>
      </footer>
    </div>
  );
};

export default MenuBoissonsPage;
