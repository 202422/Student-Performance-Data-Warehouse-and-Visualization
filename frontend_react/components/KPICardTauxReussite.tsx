"use client"

import { useEffect, useState } from "react"
import { KPICard } from "./kpi-card" // Assure-toi que le chemin correspond à l'emplacement de KPICard

export function KPICardTauxReussite() {
  const [taux, setTaux] = useState<number | null>(null)
  const [description, setDescription] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchTaux() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/stats/taux-reussite/")
        const data = await res.json()

        setTaux(data.taux_reussite)
        setDescription(`${data.etudiants_reussite} / ${data.total_etudiants} étudiants`)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTaux()
  }, [])

  if (loading) return <KPICard title="Taux de réussite global" value="..." description="Chargement..." />
  if (error) return <KPICard title="Taux de réussite global" value="?" description="Erreur" />

  return <KPICard title="Taux de réussite global" value={taux ?? 0} unit="%" description={description} />
}
