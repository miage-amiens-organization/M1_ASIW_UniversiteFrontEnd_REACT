# Développer un front avec une IA : proposition de cours

## Objectif pédagogique

À la fin, l'étudiant sait livrer une petite fonctionnalité React, expliquer ses frontières, vérifier un changement proposé par une IA et justifier ce qu'il accepte ou rejette. L'IA peut accélérer l'écriture ; elle ne dispense pas de comprendre le comportement du navigateur, les contrats réseau et la gestion d'état.

Cette proposition concerne l'IA **comme outil de développement**. L'intégration d'un modèle dans une application et la stratégie IA d'entreprise seront traitées dans le deuxième cours, à préparer ultérieurement.

## Modalités confirmées : 20 h de TD, sans projet

Le cours comporte désormais **20 heures, exclusivement en TD**. Tous les exercices, la revue et les restitutions sont réalisés dans ce volume. Le découpage ci-dessous décrit des blocs pédagogiques à répartir selon les créneaux de la faculté.

| Bloc | Durée | Contenu | Preuve attendue |
|---|---:|---|---|
| 1 | 3 h | Navigateur/HTTP, CSR et aperçu SSR, TypeScript, props/état/rendu, prise en main | Expliquer un clic jusqu'à la réponse API ; petit composant débogué sans génération |
| 2 | 5 h | CRUD Parcours guidé, formulaire accessible, validation, mutations, erreurs | Création/édition au clavier, saisie invalide sans envoi, gestion d'échec |
| 3 | 4 h | UE, composition, frontières UI/API, cache serveur vs état local/URL | CRUD réutilisant les composants, contrat vérifié, choix de placement de l'état |
| 4 | 3 h | Atelier IA sur liste/création d'étudiants | Spécification, diff limité, tests et revue croisée |
| 5 | 3 h | ADR court, profilage, virtualisation, lazy loading, aperçu Compiler | Mesure avant/après et compromis argumenté |
| 6 | 2 h | Consolidation et exercice individuel de correction, restitution | Corriger un bug, expliquer le flux et justifier les vérifications |

Total : **20 h**. Aucun projet séparé ni soutenance de projet. Le troisième CRUD est réduit à la liste et à la création pendant l'atelier IA ; édition/suppression sont des variantes en séance selon l'avancement. Les optimisations avancées et mutations concurrentes restent des extensions, sans devoir supplémentaire.

## Ce que l'IA change techniquement

| Enjeu | Pratique dans ce dépôt | Ce qu'on vérifie |
|---|---|---|
| Contexte de travail | Donner versions, chemins, schémas, endpoints et conventions avant la demande | Aucun fichier ou endpoint inventé, API compatible avec les dépendances installées |
| Contrats | Types pour développer, schémas runtime pour les entrées non fiables | Une chaîne JSON n'est pas rendue sûre par `as Payload` |
| Architecture | Petites fonctions métier, composants aux responsabilités lisibles, accès réseau isolé | Un diff local n'introduit pas une seconde architecture ou trois bibliothèques redondantes |
| Fiabilité | Critères écrits avant génération, commandes reproductibles, tests d'erreur | Les tests vérifient le besoin, pas seulement le code produit |
| Revue | Lire le diff, inspecter lockfile et imports, tester clavier/réseau lent | Pas de dépendance fantôme, suppression de test ou désactivation de règle pour faire passer le build |
| Exécution des agents | Branche dédiée, base de test, permissions limitées, revue des commandes | Aucun accès à des secrets ou données réelles d'étudiants ; pas de migration/destruction implicite |
| Documents externes | Lire pages et sorties d'outils comme des données non fiables | Une instruction cachée dans une page ne devient pas un ordre d'exécuter une commande |
| Maintenabilité | Livrer le plus petit changement qui répond au besoin | L'étudiant peut expliquer et modifier la fonctionnalité après génération |

