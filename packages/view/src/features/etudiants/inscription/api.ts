import { apiFetch } from "@/lib/api"

export type Parcours = {
  id: number
  nomParcours: string
  anneeFormation: number
}

export type Ue = {
  id: number
  numeroUe: string
  intitule: string
}

export type Etudiant = {
  id: number
  nom: string
  prenom: string
  email: string
  parcours_id: number | null
}

export type InscriptionPayload = {
  nom: string
  prenom: string
  email: string
  parcours_id: number | null
}

/** Erreur HTTP qui conserve le statut, pour distinguer un 409 d'une panne serveur. */
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function lireJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, body?.error ?? `Erreur HTTP ${response.status}`)
  }
  return body as T
}

export async function fetchParcours() {
  return lireJson<Parcours[]>(await apiFetch("/parcours"))
}

export async function fetchUesDuParcours(parcoursId: number) {
  return lireJson<Ue[]>(await apiFetch(`/parcours/${parcoursId}/ues`))
}

export async function creerEtudiant(payload: InscriptionPayload) {
  const response = await apiFetch("/etudiants", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const body = await lireJson<{ etudiant: Etudiant }>(response)
  return body.etudiant
}
