"use client"

import { KPICardMoyenneFinale } from "./kpi/KPICardMoyenneFinale"
import { KPICardClassement } from "./kpi/KPICardClassement"

interface Props {
  etudiantId: string
  classeId: string
}

export function StudentDashboardContent({ etudiantId, classeId }: Props) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Étudiant</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICardMoyenneFinale etudiantId={etudiantId} />
        <KPICardClassement etudiantId={etudiantId} classeId={classeId} />
      </div>

      {/* Ici tu pourras ajouter tes graphiques par cours ou par session */}
      <div className="mt-6">
        {/* Graphiques par cours, histogrammes, etc. */}
      </div>
    </div>
  )
}
