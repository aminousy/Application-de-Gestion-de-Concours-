import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeStatut } from '../../../composants-partages/badge-statut/badge-statut.component';
import { BoiteConfirmation } from '../../../composants-partages/boite-confirmation/boite-confirmation.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Candidature, StatutCandidature } from '../../../coeur/modeles';
import { ServiceCandidature } from '../../../coeur/services/service-candidature';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-mes-candidatures',
  standalone: true,
  imports: [DatePipe, RouterLink, BadgeStatut, BoiteConfirmation, Chargement, MessageErreur],
  templateUrl: './mes-candidatures.component.html'
})
export class MesCandidatures implements OnInit {
  private readonly serviceCandidature = inject(ServiceCandidature);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly candidatures = signal<Candidature[]>([]);

  readonly candidatureARetirer = signal<Candidature | null>(null);
  readonly retraitEnCours = signal(false);
  readonly notification = signal<string | null>(null);

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.serviceCandidature.mesCandidatures().subscribe({
      next: (liste) => {
        this.candidatures.set(liste);
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        this.erreur.set(messageErreur(err));
      }
    });
  }

  peutRetirer(candidature: Candidature): boolean {
    return candidature.statut === StatutCandidature.EN_ATTENTE;
  }

  demanderRetrait(candidature: Candidature): void {
    this.notification.set(null);
    this.candidatureARetirer.set(candidature);
  }

  annulerRetrait(): void {
    this.candidatureARetirer.set(null);
  }

  confirmerRetrait(): void {
    const candidature = this.candidatureARetirer();
    if (!candidature || this.retraitEnCours()) {
      return;
    }
    this.retraitEnCours.set(true);
    this.serviceCandidature.supprimer(candidature.id).subscribe({
      next: () => {
        this.retraitEnCours.set(false);
        this.candidatures.update((liste) => liste.filter((c) => c.id !== candidature.id));
        this.candidatureARetirer.set(null);
        this.notification.set('Votre candidature a ete retiree.');
      },
      error: (err: HttpErrorResponse) => {
        this.retraitEnCours.set(false);
        this.candidatureARetirer.set(null);
        this.notification.set(messageErreur(err));
      }
    });
  }
}
