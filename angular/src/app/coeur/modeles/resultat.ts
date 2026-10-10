
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


export interface RequeteDeliberation {
  admis?: boolean;
  decision?: string;
}
