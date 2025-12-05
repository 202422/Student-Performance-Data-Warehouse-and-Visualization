"use client"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SessionMoyenneChart } from "@/components/session-moyenne-chart"

interface Cours {
  id: number
  cours: string
}

export function CoursSelectionDialog() {
  const [open, setOpen] = useState(true)
  const [coursList, setCoursList] = useState<Cours[]>([])
  const [selectedCours, setSelectedCours] = useState<string>("")
  const [selectedCoursName, setSelectedCoursName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    async function fetchCours() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/cours/")
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des cours")
        }
        const data = await res.json()
        setCoursList(data)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCours()
  }, [])

  const handleSelect = () => {
    if (selectedCours) {
      const cours = coursList.find((c) => c.id.toString() === selectedCours)
      if (cours) {
        setSelectedCoursName(cours.cours)
        setShowChart(true)
        setOpen(false)
      }
    }
  }

  if (showChart && selectedCours) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => {
              setShowChart(false)
              setSelectedCours("")
              setSelectedCoursName("")
              setOpen(true)
            }}
          >
            Changer de cours
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <SessionMoyenneChart coursId={selectedCours} coursName={selectedCoursName} />
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sélectionner un cours</DialogTitle>
          <DialogDescription>
            Choisissez un cours parmi la liste pour afficher ses statistiques
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 text-sm">
              Erreur lors du chargement des cours
            </p>
          ) : (
            <Select value={selectedCours} onValueChange={setSelectedCours}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un cours" />
              </SelectTrigger>
              <SelectContent>
                {coursList.map((cours) => (
                  <SelectItem key={cours.id} value={cours.id.toString()}>
                    {cours.cours}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSelect}
            disabled={!selectedCours || loading}
            className="w-full sm:w-auto"
          >
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

