import { DatePipe, SlicePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Concours } from '../../../coeur/modeles';
import { ServiceAuthentification } from '../../../coeur/services/service-authentification';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { estDatePassee } from '../../../coeur/utilitaires/date.utils';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-liste-concours',
  standalone: true,
  imports: [DatePipe, SlicePipe, RouterLink, Chargement, MessageErreur],
  templateUrl: './liste-concours.component.html'
})
export class ListeConcours implements OnInit {
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly servAuth = inject(ServiceAuthentification);

  readonly chargement = signal(true);
  readonly erreur = signal<string | null>(null);
  readonly connexionRequise = signal(false);
  readonly concours = signal<Concours[]>([]);
  readonly recherche = signal('');

  readonly concoursAffiches = computed(() => {
    const terme = this.recherche().trim().toLowerCase();
    if (!terme) {
      return this.concours();
    }
    return this.concours().filter(
      (c) =>
        c.titre.toLowerCase().includes(terme) ||
        (c.description ?? '').toLowerCase().includes(terme)
    );
  });

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);
    this.connexionRequise.set(false);

    this.serviceConcours.listerOuverts().subscribe({
      next: (liste) => {
        this.concours.set(liste);
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        if (err.status === 401 && !this.servAuth.estAuthentifie()) {
          this.connexionRequise.set(true);
        } else {
          this.erreur.set(messageErreur(err));
        }
      }
    });
  }

  majRecherche(valeur: string): void {
    this.recherche.set(valeur);
  }

  dateLimiteDepassee(concours: Concours): boolean {
    return estDatePassee(concours.dateLimiteCandidature);
  }
}
