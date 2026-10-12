import { z } from "zod"

const requiredText = (label: string) =>
  z.string({ error: `${label} doit être une chaîne de caractères.` })
    .trim().min(1, `${label} est requis.`)
const year = z.union([z.literal(1), z.literal(2)], {
  error: "L’année de formation doit être le nombre 1 ou 2.",
})
const parcoursFields = {
  nomParcours: requiredText("Le nom du parcours"),
  anneeFormation: year.optional(),
}
const ueFields = {
  numeroUe: requiredText("Le numéro d’UE"),
  intitule: requiredText("L’intitulé"),
}
const nonEmptyUpdate = (value: object) => Object.keys(value).length > 0
const updateMessage = "Au moins un champ à modifier est requis."

export const createParcoursSchema = z.strictObject(parcoursFields)
export const updateParcoursSchema = z.strictObject(parcoursFields).partial()
  .refine(nonEmptyUpdate, updateMessage)
export const createUeSchema = z.strictObject(ueFields)
export const updateUeSchema = z.strictObject(ueFields).partial()
  .refine(nonEmptyUpdate, updateMessage)
export const ueParcoursSchema = z.strictObject({
  parcoursIds: z.array(z.number().int().positive().max(Number.MAX_SAFE_INTEGER)),
})

// Preserve { error: string } for the existing front hooks; fields is optional detail.
export async function readBody<T extends z.ZodType>(
  req: Request, schema: T,
): Promise<z.output<T> | Response> {
  let input: unknown
  try {
    input = await req.json()
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error
    return Response.json({ error: "Le corps de la requête doit être un JSON valide." }, { status: 400 })
  }
  const result = schema.safeParse(input)
  if (!result.success) {
    return Response.json({
      error: result.error.issues[0]?.message ?? "Données invalides.",
      fields: z.flattenError(result.error).fieldErrors,
    }, { status: 400 })
  }
  return result.data
}

export function readId(value: string): number | Response {
  const id = Number(value)
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(id)) {
    return Response.json({ error: "L’identifiant doit être un entier strictement positif." }, { status: 400 })
  }
  return id
}

export function serverError(error: unknown): Response {
  console.error("Unexpected API error:", error)
  return Response.json({ error: "Une erreur interne est survenue." }, { status: 500 })
}
