"use client"
import { useEffect, useState } from "react"
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function fixEncoding(text: string) {
  try {
    return decodeURIComponent(escape(text))
  } catch {
    return text
  }
}

export function ClasseBarChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/stats/moyenne-par-classe/")
        const json = await res.json()
        const formatted = json.map((item: any) => ({
          name: fixEncoding(item["Classe"]),
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
  }, [])

  if (loading) return <p className="text-center">Chargement...</p>
  if (error) return <p className="text-center text-red-500">Erreur lors du chargement des données.</p>

  const values = data.map((d: any) => d.moyenne)
  const maxValue = Math.max(...values, 12)

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Moyenne finale par classe</CardTitle>
        <CardDescription>Moyennes finales de chaque classe (Radar Chart)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius={110} data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, maxValue + 0.5]} tick={{ fontSize: 12 }}/>
            <Tooltip formatter={(value: any) => [`${value.toFixed(2)}`, "Moyenne"]} contentStyle={{backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px"}} />
            <Legend />
            <Radar name="Moyenne" dataKey="moyenne" stroke="var(--color-chart-4)" fill="var(--color-chart-4)" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
