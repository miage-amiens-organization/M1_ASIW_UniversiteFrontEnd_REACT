import { cn } from "@/utils/cn"
import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { navItems } from "./navigation"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-zinc-200 bg-white transition-[width] duration-200",
        isOpen ? "w-60" : "w-16"
      )}
    >
      {/* Marque */}
      <div className="flex h-14 items-center gap-3 border-b border-zinc-200 px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white">
          U
        </div>
        {isOpen && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-zinc-900">UPJV</p>
            <p className="truncate text-xs text-zinc-500">Parcours & notes</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {isOpen && (
          <p className="px-2 pb-2 text-xs font-medium text-zinc-400">
            Navigation
          </p>
        )}
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            // Le lien "/" ne doit être actif que sur la page d'accueil exacte
            activeOptions={{ exact: item.to === "/" }}
            title={isOpen ? undefined : item.label}
            className={cn(
              "flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium text-zinc-600 transition-colors",
              "hover:bg-zinc-100 hover:text-zinc-900",
              "data-[status=active]:bg-zinc-100 data-[status=active]:text-zinc-900",
              !isOpen && "justify-center px-0"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {isOpen && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Pied de sidebar */}
      <div className="border-t border-zinc-200 p-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "Réduire le menu" : "Déplier le menu"}
          className={cn(
            "flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900",
            !isOpen && "justify-center px-0"
          )}
        >
          {isOpen ? (
            <PanelLeftClose className="size-4 shrink-0" />
          ) : (
            <PanelLeftOpen className="size-4 shrink-0" />
          )}
          {isOpen && <span>Réduire</span>}
        </button>
      </div>
    </aside>
  )
}
