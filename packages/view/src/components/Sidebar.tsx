import { cn } from "@/utils/cn"
import { useState } from "react"
import { Link, useLocation } from "react-router"

export function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { path: "/", label: "Accueil", icon: "🏠" },
    { path: "/parcours", label: "Parcours", icon: "📚" },
    { path: "/exercices", label: "Exercices Perf", icon: "🚀" },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 shadow-md flex flex-col h-screen transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div
        className={cn(
          "p-4 border-b border-gray-200 flex items-center",
          isOpen ? "justify-between" : "justify-center"
        )}
      >
        <h1
          className={cn(
            isOpen ? "block" : "hidden",
            "text-xl font-bold text-gray-800"
          )}
        >
          UPJV
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Toggle sidebar"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            <span className={`${isOpen ? "block" : "hidden"}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
