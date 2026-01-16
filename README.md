# Bible Challenge 📖

Application web de suivi de lecture biblique quotidienne permettant de suivre la progression des membres dans leur lecture de la Bible.

## 🎯 À propos

Bible Challenge est une application web moderne développée avec Vue 3 qui permet de :
- Suivre quotidiennement la lecture biblique de chaque membre
- Visualiser l'historique et la progression cumulée
- Gérer les utilisateurs et leurs données
- Célébrer les objectifs atteints avec des animations

## 🏗️ Architecture

Le projet est organisé avec l'application frontend dans le dossier `vue/`.

```
bible-challenge/
├── vue/                # Application Vue 3 (frontend)
├── .gitignore         # Fichiers à ignorer par Git
└── README.md          # Ce fichier
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Un compte Supabase pour la base de données

### Installation

1. Cloner le repository :
```bash
git clone https://github.com/Joaslde/Bible-challenge.git
cd Bible-challenge
```

2. Installer les dépendances du projet Vue :
```bash
cd vue
npm install
```

3. Configurer les variables d'environnement :
Créez un fichier `.env` dans le dossier `vue/` :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

## 📚 Documentation

Consultez le [README.md du dossier vue](./vue/README.md) pour plus de détails sur l'application Vue.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence libre.
