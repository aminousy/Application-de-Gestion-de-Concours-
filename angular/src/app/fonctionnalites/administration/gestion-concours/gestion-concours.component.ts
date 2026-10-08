import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BoiteConfirmation } from '../../../composants-partages/boite-confirmation/boite-confirmation.component';
import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Concours } from '../../../coeur/modeles';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-gestion-concours',
  standalone: true,
  imports: [DatePipe, RouterLink, BoiteConfirmation, Chargement, MessageErreur],
  templateUrl: './gestion-concours.component.html'
})
export class GestionConcours implements OnInit {
  private readonly service = inject(ServiceConcours);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly notification = signal<string | null>(null);
  readonly concours = signal<Concours[]>([]);
  readonly recherche = signal('');
  readonly basculeEnCours = signal<number | null>(null);

  readonly concoursAffiches = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) {
      return this.concours();
    }
    return this.concours().filter((c) => c.titre.toLowerCase().includes(terme));
  });

  readonly concoursASupprimer = signal<Concours | null>(null);
  readonly suppressionEnCours = signal(false);

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.service.listerTous().subscribe({
      next: (liste) => {
        this.concours.set(liste);
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        this.erreur.set(messageErreur(err));
      }
    });
  }

  majRecherche(valeur: string): void {
    this.recherche.set(valeur);
  }

  basculerOuverture(c: Concours): void {
    if (this.basculeEnCours() !== null) {
      return;
    }
    this.basculeEnCours.set(c.id);
    this.notification.set(null);
    this.service.definirOuverture(c.id, !c.ouvert).subscribe({
      next: (maj) => {
        this.concours.update((liste) => liste.map((x) => (x.id === c.id ? maj : x)));
        this.basculeEnCours.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.basculeEnCours.set(null);
        this.notification.set(messageErreur(err));
      }
    });
  }

  demanderSuppression(c: Concours): void {
    this.notification.set(null);
    this.concoursASupprimer.set(c);
  }

  annulerSuppression(): void {
    this.concoursASupprimer.set(null);
  }

  confirmerSuppression(): void {
    const c = this.concoursASupprimer();
    if (!c || this.suppressionEnCours()) {
      return;
    }
    this.suppressionEnCours.set(true);
    this.service.supprimer(c.id).subscribe({
      next: () => {
        this.suppressionEnCours.set(false);
        this.concours.update((liste) => liste.filter((x) => x.id !== c.id));
        this.concoursASupprimer.set(null);
        this.notification.set('Concours supprime.');
      },
      error: (err: HttpErrorResponse) => {
        this.suppressionEnCours.set(false);
        this.concoursASupprimer.set(null);
        this.notification.set(messageErreur(err));
      }
    });
  }
}
