import { Gauge, GraduationCap, House, type LucideIcon } from "lucide-react"
import { features } from "@/config/features"

export type NavItem = {
  to: "/" | "/parcours" | "/exercices"
  label: string
  icon: LucideIcon
  enabled?: boolean
}

// Source unique pour la sidebar et le fil d'Ariane du header
const allNavItems: NavItem[] = [
  { to: "/", label: "Accueil", icon: House },
  { to: "/parcours", label: "Parcours", icon: GraduationCap },
  {
    to: "/exercices",
    label: "Exercices Perf",
    icon: Gauge,
    enabled: features.exercicesPerf,
  },
]

export const navItems = allNavItems.filter((item) => item.enabled !== false)
