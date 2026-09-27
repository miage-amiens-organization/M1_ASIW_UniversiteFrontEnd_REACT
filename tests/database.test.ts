import { afterAll, beforeEach, expect, spyOn, test } from "bun:test"

// Set before importing services: never open or mutate the course database.
process.env.DATABASE_PATH = ":memory:"
const { db, initDatabase } = await import("../packages/back/src/server/db")
const { updateUeParcours } = await import("../packages/back/src/server/services/ue/ue.service")
const { deleteParcours } = await import("../packages/back/src/server/services/parcours/parcours.service")

beforeEach(() => {
  initDatabase()
  db.run("DELETE FROM ue_parcours")
  db.run("DELETE FROM etudiants")
  db.run("DELETE FROM ues")
  db.run("DELETE FROM parcours")
  db.run("INSERT INTO parcours (id, nomParcours) VALUES (1, 'MIAGE'), (2, 'Info')")
  db.run("INSERT INTO ues (id, numeroUe, intitule) VALUES (1, 'WEB', 'Web')")
  db.run("INSERT INTO ue_parcours VALUES (1, 1)")
})
afterAll(() => db.close())

test("an invalid association preserves all previous links", () => {
  const log = spyOn(console, "error").mockImplementation(() => {})
  try {
    expect(updateUeParcours(1, [2, 999])).toBe(false)
    expect(db.query("SELECT parcours_id FROM ue_parcours WHERE ue_id = 1").all())
      .toEqual([{ parcours_id: 1 }])
  } finally { log.mockRestore() }
})

test("replacement deduplicates parcours and accepts clearing all links", () => {
  expect(updateUeParcours(1, [2, 2])).toBe(true)
  expect(db.query("SELECT parcours_id FROM ue_parcours WHERE ue_id = 1").all())
    .toEqual([{ parcours_id: 2 }])
  expect(updateUeParcours(1, [])).toBe(true)
  expect(db.query("SELECT * FROM ue_parcours").all()).toEqual([])
})

test("deleting a parcours clears associations and detaches students", () => {
  db.run("INSERT INTO etudiants (nom, prenom, email, parcours_id) VALUES ('Test', 'Demo', 'demo@example.test', 1)")
  expect(deleteParcours(1)).toBe(true)
  expect(db.query("SELECT * FROM ue_parcours").all()).toEqual([])
  expect(db.query("SELECT parcours_id FROM etudiants").get()).toEqual({ parcours_id: null })
})