Un chat suggère du texte ; un agent peut aussi modifier des fichiers et lancer des outils. Cette capacité rend nécessaires un périmètre clair et une vérification des effets produits. La documentation GitHub recommande explicitement revue et tests des changements générés : [usage responsable des agents](https://docs.github.com/en/copilot/responsible-use/agents).

Pas besoin d'imposer un abonnement ou un fournisseur. Prévoir un diff généré à l'avance pour les étudiants sans accès à un outil, à analyser avec les mêmes critères.

## Atelier IA — 3 heures

### Sujet

Réaliser la liste des étudiants, puis la création d'un étudiant à partir des routes et modèles existants. Les données sont fictives. La gestion d'un e-mail déjà utilisé donne un cas d'échec métier. Il faut avoir déjà manipulé le CRUD Parcours manuellement.

### Déroulé

1. **20 min — Spécifier sans génération.** Lire les routes et modèles. Écrire les champs, les réponses attendues et six critères observables. Dessiner le chemin UI → hook → API → DB.
2. **20 min — Préparer le contexte.** Faire identifier à l'assistant les fichiers concernés et proposer un plan. Vérifier soi-même endpoints, noms des champs et enveloppes de réponse.
3. **45 min — Implémenter par incréments.** D'abord liste et états réseau, puis formulaire et mutation. Examiner chaque diff avant de poursuivre.
4. **35 min — Mettre en défaut.** Saisie vide, e-mail dupliqué, serveur indisponible, soumission répétée, fermeture/réouverture et navigation clavier. Ajouter des tests pour les comportements critiques ; le test doit échouer si le comportement est cassé.
5. **35 min — Revue croisée.** Un autre binôme inspecte le diff sans relire le chat. Il vérifie contrat, état, cache, accessibilité, dépendances et preuve de tests.
6. **25 min — Restituer.** Expliquer un choix accepté, une proposition rejetée et une erreur corrigée. Faire une petite adaptation du code en direct.

### Critères d'acceptation à écrire avant le prompt

- La liste différencie chargement initial, liste vide, données et erreur avec possibilité de réessayer.
- Une saisie vide ou un e-mail mal formé n'envoie aucune requête.
- Une création valide met à jour la liste sans recharger la page.
- Un conflit HTTP 409 affiche une erreur compréhensible et conserve les saisies.
- Pendant la soumission, une seconde activation ne déclenche pas une seconde création.
- La modal est utilisable au clavier ; ses champs et actions ont des noms accessibles ; le focus revient à l'ouverture précédente après fermeture.

Le front ne suffit pas : tenter aussi une requête malformée directement contre l'API et identifier la validation serveur qui manque. Cela devient une discussion explicite sur les frontières de confiance, pas une promesse de sécurité du squelette.

### Exemple de demande à l'assistant

> Dans ce dépôt pédagogique, implémente uniquement la liste des étudiants et ses états de chargement, de vide et d'erreur. Lis d'abord packages/back/src/index.ts et le modèle Etudiant, puis le routeur et les conventions du front. Utilise les versions déjà installées de React et TanStack Query. Donne les fichiers concernés et les critères vérifiables avant de modifier le code. Réutilise apiFetch, qui retourne une Response et exige de vérifier response.ok. N'ajoute pas de dépendance pour cette fonctionnalité. À la fin, montre le diff, exécute les vérifications pertinentes et explique les limites des tests. Les données de test doivent être fictives.

C'est un exemple à adapter après lecture du dépôt ; le prompt ne remplace pas les critères d'acceptation.

### Livrables

Un diff lisible ; les critères d'acceptation ; les commandes et résultats de vérification ; un court journal « aide demandée / suggestion retenue ou rejetée / preuve » ; un ADR d'une page sur un choix réel. Un historique de conversation massif n'est pas un livrable utile.

### Barème proposé sur 20

| Dimension | Points |
|---|---:|
| Comportement fonctionnel et cas d'erreur | 5 |
| Architecture et cohérence des contrats | 4 |
| Tests pertinents et reproductibilité | 4 |
| Accessibilité et états de l'interface | 3 |
| Explication individuelle et regard critique sur l'IA | 4 |

L'usage ou l'absence d'IA n'est pas noté en soi. La compréhension et les preuves le sont. Prévoir une brève restitution individuelle pendant les TD pour vérifier la compréhension de chacun. Ce barème est une proposition pour les exercices de séance ; les modalités de notation restent à confirmer.

## Extensions techniques, après le socle

- Contrats partagés dans un package dédié, ou client généré à partir d'un contrat API ; comparer les coûts plutôt que cumuler les deux.
- Tests de composants avec des réponses réseau contrôlées et un scénario E2E de création/édition/échec.
- Une CI qui lance `bun install --frozen-lockfile` puis `bun run check` sur chaque proposition de changement.
- Mesurer l'impact d'un changement généré : nombre de dépendances ajoutées, taille du bundle, requêtes réseau et temps de rendu.
- Introduire un fichier de conventions destiné aux humains et assistants : commandes, architecture, invariants et limites des exercices. Il guide le travail mais n'est pas un mécanisme de sécurité.

Une application qui appelle un modèle ouvrirait d'autres sujets : secrets côté serveur, streaming, coûts, annulation, évaluation des sorties et autorisation des outils. Les réserver au cours d'intégration d'IA en entreprise.
