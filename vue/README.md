# Bible Challenge - Application Vue 3

Application de suivi de lecture biblique quotidienne développée avec Vue 3 et Vite.

## 🚀 Technologies

- **Vue 3** - Framework JavaScript progressif
- **Vite** - Outil de build ultra-rapide
- **Vue Router** - Routing pour Vue.js
- **Tailwind CSS** - Framework CSS utility-first
- **Supabase** - Backend as a Service pour la base de données
- **Lucide Vue Next** - Icônes
- **Canvas Confetti** - Effets de confettis pour les célébrations

## 📦 Installation

```bash
npm install
```

## 🛠️ Développement

Lancer le serveur de développement :

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 🏗️ Build

Créer un build de production :

```bash
npm run build
```

Prévisualiser le build de production :

```bash
npm run preview
```

## 📁 Structure du projet

```
vue/
├── src/
│   ├── assets/          # Ressources statiques (CSS, images)
│   ├── components/      # Composants réutilisables
│   │   ├── layout/     # Composants de mise en page (Navbar)
│   │   └── ui/         # Composants UI (FloatingSearch)
│   ├── lib/            # Utilitaires (client Supabase)
│   ├── router/         # Configuration du routing
│   ├── views/          # Vues/Pages de l'application
│   │   ├── DayView.vue      # Vue du jour (par défaut)
│   │   ├── HistoryView.vue  # Vue historique/cumul
│   │   ├── FormView.vue     # Formulaire de saisie
│   │   └── AdminView.vue    # Administration des utilisateurs
│   ├── App.vue         # Composant racine
│   └── main.js         # Point d'entrée de l'application
├── index.html          # Template HTML
├── vite.config.js      # Configuration Vite
├── tailwind.config.js  # Configuration Tailwind CSS
└── package.json        # Dépendances du projet
```

## 🔑 Configuration

Créez un fichier `.env` à la racine du dossier `vue/` avec vos variables d'environnement Supabase :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

## 📝 Fonctionnalités

- ✅ Suivi quotidien de la lecture biblique par chapitre
- ✅ Gestion de plusieurs utilisateurs/membres
- ✅ Historique et progression cumulée
- ✅ Interface d'administration pour gérer les utilisateurs
- ✅ Recherche rapide de membres
- ✅ Animations et confettis pour célébrer les objectifs atteints
