import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ServiceNotification } from '../services/service-notification';

/**
 * Signale par un toast les erreurs transverses (perte de connexion, erreur
 * serveur). Les autres codes (400/401/403/404/409) restent geres par les
 * composants, au plus pres du contexte. L'erreur est toujours relancee.
 */
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
