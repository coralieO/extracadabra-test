# extracadabra-test

Ce projet est une application Vue.js 3 qui gère un funnel d'inscription 100% dynamique. Chaque étape est définie par un `slug` côté backend, et le frontend est conçu pour être extensible sans modification du core.

---

## Fonctionnalités

- Funnel d'inscription dynamique basé sur des slugs.
- Validation des formulaires avec **Yup** et **Vee-Validate**.
- Navigation entre les étapes avec gestion des erreurs.
- API mockée avec **axios-mock-adapter**.
- Design responsive en SCSS sans librairie CSS tierce.

---

## Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**

---


## ⚡ Installation

1. **Installez les dépendances** :

```bash
    npm install
    ou
    yarn install
```


    
## Lancez le projet en développement :

```bash
    npm run dev
```


## 🛠️ Technologies utilisées
- Vue.js 3 – Framework JavaScript pour l'UI

- Pinia – Gestion de l'état global

- Vee-Validate – Validation des formulaires

- Yup – Définition des schémas de validation

- axios-mock-adapter – Mock des appels API

- SCSS – Préprocesseur CSS pour le design


## 📂 Architecture du projet

src/
├── api/                     # Gestion des appels API
│   ├── registrationApi.ts   # Appels API pour les étapes et le résumé
│   └── registrationMock.ts  # Mock des endpoints API
├── assets/                  # Fichiers statiques (images, styles)
│   └── Style/               # Fichiers SCSS pour le design
├── components/              # Composants réutilisables
│   ├── registrationSteps/   # Composants pour chaque étape du funnel
│   │   ├── PersonalInformationStep.vue
│   │   ├── BirthdateStep.vue
│   │   ├── PictureStep.vue
│   │   └── AddressStep.vue
│   ├── utils/               # Composants utilitaires (BaseInput, etc.)
│   └── StepActionsButtons.vue
├── store/                   # Gestion de l'état global avec Pinia
│   └── registration.ts
├── validation/              # Schémas de validation Yup
│   └── validationSchemas.ts
├── views/                   # Pages principales
│   └── RegistrationForm.vue
├── App.vue                  # Composant racine
├── main.ts                  # Point d'entrée de l'application
└── vite.config.ts           # Configuration de Vite