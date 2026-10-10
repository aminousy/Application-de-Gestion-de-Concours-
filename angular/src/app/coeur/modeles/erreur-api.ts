
export interface ErreurChamp {
  champ: string;
  message: string;
}


export interface ReponseErreur {
  statut: number;
  message: string;
  date: string;
  chemin?: string;
  erreurs?: ErreurChamp[];
}
