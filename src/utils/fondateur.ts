// Fondateur : section de la page À propos, gérée depuis /admin/fondateur (table site_blocks, clé « fondateur »).

export const CLE_FONDATEUR = 'fondateur';
export const PHOTO_FONDATEUR_DEFAUT = '/images/pf.png';

export interface SiteBlockPublic {
  key: string;
  title: string;
  subtitle: string | null;
  body: string;
  photo_url: string | null;
}

export interface SiteBlockAdmin extends SiteBlockPublic {
  id: number;
  photo_path: string | null;
  is_published: boolean;
}

// Contenu affiché si l'API ne renvoie rien (404, erreur, délai) et pré-remplissage du formulaire admin
export const FONDATEUR_DEFAUT: SiteBlockPublic = {
  key: CLE_FONDATEUR,
  title: 'Insa Gaye',
  subtitle: 'Fondateur de SUNUFITNESS',
  body:
    'Depuis plus de 20 ans, je consacre ma vie au sport, à la santé et au bien-être. ' +
    'Mon parcours est le fruit d’une passion profonde pour l’activité physique, ' +
    'soutenue par des diplômes et certifications en préparation physique, nutrition et ' +
    'coaching mental. Mon histoire commence au Sénégal, où le sport m’a très tôt forgé ' +
    'discipline et détermination. En arrivant en Europe, j’ai dû tout recommencer : me ' +
    'former, apprendre, observer, et travailler dur pour transformer cette passion en ' +
    'expertise. J’ai passé des années à perfectionner mes connaissances et mes ' +
    'méthodes, en combinant la rigueur de la science du sport et l’expérience pratique ' +
    'du terrain. Au fil du temps, j’ai eu le privilège d’accompagner des centaines de ' +
    'personnes – hommes, femmes, débutants ou athlètes confirmés – à atteindre leurs ' +
    'objectifs : retrouver la forme, améliorer leurs performances, rééquilibrer leur ' +
    'alimentation et développer une force mentale solide. Aujourd’hui, avec SUNU ' +
    'Fitness, je veux transmettre cette expérience et cette vision : créer un espace ' +
    'unique, professionnel et bienveillant, où chaque individu peut progresser ' +
    'durablement et révéler la meilleure version de lui-même.',
  photo_url: null,
};
