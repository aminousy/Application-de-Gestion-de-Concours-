import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { CarteStatistique } from '../../../composants-partages/carte-statistique/carte-statistique.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { StatutCandidature } from '../../../coeur/modeles';
import { ServiceCandidature } from '../../../coeur/services/service-candidature';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { ServiceResultat } from '../../../coeur/services/service-resultat';
import { ServiceUtilisateur } from '../../../coeur/services/service-utilisateur';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

interface StatistiquesCandidat {
  prenom: string;
  totalCandidatures: number;
  enAttente: number;
  admises: number;
  resultatsDisponibles: number;
  concoursOuverts: number;
}

@Component({
  selector: 'app-tableau-de-bord-candidat',
  standalone: true,
  imports: [RouterLink, CarteStatistique, Chargement, MessageErreur],
  templateUrl: './tableau-de-bord-candidat.component.html'
})
export class TableauDeBordCandidat implements OnInit {
  private readonly serviceCandidature = inject(ServiceCandidature);
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly serviceResultat = inject(ServiceResultat);
  private readonly serviceUtilisateur = inject(ServiceUtilisateur);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly stats = signal<StatistiquesCandidat | null>(null);

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);

    forkJoin({
      profil: this.serviceUtilisateur.monProfil(),
      candidatures: this.serviceCandidature.mesCandidatures(),
      concoursOuverts: this.serviceConcours.listerOuverts()
    })
      .pipe(
        switchMap((donnees) => {
          if (donnees.candidatures.length === 0) {
            return of({ ...donnees, resultats: [] as boolean[] });
          }
          return forkJoin(
            donnees.candidatures.map((c) =>
              this.serviceResultat.obtenirParCandidature(c.id).pipe(
                map(() => true),
                catchError(() => of(false))
              )
            )
          ).pipe(map((resultats) => ({ ...donnees, resultats })));
        })
      )
      .subscribe({
        next: ({ profil, candidatures, concoursOuverts, resultats }) => {
          this.stats.set({
            prenom: profil.prenom,
            totalCandidatures: candidatures.length,
            enAttente: candidatures.filter((c) => c.statut === StatutCandidature.EN_ATTENTE).length,
            admises: candidatures.filter((c) => c.statut === StatutCandidature.ADMIS).length,
            resultatsDisponibles: resultats.filter(Boolean).length,
            concoursOuverts: concoursOuverts.length
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
