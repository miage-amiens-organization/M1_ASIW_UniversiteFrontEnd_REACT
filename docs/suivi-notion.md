# Suivi de mise à jour Notion — 27 septembre 2026

## Autorisation et modalités

Julian a autorisé la modification du cours Notion. Format confirmé : **20 h exclusivement en TD, sans projet**. L'accès connecté est rétabli ; aucune nouvelle connexion n'est nécessaire pour cette session.

## Modifications appliquées

- Présentation : 20 h sans projet et progression 3 + 5 + 4 + 3 + 3 + 2 h.
- React : bibliothèque d'interface, CSR/SSR/SSG/hydratation, props/état/rendu/commit, exemples typés, Router et Outlet, hooks, contexte, placement de l'état, StrictMode, effets et Compiler optionnel.
- Pré-requis : clone HTTPS, installation figée depuis la racine, commandes front/back compatibles avec le dépôt distant, proxy local, données fictives et précautions IA.
- Ajouter un parcours : chemins et barrel, dialogue natif avec nettoyage, champs propageant leurs attributs, formulaire avec onSubmit, mutate sans promesse rejetée non gérée, erreurs visibles et blocage pendant l'envoi. Contrat UpdateParcoursPayload ajouté.
- Lister les parcours : clés stables, tableau générique sans any, render obligatoire, boutons clavier, chargement/erreur/réessai/vide ; chemin components/ui/Table.tsx harmonisé.
- Modifier un parcours : identifiant séparé de la saisie, montage à chaque ouverture, page cohérente, effets corrigés, invalidation par défaut, variante optimiste avec snapshot/rollback/réconciliation et limite de concurrence.
- Supprimer un parcours : invalidation après succès, retrait du faux contexte retourné d'onSuccess, confirmation et critères d'erreur/accessibilité.
- CRUD UE : numeroUe chaîne, mise à jour après succès distinguée de l'optimisme, portée des installations, séparation des responsabilités, Button typé avec classes définies et type button par défaut.
- Gestion des erreurs : safeParse/result.data, propriétés optionnelles, schéma UE, année enum, identité hors schéma, adaptateurs ControlledInput/ControlledSelect accessibles, annulation et réinitialisation ; rappel de validation serveur.
- Design patterns : props ≠ héritage, composition déjà présente via children, exemples remplacés, réutilisation du dialogue natif, organisation par fonctionnalités distinguée d'une application complète de FSD.
- Étudiants : page renommée « Atelier IA — liste et création d'étudiants », atelier de 3 h avec critères, contexte, petits diffs, tests, revue croisée et restitution ; édition/suppression optionnelles en séance, sans abonnement imposé.
- Exercice de fin : 3 h ADR/performance puis 2 h de consolidation individuelle ; ADR sans nouvelle fonctionnalité complète ; mesures avant/après, rendu ≠ DOM, développement/production, limites d'IntersectionObserver et lazy loading.

## Vérification et publication

Les blocs modifiés ont été relus dans l'éditeur. Présentation, React, Pré-requis, Ajouter un parcours, Lister les parcours, Modifier un parcours, CRUD UE et Gestion des erreurs ont été rouverts ; les corrections principales y sont conservées. Le formulaire RHF relu après réouverture correspond exactement au texte attendu. Le contrat UE a été recoupé avec le backend : numeroUe/intitule à la création, parcoursIds sur la route séparée d'association.

La présentation et l'atelier IA ont été contrôlés sur le site public : **20 h sans projet et nouvel atelier effectivement visibles**. La première lecture publique présentait encore l'ancienne version ; une navigation ultérieure a confirmé sa mise à jour. Aucun réglage de partage ni élargissement de permissions n'a été effectué.

Les collages de code ont parfois été dupliqués ou refusés par Notion ; les blocs concernés ont été réparés et comparés au texte attendu. Ne pas confondre la première page affichée pendant le chargement avec l'état après synchronisation.

## Validation technique locale

- `bun run check` : lint et typage des deux packages, 6 tests de régression et build front réussis.
- TypeScript strict dans un environnement temporaire : dialogue, tableau, composition, Button, adaptateurs RHF, formulaire Parcours avec resolver Zod, arbre d'erreurs et callbacks optimistes.
- Cet environnement utilise React 19.1.1, Query 5.90.6, Zod 4.1.12, TypeScript 5.9.3, RHF 7.89.0 et resolvers 5.9.1. Il est séparé du squelette étudiant.
- Les images de résultat et chaque exercice assemblé n'ont pas fait l'objet d'un test visuel/E2E exhaustif. Les scénarios clavier/réseau restent explicitement demandés dans les TD.

## Dépôt et périmètre

Les corrections de code sont regroupées sur `cours/review-2026`. Le front reste volontairement incomplet pour les exercices. La validation runtime exhaustive et l'authentification de l'API ne sont pas implémentées ; le support précise cette limite pédagogique.

Le cours distinct « intégration de l'IA en entreprise » reste à préparer ultérieurement.

## Liens

- [Cours](https://app.notion.com/p/miage-amiens-lapujade/BC05_C05_R01-Applications-web-front-end-React-1a7ef565d6594e8dbbe4a302fe102899)
- [Atelier IA public](https://miage-amiens-lapujade.notion.site/CRUD-tudiants-0c3b1c92af2647a2b5a5886199a9e8e1)
- [Présentation publique](https://miage-amiens-lapujade.notion.site/Pr-sentation-964e997b18294875937addb07ccb3a00)
