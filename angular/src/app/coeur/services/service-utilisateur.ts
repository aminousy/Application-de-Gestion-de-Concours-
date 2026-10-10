import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import {
  RequeteAdministrationUtilisateur,
  RequeteChangementMotDePasse,
  RequeteCreationUtilisateur,
  RequeteMiseAJourUtilisateur,
  Role,
  Utilisateur
} from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceUtilisateur {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.utilisateurs;


  listerTous(role?: Role): Observable<Utilisateur[]> {
    let params = new HttpParams();
    if (role) {
      params = params.set('role', role);
    }
    return this.http.get<Utilisateur[]>(this.url, { params });
  }


  obtenirParId(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.url}/${id}`);
  }


  monProfil(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.url}/moi`);
  }


  creer(requete: RequeteCreationUtilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.url, requete);
  }


  mettreAJourMonProfil(requete: RequeteMiseAJourUtilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.url}/moi`, requete);
  }


  mettreAJour(id: number, requete: RequeteMiseAJourUtilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.url}/${id}`, requete);
  }


  changerMonMotDePasse(requete: RequeteChangementMotDePasse): Observable<void> {
    return this.http.patch<void>(`${this.url}/moi/mot-de-passe`, requete);
  }


  administrer(
    id: number,
    requete: RequeteAdministrationUtilisateur
  ): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(`${this.url}/${id}/administration`, requete);
  }


  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
