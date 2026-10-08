import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import { Concours, ConcoursDetail, RequeteConcours } from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceConcours {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.concours;

  /** GET /api/concours/ouverts (tout utilisateur authentifie). */
  listerOuverts(): Observable<Concours[]> {
    return this.http.get<Concours[]>(`${this.url}/ouverts`);
  }

  /** GET /api/concours (ROLE_ADMIN). */
  listerTous(): Observable<Concours[]> {
    return this.http.get<Concours[]>(this.url);
  }

  /** GET /api/concours/{id} (detail avec epreuves). */
  obtenirDetail(id: number): Observable<ConcoursDetail> {
    return this.http.get<ConcoursDetail>(`${this.url}/${id}`);
  }

  /** POST /api/concours (ROLE_ADMIN). */
  creer(requete: RequeteConcours): Observable<Concours> {
    return this.http.post<Concours>(this.url, requete);
  }

  /** PUT /api/concours/{id} (ROLE_ADMIN). */
  mettreAJour(id: number, requete: RequeteConcours): Observable<Concours> {
    return this.http.put<Concours>(`${this.url}/${id}`, requete);
  }

  /** PATCH /api/concours/{id}/ouverture?ouvert=true|false (ROLE_ADMIN). */
  definirOuverture(id: number, ouvert: boolean): Observable<Concours> {
    const params = new HttpParams().set('ouvert', ouvert);
    return this.http.patch<Concours>(`${this.url}/${id}/ouverture`, null, { params });
  }

  /** DELETE /api/concours/{id} (ROLE_ADMIN, 204). */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
