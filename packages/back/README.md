# API pédagogique Bun + SQLite

Depuis la racine du workspace : `bun install --frozen-lockfile`, puis `bun run dev:back`.
L'API écoute sur le port 3001 ; le front Vite transmet `/api` via son proxy.

Ressources : `/api/parcours`, `/api/ues`, `/api/etudiants`, détails `/:id`, associations UE/parcours.
Les modèles TypeScript se trouvent dans `src/server/models` et les routes dans `src/index.ts`.
Les réponses de création sont enveloppées (`{ message, parcours }`, `{ message, ue }`, etc.).

La base par défaut est `packages/back/data.db`. Utiliser `DATABASE_PATH=:memory:` pour une session jetable.
Les clés étrangères sont activées et le remplacement des associations est transactionnel.

`bun run typecheck` et `bun run lint` vérifient le backend. Depuis la racine, `bun run check` vérifie le projet complet.
La validation des entrées HTTP reste partielle ; ce support local n'est pas un serveur prêt pour la production.
