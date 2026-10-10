import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ServiceNotification } from '../services/service-notification';


export const intercepteurErreurs: HttpInterceptorFn = (requete, suivant) => {
  const notifications = inject(ServiceNotification);

  return suivant(requete).pipe(
    catchError((erreur: unknown) => {
      if (erreur instanceof HttpErrorResponse) {
        if (erreur.status === 0) {
          notifications.erreur('Impossible de joindre le serveur. Verifiez votre connexion.');
        } else if (erreur.status >= 500) {
          notifications.erreur('Une erreur est survenue sur le serveur. Reessayez plus tard.');
        }
      }
      return throwError(() => erreur);
    })
  );
};
