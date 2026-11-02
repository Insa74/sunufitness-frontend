// Avis Google : section « Ils nous font confiance » de la page d'accueil.
// Textes recopiés tels quels depuis Google (ne pas corriger les fautes).

export interface AvisGoogle {
  auteur: string;
  note: number;
  date: string;
  texte: string;
}

export const NOTE_GOOGLE = '5,0';
export const NOMBRE_AVIS_GOOGLE = 'plus de 60 avis Google';
export const LIEN_AVIS_GOOGLE =
  'https://www.google.com/maps/search/?api=1&query=SUNUFITNESS+Saly';

export const AVIS_GOOGLE: AvisGoogle[] = [
  {
    auteur: 'Djelove S.',
    note: 5,
    date: 'août 2026',
    texte:
      "Magnifique salle de sport ! Les locaux sont d'une propreté irréprochable, les équipements sont de grande qualité, la déco et l'ambiance est juste top. Mention spéciale à Insa pour le coaching en personal trainer : il est tout simplement excellent et super professionnel, il est toujours à l'écoute , très attentionné et n'hésite jamais à donner les bons conseils pour progresser en toute sécurité. Un accompagnement sur mesure qui fait toute la différence, c'est clairement la meilleure salle de sport de Saly ☺️. Et après le sport, le réconfort ! Le bar de rafraîchissement au bord de la piscine est un vrai plus pour se détendre avec de super bons jus locaux proposés 😋tout ça dans une bonne ambiance. Alors qu'attendez vous ? 🏃🤸je recommande vivement Sunu Fitness !",
  },
  {
    auteur: 'Aicha S.',
    note: 5,
    date: 'juillet 2026',
    texte:
      "Ce lieu m'a traumatisé mais dans le bon sens lol . Équipe accueillante et patiente . Bonne ambiance ! Beaucoup de cour intéressant ! Ma forme est au taquet , je vous conseille le coaching personnel avec Insa et de prendre un bon jus de Bissau au bar !",
  },
  {
    auteur: 'Pierre A.',
    note: 5,
    date: 'mai 2026',
    texte:
      'Salle très propre, personnel accueillant se qui se fais rare de nos jours, machines bien entretenue, je vous la recommande vivement',
  },
  {
    auteur: 'Jean-Louis G.',
    note: 5,
    date: 'avril 2026',
    texte:
      "Salle au top, très bien équipée avec un personnel au top également ! L'accueil est chaleureux et l'équipe toujours disponible. Je recommande vivement, merci à toute l'équipe !",
  },
];
