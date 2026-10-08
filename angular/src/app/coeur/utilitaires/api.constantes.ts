import { environment } from '../../../environments/environment';

const BASE = environment.urlApi;

/**
 * URLs racines de l'API SunuXam. Les chemins imbriques (ex. /resultats/concours/{id}/calcul)
 * sont construits dans les services a partir de ces racines.
 */
export const URL_API = {
  authentification: `${BASE}/authentification`,
  utilisateurs: `${BASE}/utilisateurs`,
  concours: `${BASE}/concours`,
  epreuves: `${BASE}/epreuves`,
  candidatures: `${BASE}/candidatures`,
  notes: `${BASE}/notes`,
  resultats: `${BASE}/resultats`
} as const;
