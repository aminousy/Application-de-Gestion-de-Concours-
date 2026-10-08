import { Component, inject } from '@angular/core';

import {
  ServiceNotification,
  TypeNotification
} from '../../coeur/services/service-notification';

const CLASSE_ALERTE: Record<TypeNotification, string> = {
  succes: 'alert-success',
  erreur: 'alert-danger',
  info: 'alert-info',
  avertissement: 'alert-warning'
};

const ICONE_ALERTE: Record<TypeNotification, string> = {
  succes: 'bi-check-circle-fill',
  erreur: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
  avertissement: 'bi-exclamation-circle-fill'
};

@Component({
  selector: 'app-notifications',
  standalone: true,
  template: `
    <div class="pile-notifications">
      @for (n of notifications(); track n.id) {
        <div
          class="alert {{ classe(n.type) }} d-flex align-items-start gap-2 shadow-sm"
          role="alert"
        >
          <i class="bi {{ icone(n.type) }} mt-1" aria-hidden="true"></i>
          <span class="flex-grow-1">{{ n.message }}</span>
          <button
            type="button"
            class="btn-close"
            aria-label="Fermer"
            (click)="service.fermer(n.id)"
          ></button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .pile-notifications {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1080;
        width: min(24rem, calc(100vw - 2rem));
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .pile-notifications .alert {
        margin: 0;
      }
    `
  ]
})
export class Notifications {
  readonly service = inject(ServiceNotification);
  readonly notifications = this.service.notifications;

  classe(type: TypeNotification): string {
    return CLASSE_ALERTE[type];
  }

  icone(type: TypeNotification): string {
    return ICONE_ALERTE[type];
  }
}
