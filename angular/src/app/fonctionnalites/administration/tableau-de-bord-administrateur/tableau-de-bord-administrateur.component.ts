import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';

import { CarteStatistique } from '../../../composants-partages/carte-statistique/carte-statistique.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Role } from '../../../coeur/modeles';
import { ServiceCandidature } from '../../../coeur/services/service-candidature';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { ServiceResultat } from '../../../coeur/services/service-resultat';
import { ServiceUtilisateur } from '../../../coeur/services/service-utilisateur';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

interface StatistiquesAdmin {
  candidats: number;
  concours: number;
  concoursOuverts: number;
  candidatures: number;
  resultats: number;
}

@Component({
  selector: 'app-tableau-de-bord-administrateur',
  standalone: true,
  imports: [RouterLink, CarteStatistique, Chargement, MessageErreur],
  templateUrl: './tableau-de-bord-administrateur.component.html'
})
export class TableauDeBordAdministrateur implements OnInit {
  private readonly serviceUtilisateur = inject(ServiceUtilisateur);
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly serviceCandidature = inject(ServiceCandidature);
  private readonly serviceResultat = inject(ServiceResultat);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly stats = signal<StatistiquesAdmin | null>(null);

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);

    forkJoin({
      concours: this.serviceConcours.listerTous(),
      candidats: this.serviceUtilisateur.listerTous(Role.CANDIDAT)
    })
      .pipe(
        switchMap(({ concours, candidats }) => {
          if (concours.length === 0) {
            return of({ concours, candidats, candidatures: 0, resultats: 0 });
          }
          return forkJoin({
            candidatures: forkJoin(
              concours.map((c) => this.serviceCandidature.listerParConcours(c.id))
            ),
            resultats: forkJoin(concours.map((c) => this.serviceResultat.listerParConcours(c.id)))
          }).pipe(
            map(({ candidatures, resultats }) => ({
              concours,
              candidats,
              candidatures: candidatures.reduce((somme, liste) => somme + liste.length, 0),
              resultats: resultats.reduce((somme, liste) => somme + liste.length, 0)
            }))
          );
        })
      )
      .subscribe({
        next: ({ concours, candidats, candidatures, resultats }) => {
          this.stats.set({
            candidats: candidats.length,
            concours: concours.length,
            concoursOuverts: concours.filter((c) => c.ouvert).length,
            candidatures,
            resultats
          });
          this.chargement.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.chargement.set(false);
          this.erreur.set(messageErreur(err));
        }
      });
  }
}
