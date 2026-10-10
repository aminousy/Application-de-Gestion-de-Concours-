import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';

import { ServiceNotification } from '../services/service-notification';


@Injectable()
export class GestionnaireErreurs implements ErrorHandler {
  private readonly notifications = inject(ServiceNotification);

  handleError(erreur: unknown): void {
    const cause = erreur instanceof Error && erreur.cause ? erreur.cause : erreur;
    if (cause instanceof HttpErrorResponse) {
      return;
    }
    console.error(erreur);
    this.notifications.erreur('Une erreur inattendue est survenue.');
  }
}
