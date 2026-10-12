# Applications web front end — React / MIAGE

Support de TD : React 19, TypeScript, Vite, TanStack Query, Tailwind CSS ; API Bun et SQLite.
Le front est volontairement un squelette : les CRUD font partie du travail des étudiants.

## Démarrer

Prérequis : Git et Bun (vérifications effectuées avec Bun 1.3.4).
Depuis la racine du dépôt :

```sh
bun install --frozen-lockfile
bun run dev:front
```

Dans un deuxième terminal, toujours à la racine :

```sh
bun run dev:back
```

Ouvrir http://localhost:3000. Vite transmet `/api` au serveur sur le port 3001.
Le chemin du front est `packages/view`.
La base par défaut est `packages/back/data.db`, indépendamment du répertoire de lancement.
`DATABASE_PATH` permet de choisir une autre base ; les tests utilisent uniquement `:memory:`.
Ce backend pédagogique n'implémente pas d'authentification ni d'autorisation : utiliser des données fictives en local.

## Vérifications

```sh
bun run check
```

Exécute lint front/back, compilation TypeScript front/back, tests de régression puis build du front.
Les tests couvrent le transport HTTP du helper front, l'intégrité des relations SQLite et les réponses HTTP de validation des parcours et UE.
Les tests HTTP lancent leur propre serveur sur un port libre avec une base en mémoire.
Ils ne constituent pas des tests E2E des CRUD à réaliser.
Installer les dépendances depuis la racine : `bun.lock` à la racine fait référence pour le workspace.

## Contrat de validation — Parcours et UE

Les routes de création et de modification valident le JSON avec Zod côté serveur.
Le corps doit être un objet contenant uniquement les champs prévus :

- Parcours : `nomParcours` est une chaîne non vide après suppression des espaces aux extrémités ; `anneeFormation`, si fournie, est le nombre `1` ou `2` (pas une chaîne). À la création, l'année omise vaut `1`.
- UE : `numeroUe` et `intitule` sont des chaînes non vides après suppression des espaces aux extrémités. Le numéro est unique, à la création comme à la modification.
- Les `PUT` conservent les champs omis, mais refusent un objet vide et les valeurs explicitement invalides. L'identifiant reste dans l'URL, hors du corps du formulaire.
- Associations UE/parcours : `parcoursIds` contient des entiers positifs correspondant à des parcours existants. `[]` supprime les associations ; les doublons sont regroupés. Une demande invalide conserve les associations précédentes.

| Situation | Statut | Réponse |
| --- | --- | --- |
| JSON, champs, identifiant ou références invalides | `400` | `{ "error": "…" }`, avec `fields` pour les erreurs de schéma |
| Ressource absente | `404` | `{ "error": "…" }` |
| Numéro d'UE déjà utilisé | `409` | `{ "error": "Une UE avec ce numéro existe déjà." }` |
| Erreur interne | `500` | `{ "error": "…" }` |

Le front peut continuer à afficher `error` sans exploiter `fields`. Il doit vérifier `response.ok` : `fetch` ne rejette pas les réponses HTTP d'erreur.
Pour tester le TD : créer deux UE de numéros différents, puis tenter de créer une troisième UE ou de renommer la seconde avec le numéro de la première. Le refus est `409`, sans modifier les données. Tester les saisies invalides via un appel HTTP direct permet de vérifier la validation serveur indépendamment de celle du formulaire.
Ces garanties concernent les parcours, les UE et leurs associations ; les routes étudiants restent hors de cet exercice.
`PORT` permet de changer le port du backend (3001 par défaut).

## Préparation du cours

- [Revue détaillée du Notion et du dépôt](docs/review-2026.md)
- [Proposition de programme et atelier de développement avec l'IA](docs/developpement-avec-ia.md)
- [Corrections des exemples de validation](docs/corrections-notion.md)

Les fichiers de documentation proposent les mises à jour du Notion ; la page en ligne n'a pas été modifiée.
