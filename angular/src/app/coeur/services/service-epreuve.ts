import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import { Epreuve, RequeteEpreuve, RequeteMiseAJourEpreuve } from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceEpreuve {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.epreuves;


  listerParConcours(concoursId: number): Observable<Epreuve[]> {
    const params = new HttpParams().set('concoursId', concoursId);
    return this.http.get<Epreuve[]>(this.url, { params });
  }


  obtenirParId(id: number): Observable<Epreuve> {
    return this.http.get<Epreuve>(`${this.url}/${id}`);
  }


  creer(requete: RequeteEpreuve): Observable<Epreuve> {
    return this.http.post<Epreuve>(this.url, requete);
  }


  mettreAJour(id: number, requete: RequeteMiseAJourEpreuve): Observable<Epreuve> {
    return this.http.put<Epreuve>(`${this.url}/${id}`, requete);
  }


  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
