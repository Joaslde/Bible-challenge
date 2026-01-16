

# Cahier des Charges — Application Challenge Lecture Biblique

---

## 1. Concept général

Créer une application mobile-first dédiée au suivi d’un challenge de lecture biblique (Nouveau Testament) pour un groupe d’utilisateurs (15 au départ, extensible).

**Objectif** :

* Motiver la lecture quotidienne d’au moins 5 chapitres
* Suivre l’avancement individuel et collectif
* Proposer une expérience ludique, visuelle et engageante

---

## 2. Fonctionnement & logique métier

* **Challenge quotidien** : minimum 5 chapitres à lire par jour (standard du jour)
* **Lecture cumulée** : total des chapitres lus depuis le début (standard historique = nombre de jours × 5)
* Avancement affiché en termes de livres et chapitres bibliques (ex : Matthieu 15, Marc 2…)
* Lecture linéaire obligatoire : pas de saut entre les chapitres/livres
* Utilisateurs peuvent saisir chaque jour leur nombre de chapitres lus
* Pas d’authentification dans la V1 : ajout/modification utilisateurs fait par l’admin
* Interaction simple, ludique, sans texte à taper

---

## 3. Tech stack

* **Frontend** : Vue.js (version 3 recommandée)
* **Backend** : Supabase (base de données PostgreSQL + API REST/Realtime)
* **Styling & animations** : TailwindCSS et/ou Bootstrap (selon besoin, Tailwind fortement recommandé pour la customisation)
* **Hébergement** : Frontend sur Netlify ou similaire, base Supabase en cloud

---

## 4. Architecture des données (tables principales)

* **users**

  * id (uuid)
  * nom (string)
  * date_ajout (timestamp)

* **daily_logs**

  * id
  * user_id (foreign key)
  * date (date)
  * chapitres_lus (integer)

* **chapters_reference**

  * id
  * livre (string)
  * numero_chapitre (integer)
  * position_globale (integer)  ← permet conversion nombre total → position biblique

---

## 5. Vues principales & composants

### 5.1 Vue historique

* Objectif : montrer la progression cumulée de chaque utilisateur dans le parcours biblique
* UI :

  * Liste horizontale des utilisateurs (scroll horizontal)
  * Pour chaque utilisateur : colonne verticale avec barre de progression verticale représentant l’avancement dans les livres
  * Jalons fixes (livres bibliques) marqués sur la barre verticale
  * Progression linéaire sans saut possible
  * Pointeur / emoji sur la barre indiquant la position réelle
  * Emojis adaptés selon la comparaison avec le standard historique (joyeux si au-dessus, triste si en dessous)
* Interaction : scroll horizontal pour changer d’utilisateur, vertical pour voir progression dans les livres

---

### 5.2 Vue du jour

* Objectif : visualiser la performance journalière (chapitres lus aujourd’hui)
* UI :

  * Date en-tête fixe (texte complet, ex : “Jeudi 15 janvier 2026”)
  * Liste verticale des utilisateurs (noms alignés verticalement, scrollable)
  * Pour chaque utilisateur : barre horizontale indiquant chapitres lus aujourd’hui
  * Ligne en pointillés représentant le standard minimum (5 chapitres)
  * Code couleur progressif :

    * 0-5 chapitres : jaune
    * 5 chapitres atteint : barre verte
    * 6-10 chapitres : turquoise
    * 10+ chapitres : bleu saturé
  * Texte dynamique au centre de la barre affichant le nombre exact de chapitres lus aujourd’hui
* Interaction : scroll vertical fluide, compatible mobile

---

### 5.3 Vue formulaire (ajout/modification lecture du jour)

* Objectif : permettre à l’utilisateur de saisir rapidement son avancée quotidienne
* UI :

  * Liste verticale de petites cartes utilisateurs, scrollable
  * Sélection par clic sur une carte (surbrillance)
  * Affichage d’un bouton central/cliquable représentant le compteur de chapitres lus
  * À chaque clic : compteur incrémente de 1, avec animation confettis à 5 chapitres
  * Couleur du bouton évolue (neutre → jaune → vert → turquoise → bleu) selon le nombre de chapitres
  * Affichage dynamique du chapitre biblique correspondant en dessous du bouton
  * Boutons “Effacer” (reset compteur) et “Valider” (envoi à la base) en bas, bien visibles
