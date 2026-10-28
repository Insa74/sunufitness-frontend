import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DATE_COURSE_LIBELLE } from '../../config/marathon';
import CompteARebours from './CompteARebours';
import CartesFormules from './CartesFormules';
import CompteurCoureurs from './CompteurCoureurs';

// Bloc publicitaire « Prépa Marathon » en haut de la page d'accueil.
const BlocPrepaMarathon: React.FC = () => {
  const navigate = useNavigate();
  const rejoindre = () => navigate('/prepa-marathon');

  return (
    <section className="w-full bg-marathon-nuit text-white" aria-label="Prépa Marathon">
      <button onClick={rejoindre}
        className="block w-full bg-marathon-lime px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-marathon-nuit hover:brightness-95">
        Team SUNUFITNESS au Marathon du Sénégal · {DATE_COURSE_LIBELLE} · <span className="underline underline-offset-2 whitespace-nowrap">Je rejoins la team →</span>
      </button>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-marathon-lime">
          Prépa marathon · 3 mois · 3 séances / semaine
        </p>
        <h2 className="mt-3 font-condensed text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.95] text-balance">
          En janvier, Saly court en <span className="text-marathon-lime">vert.</span>
        </h2>
        <p className="mt-4 max-w-xl text-base sm:text-lg text-white/80 text-balance">
          5, 10, 21 ou 42 km : avec ou sans prépa, prends le départ avec la Team SUNUFITNESS.
        </p>

        <CompteARebours className="mt-7" />

        <div className="mt-8">
          <CartesFormules />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <button onClick={rejoindre}
            className="w-full sm:w-auto rounded-xl bg-marathon-lime px-8 py-4 font-condensed text-xl font-bold uppercase tracking-wide text-marathon-nuit hover:brightness-95">
            Je rejoins la team
          </button>
          <CompteurCoureurs />
        </div>
      </div>
    </section>
  );
};

export default BlocPrepaMarathon;
