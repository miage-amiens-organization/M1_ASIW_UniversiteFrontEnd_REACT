import { useState } from "react"
import { PageContainer, PageHeader } from "@/components/layout/Page"
import { UeListNaive } from "./perf-naive/UeListNaive"

type TabType = "naive" | "optimized" | "instructions"

export function ExercicesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("instructions")

  return (
    <PageContainer className="flex h-full flex-col">
      <PageHeader
        title="Exercice : Optimisation des performances React"
        description="Comparez une version naïve et une version optimisée d'une liste virtualisée de 10 000 éléments."
      />

      <div className="mb-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("instructions")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "instructions"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📋 Instructions
          </button>
          <button
            onClick={() => setActiveTab("naive")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "naive"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🐌 Version Naïve
          </button>
          <button
            onClick={() => setActiveTab("optimized")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "optimized"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🚀 Version Optimisée
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-auto">
        {activeTab === "instructions" && <Instructions />}
        {activeTab === "naive" && <UeListNaive />}
        {activeTab === "optimized" && <p>TODO</p>}
      </div>
    </PageContainer>
  )
}

function Instructions() {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Objectifs */}
      <section className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🎯 Objectifs de l'exercice
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Comprendre quand et pourquoi un composant React re-render
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Savoir utiliser{" "}
            <code className="bg-gray-100 px-1 rounded">useMemo</code> pour
            mémoriser des calculs coûteux
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Savoir utiliser{" "}
            <code className="bg-gray-100 px-1 rounded">useCallback</code> pour
            mémoriser des fonctions
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Comprendre le rôle de{" "}
            <code className="bg-gray-100 px-1 rounded">React.memo()</code> pour
            éviter les re-renders
          </li>
        </ul>
      </section>

      {/* Étape 1 */}
      <section className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h2 className="text-xl font-bold mb-4 text-red-800">
          📝 Étape 1 : Observer les problèmes (Version Naïve)
        </h2>
        <ol className="list-decimal ml-4 space-y-3 text-gray-700">
          <li>
            <strong>Ouvrez la console</strong> du navigateur (F12 → Console)
          </li>
          <li>
            Allez sur l'onglet <strong>"🐌 Version Naïve"</strong>
          </li>
          <li>
            <strong>Cliquez sur "Forcer un re-render"</strong> et observez :
            <ul className="list-disc ml-4 mt-1 text-sm">
              <li>Combien de lignes "🔴 Rendering UeRow" apparaissent ?</li>
              <li>
                Est-ce normal que toutes les lignes visibles soient re-rendues ?
              </li>
            </ul>
          </li>
          <li>
            <strong>Tapez une lettre</strong> dans le champ de recherche et
            observez :
            <ul className="list-disc ml-4 mt-1 text-sm">
              <li>
                Le message "🔄 Filtrage recalculé" apparaît-il à chaque frappe ?
              </li>
              <li>Le message "🔄 Stats recalculées" apparaît-il aussi ?</li>
            </ul>
          </li>
          <li>
            <strong>Cochez une checkbox</strong> et observez pourquoi TOUTES les
            lignes sont re-rendues
          </li>
        </ol>
      </section>

      {/* Étape 2 */}
      <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-bold mb-4 text-yellow-800">
          🔍 Étape 2 : Identifier les 4 problèmes
        </h2>
        <p className="mb-4 text-gray-700">
          Dans le code de{" "}
          <code className="bg-yellow-100 px-1 rounded">UeListNaive.tsx</code>,
          identifiez :
        </p>
        <div className="space-y-4">
          <div className="p-3 bg-white rounded border">
            <p className="font-bold text-red-600">🐛 Problème 1 : Filtrage</p>
            <p className="text-sm text-gray-600">
              Le tableau <code>filteredUes</code> est recalculé à chaque render,
              même si
              <code>ues</code>, <code>search</code> et <code>minEcts</code>{" "}
              n'ont pas changé.
            </p>
          </div>
          <div className="p-3 bg-white rounded border">
            <p className="font-bold text-red-600">
              🐛 Problème 2 : Statistiques
            </p>
            <p className="text-sm text-gray-600">
              L'objet <code>stats</code> avec ses <code>reduce()</code> est
              recalculé à chaque render.
            </p>
          </div>
          <div className="p-3 bg-white rounded border">
            <p className="font-bold text-red-600">🐛 Problème 3 : Fonctions</p>
            <p className="text-sm text-gray-600">
              <code>handleSelect</code> et <code>handleDelete</code> sont de
              nouvelles fonctions à chaque render, ce qui casse l'optimisation
              de <code>memo()</code>.
            </p>
          </div>
          <div className="p-3 bg-white rounded border">
            <p className="font-bold text-red-600">
              🐛 Problème 4 : Composant UeRow
            </p>
            <p className="text-sm text-gray-600">
              Le composant <code>UeRow</code> n'est pas enveloppé dans{" "}
              <code>memo()</code>, donc il re-render même si ses props n'ont pas
              changé.
            </p>
          </div>
        </div>
      </section>

      {/* Tableau récapitulatif */}
      <section className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4">📊 Récapitulatif</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Problème</th>
                <th className="p-2 text-left">Symptôme</th>
                <th className="p-2 text-left">Solution</th>
                <th className="p-2 text-left">Quand l'utiliser</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">Calcul coûteux</td>
                <td className="p-2">filter/map/reduce à chaque render</td>
                <td className="p-2">
                  <code className="bg-blue-100 px-1 rounded">useMemo</code>
                </td>
                <td className="p-2">Transformations sur des listes</td>
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="p-2">Nouvelles fonctions</td>
                <td className="p-2">memo() inefficace</td>
                <td className="p-2">
                  <code className="bg-blue-100 px-1 rounded">useCallback</code>
                </td>
                <td className="p-2">Fonctions passées en props</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Re-renders inutiles</td>
                <td className="p-2">Composant re-render sans changement</td>
                <td className="p-2">
                  <code className="bg-blue-100 px-1 rounded">memo()</code>
                </td>
                <td className="p-2">Composants dans des listes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
