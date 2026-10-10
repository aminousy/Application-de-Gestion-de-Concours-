import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { URL_API } from '../utilitaires/api.constantes';
import { Note, RequeteNote } from '../modeles';

@Injectable({ providedIn: 'root' })
export class ServiceNote {
  private readonly http = inject(HttpClient);
  private readonly url = URL_API.notes;


  saisir(requete: RequeteNote): Observable<Note> {
    return this.http.post<Note>(this.url, requete);
  }


  listerParCandidature(candidatureId: number): Observable<Note[]> {
    const params = new HttpParams().set('candidatureId', candidatureId);
    return this.http.get<Note[]>(this.url, { params });
  }


  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
