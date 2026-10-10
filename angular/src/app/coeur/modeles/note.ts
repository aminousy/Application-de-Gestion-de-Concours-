
export interface Note {
  id: number;
  candidatureId: number;
  epreuveId: number;
  intituleEpreuve: string;
  coefficient: number;
  valeur: number;
  dateSaisie: string;
}


export interface RequeteNote {
  candidatureId: number;
  epreuveId: number;
  valeur: number;
}
