import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-erreur',
  standalone: true,
  template: `
    <div class="alert alert-danger d-flex align-items-start gap-2" role="alert">
      <i class="bi bi-exclamation-triangle-fill mt-1" aria-hidden="true"></i>
      <div class="flex-grow-1">
        <p class="mb-0">{{ message }}</p>
        @if (reessayable) {
          <button
            type="button"
            class="btn btn-sm btn-outline-danger mt-2"
            (click)="reessayer.emit()"
          >
            Reessayer
          </button>
        }
      </div>
    </div>
  `
})
export class MessageErreur {
  @Input({ required: true }) message = '';
  @Input() reessayable = false;
  @Output() readonly reessayer = new EventEmitter<void>();
}
