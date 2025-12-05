"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function fixEncoding(text) {
  try {
    return decodeURIComponent(escape(text))
  } catch {
    return text
  }
}

export function TopCoursesChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/stats/moyenne-par-cours/")
        const json = await res.json()

        const formatted = json.slice(0, 5).map((item) => ({
          name: fixEncoding(item["Cours"]),
          performance: item["Moyenne finale"],
        }))

        // Trouver le max pour mettre en surbrillance
        const maxValue = Math.max(...formatted.map((d) => d.performance))

        // Ajouter un champ "highlight" pour colorer la meilleure barre
        const highlighted = formatted.map((item) => ({
          ...item,
          isTop: item.performance === maxValue,
        }))

        setData(highlighted)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-center">Chargement...</p>
  if (error) return <p className="text-center text-red-500">Erreur lors du chargement des données.</p>

  // Calcul du domaine Y resserré
  const values = data.map((d) => d.performance)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  const domain = [minValue - 0.1, maxValue + 0.1]

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top 5 cours les plus performants</CardTitle>
        <CardDescription>Moyenne finale par cours</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={domain} tick={{ fontSize: 12 }} />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
              formatter={(value) => [`${value.toFixed(2)}`, "Moyenne"]}
            />

            <Legend />

            <Bar
              dataKey="performance"
              radius={[8, 8, 0, 0]}
              // Couleur différente pour la meilleure barre
              fill={"var(--color-chart-1)"}
            >
              <LabelList
                dataKey="performance"
                position="top"
                formatter={(value) => value.toFixed(2)}
                style={{ fontSize: 12, fontWeight: "bold" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
