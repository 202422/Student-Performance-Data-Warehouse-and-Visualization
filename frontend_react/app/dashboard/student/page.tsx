"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { SidebarNav } from "@/components/sidebar-nav"
import { TopNavBar } from "@/components/top-nav-bar"

// Import des nouveaux composants pour les sélecteurs
import ClasseSelectionDialog from "@/components/student/ClasseSelectionDialog"
import EtudiantSelectionDialog from "@/components/student/EtudiantSelectionDialog"

// Composant pour le contenu du dashboard étudiant
function StudentDashboardContent({ etudiantId }: { etudiantId: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Étudiant</h1>
      <p>Affichage des informations pour l'étudiant ID: {etudiantId}</p>
      {/* Ici tu pourras ajouter tes graphiques, KPIs, tableaux, etc */}
    </div>
  )
}

export default function DashboardStudentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Nouveaux états pour les sélecteurs
  const [selectedClasse, setSelectedClasse] = useState("")
  const [selectedEtudiant, setSelectedEtudiant] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const role = localStorage.getItem("user_role") || ""
    setUserRole(role)

    if (!token) {
      router.replace("/auth/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (userRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500 text-xl font-bold">
        Accès non autorisé
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarNav />
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${
          sidebarOpen ? "sm:ml-64" : "sm:ml-0"
        }`}
      >
        <TopNavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
          {/* Sélecteur de classe */}
          <ClasseSelectionDialog onSelectClass={setSelectedClasse} />

          {/* Sélecteur d'étudiant, affiché seulement si une classe est sélectionnée */}
          {selectedClasse && (
            <EtudiantSelectionDialog
              classeId={selectedClasse}
              onSelectEtudiant={setSelectedEtudiant}
            />
          )}

          {/* Dashboard étudiant, affiché seulement si un étudiant est sélectionné */}
          {selectedEtudiant && <StudentDashboardContent etudiantId={selectedEtudiant} />}
        </main>
      </div>
    </div>
  )
}
