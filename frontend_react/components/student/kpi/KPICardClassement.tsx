"use client"

import { useEffect, useState } from "react"
import { KPICard } from "@/components/kpi-card"

interface Props {
  etudiantId: string
  classeId: string
}

export function KPICardClassement({ etudiantId, classeId }: Props) {
  const [rang, setRang] = useState<number | null>(null)
  const [effectif, setEffectif] = useState<number | null>(null)
  const [classe, setClasse] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!etudiantId || !classeId) return

    async function fetchClassement() {
      setLoading(true)
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/classement-etudiant/?etudiant=${etudiantId}&classe=${classeId}`
        )
        if (!res.ok) throw new Error("Erreur API")
        const data = await res.json()

        setRang(data.rang)
        setEffectif(data.effectif_classe)
        setClasse(data.classe)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchClassement()
  }, [etudiantId, classeId])

  if (loading)
    return <KPICard title="Classement" value="..." description="Chargement" />

  if (error)
    return <KPICard title="Classement" value="?" description="Erreur" />

  return (
    <KPICard
      title="Classement"
      value={`${rang} / ${effectif}`}
      description={`Classe ${classe}`}
    />
  )
}
