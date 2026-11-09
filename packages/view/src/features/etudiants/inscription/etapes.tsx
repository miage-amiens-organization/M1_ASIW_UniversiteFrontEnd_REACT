import { useQuery } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { fetchParcours, fetchUesDuParcours, type Etudiant } from "./api"

// Composants d'affichage du wizard : ils affichent et remontent des actions,
// mais ne décident jamais de l'étape suivante. Ils ne changent pas avec XState.

export type Identite = { nom: string; prenom: string; email: string }

const inputClass = "mt-1 block w-full border border-gray-300 rounded px-3 py-2"
const boutonPrincipal = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
const boutonSecondaire = "border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50"

// Clés propres au wizard, pour ne pas partager le cache de vos CRUD
const parcoursQuery = { queryKey: ["inscription", "parcours"], queryFn: fetchParcours }

export function Etapes({ courante }: { courante: number }) {
  const etapes = ["Identité", "Parcours", "Récapitulatif"]
  return (
    <ol className="flex gap-6 text-sm mb-6">
      {etapes.map((etape, index) => (
        <li
          key={etape}
          aria-current={courante === index + 1 ? "step" : undefined}
          className={courante === index + 1 ? "font-bold text-blue-700" : "text-gray-500"}
        >
          {index + 1}. {etape}
        </li>
      ))}
    </ol>
  )
}

export function Alerte({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="bg-red-100 text-red-700 rounded px-4 py-2 mb-4">
      {children}
    </p>
  )
}

type EtapeIdentiteProps = {
  valeurs: Identite
  onChange: (champ: keyof Identite, valeur: string) => void
  onSuivant: () => void
}

export function EtapeIdentite({ valeurs, onChange, onSuivant }: EtapeIdentiteProps) {
  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        onSuivant()
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900">Identité</h2>
      <label className="block">
        Nom
        <input className={inputClass} value={valeurs.nom} onChange={(e) => onChange("nom", e.target.value)} />
      </label>
      <label className="block">
        Prénom
        <input className={inputClass} value={valeurs.prenom} onChange={(e) => onChange("prenom", e.target.value)} />
      </label>
      <label className="block">
        E-mail
        <input
          className={inputClass}
          type="email"
          value={valeurs.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </label>
      <button type="submit" className={boutonPrincipal}>
        Suivant
      </button>
    </form>
  )
}

type EtapeParcoursProps = {
  parcoursId: number | null
  onChoisir: (parcoursId: number) => void
  onPrecedent: () => void
  onSuivant: () => void
}

export function EtapeParcours({ parcoursId, onChoisir, onPrecedent, onSuivant }: EtapeParcoursProps) {
  const parcours = useQuery(parcoursQuery)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Parcours</h2>
      {parcours.isPending && <p>Chargement des parcours…</p>}
      {parcours.isError && <Alerte>Impossible de charger les parcours.</Alerte>}
      {parcours.data?.length === 0 && <p>Aucun parcours : créez-en un dans la page Parcours.</p>}
      {parcours.data?.map((p) => (
        <label key={p.id} className="flex items-center gap-2">
          <input type="radio" name="parcours" checked={parcoursId === p.id} onChange={() => onChoisir(p.id)} />
          {p.nomParcours} (année {p.anneeFormation})
        </label>
      ))}
      {parcoursId !== null && <UesDuParcours parcoursId={parcoursId} />}
      <div className="flex gap-2">
        <button type="button" className={boutonSecondaire} onClick={onPrecedent}>
          Précédent
        </button>
        <button type="button" className={boutonPrincipal} onClick={onSuivant}>
          Suivant
        </button>
      </div>
    </div>
  )
}

function UesDuParcours({ parcoursId }: { parcoursId: number }) {
  const ues = useQuery({
    queryKey: ["inscription", "parcours", parcoursId, "ues"],
    queryFn: () => fetchUesDuParcours(parcoursId),
  })

  if (ues.isPending) return <p>Chargement des UE…</p>
  if (ues.isError) return <Alerte>Impossible de charger les UE.</Alerte>
  if (ues.data.length === 0) return <p>Aucune UE rattachée à ce parcours.</p>
  return (
    <ul aria-label="UE du parcours" className="list-disc pl-6 text-gray-700">
      {ues.data.map((ue) => (
        <li key={ue.id}>
          {ue.numeroUe} — {ue.intitule}
        </li>
      ))}
    </ul>
  )
}

type EtapeRecapitulatifProps = {
  identite: Identite
  parcoursId: number | null
  envoiEnCours: boolean
  peutRevenir?: boolean
  onPrecedent: () => void
  onConfirmer: () => void
}

export function EtapeRecapitulatif({
  identite,
  parcoursId,
  envoiEnCours,
  peutRevenir = true,
  onPrecedent,
  onConfirmer,
}: EtapeRecapitulatifProps) {
  const parcours = useQuery(parcoursQuery)
  const nomParcours = parcours.data?.find((p) => p.id === parcoursId)?.nomParcours ?? "—"

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Récapitulatif</h2>
      <ul className="text-gray-700">
        <li>Nom : {identite.nom}</li>
        <li>Prénom : {identite.prenom}</li>
        <li>E-mail : {identite.email}</li>
        <li>Parcours : {nomParcours}</li>
      </ul>
      <div className="flex gap-2">
        <button type="button" className={boutonSecondaire} disabled={!peutRevenir} onClick={onPrecedent}>
          Précédent
        </button>
        <button type="button" className={boutonPrincipal} disabled={envoiEnCours} onClick={onConfirmer}>
          {envoiEnCours ? "Envoi en cours…" : "Confirmer l'inscription"}
        </button>
      </div>
    </div>
  )
}

export function Succes({ etudiant, onRecommencer }: { etudiant: Etudiant; onRecommencer: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Étudiant inscrit</h2>
      <p className="text-gray-700">
        {etudiant.prenom} {etudiant.nom} est inscrit (n° {etudiant.id}).
      </p>
      <button type="button" className={boutonSecondaire} onClick={onRecommencer}>
        Inscrire un autre étudiant
      </button>
    </div>
  )
}
