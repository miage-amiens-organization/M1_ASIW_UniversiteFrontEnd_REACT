import { db } from "../../db"
import type {
  Ue,
  CreateUePayload,
  UpdateUePayload,
  UeWithParcours,
} from "../../models/Ue"

export async function createUe(payload: CreateUePayload): Promise<Ue | null> {
  try {
    const stmt = db.prepare(
      "INSERT INTO ues (numeroUe, intitule) VALUES (?, ?)"
    )
    const result = stmt.run(payload.numeroUe, payload.intitule)

    if (result) {
      return {
        id: result.lastInsertRowid as number,
        numeroUe: payload.numeroUe,
        intitule: payload.intitule,
        created_at: new Date().toISOString(),
      }
    }
    return null
  } catch (error) {
    console.error("Error creating UE:", error)
    return null
  }
}

export function getUeById(id: number): Ue | null {
  const stmt = db.prepare(
    "SELECT id, numeroUe, intitule, created_at FROM ues WHERE id = ?"
  )
  return (stmt.get(id) as Ue) || null
}

export function getUeByNumero(numeroUe: string): Ue | null {
  const stmt = db.prepare(
    "SELECT id, numeroUe, intitule, created_at FROM ues WHERE numeroUe = ?"
  )
  return (stmt.get(numeroUe) as Ue) || null
}

export function getAllUes(): Ue[] {
  const stmt = db.prepare(
    "SELECT id, numeroUe, intitule, created_at FROM ues ORDER BY numeroUe"
  )
  return (stmt.all() as Ue[]) || []
}

export function updateUe(id: number, payload: UpdateUePayload): Ue | null {
  try {
    const ue = getUeById(id)
    if (!ue) {
      return null
    }

    const numeroUe = payload.numeroUe || ue.numeroUe
    const intitule = payload.intitule || ue.intitule

    const stmt = db.prepare(
      "UPDATE ues SET numeroUe = ?, intitule = ? WHERE id = ?"
    )
    stmt.run(numeroUe, intitule, id)

    return {
      id,
      numeroUe,
      intitule,
      created_at: ue.created_at,
    }
  } catch (error) {
    console.error("Error updating UE:", error)
    return null
  }
}

export function deleteUe(id: number): boolean {
  try {
    // First delete all associations in the junction table
    const deleteAssocStmt = db.prepare(
      "DELETE FROM ue_parcours WHERE ue_id = ?"
    )
    deleteAssocStmt.run(id)

    // Then delete the UE
    const stmt = db.prepare("DELETE FROM ues WHERE id = ?")
    const result = stmt.run(id)
    return (result.changes as number) > 0
  } catch (error) {
    console.error("Error deleting UE:", error)
    return false
  }
}

// Many-to-Many relationship functions

export function getUeWithParcours(id: number): UeWithParcours | null {
  const ue = getUeById(id)
  if (!ue) return null

  const stmt = db.prepare(`
    SELECT p.id, p.nomParcours, p.anneeFormation
    FROM parcours p
    INNER JOIN ue_parcours up ON p.id = up.parcours_id
    WHERE up.ue_id = ?
    ORDER BY p.anneeFormation DESC, p.nomParcours
  `)
  const enseigneeDans =
    (stmt.all(id) as Array<{
      id: number
      nomParcours: string
      anneeFormation: number
    }>) || []

  return {
    ...ue,
    enseigneeDans,
  }
}

export function addUeToParcours(ueId: number, parcoursId: number): boolean {
  try {
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO ue_parcours (ue_id, parcours_id) VALUES (?, ?)"
    )
    stmt.run(ueId, parcoursId)
    return true
  } catch (error) {
    console.error("Error adding UE to parcours:", error)
    return false
  }
}

export function removeUeFromParcours(
  ueId: number,
  parcoursId: number
): boolean {
  try {
    const stmt = db.prepare(
      "DELETE FROM ue_parcours WHERE ue_id = ? AND parcours_id = ?"
    )
    const result = stmt.run(ueId, parcoursId)
    return (result.changes as number) > 0
  } catch (error) {
    console.error("Error removing UE from parcours:", error)
    return false
  }
}

export function getParcoursForUe(ueId: number): Array<{
  id: number
  nomParcours: string
  anneeFormation: number
}> {
  const stmt = db.prepare(`
    SELECT p.id, p.nomParcours, p.anneeFormation
    FROM parcours p
    INNER JOIN ue_parcours up ON p.id = up.parcours_id
    WHERE up.ue_id = ?
    ORDER BY p.anneeFormation DESC, p.nomParcours
  `)
  return (
    (stmt.all(ueId) as Array<{
      id: number
      nomParcours: string
      anneeFormation: number
    }>) || []
  )
}

export function getUesForParcours(parcoursId: number): Ue[] {
  const stmt = db.prepare(`
    SELECT u.id, u.numeroUe, u.intitule, u.created_at
    FROM ues u
    INNER JOIN ue_parcours up ON u.id = up.ue_id
    WHERE up.parcours_id = ?
    ORDER BY u.numeroUe
  `)
  return (stmt.all(parcoursId) as Ue[]) || []
}

export function updateUeParcours(ueId: number, parcoursIds: number[]): boolean {
  try {
    // Roll back the deletion and inserts together if one association is invalid.
    db.transaction(() => {
      db.prepare("DELETE FROM ue_parcours WHERE ue_id = ?").run(ueId)
      const insert = db.prepare(
        "INSERT INTO ue_parcours (ue_id, parcours_id) VALUES (?, ?)"
      )
      for (const parcoursId of new Set(parcoursIds)) {
        insert.run(ueId, parcoursId)
      }
    })()
    return true
  } catch (error) {
    console.error("Error updating UE parcours:", error)
    return false
  }
}
