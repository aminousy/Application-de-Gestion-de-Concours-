import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import { RequeteDeliberation, Resultat } from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceResultat {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.resultats;


  calculerPourConcours(concoursId: number): Observable<Resultat[]> {
    return this.http.post<Resultat[]>(`${this.url}/concours/${concoursId}/calcul`, null);
  }


  calculerPourCandidature(candidatureId: number): Observable<Resultat> {
    return this.http.post<Resultat>(`${this.url}/candidatures/${candidatureId}/calcul`, null);
  }


  deliberer(candidatureId: number, requete: RequeteDeliberation): Observable<Resultat> {
    return this.http.patch<Resultat>(
      `${this.url}/candidatures/${candidatureId}/deliberation`,
      requete
    );
  }


  publier(concoursId: number): Observable<void> {
    return this.http.post<void>(`${this.url}/concours/${concoursId}/publication`, null);
  }


  listerParConcours(concoursId: number): Observable<Resultat[]> {
    return this.http.get<Resultat[]>(`${this.url}/concours/${concoursId}`);
  }


  obtenirParCandidature(candidatureId: number): Observable<Resultat> {
    return this.http.get<Resultat>(`${this.url}/candidatures/${candidatureId}`);
  }
}
