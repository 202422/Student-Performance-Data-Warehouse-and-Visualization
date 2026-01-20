"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { SidebarNav } from "@/components/sidebar-nav"
import { TopNavBar } from "@/components/top-nav-bar"

import ClasseSelectionDialog from "@/components/student/ClasseSelectionDialog"
import EtudiantSelectionDialog from "@/components/student/EtudiantSelectionDialog"

import { KPICardMoyenneFinale } from "@/components/student/kpi/KPICardMoyenneFinale"
import { KPICardClassement } from "@/components/student/kpi/KPICardClassement"

import { StudentProgressionChart } from "@/components/student/charts/StudentProgressionChart"


/* ================================
   DASHBOARD CONTENU ÉTUDIANT
================================ */
function StudentDashboardContent({
  etudiantId,
  classeId,
}: {
  etudiantId: string
  classeId: string
}) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Étudiant</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <KPICardMoyenneFinale etudiantId={etudiantId} />
        <KPICardClassement
          etudiantId={etudiantId}
          classeId={classeId}
        />
        <StudentProgressionChart etudiantId={etudiantId} />
      </div>
    </div>
  )
}

/* ================================
   PAGE PRINCIPALE
================================ */
export default function DashboardStudentPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [selectedClasse, setSelectedClasse] = useState("")
  const [selectedEtudiant, setSelectedEtudiant] = useState("")

  const resetDashboard = () => {
    setSelectedClasse("")
    setSelectedEtudiant("")
  }

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
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (userRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-bold">
        Accès non autorisé
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r
        transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarNav />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div
        className={`flex-1 flex flex-col transition-all
        ${sidebarOpen ? "sm:ml-64" : ""}`}
      >
        <TopNavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto p-6 space-y-6">

          {/* ======================
              ÉTAT 1 : choix classe
          ====================== */}
          {!selectedClasse && !selectedEtudiant && (
            <ClasseSelectionDialog
              onSelectClass={setSelectedClasse}
            />
          )}

          {/* ======================
              ÉTAT 2 : choix étudiant
          ====================== */}
          {selectedClasse && !selectedEtudiant && (
            <EtudiantSelectionDialog
              classeId={selectedClasse}
              onSelectEtudiant={setSelectedEtudiant}
            />
          )}

          {/* ======================
              ÉTAT 3 : dashboard
          ====================== */}
          {selectedClasse && selectedEtudiant && (
            <div className="space-y-6">

              <button
                onClick={resetDashboard}
                className="px-4 py-2 border rounded-md hover:bg-muted transition"
              >
                Changer d’étudiant
              </button>

              <StudentDashboardContent
                etudiantId={selectedEtudiant}
                classeId={selectedClasse}
              />
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
