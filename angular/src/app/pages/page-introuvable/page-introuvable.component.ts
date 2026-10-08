import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-introuvable',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container py-5 text-center">
      <p class="display-1 fw-bold text-primary mb-0">404</p>
      <h1 class="h4 mb-3">Page introuvable</h1>
      <p class="text-muted">La page demandee n'existe pas ou a ete deplacee.</p>
      <a class="btn btn-primary" routerLink="/">Retour a l'accueil</a>
    </section>
  `
})
export class PageIntrouvable {}
