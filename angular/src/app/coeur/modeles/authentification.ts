import { Role } from './enumerations';


export interface RequeteConnexion {
  email: string;
  motDePasse: string;
}


export interface RequeteInscription {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
}


export interface ReponseAuthentification {
  token: string;
  typeToken: string;
  email: string;
  role: Role;
  dureeValiditeMs: number;
}


export interface UtilisateurConnecte {
  email: string;
  role: Role;
  expiration: number;
}
