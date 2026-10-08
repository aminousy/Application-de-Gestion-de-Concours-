import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { ConcoursDetail } from '../../../coeur/modeles';
import { ServiceAuthentification } from '../../../coeur/services/service-authentification';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { estDatePassee } from '../../../coeur/utilitaires/date.utils';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-detail-concours',
  standalone: true,
  imports: [DatePipe, RouterLink, Chargement, MessageErreur],
  templateUrl: './detail-concours.component.html'
})
export class DetailConcours {
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly servAuth = inject(ServiceAuthentification);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly introuvable = signal(false);
  readonly connexionRequise = signal(false);
  readonly concours = signal<ConcoursDetail | null>(null);

  readonly estAuthentifie = this.servAuth.estAuthentifie;
  readonly estCandidat = this.servAuth.estCandidat;

  private idCourant = 0;

  @Input()
  set identifiant(valeur: string) {
    const id = Number(valeur);
    if (!Number.isInteger(id) || id <= 0) {
      this.chargement.set(false);
      this.introuvable.set(true);
      return;
    }
    this.idCourant = id;
    this.charger(id);
  }

  charger(id = this.idCourant): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.introuvable.set(false);
    this.connexionRequise.set(false);

    this.serviceConcours.obtenirDetail(id).subscribe({
      next: (detail) => {
        this.concours.set(detail);
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        if (err.status === 404) {
          this.introuvable.set(true);
        } else if (err.status === 401 && !this.servAuth.estAuthentifie()) {
          this.connexionRequise.set(true);
        } else {
          this.erreur.set(messageErreur(err));
        }
      }
    });
  }

  depotClos(): boolean {
    const c = this.concours();
    return !c || !c.ouvert || estDatePassee(c.dateLimiteCandidature);
  }

  peutCandidater(): boolean {
    return this.servAuth.estCandidat() && !this.depotClos();
  }

  totalCoefficients(): number {
    return (this.concours()?.epreuves ?? []).reduce((somme, e) => somme + e.coefficient, 0);
  }
}
