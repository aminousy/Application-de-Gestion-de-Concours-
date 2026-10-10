import { Routes } from '@angular/router';


export const routesCandidat: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tableau-de-bord' },
  {
    path: 'tableau-de-bord',
    loadComponent: () =>
      import('./tableau-de-bord-candidat/tableau-de-bord-candidat.component').then(
        (m) => m.TableauDeBordCandidat
      ),
    title: 'Tableau de bord - SunuXam'
  },
  {
    path: 'candidatures',
    loadComponent: () =>
      import('./mes-candidatures/mes-candidatures.component').then((m) => m.MesCandidatures),
    title: 'Mes candidatures - SunuXam'
  },
  {
    path: 'candidature/nouvelle',
    loadComponent: () =>
      import('./depot-candidature/depot-candidature.component').then((m) => m.DepotCandidature),
    title: 'Nouvelle candidature - SunuXam'
  },
  {
    path: 'candidature/:identifiant',
    loadComponent: () =>
      import('./detail-candidature/detail-candidature.component').then((m) => m.DetailCandidature),
    title: 'Detail de la candidature - SunuXam'
  },
  {
    path: 'resultats',
    loadComponent: () =>
      import('./mes-resultats/mes-resultats.component').then((m) => m.MesResultats),
    title: 'Mes resultats - SunuXam'
  }
];
