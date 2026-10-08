import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Role } from '../../../coeur/modeles';
import { ServiceAuthentification } from '../../../coeur/services/service-authentification';
import { messageErreur } from '../../../coeur/utilitaires/erreur-http.utils';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './connexion.component.html'
})
export class Connexion implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly servAuth = inject(ServiceAuthentification);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly enCours = signal(false);
  readonly erreur = signal<string | null>(null);

  readonly formulaire = this.fb.nonNullable.group({
    adresseEmail: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.servAuth.estSessionActive()) {
      this.redirigerApresConnexion(this.servAuth.role() ?? Role.CANDIDAT);
    }
  }

  estInvalide(nom: 'adresseEmail' | 'motDePasse'): boolean {
    const controle = this.formulaire.controls[nom];
    return controle.invalid && (controle.dirty || controle.touched);
  }

  connexion(): void {
    if (this.enCours()) {
      return;
    }
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    this.enCours.set(true);
    this.erreur.set(null);

    const { adresseEmail, motDePasse } = this.formulaire.getRawValue();
    this.servAuth.connexion({ email: adresseEmail.trim(), motDePasse }).subscribe({
      next: (reponse) => this.redirigerApresConnexion(reponse.role),
      error: (err: HttpErrorResponse) => {
        this.enCours.set(false);
        this.erreur.set(
          err.status === 401
            ? 'Adresse email ou mot de passe incorrect.'
            : messageErreur(err)
        );
      }
    });
  }

  private redirigerApresConnexion(role: Role): void {
    const retour = this.route.snapshot.queryParamMap.get('retour');
    const retourValide =
      retour && !retour.startsWith('/connexion') && !retour.startsWith('/inscription');

    if (retourValide) {
      void this.router.navigateByUrl(retour);
      return;
    }
    void this.router.navigate([
      role === Role.ADMIN ? '/administration/tableau-de-bord' : '/candidat/tableau-de-bord'
    ]);
  }
}
