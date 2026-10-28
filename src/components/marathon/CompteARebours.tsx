import React, { useEffect, useState } from 'react';
import { DATE_COURSE } from '../../config/marathon';

// Compte à rebours jusqu'au départ. Basé sur un instant UTC : juste quel que soit le fuseau du téléphone.

function resteAvantDepart() {
  const ms = Math.max(0, DATE_COURSE.getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  return { fini: ms === 0, jours: Math.floor(s / 86400), heures: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), secondes: s % 60 };
}

const CompteARebours: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [reste, setReste] = useState(resteAvantDepart);

  useEffect(() => {
    const id = setInterval(() => setReste(resteAvantDepart()), 1000);
    return () => clearInterval(id);
  }, []);

  if (reste.fini) {
    return <p className={`font-condensed text-3xl font-bold uppercase text-marathon-lime ${className}`}>C'est le jour J !</p>;
  }

  const cases: [number, string][] = [
    [reste.jours, 'jours'],
    [reste.heures, 'heures'],
    [reste.minutes, 'min'],
    [reste.secondes, 'sec'],
  ];

  return (
    <div className={`grid grid-cols-4 gap-2 sm:gap-3 max-w-md ${className}`} role="timer" aria-label="Temps restant avant le départ du marathon">
      {cases.map(([valeur, unite]) => (
        <div key={unite} className="rounded-xl border border-white/10 bg-white/5 py-3 text-center">
          <span className="block font-condensed text-3xl sm:text-4xl font-bold leading-none text-white tabular-nums">
            {unite === 'jours' ? valeur : String(valeur).padStart(2, '0')}
          </span>
          <span className="mt-1 block text-[10px] sm:text-xs uppercase tracking-widest text-white/60">{unite}</span>
        </div>
      ))}
    </div>
  );
};

export default CompteARebours;
