import { Gauge, GraduationCap, House, type LucideIcon } from "lucide-react"

export type NavItem = {
  to: "/" | "/parcours" | "/exercices"
  label: string
  icon: LucideIcon
}

// Source unique pour la sidebar et le fil d'Ariane du header
export const navItems: NavItem[] = [
  { to: "/", label: "Accueil", icon: House },
  { to: "/parcours", label: "Parcours", icon: GraduationCap },
  { to: "/exercices", label: "Exercices Perf", icon: Gauge },
]
