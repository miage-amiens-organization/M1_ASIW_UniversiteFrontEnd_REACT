# Revue du cours — 27 septembre 2026

## Conclusion

Garder le fil rouge université et la stack actuelle. La priorité est de corriger les exemples, expliciter les frontières d'architecture et transformer une partie des CRUD répétitifs en travail de spécification, de vérification et de revue avec une IA. Les trois CRUD seuls mesurent moins bien la compréhension dès lors que les étudiants peuvent générer leur implémentation.

Le support consulté annonçait **15 h de TD + 15 h de projet**. Julian a ensuite confirmé les nouvelles modalités : **20 h exclusivement en TD, sans projet** ; le programme local a été adapté. Il contient déjà TanStack Query, Zod, composition, un ADR, virtualisation et lazy loading : ces sujets sont à améliorer, pas à présenter comme des nouveautés absentes.

## Périmètre réellement consulté

Lecture dans le navigateur du [Notion racine](https://miage-amiens-lapujade.notion.site/BC05_C05_R01-Applications-web-front-end-React-1a7ef565d6594e8dbbe4a302fe102899), de Présentation, React, Pré-requis, des trois pages de gestion, des quatre TD Parcours, CRUD UEs, Gestion des erreurs, CRUD Étudiants, Design patterns et Exercice de fin. Les blocs de code repliés de création, liste, modification et gestion des erreurs ont été ouverts. Les images de résultat n'ont pas fait l'objet d'une revue visuelle exhaustive.

Dépôt cloné : [M1_ASIW_UniversiteFrontEnd_REACT](https://github.com/miage-amiens-organization/M1_ASIW_UniversiteFrontEnd_REACT), base `d746e75` (« hide results »). Branche locale de travail : `cours/review-2026`. Le front incomplet est intentionnel ; il ne faut pas le transformer en corrigé distribué aux étudiants.

## Principaux problèmes relevés et corrigés dans le support

Les sections suivantes documentent les constats initiaux. Les corrections ont été appliquées dans l'éditeur Notion ; le suivi de vérification est dans `suivi-notion.md`.

### 1. Le chapitre de validation contient des erreurs exécutables

[Gestion des erreurs](https://miage-amiens-lapujade.notion.site/Gestion-des-erreurs-d2d47b179f4f451aa7f4c0375b1f1284)

- `safeParse` est stocké dans `isValidInput`, mais le code lit `result.error` : variable inexistante.
- La soumission doit sortir immédiatement en cas d'échec de `safeParse`, puis transmettre `result.data`. La première revue avait confondu deux lignes (`return` puis `update()`) et signalé à tort une condition inversée ; cette lecture a été corrigée.
- `numeroUe` est validé comme nombre alors que le modèle backend utilise une chaîne.
- `z.string().min(1).max(2)` valide une longueur, pas les années autorisées : `"9"` passe. Employer `z.enum(["1", "2"])`, puis convertir à la frontière HTTP.
- L'exemple React Hook Form décide création/édition sur `formState.id`, absent du schéma Zod. Le schéma objet retire normalement les clés non déclarées : conserver l'identité dans `editingParcours.id`, indépendamment du formulaire.
- `errors.properties.intitule.errors[0]` ignore les valeurs optionnelles. Employer un chaînage optionnel.
- `type="string"` doit devenir `type="text"` ; les labels des inputs contrôlés n'ont pas d'`id` correspondant.
- Le bouton Annuler doit avoir explicitement `type="button"` dans un formulaire.

Voir [les corrections proposées](corrections-notion.md). Un type TypeScript ne valide jamais le JSON reçu : introduire la même exigence côté serveur.

### 2. L'optimistic update est incomplète et parfois mal nommée

[Modifier un parcours](https://miage-amiens-lapujade.notion.site/Modifier-un-parcours-fc71b39f33a54b1ab1409e4c02d29f89) et [CRUD UEs](https://miage-amiens-lapujade.notion.site/CRUD-UEs-da95c59ee6d04fa98bfefd1296453531).

Le cours fournit un snapshot dans `onMutate` mais pas son exploitation en `onError` ni la réconciliation finale. Faire échouer une mutation doit remettre l'UI dans un état cohérent. Ajouter rollback, invalidation finale et un scénario de concurrence, ou conserver l'invalidation simple pour le tronc commun. Une modification du cache dans `onSuccess` est une mise à jour après confirmation, pas optimiste. L'invalidation ne force pas à masquer le tableau : distinguer chargement initial et rafraîchissement en arrière-plan. Attention aussi au tri : remplacer une ligne en place ne reproduit pas nécessairement l'ordre imposé par le serveur. [Référence TanStack](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates).

Les handlers qui attendent `mutateAsync` doivent gérer la promesse rejetée ; un callback `onError` ne transforme pas automatiquement cette promesse en succès.

### 3. Composition, props et héritage sont confondus

[Design patterns](https://miage-amiens-lapujade.notion.site/Design-patterns-426726555798413ca7d50d7bc30938c3).

Passer des props n'est pas de l'héritage. Le prop drilling est le passage à travers des niveaux intermédiaires. Renommer en « API à nombreuses props, composition et composants composés ». La première modal utilisant `children` fait déjà de la composition. Ne pas présenter toute nouvelle prop comme une violation automatique du principe ouvert/fermé.

L'exemple ModalTitle mélange `buttonVariants` et `modalTitleVariants`, utilise `size='xl'` non déclaré, contient une classe `dzqd`, des accolades JSX incorrectes et une ModalDescription qui lit `text` mais reçoit des enfants. Le remplacer par un exemple compilé avant diffusion.

### 4. Accessibilité à enseigner dès la première modal

[Ajouter un parcours](https://miage-amiens-lapujade.notion.site/Ajouter-un-parcours-eea9a9f1840f4456986d6edb6647f6f0).

La modal gère Échap et le clic extérieur, mais pas le focus initial, son confinement et sa restitution, ni son nom accessible. Les listeners restent attachés lorsqu'elle est fermée. Préférer un `<dialog>` correctement ouvert avec `showModal()` ou une primitive accessible, puis vérifier au clavier. Donner un nom aux boutons icônes ; propager les attributs `required`, `disabled`, `aria-*` dans les composants Input. [Comportement attendu W3C](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Les chemins `components/Modal.tsx`, `components/ui/Modal` et les exports du barrel ne sont pas cohérents. Uniformiser tous les exemples sur `components/ui`.

## P1 — Mieux enseigner l'architecture

### React

[Chapitre React](https://miage-amiens-lapujade.notion.site/React-d9b1cfbc574c4416b821763298af49ce).

Corriger `React.FC<Props>` alors que seul `ProfileProps` est déclaré ; corriger `isLogged` en `isLoggedIn` ; remplacer « Singe » par « Single ». Clarifier état, événements, immutabilité, clés stables, rendu et commit avant les hooks personnalisés. React ne se limite pas aux SPA, et une SPA n'est pas intrinsèquement plus rapide. Comparer rapidement CSR, SSR, SSG et hydratation ; Next et Astro ne sont pas apparus avec les Server Components.

Pour `useEffect`, enseigner la synchronisation avec un système externe et le cleanup. « `[]` = une fois » est insuffisant : StrictMode vérifie notamment les effets avec un cycle supplémentaire en développement. Distinguer calcul dérivé, événement et effet ; la remise à zéro d'un formulaire peut s'appuyer sur son montage et son identité. [Effets](https://react.dev/learn/you-might-not-need-an-effect), [StrictMode](https://react.dev/reference/react/StrictMode).

### État et frontières

Faire choisir explicitement entre état local, URL (filtres partageables), cache serveur (TanStack Query) et état transversal (panier). Context distribue une valeur ; ce n'est pas une stratégie universelle de cache ni d'optimisation. Définir UI → hook/API → contrat → serveur → base, et placer les règles métier sans dépendance au rendu quand c'est utile.

L'organisation du dépôt est **par fonctionnalités**. Ce n'est pas une démonstration complète de Feature-Sliced Design : si le terme est conservé, expliquer couches, API publiques et contraintes d'import. Sinon, la formulation « organisation par fonctionnalités inspirée de FSD » suffit. [Référence FSD](https://feature-sliced.design/docs/get-started/overview).

### Tableau générique

[Lister les parcours](https://miage-amiens-lapujade.notion.site/Lister-les-parcours-0d1ccfb5f3434a2ba4cd7efbc67be2f9).

Remplacer la clé de ligne `rowIndex` par une identité stable (`getRowKey`). Le passage de `keyof T` à toute chaîne puis le cast `as ReactNode` masquent des erreurs : distinguer une colonne donnée et une colonne calculée avec rendu obligatoire. Éviter d'enseigner la désactivation de `no-explicit-any` comme solution normale. Les lignes cliquables doivent aussi offrir une action clavier. Afficher les états vide, pending et erreur dès le TD liste.

### Performance et nouveautés

[Exercice de fin](https://miage-amiens-lapujade.notion.site/Exercice-de-fin-2ca7378050cc804b901fe69eeeba5431).

Conserver ADR et exercice naïf, mais mesurer avec React Profiler et le panneau Performance, en précisant mode développement/production et effets de StrictMode. Le nombre de logs ne mesure pas la latence. Un rendu n'implique pas une modification du DOM. IntersectionObserver observe des intersections ; il ne fournit pas à lui seul une virtualisation complète avec gestion des tailles, du défilement et du focus.

Présenter React Compiler comme une option de compilation : il automatise une partie de la mémoïsation, mais React 19 ne l'active pas implicitement. Le dépôt n'a que le plugin React Vite, pas le Compiler. Garder l'exercice naïf sans Compiler pour comprendre, puis comparer éventuellement avec une configuration dédiée. [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1).

Le dépôt déclare déjà React `^19.1.1`, Router `^7.9.5`, Query `^5.90.6`, Tailwind `^4.1.16`, Zod `^4.1.12`, Vite `^7.1.7`. Prévoir une mise à jour contrôlée et testée avant de figer la prochaine promotion, sans migration de framework par principe. Le lockfile installé construit Vite 7.1.12. Cette revue n'est pas un audit exhaustif des vulnérabilités ou des dernières versions de chaque dépendance. Consulter la [liste officielle des versions React](https://react.dev/versions) au moment de cette mise à jour.

## Dépôt : corrections effectuées et limites

| Sujet | Constat initial | Modification locale |
|---|---|---|
| Démarrage | README pointe vers `packages/front`, inexistant | README corrigé, commandes racine front/back |
| Lint backend | Import de `eslint-plugin-react` absent | Configuration TypeScript backend et dépendances explicites |
| Typecheck backend | Ancien script de build HTML/Tailwind avec dépendance absente | Suppression du script et de sa configuration inutilisés par l'API |
| SQLite | Relations déclarées sans activation explicite ; DB dépend du cwd | Activation des clés étrangères, chemin stable, `DATABASE_PATH` |
| Associations UE/parcours | Suppression puis insertions non atomiques | Transaction et déduplication des identifiants |
| Helper front | Le spread perd les entrées d'un objet `Headers` ; JSON imposé à FormData | Normalisation avec `Headers`, respect du type explicite et du multipart |
| Validation du travail | Pas de commande de vérification globale | `bun run check`, six tests de régression |

Le helper `apiFetch` continue volontairement de retourner `Response`, y compris pour un statut d'erreur HTTP, afin de rester compatible avec les hooks enseignés. Les hooks doivent vérifier `response.ok`.

Restent des travaux distincts : schémas de validation runtime sur toutes les routes, identifiants stricts (`parseInt('1abc')` ne doit pas accepter 1), homogénéité des erreurs 400/404/409/500, cohérence des contrats et tests HTTP complets. Les contraintes SQLite ne remplacent pas cette validation. Le backend n'a pas d'authentification ; le CORS partiel ne constitue pas une sécurité et n'est pas nécessaire au proxy local Vite. Ne pas présenter cette API pédagogique comme prête à être exposée.

Le vieux lockfile imbriqué `packages/back/bun.lock` reste présent ; utiliser l'installation depuis la racine. Une consolidation ultérieure pourra le retirer après validation des usages hors workspace.

## Vérifications réalisées

Avant modification : installation figée réussie, build/lint front réussis ; lint et typecheck backend en échec.
Après modification : `bun run check` réussi (lint et typecheck des deux packages, 6 tests, build front). Tests SQLite en mémoire, sans mutation du fichier de cours. Contrôle en lecture seule de la base fournie : aucune violation de clé étrangère existante. L'avertissement Node sur `module.register()` subsiste lors du build, sans le faire échouer.

Le Notion a été modifié avec l'autorisation de Julian : programme 20 h sans projet, fondamentaux React, commandes, CRUD Parcours, UE, validation, composition, atelier IA et TD final. La présentation publique a été vérifiée avec les nouvelles modalités. Le suivi détaille les autres vérifications de persistance et de diffusion.

Les exemples de dialogue, tableau, composition, bouton, adaptateurs React Hook Form, formulaire Parcours, arbre d'erreurs Zod et callbacks optimistes ont aussi été vérifiés avec TypeScript strict dans un environnement temporaire distinct du squelette étudiant. Cela ne remplace pas un test complet au clavier et en navigateur de chaque exercice assemblé.

Les corrections de dépôt sont regroupées sur la branche `cours/review-2026`.
