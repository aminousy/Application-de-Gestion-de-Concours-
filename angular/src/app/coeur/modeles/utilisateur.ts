import { Role } from './enumerations';


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


export interface RequeteCreationUtilisateur {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  role: Role;
}


export interface RequeteMiseAJourUtilisateur {
  nom: string;
  prenom: string;
  telephone?: string;
}


export interface RequeteChangementMotDePasse {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}


export interface RequeteAdministrationUtilisateur {
  role?: Role;
  actif?: boolean;
}
