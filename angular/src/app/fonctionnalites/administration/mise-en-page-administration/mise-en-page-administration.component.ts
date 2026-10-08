import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BarreNavigation } from '../../../composants-partages/barre-navigation/barre-navigation.component';
import {
  ElementMenu,
  MenuLateral
} from '../../../composants-partages/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-mise-en-page-administration',
  standalone: true,
  imports: [RouterOutlet, BarreNavigation, MenuLateral],
  template: `
    <app-barre-navigation />
    <div class="container-fluid">
      <div class="row">
        <aside class="col-lg-2 border-end bg-white p-0 d-none d-lg-block">
          <app-menu-lateral [elements]="menu" orientation="verticale" />
        </aside>
        <main class="col-lg-10 py-3 py-lg-4 px-3 px-lg-4">
          <div class="d-lg-none border-bottom mb-3">
            <app-menu-lateral [elements]="menu" orientation="horizontale" />
          </div>
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: var(--sx-clair);
      }
    `
  ]
})
export class MiseEnPageAdministration {
  readonly menu: ElementMenu[] = [
    { libelle: 'Tableau de bord', lien: '/administration/tableau-de-bord', icone: 'bi-speedometer2' },
    { libelle: 'Utilisateurs', lien: '/administration/utilisateurs', icone: 'bi-people' },
    { libelle: 'Concours', lien: '/administration/concours', icone: 'bi-trophy' },
    { libelle: 'Epreuves', lien: '/administration/epreuves', icone: 'bi-list-check' },
    { libelle: 'Candidatures', lien: '/administration/candidatures', icone: 'bi-folder' },
    { libelle: 'Notes', lien: '/administration/notes', icone: 'bi-pencil-square' },
    { libelle: 'Resultats', lien: '/administration/resultats', icone: 'bi-bar-chart' }
  ];
}
