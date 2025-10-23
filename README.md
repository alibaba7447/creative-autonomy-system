# 🎨 Système d'Autonomie Créative

Un système web complet pour aider les jeunes créatifs à structurer leur vie, leurs projets et leurs revenus **sans perdre leur liberté**.

## 🌿 Philosophie

Ce système repose sur un équilibre simple :
- **Stabilité mentale** : Clarté financière et routines quotidiennes
- **Progression créative** : Projets structurés avec la règle du 3×3
- **Plaisir d'apprendre** : Cycles de 6 semaines pour maintenir un rythme soutenable
- **Liberté** : Espace personnel pour créer, transmettre et gagner ta vie

## ✨ Fonctionnalités Principales

### 📊 Mon Bilan (Dashboard)
- **Vue d'ensemble** complète de ton système d'autonomie
- **Score de santé globale** (%) avec statut dynamique
- **4 piliers** : Finances, Projets, Alignement, Routines
- **7 boutons de navigation rapide** pour accéder à toutes les sections
- **Recommandations intelligentes** basées sur tes données

### 💰 Plancher & Plafond (Finances)
- Suivi mensuel de tes revenus
- Définition du **plancher** (sécurité financière minimum)
- Suivi de l'**expansion** (croissance)
- Gestion de l'**épargne**
- Créer, modifier, supprimer tes objectifs financiers

### 🎯 Portefeuille de Projets
- **Règle du 3×3** : 3 projets max, 3 mois, 3 actions par projet
- Vue **Kanban** avec colonnes par phase (Exploration → Production → Consolidation → Terminé)
- Suivi de la **satisfaction** (1-10) pour chaque projet
- Déplacer les projets entre les phases
- Créer, modifier, supprimer tes projets

### ⏱️ Cycles de 6 Semaines
- Planification par **cycles** (exploration → production → consolidation → méta)
- Chaque cycle dure **6 semaines** pour un rythme soutenable
- Suivi des **phases de travail**
- Créer, modifier, supprimer tes cycles
- Statut "En cours" ou "Terminé" automatique

### 🧭 Tableau de Sens (Réflexions Trimestrielles)
- **Bilan trimestriel** sur 3 axes :
  - **Créer** : Progression créative
  - **Transmettre** : Partage et enseignement
  - **Gagner ma vie** : Stabilité financière
- Phrase d'alignement hebdomadaire
- Suivi de l'évolution

### 🌅 Routine Quotidienne
- **Rituel minimal** pour rester aligné
- Phases : Matin, Avant travail, Fin de journée
- **Timer intégré** pour chaque phase
- **Citations tournantes** inspirantes
- Suivi du taux de complétude

### 📈 Analytique & Insights
- **Graphiques de progression** financière
- **Radar d'alignement** des 3 axes
- **Camembert des projets** par statut
- **Recommandations intelligentes** avec alertes
- **Métriques clés** en temps réel

### 👨‍🏫 Suivi du Coach
- Progression **semaine par semaine**
- Zones de **notes** personnelles
- **Upload de livrables**
- Tableau de progression visuel

## 🚀 Installation

