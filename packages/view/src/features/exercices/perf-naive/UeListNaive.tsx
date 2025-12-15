/**
 * EXERCICE PERFORMANCE - VERSION NAÏVE (NON OPTIMISÉE)
 *
 * Ce composant contient volontairement des problèmes de performance.
 * Les étudiants doivent identifier et corriger ces problèmes.
 *
 * 🐛 PROBLÈMES À TROUVER :
 * 1. Pas de virtualisation (tous les éléments sont rendus)
 * 2. Filtrage recalculé à chaque render
 * 3. Statistiques recalculées à chaque render
 * 4. Fonctions recréées à chaque render (casse memo)
 * 5. Composant UeRow non mémoïsé
 */

import { useState, useEffect } from "react"

// Types
interface Ue {
  id: number
  numeroUe: string
  intitule: string
  ects: number
  departement: string
}

// Génération des données de test (côté client pour l'exercice)
function generateUes(count: number): Ue[] {
  const departements = [
    "Informatique",
    "Mathématiques",
    "Physique",
    "Chimie",
    "Biologie",
  ]
  const prefixes = [
    "Introduction à",
    "Fondamentaux de",
    "Approfondissement en",
    "Projet de",
    "Séminaire de",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    numeroUe: `UE${String(i + 1).padStart(5, "0")}`,
    intitule: `${prefixes[i % prefixes.length]} ${
      departements[i % departements.length]
    } - Niveau ${Math.floor(i / 25) + 1}`,
    ects: (i % 6) + 1,
    departement: departements[i % departements.length],
  }))
}

