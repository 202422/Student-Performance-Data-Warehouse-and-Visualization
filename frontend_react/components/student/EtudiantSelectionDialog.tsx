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

interface Etudiant {
  id: number
  nom: string
}

interface Props {
  classeId: string
  onSelectEtudiant: (etudiantId: string) => void
}

export default function EtudiantSelectionDialog({ classeId, onSelectEtudiant }: Props) {
  const [open, setOpen] = useState(true)
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [selectedEtudiant, setSelectedEtudiant] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchEtudiants() {
      if (!classeId) return
      setLoading(true)
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/etudiants/?classe=${classeId}`)
        if (!res.ok) throw new Error("Erreur lors de la récupération des étudiants")
        const data = await res.json()
        setEtudiants(data)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchEtudiants()
  }, [classeId])

  const handleSelect = () => {
    if (selectedEtudiant) {
      onSelectEtudiant(selectedEtudiant)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sélectionner un étudiant</DialogTitle>
          <DialogDescription>Choisissez un étudiant pour afficher son dashboard</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 text-sm">Erreur lors du chargement des étudiants</p>
          ) : (
            <Select value={selectedEtudiant} onValueChange={setSelectedEtudiant}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {etudiants.map((e) => (
                  <SelectItem key={e.id} value={e.id.toString()}>
                    {e.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSelect} disabled={!selectedEtudiant || loading} className="w-full sm:w-auto">
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
