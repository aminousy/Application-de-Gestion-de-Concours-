import { StatutCandidature } from './enumerations';


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


export interface RequeteCandidature {
  concoursId: number;
  motivation?: string;
}


export interface RequeteChangementStatutCandidature {
  statut: StatutCandidature;
}
