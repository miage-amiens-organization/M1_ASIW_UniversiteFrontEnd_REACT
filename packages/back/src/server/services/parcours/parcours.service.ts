import { db } from "../../db";
import type {
  Parcours,
  CreateParcoursPayload,
  UpdateParcoursPayload,
  ParcoursWithInscrits,
} from "../../models/Parcours";

export async function createParcours(
  payload: CreateParcoursPayload
): Promise<Parcours | null> {
  try {
    const anneeFormation = payload.anneeFormation ?? 1;
    const stmt = db.prepare(
      "INSERT INTO parcours (nomParcours, anneeFormation) VALUES (?, ?)"
    );
    const result = stmt.run(payload.nomParcours, anneeFormation);

    if (result) {
      return {
        id: result.lastInsertRowid as number,
        nomParcours: payload.nomParcours,
        anneeFormation,
        created_at: new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error creating parcours:", error);
    return null;
  }
}

export function getParcoursById(id: number): Parcours | null {
  const stmt = db.prepare(
    "SELECT id, nomParcours, anneeFormation, created_at FROM parcours WHERE id = ?"
  );
  return (stmt.get(id) as Parcours) || null;
}

export function getParcoursWithInscrits(
  id: number
): ParcoursWithInscrits | null {
  const parcours = getParcoursById(id);
  if (!parcours) return null;

  const stmt = db.prepare(
    "SELECT id, nom, prenom, email FROM etudiants WHERE parcours_id = ? ORDER BY nom, prenom"
  );
  const inscrits = (stmt.all(id) as Array<{
    id: number;
    nom: string;
    prenom: string;
    email: string;
  }>) || [];

  return {
    ...parcours,
    inscrits,
  };
}

export function getAllParcours(): Parcours[] {
  const stmt = db.prepare(
    "SELECT id, nomParcours, anneeFormation, created_at FROM parcours ORDER BY anneeFormation DESC, nomParcours"
  );
  return (stmt.all() as Parcours[]) || [];
}

export function updateParcours(
  id: number,
  payload: UpdateParcoursPayload
): Parcours | null {
  try {
    const parcours = getParcoursById(id);
    if (!parcours) {
      return null;
    }

    const nomParcours = payload.nomParcours ?? parcours.nomParcours;
    const anneeFormation =
      payload.anneeFormation !== undefined
        ? payload.anneeFormation
        : parcours.anneeFormation;

    const stmt = db.prepare(
      "UPDATE parcours SET nomParcours = ?, anneeFormation = ? WHERE id = ?"
    );
    stmt.run(nomParcours, anneeFormation, id);

    return {
      id,
      nomParcours,
      anneeFormation,
      created_at: parcours.created_at,
    };
  } catch (error) {
    console.error("Error updating parcours:", error);
    return null;
  }
}

export function deleteParcours(id: number): boolean {
  try {
    const stmt = db.prepare("DELETE FROM parcours WHERE id = ?");
    const result = stmt.run(id);
    return (result.changes as number) > 0;
  } catch (error) {
    console.error("Error deleting parcours:", error);
    return false;
  }
}

export function getEtudiantsInParcours(parcoursId: number): Array<{
  id: number;
  nom: string;
  prenom: string;
  email: string;
}> {
  const stmt = db.prepare(
    "SELECT id, nom, prenom, email FROM etudiants WHERE parcours_id = ? ORDER BY nom, prenom"
  );
  return (stmt.all(parcoursId) as Array<{
    id: number;
    nom: string;
    prenom: string;
    email: string;
  }>) || [];
}
