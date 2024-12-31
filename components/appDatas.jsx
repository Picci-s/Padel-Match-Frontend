// Définir les données non modifiables à utiliser sur l'ensemble de l'application => penser à les importer dans chaque Screen !

// url du serveur backend
export const backend = process.env.EXPO_PUBLIC_API_URL;

// RegEx de vérification de l'adresse email
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// liste des genres pour le joueur
export const playerGenders = [
  { label: "Masculin", value: "masculin" },
  { label: "Féminin", value: "féminin" },
];

// liste des catégories de tournois
export const tournamentGenders = [
  { label: "Masculin", value: "masculin" },
  { label: "Féminin", value: "féminin" },
  { label: "Mixte", value: "mixte" },
];

export const tournamentLevel = [
  { label: "P25", value: "P25" },
  { label: "P100", value: "P100" },
  { label: "P250", value: "P250" },
  { label: "P500", value: "P500" },
  { label: "P1000", value: "P1000" },
  { label: "P1500", value: "P1500" },
  { label: "P2000", value: "P2000" },
];

export const tournamentSchedule = [
  { label: "Journée", value: "Journée" },
  { label: "Soirée", value: "Soirée" },
];

export const tournamentCapacity = [
  { label: "16", value: "16" },
  { label: "18", value: "18" },
  { label: "20", value: "20" },
  { label: "22", value: "22" },
  { label: "24", value: "24" },
  { label: "26", value: "26" },
  { label: "28", value: "28" },
  { label: "30", value: "30" },
  { label: "32", value: "32" },
  { label: "34", value: "34" },
  { label: "36", value: "36" },
  { label: "38", value: "38" },
  { label: "40", value: "40" },
  { label: "42", value: "42" },
  { label: "44", value: "44" },
  { label: "46", value: "46" },
  { label: "48", value: "48" },
  { label: "50", value: "50" },
  { label: "52", value: "52" },
  { label: "54", value: "54" },
  { label: "56", value: "56" },
  { label: "58", value: "58" },
  { label: "60", value: "60" },
];

export const months = [
  { label: "Janvier", value: 0 },
  { label: "Février", value: 1 },
  { label: "Mars", value: 2 },
  { label: "Avril", value: 3 },
  { label: "Mai", value: 4 },
  { label: "Juin", value: 5 },
  { label: "Juillet", value: 6 },
  { label: "Août", value: 7 },
  { label: "Septembre", value: 8 },
  { label: "Octobre", value: 9 },
  { label: "Novembre", value: 10 },
  { label: "Décembre", value: 11 },
];
