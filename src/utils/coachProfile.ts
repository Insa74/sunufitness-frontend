// Nos coaches : types partagés entre la page publique et la page admin.

export interface CoachProfilePublic {
  id: number;
  display_name: string;
  specialty: string | null;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
}

export interface CoachProfileAdmin extends CoachProfilePublic {
  is_published: boolean;
}

// Deux initiales en majuscules (ex. « Awa Diop » → « AD »)
export function initiales(nom: string): string {
  const mots = nom.trim().split(/\s+/).filter(Boolean);
  if (mots.length === 0) return '?';
  const lettres = mots.length === 1 ? mots[0].slice(0, 2) : mots[0][0] + mots[mots.length - 1][0];
  return lettres.toUpperCase();
}
