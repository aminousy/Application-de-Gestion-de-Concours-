import { environment } from '../../../environments/environment';

const BASE = environment.urlApi;


export const URL_API = {
  authentification: `${BASE}/authentification`,
  utilisateurs: `${BASE}/utilisateurs`,
  concours: `${BASE}/concours`,
  epreuves: `${BASE}/epreuves`,
  candidatures: `${BASE}/candidatures`,
  notes: `${BASE}/notes`,
  resultats: `${BASE}/resultats`
} as const;
