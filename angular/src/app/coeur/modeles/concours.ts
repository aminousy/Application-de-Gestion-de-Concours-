import { Epreuve } from './epreuve';


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


export interface RequeteConcours {
  titre: string;
  description?: string;
  dateLimiteCandidature: string;
  dateDeliberation?: string;
  nombrePlaces: number;
  ouvert: boolean;
}
