import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ServiceAuthentification } from '../../coeur/services/service-authentification';

interface Avantage {
  icone: string;
  titre: string;
  texte: string;
}

interface EtapeProcessus {
  numero: number;
  titre: string;
  texte: string;
}

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class Accueil {
  private readonly servAuth = inject(ServiceAuthentification);

  readonly estAuthentifie = this.servAuth.estAuthentifie;
  readonly estAdministrateur = this.servAuth.estAdministrateur;

  readonly avantages: Avantage[] = [
    {
      icone: 'bi-laptop',
      titre: 'Tout en ligne',
      texte: 'Inscrivez-vous, candidatez et suivez votre dossier sans vous deplacer.'
    },
    {
      icone: 'bi-bell',
      titre: 'Suivi en temps reel',
      texte: 'Consultez a tout moment le statut de vos candidatures.'
    },
    {
      icone: 'bi-bar-chart',
      titre: 'Resultats transparents',
      texte: 'Moyenne, rang et decision consultables des la publication.'
    },
    {
      icone: 'bi-shield-lock',
      titre: 'Securise',
      texte: 'Authentification par jeton et donnees personnelles protegees.'
    }
  ];

  readonly etapes: EtapeProcessus[] = [
    {
      numero: 1,
      titre: 'Creer un compte',
      texte: 'Inscrivez-vous en quelques secondes avec votre adresse email.'
    },
    {
      numero: 2,
      titre: 'Choisir un concours',
      texte: 'Parcourez les concours ouverts et consultez leurs epreuves.'
    },
    {
      numero: 3,
      titre: 'Deposer sa candidature',
      texte: 'Soumettez votre dossier et votre lettre de motivation.'
    },
    {
      numero: 4,
      titre: 'Suivre et consulter',
      texte: 'Suivez votre statut puis consultez vos resultats une fois publies.'
    }
  ];
}
