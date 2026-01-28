# CryptoWalletFront

Application Angular pour la gestion de portefeuille crypto, connectée à une API Symfony backend.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## 🚀 Démarrage rapide

### Prérequis

1. **Backend Symfony** doit être démarré sur `http://localhost:8000`
2. **Node.js** et **npm** installés
3. Les dépendances Angular installées

### Installation

```bash
npm install
```

### Démarrage du serveur de développement

```bash
npm start
# ou
ng serve
```

Une fois le serveur démarré, ouvrez votre navigateur et allez sur `http://localhost:4200/`. L'application se rechargera automatiquement à chaque modification des fichiers sources.

## 🔐 Authentification

L'application utilise l'authentification JWT :
1. **Inscription** : Créez un compte avec email et mot de passe
2. **Connexion** : Connectez-vous pour obtenir un token JWT
3. Le token est automatiquement stocké dans le localStorage et utilisé pour toutes les requêtes API

## 📱 Fonctionnalités

### Portefeuille
- ✅ Affichage de tous vos actifs crypto
- ✅ Ajout d'un nouvel actif (symbole, nom, quantité, prix d'achat, date)
- ✅ Modification d'un actif existant
- ✅ Suppression d'un actif

### Statistiques
- ✅ Valeur totale du portefeuille
- ✅ Total investi
- ✅ Profit/Perte avec pourcentage
- ✅ Résumé détaillé par crypto
- ✅ Distribution du portefeuille

## 🏗️ Structure du projet

```
src/
├── app/
│   ├── auth/              # Composants d'authentification (login, register)
│   ├── core/
│   │   ├── guards/        # Guards de protection des routes
│   │   └── services/      # Services API et authentification
│   ├── dashboard/         # Page principale avec onglets
│   ├── layouts/           # Layouts (auth-layout, main-layout)
│   ├── portfolio/         # Composant portfolio et dialogue d'ajout/modification
│   └── stats/             # Composant statistiques
```

## 💾 Stockage des Données

### Architecture de Stockage

**Frontend (Angular)** :
- Stocke uniquement le **token JWT** dans le `localStorage` du navigateur
- Aucune donnée sensible n'est stockée côté client
- Le token est utilisé pour authentifier toutes les requêtes API

**Backend (Symfony)** :
- **Base de données** : MySQL (`crypto_wallet`)
- **Tables principales** :
  - `user` : Utilisateurs (id, email, password hash, roles)
  - `asset` : Actifs crypto (id, symbol, name, quantity, purchasePrice, purchaseDate, user_id, createdAt, updatedAt)
- **Authentification** : JWT (tokens stockés côté client, clés de signature côté serveur)

### Flux de Données

```
Frontend Angular → API Symfony → MySQL Database
     ↓                ↓              ↓
localStorage      JWT Token      Tables SQL
(token JWT)      (validation)    (données)
```

**Important** : Toutes les données sont stockées dans la base de données MySQL du backend. Le frontend ne fait que les afficher et les manipuler via l'API REST.

## 🔧 Configuration API

L'URL de base de l'API est configurée dans `src/app/core/services/api.service.ts` :

```typescript
private baseURL = 'http://localhost:8000/api';
```

Pour changer l'URL de l'API, modifiez cette valeur.

## 🎨 Améliorations UI/UX

L'application a été conçue avec une attention particulière à l'expérience utilisateur :

- ✨ **Animations fluides** : Transitions smooth sur tous les éléments
- 🎯 **Feedback visuel** : Messages de succès/erreur avec icônes
- 🖱️ **Interactions** : Effets hover et focus améliorés
- 📱 **Design moderne** : Gradients, ombres et bordures arrondies
- ⚡ **Performance** : Chargements optimisés avec animations de fade-in
- 🎨 **Thème cohérent** : Palette de couleurs harmonieuse

## 📦 Technologies utilisées

- **Angular 21** - Framework frontend
- **Angular Material** - Composants UI avec Material Design 3
- **RxJS** - Programmation réactive
- **TypeScript** - Langage de programmation
- **SCSS** - Préprocesseur CSS pour styles avancés

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