### Prérequis
- Node.js 18+ et pnpm
- Une base de données MySQL/TiDB
- Compte Manus OAuth (pour l'authentification)

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/alibaba7447/creative-autonomy-system.git
cd creative-autonomy_system
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configurer les variables d'environnement**
Crée un fichier `.env.local` à la racine du projet :
```env
# Base de données
DATABASE_URL=mysql://user:password@localhost:3306/creative_autonomy

# Authentification
JWT_SECRET=your_jwt_secret_key_here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# Application
VITE_APP_ID=your_app_id
VITE_APP_TITLE=Système d'autonomie créative
VITE_APP_LOGO=https://your-logo-url.png

# Optionnel
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
```

4. **Initialiser la base de données**
```bash
pnpm db:push
```

5. **Démarrer le serveur de développement**
```bash
pnpm dev
```

L'application sera disponible à `http://localhost:3000`

## 📖 Guide d'Utilisation

### Première connexion
1. Clique sur **"Accéder à mon bilan"** sur la page d'accueil
2. Connecte-toi avec tes identifiants Manus
3. Tu arriveras sur le **Dashboard** avec ton score de santé globale

### Configurer ton système

#### 1. Définis ton Plancher & Plafond
- Va à **Finances**
- Clique sur **"Nouveau revenu"**
- Définis :
  - **Plancher** : Revenu minimum pour vivre sereinement
  - **Expansion** : Objectif de croissance
  - **Épargne** : Montant à mettre de côté

#### 2. Crée tes premiers projets
- Va à **Projets**
- Clique sur **"Nouveau projet"**
- Rappel : Maximum 3 projets actifs
- Remplis : Titre, Description, Phase, Satisfaction

#### 3. Planifie tes cycles
- Va à **Cycles de 6 semaines**
- Clique sur **"Nouveau cycle"**
- Choisis la phase (Exploration, Production, Consolidation, Méta)
- Ajoute tes objectifs pour ce cycle

#### 4. Définis ta routine quotidienne
- Va à **Routine quotidienne**
- Crée ta routine minimale
- Utilise le timer pour chaque phase
- Suivi automatique du taux de complétude

### Gérer tes données

Chaque élément (Cycles, Projets, Finances, etc.) peut être :
- ✏️ **Modifié** : Clique sur le bouton "Modifier"
- 🗑️ **Supprimé** : Clique sur "Supprimer" (avec confirmation)
- 📊 **Suivi** : Voir la progression en temps réel

## 🎨 Design & Ambiance

- **Couleurs apaisantes** : Verts, beiges, blancs
- **Typographie douce** : Lisible et agréable
- **Interface minimaliste** : Pas de surcharge
- **Mode clair/sombre** : Adapté à tes préférences
- **Responsive** : Fonctionne sur tous les appareils

## 🛠️ Architecture Technique

### Stack
- **Frontend** : React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend** : Express 4 + tRPC 11
- **Base de données** : MySQL/TiDB + Drizzle ORM
- **Authentification** : Manus OAuth
- **Déploiement** : Prêt pour Vercel/Netlify

### Structure du projet
```
creative_autonomy_system/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Pages principales
│   │   ├── components/    # Composants réutilisables
│   │   ├── lib/           # Utilitaires
│   │   └── index.css      # Styles globaux
│   └── public/            # Assets statiques
├── server/                # Backend Express
│   ├── routers.ts         # Procédures tRPC
│   ├── db.ts              # Requêtes base de données
│   └── _core/             # Configuration interne
├── drizzle/               # Schéma et migrations
└── README.md              # Ce fichier
```

## 🔐 Sécurité

- ✅ Authentification OAuth sécurisée
- ✅ Sessions JWT signées
- ✅ Données utilisateur isolées
- ✅ Protection contre les injections SQL (Drizzle ORM)
- ✅ HTTPS en production

## 📱 Responsive Design

L'application fonctionne parfaitement sur :
- 🖥️ Ordinateurs (1920px+)
- 💻 Tablettes (768px - 1024px)
- 📱 Téléphones (320px - 767px)

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le dépôt
2. Crée une branche (`git checkout -b feature/amazing-feature`)
3. Commit tes changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvre une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 💬 Support

Pour toute question ou problème :
- 📧 Ouvre une issue sur GitHub
- 💡 Propose une amélioration
- 🐛 Signale un bug

## 🙏 Remerciements

Créé pour aider les jeunes créatifs à trouver l'équilibre entre :
- Stabilité mentale et financière
- Liberté créative
- Progression constante
- Plaisir d'apprendre

---

**Stabilise ton mental, structure tes projets, et avance librement.** 🌿✨

Fait avec ❤️ pour les créatifs autonomes.

