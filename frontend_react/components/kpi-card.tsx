"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface KPICardProps {
  title: string
  value: number | string
  unit?: string
  description?: string
}

export function KPICard({ title, value, unit, description }: KPICardProps) {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-primary">
              {value}
              {unit && <span className="text-2xl ml-1">{unit}</span>}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
