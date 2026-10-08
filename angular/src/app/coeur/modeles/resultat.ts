/**
 * Backend : ReponseResultat.
 * `rang` : null tant que le classement du concours n'a pas ete etabli.
 * `dateCalcul` : ISO 8601 (LocalDateTime).
 */
export interface Resultat {
  id: number;
  candidatureId: number;
  concoursId: number;
  nomCandidat: string;
  prenomCandidat: string;
  moyenne: number;
  rang: number | null;
  admis: boolean;
  decision: string | null;
  dateCalcul: string;
}

/**
 * Backend : DemandeDeliberation
 * (PATCH /api/resultats/candidatures/{id}/deliberation, ROLE_ADMIN).
 * Champs facultatifs : un champ omis laisse la valeur calculee inchangee.
 */
export interface RequeteDeliberation {
  admis?: boolean;
  decision?: string;
}
