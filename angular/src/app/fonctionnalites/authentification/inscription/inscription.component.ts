import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ErreurChamp } from '../../../coeur/modeles';
import { ServiceAuthentification } from '../../../coeur/services/service-authentification';
import { erreursChamps, messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';
import { validateurCorrespondance } from '../../../coeur/utilitaires/validateurs';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.component.html'
})
export class Inscription implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly servAuth = inject(ServiceAuthentification);
  private readonly router = inject(Router);

  readonly enCours = signal(false);
  readonly erreur = signal<string | null>(null);
  readonly erreursDetail = signal<ErreurChamp[]>([]);

  readonly formulaire = this.fb.nonNullable.group(
    {
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      prenom: ['', [Validators.required, Validators.maxLength(100)]],
      adresseEmail: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
      numeroTelephone: ['', [Validators.maxLength(30)]],
      motDePasse: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmationMotDePasse: ['', [Validators.required]]
    },
    { validators: validateurCorrespondance('motDePasse', 'confirmationMotDePasse') }
  );

  ngOnInit(): void {
    if (this.servAuth.estSessionActive()) {
      void this.router.navigate(['/candidat/tableau-de-bord']);
    }
  }

  estInvalide(nom: string): boolean {
    const controle = this.formulaire.get(nom);
    return !!controle && controle.invalid && (controle.dirty || controle.touched);
  }

  get erreurCorrespondance(): boolean {
    const controle = this.formulaire.controls.confirmationMotDePasse;
    return this.formulaire.hasError('correspondance') && (controle.dirty || controle.touched);
  }

  inscription(): void {
    if (this.enCours()) {
      return;
    }
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    this.enCours.set(true);
    this.erreur.set(null);
    this.erreursDetail.set([]);

    const valeurs = this.formulaire.getRawValue();
    this.servAuth
      .inscription({
        nom: valeurs.nom.trim(),
        prenom: valeurs.prenom.trim(),
        email: valeurs.adresseEmail.trim(),
        motDePasse: valeurs.motDePasse,
        telephone: valeurs.numeroTelephone.trim() || undefined
      })
      .subscribe({
        next: () => this.router.navigate(['/candidat/tableau-de-bord']),
        error: (err: HttpErrorResponse) => {
          this.enCours.set(false);
          this.erreursDetail.set(erreursChamps(err));
          this.erreur.set(
            err.status === 409
              ? 'Un compte existe deja avec cette adresse email.'
              : messageErreur(err)
          );
        }
      });
  }
}
