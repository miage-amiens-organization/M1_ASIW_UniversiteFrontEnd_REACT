import { expect, test, type APIRequestContext, type Page } from "@playwright/test"

const API = "http://localhost:3001/api"

// Chaque test crée ses propres données fictives : il ne dépend pas du contenu de la base.
async function creerParcoursAvecUe(request: APIRequestContext) {
  const suffixe = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
  const { parcours } = await (
    await request.post(`${API}/parcours`, { data: { nomParcours: `Parcours E2E ${suffixe}`, anneeFormation: 1 } })
  ).json()
  const { ue } = await (
    await request.post(`${API}/ues`, { data: { numeroUe: `E2E-${suffixe}`, intitule: "UE de test" } })
  ).json()
  await request.put(`${API}/ues/${ue.id}/parcours`, { data: { parcoursIds: [parcours.id] } })
  return parcours as { id: number; nomParcours: string }
}

function emailUnique() {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 1000)}@exemple.fr`
}

async function allerAuRecapitulatif(page: Page, email: string, nomParcours: string) {
  await page.goto("/inscription")
  await page.getByLabel("Nom", { exact: true }).fill("Martin")
  await page.getByLabel("Prénom").fill("Alice")
  await page.getByLabel("E-mail").fill(email)
  await page.getByRole("button", { name: "Suivant" }).click()
  await page.getByRole("radio", { name: nomParcours }).check()
  await expect(page.getByRole("list", { name: "UE du parcours" })).toContainText("UE de test")
  await page.getByRole("button", { name: "Suivant" }).click()
}

test("un étudiant est inscrit dans le parcours choisi", async ({ page, request }) => {
  const parcours = await creerParcoursAvecUe(request)
  const email = emailUnique()

  await allerAuRecapitulatif(page, email, parcours.nomParcours)
  await page.getByRole("button", { name: "Confirmer l'inscription" }).click()

  await expect(page.getByRole("heading", { name: "Étudiant inscrit" })).toBeVisible()
  // On vérifie l'effet réel côté API, pas seulement le message affiché
  const etudiants: Array<{ email: string; parcours_id: number }> = await (await request.get(`${API}/etudiants`)).json()
  expect(etudiants.filter((e) => e.email === email)).toEqual([expect.objectContaining({ parcours_id: parcours.id })])
})

// À vous : faites écrire par l'agent les tests des autres critères d'acceptation du TD.
