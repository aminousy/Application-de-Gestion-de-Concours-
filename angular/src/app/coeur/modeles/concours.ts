import { Epreuve } from './epreuve';

/**
 * Backend : ReponseConcours (listes).
 * `dateLimiteCandidature`, `dateDeliberation` : 'AAAA-MM-JJ' (LocalDate).
 * `datePublicationResultats` : ISO 8601 (LocalDateTime) ou null.
 */
export interface Concours {
  id: number;
  titre: string;
  description: string | null;
  dateLimiteCandidature: string;
  dateDeliberation: string | null;
  nombrePlaces: number;
  ouvert: boolean;
  resultatsPublies: boolean;
  datePublicationResultats: string | null;
  nombreEpreuves: number;
}

/** Backend : ReponseConcoursDetail (GET /api/concours/{id}). */
export interface ConcoursDetail {
  id: number;
  titre: string;
  description: string | null;
  dateLimiteCandidature: string;
  dateDeliberation: string | null;
  nombrePlaces: number;
  ouvert: boolean;
  resultatsPublies: boolean;
  datePublicationResultats: string | null;
  epreuves: Epreuve[];
}

/** Backend : DemandeConcours (POST et PUT /api/concours, ROLE_ADMIN). */
export interface RequeteConcours {
  titre: string;
  description?: string;
  dateLimiteCandidature: string;
  dateDeliberation?: string;
  nombrePlaces: number;
  ouvert: boolean;
}