* UX : interaction uniquement par clics, sans saisie manuelle, fluide et ludique

---

### 5.4 Composant Navbar

* Position : fixe en bas de l’écran, barre cylindrique semi-transparente
* Icônes uniquement, sans texte (optionnel sous forme de tooltip)
* Icônes :

  * Montre → Vue du jour
  * Calendrier → Vue historique
  * Plus → Vue formulaire
  * Roue (admin) → Page admin (gestion utilisateurs, corrections)
* Design : simple, épuré, couleurs cohérentes avec l’appli, touch-friendly
* Animations de transition entre pages (slide ou fade)

---

## 6. Animations & feedbacks

* Explosion de confettis à 5 chapitres sur bouton formulaire
* Transition fluide entre pages
* Animation de progression des barres (vue jour et historique)
* Feedback visuel au clic sur navbar
* Emojis dynamiques selon avancement historique

---

## 7. Fonctionnalités futures envisagées (V2+)

* Ajout autonome de noms/utilisateurs par les membres
* Filtrage et recherche dans la liste des utilisateurs
* Modal ou détail cliquable sur les barres pour afficher l’historique complet du jour
* Gestion des erreurs réseau / notifications
* Gestion des permissions (affichage admin seulement)
* Mode sombre / clair

---

## 8. Notes additionnelles

* Pas d’authentification dans la V1, mais possible à intégrer plus tard
* L’application est pensée mobile-first, design simple mais impactant
* Le mapping nombre total chapitres → position biblique est clé et central
* Supabase facilite la gestion des données et les requêtes temps réel
* Tailwind CSS conseillé pour stylisation fine et animations faciles

---


### Architecture des fichiers du projet (Vue.js 3 + Tailwind + Supabase)

| Dossier / Fichier | Rôle & Description |
| --- | --- |
| **`src/assets/`** | Contient le fichier `main.css` avec les directives Tailwind et tes polices. |
| **`src/lib/`** | **`supabaseClient.js`** : Le fichier crucial qui contient la connexion à ta base de données. |
| **`src/router/`** | **`index.js`** : Définit les chemins (ex: `/` pour le jour, `/historique`, `/saisie`). |
| **`src/utils/`** | **`bibleLogic.js`** : Fonctions pour convertir un chiffre (ex: 150) en texte (ex: "Psaumes 1"). |
| **`src/components/ui/`** | Petits composants réutilisables : boutons stylisés, barres de progression, badges. |
| **`src/components/layout/`** | **`Navbar.vue`** : La barre de navigation fixe en bas de l'écran. |
| **`src/components/form/`** | **`ChapterCounter.vue`** : Le bouton cliquable avec animation pour la saisie. |
| **`src/views/`** | **`DayView.vue`** : Page principale (classement du jour). |
|  | **`HistoryView.vue`** : Page de progression globale (vue verticale). |
|  | **`FormView.vue`** : Page où l'on clique pour ajouter ses chapitres. |
|  | **`AdminView.vue`** : Page pour ajouter ou modifier des utilisateurs. |
| **`src/App.vue`** | Le composant racine qui affiche la Navbar et injecte les différentes vues. |
| **`src/main.js`** | Le point d'entrée qui initialise Vue, le Router et Tailwind. |

---

### Pourquoi cette disposition ?

1. **Séparation des responsabilités :** En isolant la logique biblique dans `utils/`, tu peux tester tes calculs sans avoir besoin d'ouvrir l'interface graphique.
2. **Facilité de maintenance :** Si tu veux changer le design d'un bouton, tu vas dans `components/ui/`. Si tu veux changer le fonctionnement d'une page entière, tu vas dans `views/`.
3. **Supabase Centralisé :** Le dossier `lib/` permet de ne pas répéter tes clés API partout. Tu importes juste ton client là où tu en as besoin.

### La suite logique

Maintenant que nous avons le plan de la maison :

* **Côté Supabase :** Les API sont prêtes dès que les tables sont créées. On n'écrit pas de code "backend" classique, on utilise juste les fonctions de Supabase dans nos fichiers `.vue`.
* **Côté Design :** Avec Tailwind, on pourra coder directement dans les fichiers Vue pour que ça ressemble exactement à ton cahier des charges.

