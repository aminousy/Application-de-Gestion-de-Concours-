import { Role } from './enumerations';

/**
 * Backend : ReponseUtilisateur (GET /api/utilisateurs, /{id}, /moi).
 * `dateCreation` : chaine ISO 8601 (Instant). `telephone` : peut etre null.
 */
export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  role: Role;
  actif: boolean;
  dateCreation: string;
}

/** Backend : DemandeCreationUtilisateur (POST /api/utilisateurs, ROLE_ADMIN). */
export interface RequeteCreationUtilisateur {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  role: Role;
}

/** Backend : DemandeMiseAJourUtilisateur (PUT /api/utilisateurs/{id} ou /moi). */
export interface RequeteMiseAJourUtilisateur {
  nom: string;
  prenom: string;
  telephone?: string;
}

/** Backend : DemandeChangementMotDePasse (PATCH /api/utilisateurs/moi/mot-de-passe). */
export interface RequeteChangementMotDePasse {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

/**
 * Backend : DemandeAdministrationUtilisateur
 * (PATCH /api/utilisateurs/{id}/administration). Champs facultatifs :
 * un champ omis n'est pas modifie.
 */
export interface RequeteAdministrationUtilisateur {
  role?: Role;
  actif?: boolean;
}
