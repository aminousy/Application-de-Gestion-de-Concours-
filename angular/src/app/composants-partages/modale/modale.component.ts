import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modale',
  standalone: true,
  template: `
    @if (ouverte) {
      <div class="fond-modale" (click)="fermer.emit()">
        <div
          class="carte-modale"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="titre"
          (click)="$event.stopPropagation()"
        >
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h5 fw-bold mb-0">{{ titre }}</h2>
            <button
              type="button"
              class="btn-close"
              aria-label="Fermer"
              (click)="fermer.emit()"
            ></button>
          </div>
          <ng-content />
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
        align-items: flex-start;
        justify-content: center;
        z-index: 1050;
        padding: 2rem 1rem;
        overflow-y: auto;
      }
      .carte-modale {
        background: #fff;
        border-radius: 0.5rem;
        padding: 1.5rem;
        max-width: 38rem;
        width: 100%;
      }
    `
  ]
})
export class Modale {
  @Input() ouverte = false;
  @Input({ required: true }) titre = '';
  @Output() readonly fermer = new EventEmitter<void>();
}
