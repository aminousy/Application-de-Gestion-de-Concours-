import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chargement',
  standalone: true,
  template: `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement en cours</span>
      </div>
      @if (message) {
        <p class="mt-2 text-muted mb-0">{{ message }}</p>
      }
    </div>
  `
})
export class Chargement {
  @Input() message = '';
}
