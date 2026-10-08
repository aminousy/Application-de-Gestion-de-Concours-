# Structure du projet SunuXam (frontend)

Architecture organisee par **couche** (`coeur/`) et par **fonctionnalite**
(`fonctionnalites/`). Tous les noms metier sont en francais.

## Regle de responsabilite

```
COMPOSANT  ->  SERVICE  ->  HttpClient  ->  API Spring Boot
```

- Les **composants** gerent l'affichage, les formulaires, l'interaction et
  appellent les services. Aucune logique metier complexe.
- Les **services** (`coeur/services/`) regroupent tous les appels HTTP.
- Les **gardes** (`coeur/gardes/`) controlent la navigation selon le role.
- Les **intercepteurs** (`coeur/intercepteurs/`) ajoutent le jeton JWT (401 ->
  deconnexion) et signalent les erreurs transverses.
- Les **modeles** (`coeur/modeles/`) refletent exactement les DTO du backend.
- Les **utilitaires** (`coeur/utilitaires/`) centralisent constantes et helpers.

## Dossiers

| Dossier | Contenu |
|---|---|
| `coeur/modeles/` | Interfaces : `Utilisateur`, `Concours`, `Epreuve`, `Candidature`, `Note`, `Resultat`, `RequeteConnexion`, `RequeteInscription`, `ReponseAuthentification`, ... |
| `coeur/services/` | `ServiceAuthentification`, `ServiceUtilisateur`, `ServiceConcours`, `ServiceEpreuve`, `ServiceCandidature`, `ServiceNote`, `ServiceResultat`, `ServiceNotification` |
| `coeur/gardes/` | `gardeRole` |
| `coeur/intercepteurs/` | `intercepteurJwt`, `intercepteurErreurs` |
| `coeur/utilitaires/` | `api.constantes.ts`, `libelles.ts`, `jeton.utils.ts`, `erreur-http.utils.ts`, `date.utils.ts`, `validateurs.ts`, `gestionnaire-erreurs.ts` |
| `fonctionnalites/authentification/` | `Connexion`, `Inscription` |
| `fonctionnalites/concours/` | `ListeConcours`, `DetailConcours` (publics) |
| `fonctionnalites/candidat/` | `TableauDeBordCandidat`, `DepotCandidature`, `MesCandidatures`, `DetailCandidature`, `MesResultats` |
| `fonctionnalites/administration/` | `MiseEnPageAdministration`, `TableauDeBordAdministrateur`, `GestionUtilisateurs`, `GestionConcours`, `FormulaireConcours`, `GestionEpreuves`, `GestionCandidatures`, `GestionNotes`, `GestionResultats` |
| `composants-partages/` | `BarreNavigation`, `MenuLateral`, `PiedPage`, `Chargement`, `MessageErreur`, `BoiteConfirmation`, `Modale`, `BadgeStatut`, `CarteStatistique`, `Notifications` |
| `pages/` | `Accueil`, `PageIntrouvable` |

## Routage

- Chargement differe (`loadComponent` / `loadChildren`) par fonctionnalite,
  avec prechargement en arriere-plan (`PreloadAllModules`).
- Fichiers de routes dedies : `fonctionnalites/candidat/candidat.routes.ts`,
  `fonctionnalites/administration/administration.routes.ts`.
