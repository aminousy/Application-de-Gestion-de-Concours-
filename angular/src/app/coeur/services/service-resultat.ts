import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import { RequeteDeliberation, Resultat } from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceResultat {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.resultats;

  /** POST /api/resultats/concours/{id}/calcul (ROLE_ADMIN) : calcule et classe. */
  calculerPourConcours(concoursId: number): Observable<Resultat[]> {
    return this.http.post<Resultat[]>(`${this.url}/concours/${concoursId}/calcul`, null);
  }

  /** POST /api/resultats/candidatures/{id}/calcul (ROLE_ADMIN). */
  calculerPourCandidature(candidatureId: number): Observable<Resultat> {
    return this.http.post<Resultat>(`${this.url}/candidatures/${candidatureId}/calcul`, null);
  }

  /** PATCH /api/resultats/candidatures/{id}/deliberation (ROLE_ADMIN). */
  deliberer(candidatureId: number, requete: RequeteDeliberation): Observable<Resultat> {
    return this.http.patch<Resultat>(
      `${this.url}/candidatures/${candidatureId}/deliberation`,
      requete
    );
  }

  /** POST /api/resultats/concours/{id}/publication (ROLE_ADMIN, 204). */
  publier(concoursId: number): Observable<void> {
    return this.http.post<void>(`${this.url}/concours/${concoursId}/publication`, null);
  }

  /** GET /api/resultats/concours/{id} (ROLE_ADMIN) : classement du concours. */
  listerParConcours(concoursId: number): Observable<Resultat[]> {
    return this.http.get<Resultat[]>(`${this.url}/concours/${concoursId}`);
  }

  /**
   * GET /api/resultats/candidatures/{id}.
   * ROLE_ADMIN : sans condition. ROLE_CANDIDAT : le sien, uniquement apres publication.
   */
  obtenirParCandidature(candidatureId: number): Observable<Resultat> {
    return this.http.get<Resultat>(`${this.url}/candidatures/${candidatureId}`);
  }
}
