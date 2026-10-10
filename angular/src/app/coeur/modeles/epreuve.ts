
export interface Epreuve {
  id: number;
  intitule: string;
  description: string | null;
  coefficient: number;
  dureeMinutes: number;
  concoursId: number;
}


export interface RequeteEpreuve {
  intitule: string;
  description?: string;
  coefficient: number;
  dureeMinutes: number;
  concoursId: number;
}


export interface RequeteMiseAJourEpreuve {
  intitule: string;
  description?: string;
  coefficient: number;
  dureeMinutes: number;
}
