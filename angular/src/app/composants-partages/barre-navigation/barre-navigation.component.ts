import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ServiceAuthentification } from '../../coeur/services/service-authentification';

@Component({
  selector: 'app-barre-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark barre-sunuxam">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">SunuXam</a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navigationSunuxam"
          aria-controls="navigationSunuxam"
          aria-expanded="false"
          aria-label="Ouvrir la navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navigationSunuxam">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/concours" routerLinkActive="active">Concours</a>
            </li>

            @if (estCandidat()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/candidat/tableau-de-bord" routerLinkActive="active">
                  Tableau de bord
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/candidat/candidatures" routerLinkActive="active">
                  Mes candidatures
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/candidat/resultats" routerLinkActive="active">
                  Mes resultats
                </a>
              </li>
            }

            @if (estAdministrateur()) {
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/administration/tableau-de-bord"
                  routerLinkActive="active"
                >
                  Administration
                </a>
              </li>
            }
          </ul>

          <ul class="navbar-nav">
            @if (utilisateur(); as u) {
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="bi bi-person-circle me-1"></i>{{ u.email }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <button type="button" class="dropdown-item" (click)="deconnexion()">
                      <i class="bi bi-box-arrow-right me-2"></i>Se deconnecter
                    </button>
                  </li>
                </ul>
              </li>
            } @else {
              <li class="nav-item">
                <a class="nav-link" routerLink="/connexion" routerLinkActive="active">Connexion</a>
              </li>
              <li class="nav-item ms-lg-2 d-grid">
                <a class="btn btn-light btn-sm my-1" routerLink="/inscription">S'inscrire</a>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .barre-sunuxam {
        background-color: var(--sx-primaire);
      }
      .nav-link.active {
        font-weight: 600;
        text-decoration: underline;
      }
    `
  ]
})
export class BarreNavigation {
  private readonly servAuth = inject(ServiceAuthentification);

  readonly utilisateur = this.servAuth.utilisateurConnecte;
  readonly estAdministrateur = this.servAuth.estAdministrateur;
  readonly estCandidat = this.servAuth.estCandidat;

  deconnexion(): void {
    this.servAuth.deconnexion();
  }
}
