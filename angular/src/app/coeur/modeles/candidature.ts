import { StatutCandidature } from './enumerations';

/**
 * Backend : ReponseCandidature.
 * `dateDepot` : ISO 8601 (LocalDateTime).
 */
export interface Candidature {
  id: number;
  concoursId: number;
  titreConcours: string;
  candidatId: number;
  nomCandidat: string;
  prenomCandidat: string;
  emailCandidat: string;
  statut: StatutCandidature;
  dateDepot: string;
  motivation: string | null;
}

/**
 * Backend : DemandeCandidature (POST /api/candidatures, ROLE_CANDIDAT).
 * NOTE : le backend n'accepte QUE `concoursId` et `motivation`.
 * Aucun endpoint de depot de pieces justificatives (CV, photo, diplome).
 */
export interface RequeteCandidature {
  concoursId: number;
  motivation?: string;
}

/**
 * Backend : DemandeChangementStatutCandidature
 * (PATCH /api/candidatures/{id}/statut, ROLE_ADMIN).
 */
export interface RequeteChangementStatutCandidature {
  statut: StatutCandidature;
}
