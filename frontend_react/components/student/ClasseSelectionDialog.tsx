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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface Classe {
  id: number
  classe: string
}

interface Props {
  onSelectClass: (classeId: string) => void
}

export default function ClasseSelectionDialog({ onSelectClass }: Props) {
  const [open, setOpen] = useState(true)
  const [classes, setClasses] = useState<Classe[]>([])
  const [selectedClasse, setSelectedClasse] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/classes/")
        if (!res.ok) throw new Error("Erreur lors de la récupération des classes")
        const data = await res.json()
        setClasses(data)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const handleSelect = () => {
    if (selectedClasse) {
      onSelectClass(selectedClasse)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sélectionner une classe</DialogTitle>
          <DialogDescription>Choisissez une classe pour afficher les étudiants correspondants</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 text-sm">Erreur lors du chargement des classes</p>
          ) : (
            <Select value={selectedClasse} onValueChange={setSelectedClasse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.classe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSelect} disabled={!selectedClasse || loading} className="w-full sm:w-auto">
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


