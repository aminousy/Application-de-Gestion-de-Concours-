/**
 * Backend : ReponseNote.
 * `dateSaisie` : ISO 8601 (LocalDateTime).
 */
export interface Note {
  id: number;
  candidatureId: number;
  epreuveId: number;
  intituleEpreuve: string;
  coefficient: number;
  valeur: number;
  dateSaisie: string;
}

/**
 * Backend : DemandeNote (POST /api/notes, ROLE_ADMIN).
 * `valeur` doit etre comprise entre 0 et 20 (validation backend).
 */
export interface RequeteNote {
  candidatureId: number;
  epreuveId: number;
  valeur: number;
}
