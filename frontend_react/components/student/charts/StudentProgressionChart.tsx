"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Spinner } from "@/components/ui/spinner"

/* Corrige les problèmes d'encodage éventuels */
function fixEncoding(text: string) {
  try {
    return decodeURIComponent(escape(text))
  } catch {
    return text
  }
}

interface Props {
  etudiantId: string
}

export function StudentProgressionChart({ etudiantId }: Props) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/progression-sessions/?etudiant=${etudiantId}`
        )

        if (!res.ok) {
          throw new Error("Erreur API")
        }

        const json = await res.json()

        const formatted = json.map((item: any) => ({
          session: fixEncoding(item["Session"]),
          moyenne: item["Moyenne étudiant"],
        }))

        setData(formatted)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [etudiantId])

  /* =============================
        LOADING
  ============================== */
  if (loading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </CardContent>
      </Card>
    )
  }

  /* =============================
        ERROR
  ============================== */
  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex justify-center py-12">
          <p className="text-red-500">
            Erreur lors du chargement des données
          </p>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex justify-center py-12">
          <p className="text-muted-foreground">
            Aucune donnée disponible pour cet étudiant
          </p>
        </CardContent>
      </Card>
    )
  }

  /* =============================
        SCALE AUTO
  ============================== */
  const values = data.map((d) => d.moyenne)
  const min = Math.min(...values)
  const max = Math.max(...values)

  const domain = [
    Math.max(min - 0.2, 0),
    Math.min(max + 0.2, 20),
  ]

  /* =============================
        CHART
  ============================== */
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Progression des notes par session
        </CardTitle>
        <CardDescription>
          Évolution de la moyenne générale de l’étudiant
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
            />

            <XAxis
              dataKey="session"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              domain={domain}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
              formatter={(value: any) => {
  const num = Number(value)
  if (isNaN(num)) return ["N/A", "Moyenne"]
  return [num.toFixed(2), "Moyenne"]
}}

            />

            <Legend />

            <Line
              type="monotone"
              dataKey="moyenne"
              name="Moyenne"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
