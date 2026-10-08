import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-boite-confirmation',
  standalone: true,
  template: `
    @if (ouverte) {
      <div class="fond-modale" (click)="annule.emit()">
        <div
          class="carte-modale"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="titre"
          (click)="$event.stopPropagation()"
        >
          <h2 class="h6 fw-bold">{{ titre }}</h2>
          <p class="text-muted small mb-3">{{ message }}</p>
          <div class="d-flex justify-content-end gap-2">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              [disabled]="enCours"
              (click)="annule.emit()"
            >
              Annuler
            </button>
            <button
              type="button"
              class="btn btn-sm"
              [class.btn-danger]="variante === 'danger'"
              [class.btn-primary]="variante === 'primary'"
              [disabled]="enCours"
              (click)="confirme.emit()"
            >
              @if (enCours) {
                <span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
              }
              {{ libelleConfirmation }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .fond-modale {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
        padding: 1rem;
      }
      .carte-modale {
        background: #fff;
        border-radius: 0.5rem;
        padding: 1.25rem;
        max-width: 24rem;
        width: 100%;
      }
    `
  ]
})
export class BoiteConfirmation {
  @Input() ouverte = false;
  @Input() titre = 'Confirmation';
  @Input({ required: true }) message = '';
  @Input() libelleConfirmation = 'Confirmer';
  @Input() variante: 'danger' | 'primary' = 'danger';
  @Input() enCours = false;

  @Output() readonly confirme = new EventEmitter<void>();
  @Output() readonly annule = new EventEmitter<void>();
}
