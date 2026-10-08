import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import {
  Candidature,
  RequeteCandidature,
  RequeteChangementStatutCandidature,
  StatutCandidature
} from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceCandidature {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.candidatures;

  /** POST /api/candidatures (ROLE_CANDIDAT). */
  deposer(requete: RequeteCandidature): Observable<Candidature> {
    return this.http.post<Candidature>(this.url, requete);
  }

  /** GET /api/candidatures/mes (ROLE_CANDIDAT). */
  mesCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.url}/mes`);
  }

  /** GET /api/candidatures/{id} (proprietaire ou ROLE_ADMIN). */
  obtenirParId(id: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.url}/${id}`);
  }

  /** GET /api/candidatures?concoursId={id}&statut={statut} (ROLE_ADMIN). */
  listerParConcours(
    concoursId: number,
    statut?: StatutCandidature
  ): Observable<Candidature[]> {
    let params = new HttpParams().set('concoursId', concoursId);
    if (statut) {
      params = params.set('statut', statut);
    }
    return this.http.get<Candidature[]>(this.url, { params });
  }

  /** PATCH /api/candidatures/{id}/statut (ROLE_ADMIN). */
  changerStatut(
    id: number,
    requete: RequeteChangementStatutCandidature
  ): Observable<Candidature> {
    return this.http.patch<Candidature>(`${this.url}/${id}/statut`, requete);
  }

  /** DELETE /api/candidatures/{id} (proprietaire si EN_ATTENTE, ou ROLE_ADMIN, 204). */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
