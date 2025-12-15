import { App } from "@/App"
import { ExercicesPage } from "@/features/exercices/ExercicesPage"
import { HomePage } from "@/features/home/HomePage"
import { ParcoursPage } from "@/features/parcours/ParcoursPage"
import { createBrowserRouter, RouterProvider } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "parcours",
        element: <ParcoursPage />,
      },
      {
        path: "exercices",
        element: <ExercicesPage />,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
