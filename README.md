<div align="center">

# Festival du Jeu – Application Web Bénévoles

Une application **web** dédiée à la gestion des bénévoles et des festivals.  
Elle est complémentaire à la [version mobile iOS](https://github.com/JiayiHE95/BenevoleAPP-Back), développée spécifiquement pour les bénévoles.  

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">
  <img alt="Creative Commons License" style="border-width:0"
       src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" />
</a><br />
Ce projet est sous licence
<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">
  Creative Commons Attribution – NonCommercial – NoDerivatives 4.0 International
</a>.

---

**Janvier 2024**  
**Projet IG4 – Polytech Montpellier**

</div>

## 📋 Sommaire

- [Présentation](#présentation)
- [Objectifs](#objectifs)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Déploiement](#déploiement)
- [Sécurité](#sécurité)
- [Contributeurs](#contributeurs)

---

## 📝 Présentation

Cette application web est conçue pour faciliter la gestion d’un festival et l’organisation des bénévoles.  
Elle répond aux besoins du **Festival du Jeu de Montpellier** et permet :  

- La gestion complète d’un festival (planning, postes, inscriptions, zones de jeux, référents, etc.).  
- L’accès des bénévoles à toutes les informations nécessaires : inscriptions, postes, planning personnalisé.  
- La récupération des données des festivals passés pour faciliter la préparation d’éditions futures.  

👉 Une version mobile iOS a également été développée pour améliorer l’expérience des bénévoles sur le terrain.  

---

## 🎯 Objectifs

- Simplifier la **gestion de l’organisation du festival**.  
- Proposer un **système d’inscription** intuitif pour les bénévoles.  
- Permettre l’**import de données** (zones, jeux, postes) via un fichier CSV.  
- Garantir une **gestion flexible** et adaptable à l’évolution des festivals et des bénévoles.

---

## ✅ Fonctionnalités

### Pour les utilisateurs sans compte
- Inscription et connexion.  
- Accès au site officiel du festival.  

### Pour les bénévoles
- Gestion du profil personnel.  
- Inscription à des postes ou créneaux.  
- Suivi des inscriptions et notifications.  
- Accès aux zones de jeux et notices.  
- Planning personnalisé et indicateurs de remplissage.  

### Pour l’administrateur
- Création et gestion complète d’un festival.  
- Importation d’un fichier CSV (zones, jeux, postes).  
- Affectation des bénévoles « flexibles ».  
- Gestion des postes, capacités et créneaux.  
- Ajout de référents.  
- Accès aux données des festivals passés.  

---

## 🏗 Architecture

L’application suit une architecture **MVC** :  
- **Frontend** : pages et composants en React.  
- **Backend** : gestion de la logique métier, sécurité et API.  
- **Base de données** : stockage relationnel avec PostgreSQL.  

La sécurité est assurée par un **middleware d’authentification (JWT)**.  

---

## 🛠 Technologies

- **Backend** : Node.js, Express, Sequelize  
- **Frontend** : React, SCSS, Axios  
- **Base de données** : PostgreSQL  
- **Authentification** : JSON Web Tokens (JWT)  

---

## 🚀 Déploiement

- Plateforme : **Render**  
- Déploiement continu via GitHub (auto-déploiement à chaque `git push`).  
- Accès sécurisé par HTTPS.  

---

## 🔒 Sécurité

- HTTPS pour toutes les communications.  
- Authentification par **JWT** avec durée limitée (24h).  
- Redirection automatique des utilisateurs non connectés.  
- Protection contre injections SQL et attaques XSS.  

---

## 🤝 Contributeurs

- [**Jiayi He**](https://github.com/JiayiHE95)  
- [**Charlène Morchipont**](https://github.com/charleneMrcp)  

---
