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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

function fixEncoding(text: string) {
  try {
    return decodeURIComponent(escape(text))
  } catch {
    return text
  }
}

interface SessionMoyenneChartProps {
  coursId: string
  coursName: string
}

export function SessionMoyenneChart({ coursId, coursName }: SessionMoyenneChartProps) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/stats/moyenne-par-session/?cours=${coursId}`)
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des données")
        }
        const json = await res.json()

        const formatted = json.map((item: any) => ({
          name: fixEncoding(item["Session"]),
          moyenne: item["Moyenne finale"],
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
  }, [coursId])

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-center text-red-500">Erreur lors du chargement des données.</p>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-center text-muted-foreground">Aucune donnée disponible pour ce cours.</p>
        </CardContent>
      </Card>
    )
  }

  const values = data.map((d: any) => d.moyenne)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const domain = [Math.max(minValue - 0.1, 0), maxValue + 0.1]

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Moyennes par session - {coursName}</CardTitle>
        <CardDescription>Moyennes finales par session pour ce cours</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={domain} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
              formatter={(value: any) => [`${value.toFixed(2)}`, "Moyenne"]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="moyenne"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={{ fill: "var(--color-chart-2)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

