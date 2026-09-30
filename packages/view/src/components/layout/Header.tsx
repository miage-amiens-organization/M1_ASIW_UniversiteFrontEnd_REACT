import { useLocation } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { navItems } from "./navigation"

export function Header() {
  const { pathname } = useLocation()

  // Entrée de menu correspondant à l'URL courante ("/" uniquement en exact)
  const current = navItems.find((item) =>
    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)
  )

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-zinc-200 bg-white px-6">
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-zinc-500">UPJV</span>
        {current && (
          <>
            <ChevronRight className="size-4 text-zinc-400" />
            <span className="font-medium text-zinc-900">{current.label}</span>
          </>
        )}
      </nav>
    </header>
  )
}
