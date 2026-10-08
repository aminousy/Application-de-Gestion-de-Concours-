import { Role } from './enumerations';

/** Corps de POST /api/authentification/connexion (backend : DemandeConnexion). */
export interface RequeteConnexion {
  email: string;
  motDePasse: string;
}

/** Corps de POST /api/authentification/inscription (backend : DemandeInscription). */
export interface RequeteInscription {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
}

/**
 * Reponse de /api/authentification/inscription et /connexion
 * (backend : ReponseAuthentification).
 */
export interface ReponseAuthentification {
  token: string;
  typeToken: string;
  email: string;
  role: Role;
  dureeValiditeMs: number;
}

/**
 * Etat de session cote frontend, derive du JWT (non renvoye tel quel par le backend).
 * `expiration` : horodatage en millisecondes (claim `exp` x 1000).
 */
export interface UtilisateurConnecte {
  email: string;
  role: Role;
  expiration: number;
}
