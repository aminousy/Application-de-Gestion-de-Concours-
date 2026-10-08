import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carte-statistique',
  standalone: true,
  template: `
    <div class="card shadow-sm h-100">
      <div class="card-body d-flex align-items-center gap-3">
        @if (icone) {
          <i class="bi {{ icone }} carte-stat-icone {{ couleur }}" aria-hidden="true"></i>
        }
        <div>
          <div class="fs-3 fw-bold lh-1 {{ couleur }}">{{ valeur }}</div>
          <div class="small text-muted">{{ libelle }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .carte-stat-icone {
        font-size: 1.9rem;
      }
    `
  ]
})
export class CarteStatistique {
  @Input({ required: true }) valeur: number | string = 0;
  @Input({ required: true }) libelle = '';
  @Input() icone = '';
  @Input() couleur = 'text-primary';
}
