import { Routes } from '@angular/router';

import { gardeRole } from './coeur/gardes';
import { Role } from './coeur/modeles';
import { MiseEnPagePublique } from './composants-partages/mise-en-page-publique/mise-en-page-publique.component';
import { Accueil } from './pages/accueil/accueil.component';
import { PageIntrouvable } from './pages/page-introuvable/page-introuvable.component';


export const routes: Routes = [
  {
    path: '',
    component: MiseEnPagePublique,
    children: [
      { path: '', pathMatch: 'full', component: Accueil, title: 'SunuXam' },
      {
        path: 'connexion',
        loadComponent: () =>
          import('./fonctionnalites/authentification/connexion/connexion.component').then(
            (m) => m.Connexion
          ),
        title: 'Connexion - SunuXam'
      },
      {
        path: 'inscription',
        loadComponent: () =>
          import('./fonctionnalites/authentification/inscription/inscription.component').then(
            (m) => m.Inscription
          ),
        title: 'Inscription - SunuXam'
      },
      {
        path: 'concours',
        loadComponent: () =>
          import('./fonctionnalites/concours/liste-concours/liste-concours.component').then(
            (m) => m.ListeConcours
          ),
        title: 'Concours - SunuXam'
      },
      {
        path: 'concours/:identifiant',
        loadComponent: () =>
          import('./fonctionnalites/concours/detail-concours/detail-concours.component').then(
            (m) => m.DetailConcours
          ),
        title: 'Detail du concours - SunuXam'
      },
      {
        path: 'candidat',
        canActivate: [gardeRole(Role.CANDIDAT)],
        loadChildren: () =>
          import('./fonctionnalites/candidat/candidat.routes').then((m) => m.routesCandidat)
      }
    ]
  },
  {
    path: 'administration',
    canActivate: [gardeRole(Role.ADMIN)],
    loadChildren: () =>
      import('./fonctionnalites/administration/administration.routes').then(
        (m) => m.routesAdministration
      )
  },
  { path: '**', component: PageIntrouvable, title: 'Page introuvable - SunuXam' }
];
