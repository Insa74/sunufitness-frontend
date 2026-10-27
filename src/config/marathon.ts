// Campagne PRÉPA MARATHON — Marathon du Sénégal (Saly).
// Toutes les dates, prix et liens de la campagne sont ici : c'est le seul fichier à modifier.

// Les routes marathon ne sont déployées que sur le backend admin (pas sur api.sunufitness.com).
export const MARATHON_API_BASE = import.meta.env.VITE_MARATHON_API_BASE_URL ?? 'https://admin.sunufitness.com/api';

export function marathonUrl(path: string) {
  const base = MARATHON_API_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

// Départ : 24 janvier 2027 à 8h00, heure de Dakar (= UTC toute l'année).
export const DATE_COURSE = new Date(Date.UTC(2027, 0, 24, 8, 0, 0));
export const DATE_COURSE_LIBELLE = '24 janvier 2027';

// Début de la prépa (3 mois, 3 séances / semaine).
export const DEBUT_PREPA_LIBELLE = 'lundi 9 novembre 2026';

export type Distance = '5km' | '10km' | '21km' | '42km';
export type Formule = 'prepa_membre' | 'prepa_sans_abonnement' | 'course_seule';

export const DISTANCES: { value: Distance; label: string; detail: string; lienOfficiel: string }[] = [
  { value: '5km', label: '5 km', detail: 'Course populaire', lienOfficiel: 'https://marathondusenegal.com/66-inscriptions-marathon-du-senegal-5-kilometres.html' },
  { value: '10km', label: '10 km', detail: 'Le classique', lienOfficiel: 'https://marathondusenegal.com/64-inscriptions-marathon-du-senegal-10-kilometres.html' },
  { value: '21km', label: '21 km', detail: 'Semi-marathon', lienOfficiel: 'https://marathondusenegal.com/62-inscriptions-marathon-du-senegal-semi-marathon.html' },
  { value: '42km', label: '42 km', detail: 'Marathon', lienOfficiel: 'https://marathondusenegal.com/60-inscriptions-marathon-du-senegal-marathon.html' },
];

export const FORMULES: { value: Formule; titre: string; prix: string; precision: string; enAvant?: boolean }[] = [
  { value: 'prepa_sans_abonnement', titre: 'Pas encore membre', prix: '25 000 F / mois', precision: 'soit 75 000 F pour les 3 mois de prépa' },
  { value: 'prepa_membre', titre: 'Déjà membre', prix: '+15 000 F / mois', precision: 'en plus de ton abonnement', enAvant: true },
  { value: 'course_seule', titre: 'Juste la course', prix: 'Team SUNU', precision: 'cours sous nos couleurs' },
];

export const WHATSAPP_NUMERO = '221710196868';
export const WHATSAPP_AFFICHE = '+221 71 019 68 68';
export const WHATSAPP_MESSAGE = 'Bonjour, je viens de rejoindre la Prépa Marathon SUNUFITNESS';
export const lienWhatsApp = () => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const libelleDistance = (v: string) => DISTANCES.find((d) => d.value === v)?.label ?? v;
export const libelleFormule = (v: string) => FORMULES.find((f) => f.value === v)?.titre ?? v;
