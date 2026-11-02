import React, { useEffect, useRef, useState } from 'react';
import {
  AVIS_GOOGLE,
  AvisGoogle as Avis,
  LIEN_AVIS_GOOGLE,
  NOMBRE_AVIS_GOOGLE,
  NOTE_GOOGLE,
} from '../../data/avisGoogle';

const Etoiles: React.FC<{ note: number; className?: string }> = ({ note, className = '' }) => (
  <span role="img" className={`inline-flex gap-[2px] text-amber-400 ${className}`} aria-label={`${note} étoiles sur 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa-solid fa-star ${i < note ? '' : 'opacity-30'}`} aria-hidden="true"></i>
    ))}
  </span>
);

const CarteAvis: React.FC<{ avis: Avis }> = ({ avis }) => {
  const [deplie, setDeplie] = useState(false);
  const [tronque, setTronque] = useState(false);
  const texteRef = useRef<HTMLParagraphElement>(null);

  // Le bouton n'apparaît que si le texte dépasse vraiment les 5 lignes affichées
  useEffect(() => {
    const el = texteRef.current;
    if (!el || deplie) return;
    const mesurer = () => setTronque(el.scrollHeight > el.clientHeight + 1);
    mesurer();
    // Remesure une fois la police chargée (la hauteur du bloc ne change pas, le texte si)
    document.fonts?.ready.then(mesurer);
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    return () => observateur.disconnect();
  }, [deplie]);

  return (
    <article className="flex flex-col w-full min-w-0 bg-white rounded-[15px] shadow-xl p-[20px] sm:p-[24px] border border-[#05835e]/20">
      <div className="flex flex-row justify-between items-start gap-[12px]">
        <div className="flex flex-col gap-[4px] min-w-0">
          <span className="text-[16px] sm:text-[17px] font-bahnschrift font-bold text-gray-800 truncate">
            {avis.auteur}
          </span>
          <span className="text-[13px] font-bahnschrift font-light text-gray-500">{avis.date}</span>
        </div>
        <span className="flex-shrink-0 inline-flex items-center gap-[6px] text-[12px] font-bahnschrift text-gray-600 bg-gray-100 rounded-full px-[10px] py-[4px]">
          <i className="fa-brands fa-google text-[#05835e]" aria-hidden="true"></i>
          Avis Google
        </span>
      </div>

      <Etoiles note={avis.note} className="mt-[12px] text-[14px]" />

      {/* Fermé : 5 lignes ; sur ordinateur, hauteur fixe pour aligner les cartes */}
      <p
        ref={texteRef}
        className={`text-[14px] sm:text-[15px] font-bahnschrift font-light leading-[22px] text-gray-700 mt-[12px] break-words ${
          deplie ? '' : 'line-clamp-5 lg:h-[110px]'
        }`}
      >
        {avis.texte}
      </p>

      {/* Emplacement du bouton gardé sur ordinateur, même vide, pour aligner les cartes */}
      <div className={`mt-[8px] lg:h-[22px] ${tronque ? '' : 'hidden lg:block'}`}>
        {tronque && (
          <button
            type="button"
            onClick={() => setDeplie((v) => !v)}
            aria-expanded={deplie}
            className="text-[14px] leading-[22px] font-bahnschrift font-normal text-[#05835e] hover:underline"
          >
            {deplie ? 'Réduire' : 'Lire la suite'}
          </button>
        )}
      </div>
    </article>
  );
};

const AvisGoogleSection: React.FC = () => (
  <section id="avis" className="w-full py-[40px] sm:py-[50px] md:py-[60px] lg:py-[80px] px-4 sm:px-6 md:px-8">
    <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">
      <h2 className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px] font-bahnschrift font-bold leading-[30px] sm:leading-[34px] md:leading-[42px] lg:leading-[52px] text-center uppercase text-[#05835e]">
        Ils nous font confiance
      </h2>

      <div className="inline-flex flex-wrap justify-center items-center gap-x-[8px] gap-y-[4px] mt-[16px] sm:mt-[20px] bg-[#05835e19] rounded-full px-[16px] sm:px-[20px] py-[8px] text-[14px] sm:text-[16px] font-bahnschrift text-global-text1">
        <span className="font-bold">{NOTE_GOOGLE}</span>
        <Etoiles note={5} />
        <span>· {NOMBRE_AVIS_GOOGLE}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-[20px] sm:gap-[24px] w-full mt-[32px] sm:mt-[40px]">
        {AVIS_GOOGLE.map((avis) => (
          <CarteAvis key={avis.auteur} avis={avis} />
        ))}
      </div>

      <a
        href={LIEN_AVIS_GOOGLE}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center gap-[8px] text-[14px] sm:text-[16px] md:text-[18px] font-bahnschrift font-normal text-global-text5 bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-[3px] px-[24px] sm:px-[28px] md:px-[32px] py-[12px] sm:py-[14px] md:py-[16px] mt-[32px] sm:mt-[40px] hover:opacity-90 transition-opacity duration-300 w-full sm:w-auto max-w-[360px] text-center"
      >
        <i className="fa-brands fa-google" aria-hidden="true"></i>
        Voir tous nos avis sur Google
      </a>
    </div>
  </section>
);

export default AvisGoogleSection;
