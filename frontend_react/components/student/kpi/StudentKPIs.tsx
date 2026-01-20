"use client"

import { KPICardMoyenneFinale } from "./KPICardMoyenneFinale"
import { KPICardClassement } from "./KPICardClassement"

interface Props {
  etudiantId: string
  classeId: string
}

export function StudentKPIs({ etudiantId, classeId }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Moyenne finale */}
      <KPICardMoyenneFinale etudiantId={etudiantId} />

      {/* Classement dans la classe */}
      <KPICardClassement etudiantId={etudiantId} classeId={classeId} />
    </div>
  )
}
