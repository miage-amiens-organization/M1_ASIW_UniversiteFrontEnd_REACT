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
Les tests couvrent le transport HTTP du helper front et l'intégrité des relations SQLite.
Ils ne constituent pas des tests E2E des CRUD à réaliser.
Installer les dépendances depuis la racine : `bun.lock` à la racine fait référence pour le workspace.

## Préparation du cours

- [Revue détaillée du Notion et du dépôt](docs/review-2026.md)
- [Proposition de programme et atelier de développement avec l'IA](docs/developpement-avec-ia.md)
- [Corrections des exemples de validation](docs/corrections-notion.md)

Les fichiers de documentation proposent les mises à jour du Notion ; la page en ligne n'a pas été modifiée.
