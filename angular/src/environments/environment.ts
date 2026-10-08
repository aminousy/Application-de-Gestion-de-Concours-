/**
 * Configuration de developpement (profil par defaut de `ng serve`).
 * L'URL de l'API est centralisee ici : aucun service ne doit la redefinir.
 */
export const environment = {
  production: false,
  urlApi: 'http://localhost:8080/api',
  cleStockageJeton: 'sunuxam.jeton',
  nomApplication: 'SunuXam'
};
