import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { apiUrl } from '../../config/api';
import { CoachProfilePublic, initiales } from '../../utils/coachProfile';

// Nos coaches : page publique, contenu géré par l'admin sur /admin/coaches-site.

const PhotoCoach: React.FC<{ nom: string; url: string | null }> = ({ nom, url }) => {
  const [echec, setEchec] = useState(false);
  if (url && !echec) {
    return (
      <img
        src={url}
        alt={nom}
        loading="lazy"
        onError={() => setEchec(true)}
        className="block w-full aspect-square object-cover"
      />
    );
  }
  return (
    <span
      className="w-full aspect-square bg-[#2c5f4f] text-white text-[64px] sm:text-[72px] font-bahnschrift font-bold flex items-center justify-center"
      aria-hidden="true"
    >
      {initiales(nom)}
    </span>
  );
};

const CarteCoach: React.FC<{ coach: CoachProfilePublic }> = ({ coach }) => {
  const [deplie, setDeplie] = useState(false);
  const [tronque, setTronque] = useState(false);
  const texteRef = useRef<HTMLParagraphElement>(null);

  // Le bouton n'apparaît que si la présentation dépasse vraiment les 5 lignes affichées
  useEffect(() => {
    const el = texteRef.current;
    if (!el || deplie) return;
    const mesurer = () => setTronque(el.scrollHeight > el.clientHeight + 1);
    mesurer();
    document.fonts?.ready.then(mesurer);
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    return () => observateur.disconnect();
  }, [deplie, coach.bio]);

  return (
    <article className="flex flex-col w-full min-w-0 bg-white rounded-[15px] shadow-xl overflow-hidden border border-[#2c5f4f]/20">
      <PhotoCoach nom={coach.display_name} url={coach.photo_url} />

      <div className="flex flex-col items-center text-center w-full p-[20px] sm:p-[24px]">
        <h2 className="text-[18px] sm:text-[20px] font-bahnschrift font-bold text-[#2c5f4f] break-words">
          {coach.display_name}
        </h2>
        {coach.specialty && (
          <p className="mt-[4px] text-[13px] sm:text-[14px] font-bahnschrift font-semibold uppercase tracking-wide text-[#b89968] break-words">
            {coach.specialty}
          </p>
        )}

        {coach.bio && (
          <>
            <p
              ref={texteRef}
              className={`text-[14px] sm:text-[15px] font-bahnschrift font-light leading-[22px] text-gray-700 mt-[12px] break-words whitespace-pre-line ${
                deplie ? '' : 'line-clamp-5'
              }`}
            >
              {coach.bio}
            </p>
            {tronque && (
              <button
                type="button"
                onClick={() => setDeplie((v) => !v)}
                aria-expanded={deplie}
                className="mt-[8px] text-[14px] leading-[22px] font-bahnschrift font-normal text-[#2c5f4f] hover:underline"
              >
                {deplie ? 'Réduire' : 'Lire la suite'}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
};

const NosCoachesPage: React.FC = () => {
  const [coaches, setCoaches] = useState<CoachProfilePublic[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    document.title = 'Nos coaches — SUNUFITNESS';
    fetch(apiUrl('/coaches/public'), { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setCoaches(Array.isArray(d?.data) ? d.data : []))
      .catch(() => setErreur(true))
      .finally(() => setChargement(false));
  }, []);

  // Moins de 3 cartes : grille réduite et centrée, cartes à la largeur d'une colonne sur 3
  const grilleColonnes =
    coaches.length === 1
      ? 'grid-cols-1 max-w-[384px]'
      : coaches.length === 2
        ? 'grid-cols-1 sm:grid-cols-2 max-w-[792px]'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      <Header />

      <main className="flex-1 w-full py-[40px] sm:py-[50px] md:py-[60px] lg:py-[80px] px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">
          <h1 className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px] font-bahnschrift font-bold leading-[30px] sm:leading-[34px] md:leading-[42px] lg:leading-[52px] text-center uppercase text-[#2c5f4f]">
            Nos coaches
          </h1>
          <span className="block w-[64px] h-[3px] bg-[#b89968] rounded-full mt-[12px]" aria-hidden="true" />
          <p className="mt-[16px] max-w-[640px] text-center text-[15px] sm:text-[17px] font-bahnschrift font-light text-gray-700">
            Rencontrez la Team SUNUFITNESS : des coaches passionnés pour vous accompagner vers vos objectifs.
          </p>

          {chargement && (
            <div className="flex justify-center py-[60px]" role="status" aria-label="Chargement">
              <div className="w-8 h-8 border-4 border-[#2c5f4f] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!chargement && erreur && (
            <p className="mt-[40px] text-center text-[15px] font-bahnschrift text-red-700 bg-red-50 border border-red-200 rounded-[10px] px-[20px] py-[14px]">
              Impossible de charger nos coaches pour le moment. Merci de réessayer plus tard.
            </p>
          )}

          {!chargement && !erreur && coaches.length === 0 && (
            <p className="mt-[40px] text-center text-[15px] font-bahnschrift text-gray-600">
              Notre équipe sera bientôt présentée ici.
            </p>
          )}

          {!chargement && !erreur && coaches.length > 0 && (
            <div className={`grid ${grilleColonnes} items-start gap-[20px] sm:gap-[24px] w-full mx-auto mt-[32px] sm:mt-[40px]`}>
              {coaches.map((c) => (
                <CarteCoach key={c.id} coach={c} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NosCoachesPage;
