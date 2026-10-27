import React from 'react';
import { FORMULES } from '../../config/marathon';

// Les 3 formules de la campagne (accueil + page /prepa-marathon).
const CartesFormules: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
    {FORMULES.map((f) => (
      <div key={f.value}
        className={`relative rounded-2xl p-5 text-left ${f.enAvant ? 'border-2 border-marathon-lime bg-marathon-lime/10' : 'border border-white/15 bg-white/5'}`}>
        {f.enAvant && (
          <span className="absolute -top-3 left-5 rounded-full bg-marathon-lime px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-marathon-nuit">
            Membres SUNU
          </span>
        )}
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">{f.titre}</p>
        <p className={`mt-1 font-condensed text-3xl font-bold uppercase ${f.enAvant ? 'text-marathon-lime' : 'text-white'}`}>{f.prix}</p>
        <p className="mt-1 text-sm text-white/70">{f.precision}</p>
      </div>
    ))}
  </div>
);

export default CartesFormules;
