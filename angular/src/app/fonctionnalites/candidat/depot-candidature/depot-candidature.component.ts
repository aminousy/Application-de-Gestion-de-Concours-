import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { Candidature, Concours } from '../../../coeur/modeles';
import { ServiceCandidature } from '../../../coeur/services/service-candidature';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-depot-candidature',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Chargement, MessageErreur],
  templateUrl: './depot-candidature.component.html'
})
export class DepotCandidature implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceCandidature = inject(ServiceCandidature);
  private readonly serviceConcours = inject(ServiceConcours);
  private readonly route = inject(ActivatedRoute);

  readonly chargementConcours = signal(true);
  readonly erreurChargement = signal<string | null>(null);
  readonly concoursOuverts = signal<Concours[]>([]);

  readonly enCours = signal(false);
  readonly erreur = signal<string | null>(null);
  readonly succes = signal<Candidature | null>(null);

  readonly formulaire = this.fb.nonNullable.group({
    concoursId: [0, [Validators.required, Validators.min(1)]],
    motivation: ['', [Validators.maxLength(2000)]]
  });

  ngOnInit(): void {
    const parametre = this.route.snapshot.queryParamMap.get('concoursId');
    const preselection = parametre ? Number(parametre) : 0;

    this.serviceConcours.listerOuverts().subscribe({
      next: (liste) => {
        this.concoursOuverts.set(liste);
        this.chargementConcours.set(false);
        if (preselection && liste.some((c) => c.id === preselection)) {
          this.formulaire.controls.concoursId.setValue(preselection);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.chargementConcours.set(false);
        this.erreurChargement.set(messageErreur(err));
      }
    });
  }

  estInvalide(nom: string): boolean {
    const controle = this.formulaire.get(nom);
    return !!controle && controle.invalid && (controle.dirty || controle.touched);
  }

  deposer(): void {
    if (this.enCours()) {
      return;
    }
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    this.enCours.set(true);
    this.erreur.set(null);

    const { concoursId, motivation } = this.formulaire.getRawValue();
    this.serviceCandidature
      .deposer({ concoursId, motivation: motivation.trim() || undefined })
      .subscribe({
        next: (candidature) => {
          this.enCours.set(false);
          this.succes.set(candidature);
        },
        error: (err: HttpErrorResponse) => {
          this.enCours.set(false);
          this.erreur.set(messageErreur(err));
        }
      });
  }
}
