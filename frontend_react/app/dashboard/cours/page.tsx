"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { CoursSelectionDialog } from "@/components/cours-selection-dialog"
import { SidebarNav } from "@/components/sidebar-nav"
import { TopNavBar } from "@/components/top-nav-bar"

export default function DashboardCoursPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarNav />
      </aside>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${sidebarOpen ? "sm:ml-64" : "sm:ml-0"}`}>
        {/* Top Navigation */}
        <TopNavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <CoursSelectionDialog />
        </main>
      </div>
    </div>
  )
}

