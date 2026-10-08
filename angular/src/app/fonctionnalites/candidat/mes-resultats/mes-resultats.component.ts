import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { BadgeStatut } from '../../../composants-partages/badge-statut/badge-statut.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Candidature, Resultat } from '../../../coeur/modeles';
import { ServiceCandidature } from '../../../coeur/services/service-candidature';
import { ServiceResultat } from '../../../coeur/services/service-resultat';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

interface LigneResultat {
  candidature: Candidature;
  resultat: Resultat | null;
  publie: boolean;
}

@Component({
  selector: 'app-mes-resultats',
  standalone: true,
  imports: [DecimalPipe, RouterLink, BadgeStatut, Chargement, MessageErreur],
  templateUrl: './mes-resultats.component.html'
})
export class MesResultats implements OnInit {
  private readonly serviceCandidature = inject(ServiceCandidature);
  private readonly serviceResultat = inject(ServiceResultat);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly lignes = signal<LigneResultat[]>([]);

  readonly resume = computed(() => {
    const lignes = this.lignes();
    return {
      total: lignes.length,
      publies: lignes.filter((l) => l.publie).length,
      admis: lignes.filter((l) => l.resultat?.admis).length
    };
  });

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);

    this.serviceCandidature
      .mesCandidatures()
      .pipe(
        switchMap((candidatures) => {
          if (candidatures.length === 0) {
            return of<LigneResultat[]>([]);
          }
          return forkJoin(
            candidatures.map((candidature) =>
              this.serviceResultat.obtenirParCandidature(candidature.id).pipe(
                map((resultat): LigneResultat => ({ candidature, resultat, publie: true })),
                catchError(() =>
                  of<LigneResultat>({ candidature, resultat: null, publie: false })
                )
              )
            )
          );
        })
      )
      .subscribe({
        next: (lignes) => {
          this.lignes.set(lignes);
          this.chargement.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.chargement.set(false);
          this.erreur.set(messageErreur(err));
        }
      });
  }
}
