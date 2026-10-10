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


  deposer(requete: RequeteCandidature): Observable<Candidature> {
    return this.http.post<Candidature>(this.url, requete);
  }


  mesCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.url}/mes`);
  }


  obtenirParId(id: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.url}/${id}`);
  }


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


  changerStatut(
    id: number,
    requete: RequeteChangementStatutCandidature
  ): Observable<Candidature> {
    return this.http.patch<Candidature>(`${this.url}/${id}/statut`, requete);
  }


  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
