import React, { useEffect, useState } from 'react';
import { marathonUrl } from '../../config/marathon';

// Nombre d'inscrits, affiché seulement à partir de 10 (sinon rien, même en cas d'erreur).
const SEUIL_AFFICHAGE = 10;

const CompteurCoureurs: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch(marathonUrl('/marathon/compteur'), { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => { if (typeof json?.data?.total === 'number') setTotal(json.data.total); })
      .catch(() => {});
  }, []);

  if (total === null || total < SEUIL_AFFICHAGE) return null;

  return (
    <p className={`flex items-center gap-2 text-sm text-white/80 ${className}`}>
      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-marathon-lime animate-pulse" />
      <span><strong className="text-marathon-lime">{total.toLocaleString('fr-FR')} coureurs</strong> ont déjà rejoint la Team SUNUFITNESS</span>
    </p>
  );
};

export default CompteurCoureurs;
