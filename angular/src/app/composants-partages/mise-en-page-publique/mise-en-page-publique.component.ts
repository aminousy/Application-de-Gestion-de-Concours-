import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BarreNavigation } from '../barre-navigation/barre-navigation.component';
import { PiedPage } from '../pied-page/pied-page.component';

@Component({
  selector: 'app-mise-en-page-publique',
  standalone: true,
  imports: [RouterOutlet, BarreNavigation, PiedPage],
  template: `
    <app-barre-navigation />
    <main class="flex-grow-1">
      <router-outlet />
    </main>
    <app-pied-page />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
    `
  ]
})
export class MiseEnPagePublique {}