// Composant ligne (NON optimisé - pas de memo)
function UeRow({
  ue,
  isSelected,
  onSelect,
  onDelete,
}: {
  ue: Ue
  isSelected: boolean
  onSelect: (id: number) => void
  onDelete: (id: number) => void
}) {
  // 👀 Observer ce log dans la console
  console.log(`🔴 Rendering UeRow ${ue.id}`)

  return (
    <div
      className={`flex items-center px-4 py-2 border-b ${
        isSelected ? "bg-blue-100" : "bg-white hover:bg-gray-50"
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(ue.id)}
        className="mr-4 w-4 h-4"
      />
      <span className="w-28 font-mono text-sm text-gray-500">
        {ue.numeroUe}
      </span>
      <span className="flex-1 truncate">{ue.intitule}</span>
      <span className="w-20 text-center text-sm">{ue.ects} ECTS</span>
      <span className="w-32 text-sm text-gray-500">{ue.departement}</span>
      <button
        onClick={() => onDelete(ue.id)}
        className="ml-4 px-2 py-1 text-red-500 hover:bg-red-50 rounded"
      >
        🗑️
      </button>
    </div>
  )
}

export function UeListNaive() {
  const [ues, setUes] = useState<Ue[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [search, setSearch] = useState("")
  const [minEcts, setMinEcts] = useState(0)
  const [renderCount, setRenderCount] = useState(0)

  // Charger les données au montage
  // 🐛 PROBLÈME 0 : On charge 1000 UEs sans virtualisation = LENT !
  useEffect(() => {
    console.log("📦 Génération de 1 000 UEs (sans virtualisation)...")
    setUes(generateUes(1000))
  }, [])

  // 🐛 PROBLÈME 1 : Recalculé à CHAQUE render (même si ues/search/minEcts n'ont pas changé)
  const filteredUes = ues.filter((ue) => {
    const matchSearch =
      ue.intitule.toLowerCase().includes(search.toLowerCase()) ||
      ue.numeroUe.toLowerCase().includes(search.toLowerCase())
    const matchEcts = ue.ects >= minEcts
    return matchSearch && matchEcts
  })
  console.log("🔄 Filtrage recalculé")

  // 🐛 PROBLÈME 2 : Statistiques recalculées à chaque render
  const stats = {
    total: filteredUes.length,
    selected: selectedIds.size,
    totalEcts: filteredUes.reduce((sum, ue) => sum + ue.ects, 0),
    avgEcts:
      filteredUes.length > 0
        ? filteredUes.reduce((sum, ue) => sum + ue.ects, 0) / filteredUes.length
        : 0,
    byDepartement: filteredUes.reduce((acc, ue) => {
      acc[ue.departement] = (acc[ue.departement] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  }
  console.log("🔄 Stats recalculées")

  // 🐛 PROBLÈME 3 : Nouvelles fonctions créées à chaque render
  // Cela casse l'optimisation de memo() car les props changent à chaque fois
  const handleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleDelete = (id: number) => {
    if (confirm(`Supprimer l'UE ${id} ?`)) {
      setUes((prev) => prev.filter((ue) => ue.id !== id))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredUes.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredUes.map((ue) => ue.id)))
    }
  }

  // Forcer un re-render pour démontrer le problème
  const forceRerender = () => {
    setRenderCount((c) => c + 1)
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">
        📊 Liste des UEs{" "}
        <span className="text-red-500">(Version NON optimisée)</span>
      </h1>

      {/* Panneau de debug */}
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="font-bold text-red-800">🔍 Zone de debug</p>
        <p className="text-sm text-red-600">
          Ouvrez la console (F12) et observez les logs
        </p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={forceRerender}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Forcer un re-render ({renderCount})
          </button>
        </div>
        <p className="text-xs mt-2 text-red-700">
          💡 Cliquez et regardez combien de UeRow sont re-rendues dans la
          console
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une UE..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={minEcts}
          onChange={(e) => setMinEcts(Number(e.target.value))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value={0}>Tous les ECTS</option>
          <option value={1}>≥ 1 ECTS</option>
          <option value={3}>≥ 3 ECTS</option>
          <option value={5}>≥ 5 ECTS</option>
        </select>
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {selectedIds.size === filteredUes.length
            ? "Désélectionner tout"
            : "Tout sélectionner"}
        </button>
      </div>

      {/* Statistiques */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg grid grid-cols-5 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500">UEs affichées</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">{stats.selected}</p>
          <p className="text-sm text-gray-500">Sélectionnées</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {stats.totalEcts.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">ECTS total</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{stats.avgEcts.toFixed(1)}</p>
          <p className="text-sm text-gray-500">ECTS moyen</p>
        </div>
        <div className="text-left text-xs">
          {Object.entries(stats.byDepartement)
            .slice(0, 5)
            .map(([dept, count]) => (
              <p key={dept} className="truncate">
                {dept}: {count}
              </p>
            ))}
        </div>
      </div>

      {/* 🐛 PROBLÈME : Liste NON virtualisée - tous les éléments sont dans le DOM */}
      <div className="flex-1 border rounded-lg overflow-auto min-h-[400px] max-h-[500px]">
        {filteredUes.length > 0 ? (
          <div>
            {filteredUes.map((ue) => (
              <UeRow
                key={ue.id}
                ue={ue}
                isSelected={selectedIds.has(ue.id)}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {ues.length === 0 ? "Chargement..." : "Aucune UE trouvée"}
          </div>
        )}
      </div>

      {/* Questions pour les étudiants */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="font-bold text-yellow-800">📝 Questions à résoudre :</p>
        <ol className="list-decimal ml-4 mt-2 text-sm text-yellow-700 space-y-1">
          <li>
            Ouvrez les DevTools (F12) → Elements. Combien de div sont dans le
            DOM pour la liste ?
          </li>
          <li>
            Cliquez sur "Forcer un re-render" et observez la console. Combien de
            lignes sont re-rendues ?
          </li>
          <li>
            Tapez une lettre dans la recherche. Pourquoi le filtrage est-il
            recalculé ?
          </li>
          <li>
            Cochez une checkbox. Pourquoi TOUTES les lignes sont re-rendues ?
          </li>
          <li>Identifiez les 5 problèmes de performance dans ce code.</li>
        </ol>
      </div>
    </div>
  )
}
