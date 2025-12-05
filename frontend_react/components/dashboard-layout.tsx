"use client"

import { useState } from "react"
import { SidebarNav } from "./sidebar-nav"
import { TopNavBar } from "./top-nav-bar"
import { KPICardTauxReussite } from "@/components/KPICardTauxReussite"
import { TopCoursesChart } from "./top-courses-chart"
import { GradesDistributionChart } from "./grades-distribution-chart"

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
  className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
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
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out
          ${sidebarOpen ? "sm:ml-64" : "sm:ml-0"}`}
      >
        {/* Top Navigation */}
        <TopNavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
              <KPICardTauxReussite />
              {/* Ajouter ici d'autres KPI Cards dynamiques */}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <TopCoursesChart />
              <GradesDistributionChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
