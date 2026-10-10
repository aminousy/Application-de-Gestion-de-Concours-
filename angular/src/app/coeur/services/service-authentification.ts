import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { URL_API } from '../utilitaires/api.constantes';
import { decoderJeton, estChargeExpiree } from '../utilitaires/jeton.utils';
import {
  ReponseAuthentification,
  RequeteConnexion,
  RequeteInscription,
  Role,
  UtilisateurConnecte
} from '../modeles';


@Injectable({ providedIn: 'root' })
export class ServiceAuthentification {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _utilisateurConnecte = signal<UtilisateurConnecte | null>(this.lireSession());


  readonly utilisateurConnecte = this._utilisateurConnecte.asReadonly();
  readonly estAuthentifie = computed(() => this._utilisateurConnecte() !== null);
  readonly estAdministrateur = computed(() => this._utilisateurConnecte()?.role === Role.ADMIN);
  readonly estCandidat = computed(() => this._utilisateurConnecte()?.role === Role.CANDIDAT);

  private minuterieExpiration?: ReturnType<typeof setTimeout>;

  constructor() {
    const session = this._utilisateurConnecte();
    if (session) {
      this.programmerExpiration(session.expiration);
    }
  }

  connexion(requete: RequeteConnexion): Observable<ReponseAuthentification> {
    return this.http
      .post<ReponseAuthentification>(`${URL_API.authentification}/connexion`, requete)
      .pipe(tap((reponse) => this.enregistrerSession(reponse.token)));
  }

  inscription(requete: RequeteInscription): Observable<ReponseAuthentification> {
    return this.http
      .post<ReponseAuthentification>(`${URL_API.authentification}/inscription`, requete)
      .pipe(tap((reponse) => this.enregistrerSession(reponse.token)));
  }

  deconnexion(rediriger = true): void {
    localStorage.removeItem(environment.cleStockageJeton);
    this._utilisateurConnecte.set(null);
    if (this.minuterieExpiration) {
      clearTimeout(this.minuterieExpiration);
      this.minuterieExpiration = undefined;
    }
    if (rediriger) {
      void this.router.navigate(['/connexion']);
    }
  }


  jeton(): string | null {
    return localStorage.getItem(environment.cleStockageJeton);
  }

  role(): Role | null {
    return this._utilisateurConnecte()?.role ?? null;
  }


  estSessionActive(): boolean {
    const session = this._utilisateurConnecte();
    if (!session) {
      return false;
    }
    if (session.expiration <= Date.now()) {
      this.deconnexion(false);
      return false;
    }
    return true;
  }

  private enregistrerSession(jeton: string): void {
    const charge = decoderJeton(jeton);
    if (!charge || estChargeExpiree(charge)) {
      this.deconnexion(false);
      return;
    }
    localStorage.setItem(environment.cleStockageJeton, jeton);
    const session: UtilisateurConnecte = {
      email: charge.sub,
      role: charge.role as Role,
      expiration: (charge.exp ?? 0) * 1000
    };
    this._utilisateurConnecte.set(session);
    this.programmerExpiration(session.expiration);
  }

  private lireSession(): UtilisateurConnecte | null {
    const jeton = localStorage.getItem(environment.cleStockageJeton);
    if (!jeton) {
      return null;
    }
    const charge = decoderJeton(jeton);
    if (!charge || estChargeExpiree(charge)) {
      localStorage.removeItem(environment.cleStockageJeton);
      return null;
    }
    return {
      email: charge.sub,
      role: charge.role as Role,
      expiration: (charge.exp ?? 0) * 1000
    };
  }

  private programmerExpiration(expiration: number): void {
    if (this.minuterieExpiration) {
      clearTimeout(this.minuterieExpiration);
    }
    const delai = expiration - Date.now();
    if (delai <= 0) {
      this.deconnexion();
      return;
    }
    this.minuterieExpiration = setTimeout(() => this.deconnexion(), delai);
  }
}
