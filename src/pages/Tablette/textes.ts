// Textes acceptés par le client sur la tablette (version 2026-11).
// Résumé des documents « Contrat d'abonnement » et « Règlement intérieur » version 2026 :
// à mettre à jour ici ET dans InscriptionTablette::CONTRAT_VERSION si le texte change.

export const CONTRAT_VERSION = '2026-11';

export const CONTRAT: { titre: string; points: string[] }[] = [
  {
    titre: 'Formule et durée',
    points: [
      'La formule choisie, sa date de début et son prix figurent sur le reçu remis par la Caisse.',
      'Un abonnement d\'un mois court d\'une date à la même date le mois suivant. Il s\'arrête à son échéance, sans reconduction automatique.',
      'Le Personal Training n\'inclut pas l\'abonnement à la salle. Les séances de Personal Training non faites restent dues, sans date limite.',
      'Un pack de cours collectifs donne droit à un cours par jour, avec un accès d\'une heure.',
    ],
  },
  {
    titre: 'Accès',
    points: [
      'Mon QR code est personnel. Il est scanné à l\'accueil à chaque entrée.',
      'Le prêter ou le partager entraîne l\'exclusion immédiate, sans remboursement.',
    ],
  },
  {
    titre: 'Paiement et remboursement',
    points: [
      'Le paiement se fait d\'avance, à l\'accueil : espèces, Wave ou Orange Money. Un reçu est remis à chaque achat.',
      'Aucune formule n\'est remboursée, sauf cas exceptionnel validé par la Direction. Les formules ne peuvent pas être cédées à une autre personne.',
    ],
  },
  {
    titre: 'Santé et responsabilité',
    points: [
      'Je déclare être apte à pratiquer une activité sportive et j\'informe mon coach de toute blessure ou contre-indication.',
      'Le Club n\'est pas responsable des objets perdus ou volés, ni des blessures dues au non-respect des consignes.',
    ],
  },
  {
    titre: 'Données personnelles',
    points: [
      'SUNUFITNESS enregistre mon nom, mon téléphone, mon e-mail, mes achats et mes passages pour gérer mon accès et mes séances. Ces données ne sont pas vendues.',
    ],
  },
];

export const REGLEMENT: string[] = [
  'Respect envers les coachs, le personnel et les autres membres.',
  'Serviette obligatoire, matériel désinfecté après usage, chaussures de sport propres.',
  'Pas de nourriture dans les zones d\'entraînement.',
  'Matériel rangé après usage, poids jamais lâchés.',
  'Cours collectifs : inscription obligatoire, pas d\'entrée après 5 minutes de retard, absence signalée 3 heures avant.',
  'Bassin : douche et bonnet obligatoires, jamais sans coach ou maître-nageur.',
  'Le personnel peut refuser l\'entrée ou exclure en cas de non-respect du règlement.',
];
