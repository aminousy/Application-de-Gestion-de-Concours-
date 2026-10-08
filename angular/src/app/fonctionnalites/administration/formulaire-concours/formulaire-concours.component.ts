import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Chargement } from '../../../composants-partages/chargement/chargement.component';
import { MessageErreur } from '../../../composants-partages/message-erreur/message-erreur.component';
import { RequeteConcours } from '../../../coeur/modeles';
import { ServiceConcours } from '../../../coeur/services/service-concours';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';
import { validateurOrdreDates } from '../../../coeur/utilitaires/validateurs';

@Component({
  selector: 'app-formulaire-concours',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Chargement, MessageErreur],
  templateUrl: './formulaire-concours.component.html'
})
export class FormulaireConcours {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ServiceConcours);
  private readonly router = inject(Router);

  readonly mode = signal<'creation' | 'edition'>('creation');
  readonly chargement = signal(false);
  readonly introuvable = signal(false);
  readonly enCours = signal(false);
  readonly erreur = signal<string | null>(null);

  private idEnEdition = 0;

  readonly formulaire = this.fb.nonNullable.group(
    {
      titre: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      dateLimiteCandidature: ['', [Validators.required]],
      dateDeliberation: [''],
      nombrePlaces: [1, [Validators.required, Validators.min(1)]],
      ouvert: [false]
    },
    { validators: validateurOrdreDates('dateLimiteCandidature', 'dateDeliberation') }
  );

  @Input()
  set identifiant(valeur: string | undefined) {
    // Route /concours/nouveau : aucun identifiant -> mode creation, on ne fait rien.
    if (valeur === undefined || valeur === null || valeur === '') {
      return;
    }
    const id = Number(valeur);
    if (!Number.isInteger(id) || id <= 0) {
      this.introuvable.set(true);
      return;
    }
    this.mode.set('edition');
    this.idEnEdition = id;
    this.charger(id);
  }

  estInvalide(nom: string): boolean {
    const c = this.formulaire.get(nom);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  private charger(id: number): void {
    this.chargement.set(true);
    this.service.obtenirDetail(id).subscribe({
      next: (c) => {
        this.formulaire.reset({
          titre: c.titre,
          description: c.description ?? '',
          dateLimiteCandidature: c.dateLimiteCandidature,
          dateDeliberation: c.dateDeliberation ?? '',
          nombrePlaces: c.nombrePlaces,
          ouvert: c.ouvert
        });
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        if (err.status === 404) {
          this.introuvable.set(true);
        } else {
          this.erreur.set(messageErreur(err));
        }
      }
    });
  }

  soumettre(): void {
    if (this.enCours()) {
      return;
    }
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    this.enCours.set(true);
    this.erreur.set(null);

    const v = this.formulaire.getRawValue();
    const requete: RequeteConcours = {
      titre: v.titre.trim(),
      description: v.description.trim() || undefined,
      dateLimiteCandidature: v.dateLimiteCandidature,
      dateDeliberation: v.dateDeliberation || undefined,
      nombrePlaces: v.nombrePlaces,
      ouvert: v.ouvert
    };

    const appel =
      this.mode() === 'creation'
        ? this.service.creer(requete)
        : this.service.mettreAJour(this.idEnEdition, requete);

    appel.subscribe({
      next: () => this.router.navigate(['/administration/concours']),
      error: (err: HttpErrorResponse) => {
        this.enCours.set(false);
        this.erreur.set(messageErreur(err));
      }
    });
  }
}
