/** Backend : ReponseErreur.ErreurChamp (detail d'une erreur de validation). */
export interface ErreurChamp {
  champ: string;
  message: string;
}

/**
 * Backend : ReponseErreur (corps JSON renvoye pour toute erreur de l'API).
 * `chemin` et `erreurs` ne sont presents que dans certains cas.
 */
export interface ReponseErreur {
  statut: number;
  message: string;
  date: string;
  chemin?: string;
  erreurs?: ErreurChamp[];
}
