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

  /** GET /api/utilisateurs (ROLE_ADMIN), filtrable par role. */
  listerTous(role?: Role): Observable<Utilisateur[]> {
    let params = new HttpParams();
    if (role) {
      params = params.set('role', role);
    }
    return this.http.get<Utilisateur[]>(this.url, { params });
  }

  /** GET /api/utilisateurs/{id} (ROLE_ADMIN). */
  obtenirParId(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.url}/${id}`);
  }

  /** GET /api/utilisateurs/moi. */
  monProfil(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.url}/moi`);
  }

  /** POST /api/utilisateurs (ROLE_ADMIN). */
  creer(requete: RequeteCreationUtilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.url, requete);
  }

  /** PUT /api/utilisateurs/moi. */
  mettreAJourMonProfil(requete: RequeteMiseAJourUtilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.url}/moi`, requete);
  }

  /** PUT /api/utilisateurs/{id} (ROLE_ADMIN). */
  mettreAJour(id: number, requete: RequeteMiseAJourUtilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.url}/${id}`, requete);
  }

  /** PATCH /api/utilisateurs/moi/mot-de-passe (204). */
  changerMonMotDePasse(requete: RequeteChangementMotDePasse): Observable<void> {
    return this.http.patch<void>(`${this.url}/moi/mot-de-passe`, requete);
  }

  /** PATCH /api/utilisateurs/{id}/administration (ROLE_ADMIN). */
  administrer(
    id: number,
    requete: RequeteAdministrationUtilisateur
  ): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(`${this.url}/${id}/administration`, requete);
  }

  /** DELETE /api/utilisateurs/{id} (ROLE_ADMIN, 204). */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
