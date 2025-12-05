"use client"
import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function fixEncoding(text: string) {
  try {
    return decodeURIComponent(escape(text))
  } catch {
    return text
  }
}

export function FiliereBarChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/stats/moyenne-par-filiere/")
        const json = await res.json()
        const formatted = json.map((item: any) => ({
          name: fixEncoding(item["Filiere"]),
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
  const minValue = Math.min(...values, 10)
  const maxValue = Math.max(...values, 12)
  const domain = [Math.max(minValue - 0.1, 0), maxValue + 0.1]

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Moyenne finale par filière</CardTitle>
        <CardDescription>Moyennes finales de chaque filière</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={domain} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: any) => [`${value.toFixed(2)}`, "Moyenne"]} contentStyle={{backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px"}} />
            <Legend />
            <Bar dataKey="moyenne" fill="var(--color-chart-3)" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="moyenne" position="top" formatter={(value: any) => value.toFixed(2)} style={{ fontSize: 12, fontWeight: "bold" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
