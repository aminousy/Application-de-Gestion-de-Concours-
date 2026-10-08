import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import { Epreuve, RequeteEpreuve, RequeteMiseAJourEpreuve } from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceEpreuve {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.epreuves;

  /** GET /api/epreuves?concoursId={id}. */
  listerParConcours(concoursId: number): Observable<Epreuve[]> {
    const params = new HttpParams().set('concoursId', concoursId);
    return this.http.get<Epreuve[]>(this.url, { params });
  }

  /** GET /api/epreuves/{id}. */
  obtenirParId(id: number): Observable<Epreuve> {
    return this.http.get<Epreuve>(`${this.url}/${id}`);
  }

  /** POST /api/epreuves (ROLE_ADMIN). */
  creer(requete: RequeteEpreuve): Observable<Epreuve> {
    return this.http.post<Epreuve>(this.url, requete);
  }

  /** PUT /api/epreuves/{id} (ROLE_ADMIN). */
  mettreAJour(id: number, requete: RequeteMiseAJourEpreuve): Observable<Epreuve> {
    return this.http.put<Epreuve>(`${this.url}/${id}`, requete);
  }

  /** DELETE /api/epreuves/{id} (ROLE_ADMIN, 204). */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
