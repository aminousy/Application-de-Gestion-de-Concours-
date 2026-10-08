import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface ElementMenu {
  libelle: string;
  lien: string;
  icone: string;
}

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="nav py-2"
      [class.flex-column]="orientation === 'verticale'"
      [class.flex-nowrap]="orientation === 'horizontale'"
      [class.overflow-auto]="orientation === 'horizontale'"
    >
      @for (element of elements; track element.lien) {
        <a
          class="nav-link text-nowrap lien-menu"
          [routerLink]="element.lien"
          routerLinkActive="active"
        >
          <i class="bi {{ element.icone }} me-2" aria-hidden="true"></i>{{ element.libelle }}
        </a>
      }
    </nav>
  `,
  styles: [
    `
      .lien-menu {
        color: var(--sx-sombre);
      }
      .lien-menu.active {
        color: var(--sx-primaire);
        font-weight: 600;
        background-color: var(--sx-clair);
        border-left: 3px solid var(--sx-primaire);
      }
    `
  ]
})
export class MenuLateral {
  @Input({ required: true }) elements: ElementMenu[] = [];
  @Input() orientation: 'verticale' | 'horizontale' = 'verticale';
}
