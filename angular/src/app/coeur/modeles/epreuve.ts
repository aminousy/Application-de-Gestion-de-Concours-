/** Backend : ReponseEpreuve. */
export interface Epreuve {
  id: number;
  intitule: string;
  description: string | null;
  coefficient: number;
  dureeMinutes: number;
  concoursId: number;
}

/** Backend : DemandeEpreuve (POST /api/epreuves, ROLE_ADMIN). */
export interface RequeteEpreuve {
  intitule: string;
  description?: string;
  coefficient: number;
  dureeMinutes: number;
  concoursId: number;
}

/**
 * Backend : DemandeMiseAJourEpreuve (PUT /api/epreuves/{id}).
 * Le concours de rattachement n'est pas modifiable.
 */
export interface RequeteMiseAJourEpreuve {
  intitule: string;
  description?: string;
  coefficient: number;
  dureeMinutes: number;
}
