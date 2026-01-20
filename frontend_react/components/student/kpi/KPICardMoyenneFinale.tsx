"use client"

import { useEffect, useState } from "react"
import { KPICard } from "@/components/kpi-card"

interface Props {
  etudiantId: string
}

export function KPICardMoyenneFinale({ etudiantId }: Props) {
  const [moyenne, setMoyenne] = useState<number | null>(null)
  const [nombreCours, setNombreCours] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchMoyenne() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/moyenne-etudiant/?etudiant=${etudiantId}`
        )
        const data = await res.json()
        setMoyenne(data.moyenne_finale)
        setNombreCours(data.nombre_cours)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMoyenne()
  }, [etudiantId])

  if (loading)
    return (
      <KPICard
        title="Moyenne finale"
        value="..."
        description="Chargement"
      />
    )

  if (error)
    return (
      <KPICard
        title="Moyenne finale"
        value="?"
        description="Erreur"
      />
    )

  return (
    <KPICard
      title="Moyenne finale"
      value={moyenne ?? 0}
      unit="/20"
      description={`Nombre de cours : ${nombreCours ?? 0}`}
    />
  )
}
