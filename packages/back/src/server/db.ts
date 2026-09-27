import { Database } from "bun:sqlite"
import { fileURLToPath } from "node:url"

export const db = new Database(
  process.env.DATABASE_PATH ?? fileURLToPath(new URL("../../data.db", import.meta.url))
)
// SQLite must enforce the relations declared below.
db.run("PRAGMA foreign_keys = ON")

export const initDatabase = () => {
  db.run(`
  CREATE TABLE IF NOT EXISTS parcours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomParcours TEXT NOT NULL,
    anneeFormation INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

  db.run(`
  CREATE TABLE IF NOT EXISTS etudiants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    parcours_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parcours_id) REFERENCES parcours(id) ON DELETE SET NULL
  )
`)

  db.run(`
  CREATE TABLE IF NOT EXISTS ues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroUe TEXT NOT NULL UNIQUE,
    intitule TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

  db.run(`
  CREATE TABLE IF NOT EXISTS ue_parcours (
    ue_id INTEGER NOT NULL,
    parcours_id INTEGER NOT NULL,
    PRIMARY KEY (ue_id, parcours_id),
    FOREIGN KEY (ue_id) REFERENCES ues(id) ON DELETE CASCADE,
    FOREIGN KEY (parcours_id) REFERENCES parcours(id) ON DELETE CASCADE
  )
`)
}
