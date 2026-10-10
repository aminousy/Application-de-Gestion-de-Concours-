import { Routes } from '@angular/router';

import { MiseEnPageAdministration } from './mise-en-page-administration/mise-en-page-administration.component';


export const routesAdministration: Routes = [
  {
    path: '',
    component: MiseEnPageAdministration,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tableau-de-bord' },
      {
        path: 'tableau-de-bord',
        loadComponent: () =>
          import(
            './tableau-de-bord-administrateur/tableau-de-bord-administrateur.component'
          ).then((m) => m.TableauDeBordAdministrateur),
        title: 'Tableau de bord admin - SunuXam'
      },
      {
        path: 'utilisateurs',
        loadComponent: () =>
          import('./gestion-utilisateurs/gestion-utilisateurs.component').then(
            (m) => m.GestionUtilisateurs
          ),
        title: 'Gestion des utilisateurs - SunuXam'
      },
      {
        path: 'concours',
        loadComponent: () =>
          import('./gestion-concours/gestion-concours.component').then((m) => m.GestionConcours),
        title: 'Gestion des concours - SunuXam'
      },
      {
        path: 'concours/nouveau',
        loadComponent: () =>
          import('./formulaire-concours/formulaire-concours.component').then(
            (m) => m.FormulaireConcours
          ),
        title: 'Nouveau concours - SunuXam'
      },
      {
        path: 'concours/:identifiant/modifier',
        loadComponent: () =>
          import('./formulaire-concours/formulaire-concours.component').then(
            (m) => m.FormulaireConcours
          ),
        title: 'Modifier le concours - SunuXam'
      },
      {
        path: 'epreuves',
        loadComponent: () =>
          import('./gestion-epreuves/gestion-epreuves.component').then((m) => m.GestionEpreuves),
        title: 'Gestion des epreuves - SunuXam'
      },
      {
        path: 'candidatures',
        loadComponent: () =>
          import('./gestion-candidatures/gestion-candidatures.component').then(
            (m) => m.GestionCandidatures
          ),
        title: 'Gestion des candidatures - SunuXam'
      },
      {
        path: 'notes',
        loadComponent: () =>
          import('./gestion-notes/gestion-notes.component').then((m) => m.GestionNotes),
        title: 'Gestion des notes - SunuXam'
      },
      {
        path: 'resultats',
        loadComponent: () =>
          import('./gestion-resultats/gestion-resultats.component').then((m) => m.GestionResultats),
        title: 'Gestion des resultats - SunuXam'
      }
    ]
  }
];
