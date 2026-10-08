import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import { Note, RequeteNote } from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceNote {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.notes;

  /** POST /api/notes (ROLE_ADMIN) : cree ou met a jour la note du couple candidature + epreuve. */
  saisir(requete: RequeteNote): Observable<Note> {
    return this.http.post<Note>(this.url, requete);
  }

  /** GET /api/notes?candidatureId={id} (proprietaire ou ROLE_ADMIN). */
  listerParCandidature(candidatureId: number): Observable<Note[]> {
    const params = new HttpParams().set('candidatureId', candidatureId);
    return this.http.get<Note[]>(this.url, { params });
  }

  /** DELETE /api/notes/{id} (ROLE_ADMIN, 204). */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
