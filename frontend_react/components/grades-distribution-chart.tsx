"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function GradesDistributionChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/stats/histogramme-notes/")
        const json = await res.json()

        const formatted = json.map((item) => ({
          grade: item.intervalle,
          count: item.count,
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
  }, [])

  if (loading) return <p className="text-center">Chargement...</p>
  if (error) return <p className="text-center text-red-500">Erreur lors du chargement des données.</p>

  // Mise en avant des petites différences → compression dynamique de l’axe Y
  const maxValue = Math.max(...data.map((d) => d.count))
  const minValue = Math.min(...data.map((d) => d.count))
  const dynamicMax = maxValue + (maxValue - minValue) * 0.15

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Histogramme des notes globales</CardTitle>
        <CardDescription>Distribution des notes de tous les étudiants</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

            <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, dynamicMax]} />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />

            {/* Barres colorées dynamiquement pour mettre en exergue les différences */}
            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              fill="var(--color-chart-2)"
            >
              {/* Label au dessus des barres */}
              <LabelList dataKey="count" position="top" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
