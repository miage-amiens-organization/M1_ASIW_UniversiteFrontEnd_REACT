# Corrections de référence pour le Notion

Ces extraits documentent les corrections du chapitre « Gestion des erreurs », appliquées dans le support Notion. Les solutions des CRUD ne sont pas intégrées au squelette étudiant.

## Validation UE avec Zod 4

`numeroUe` est une chaîne dans l'API. Conserver le résultat de validation et transmettre les données validées. La soumission n'a lieu qu'en cas de succès.

```tsx
const ueSchema = z.object({
  numeroUe: z.string().trim().min(1, "Le numéro est requis"),
  intitule: z.string().trim().min(1, "L'intitulé est requis"),
})

const submitUe = (input: unknown) => {
  const result = ueSchema.safeParse(input)
  if (!result.success) {
    setErrors(z.treeifyError(result.error))
    return
  }
  setErrors(undefined)
  mutation.mutate(result.data)
}

// Les propriétés d'erreur peuvent être absentes.
// Associer cet élément à l'input via aria-describedby.
<p id="intitule-error">{errors?.properties?.intitule?.errors[0]}</p>
```

`mutation` et `setErrors` désignent ici le hook de mutation et l'état d'erreurs du composant à réaliser. Cette fonction ne gère que la validation locale ; afficher aussi l'erreur de la mutation et valider les entrées côté backend. [Schémas Zod](https://zod.dev/api).

## Année et identité d'un parcours

```tsx
const parcoursSchema = z.object({
  nomParcours: z.string().trim().min(1, "Le nom est requis"),
  anneeFormation: z.enum(["1", "2"]),
})

type FormValues = z.infer<typeof parcoursSchema>

const submitForm = (values: FormValues) => {
  const payload = {
    nomParcours: values.nomParcours,
    anneeFormation: Number(values.anneeFormation),
  }

  if (editingParcours) {
    updateMutation.mutate({ id: editingParcours.id, payload })
  } else {
    createMutation.mutate(payload)
  }
}
```

L'identifiant provient du parcours sélectionné, jamais des valeurs du formulaire. Le formulaire reçoit `resolver: zodResolver(parcoursSchema)`. Les mutations ferment la modal seulement au succès et affichent leurs erreurs dans l'interface.

Monter le composant de formulaire à l'ouverture permet de réinitialiser les valeurs à chaque session d'édition. Une clé seule sur l'identifiant ne garantit pas la remise à zéro si le composant reste monté et qu'on rouvre le même parcours.

```tsx
{modalOpen && (
  <ParcoursFormModal
    key={editingParcours?.id ?? "create"}
    editingParcours={editingParcours}
    onClose={handleCloseModal}
  />
)}
```

Dans le formulaire : `<Button type="button" onClick={onClose}>Annuler</Button>` ; pour le champ texte, `type="text"`. Dans le wrapper d'input contrôlé : `id={field.name}`, `aria-invalid={Boolean(fieldState.error)}` et `aria-describedby` vers le message d'erreur si présent.

## Mise à jour optimiste : expliciter les trois phases

Pour un premier TD, garder l'invalidation après succès est suffisant. Pour la variante optimiste, montrer ensemble :

1. `onMutate` : annuler la lecture en cours, sauvegarder le cache, appliquer la projection locale.
2. `onError` : restaurer le snapshot et informer l'utilisateur.
3. `onSettled` : réconcilier avec le serveur en invalidant les clés concernées.

Prévenir que le rollback global d'une liste peut écraser une mutation concurrente : commencer avec une seule mutation active par ressource, puis discuter cette limite. La réponse serveur reste l'autorité. [Exemples TanStack](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates).

## Réécriture du passage sur la composition

« Passer des props permet de paramétrer un composant. Quand l'API accumule des options liées à la structure interne, on peut proposer des emplacements ou des sous-composants. La composition permet à l'appelant de choisir le contenu sans multiplier ces options. Le prop drilling désigne la transmission à travers plusieurs niveaux intermédiaires ; il ne correspond pas à de l'héritage. »

L'exemple ModalTitle a été remplacé par des sous-composants typés avec ComponentProps, réutilisant le dialogue natif accessible. Le titre, la description et le pied de fenêtre ont été vérifiés avec TypeScript strict dans un environnement temporaire.
