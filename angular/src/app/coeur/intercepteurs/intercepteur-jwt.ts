import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ServiceAuthentification } from '../services/service-authentification';

const CHEMIN_AUTHENTIFICATION = `${environment.urlApi}/authentification`;


export const intercepteurJwt: HttpInterceptorFn = (requete, suivant) => {
  const servAuth = inject(ServiceAuthentification);

  const estRequeteApi = requete.url.startsWith(environment.urlApi);
  const estRequeteAuthentification = requete.url.startsWith(CHEMIN_AUTHENTIFICATION);
  const jeton = servAuth.jeton();

  const requeteFinale =
    estRequeteApi && !estRequeteAuthentification && jeton
      ? requete.clone({ setHeaders: { Authorization: `Bearer ${jeton}` } })
      : requete;

  return suivant(requeteFinale).pipe(
    catchError((erreur: unknown) => {
      if (
        erreur instanceof HttpErrorResponse &&
        erreur.status === 401 &&
        !estRequeteAuthentification &&
        jeton
      ) {
        servAuth.deconnexion();
      }
      return throwError(() => erreur);
    })
  );
};
