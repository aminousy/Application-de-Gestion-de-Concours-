import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pied-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="pied-sunuxam py-4 text-light">
      <div class="container">
        <div class="row gy-3">
          <div class="col-md-6">
            <h5 class="fw-bold mb-1">SunuXam</h5>
            <p class="mb-0 small text-white-50">
              La plateforme de gestion des concours et examens.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <a class="link-light d-block small" routerLink="/concours">Concours ouverts</a>
            <a class="link-light d-block small" routerLink="/connexion">Connexion</a>
            <a class="link-light d-block small" routerLink="/inscription">Creer un compte</a>
          </div>
        </div>
        <hr class="border-secondary" />
        <p class="mb-0 small text-white-50">
          &copy; {{ annee }} SunuXam. Projet universitaire - Licence 3 Genie Logiciel.
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      .pied-sunuxam {
        background-color: var(--sx-sombre);
      }
    `
  ]
})
export class PiedPage {
  readonly annee = new Date().getFullYear();
}
