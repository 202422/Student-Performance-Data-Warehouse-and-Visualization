from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Sum
from .models import FaitNotes, DimEtudiant, DimCours, DimFiliere
from .utils import get_notes_grouped

class MoyenneParCours(APIView):
    def get(self, request):

        notes = get_notes_grouped()

        # regroupement par cours
        notes_par_cours = {}
        for item in notes:
            cours_id = item["id_cours_fk"]

            notes_par_cours.setdefault(cours_id, []).append(item["note_finale"])

        resultats = []

        for cours_id, notes_list in notes_par_cours.items():
            # récupérer le nom du cours
            cours = DimCours.objects.get(pk=cours_id)

            moyenne = sum(notes_list) / len(notes_list)

            resultats.append({
                "Cours": cours.cours,   # nom du cours
                "Moyenne finale": round(moyenne, 2)
            })

            resultats = sorted(resultats, key=lambda x: x["Moyenne finale"], reverse=True)

        return Response(resultats)

class TauxReussite(APIView):
    def get(self, request):

        notes_finales = get_notes_grouped()

        # Transformer en structure { etudiant_id : [liste de notes_finales] }
        notes_par_etudiant = {}
        for item in notes_finales:
            etu = item["id_etudiant_fk"]
            notes_par_etudiant.setdefault(etu, []).append(item["note_finale"])

        # Étape 2 : Calculer la moyenne de chaque étudiant
        moyennes = []
        for etu, notes in notes_par_etudiant.items():
            moyennes.append(sum(notes) / len(notes))

        total_etudiants = len(moyennes)
        if total_etudiants == 0:
            return Response({"taux_reussite": 0})

        # Étape 3 : Compter ceux qui ont >= 14/20
        reussites = sum(1 for m in moyennes if m >= 14)

        taux = (reussites / total_etudiants) * 100

        return Response({
            "taux_reussite": round(taux, 2),
            "total_etudiants": total_etudiants,
            "etudiants_reussite": reussites
        })
    
class PoidsMoyenParActivite(APIView):
    def get(self, request):
        data = (
            FaitNotes.objects
            .values("id_activite_fk__activite")
            .annotate(poids_moyen=Avg("poids_activite"))
            .order_by("-poids_moyen")
        )

        response = [
            {
                "activite": item["id_activite_fk__activite"],
                "poids_moyen": float(item["poids_moyen"]) if item["poids_moyen"] else None
            }
            for item in data
        ]

        return Response(response)
    


class NoteFinaleParEtudiant(APIView):
    def get(self, request):

        notes_finales = get_notes_grouped()

        # Étape 1 : regrouper par étudiant
        notes_par_etudiant = {}
        for item in notes_finales:
            etu = item["id_etudiant_fk"]
            notes_par_etudiant.setdefault(etu, []).append(item["note_finale"])

        # Étape 2 : calculer la moyenne + remplacer l'id par le nom
        resultats = []
        for etu_id, notes in notes_par_etudiant.items():

            # Récupération de l'étudiant
            etudiant = DimEtudiant.objects.get(pk=etu_id)

            # Construire le nom complet
            nom_complet = f"{etudiant.nom_etudiant}"

            moyenne = sum(notes) / len(notes)

            resultats.append({
                "Etudiant": nom_complet,
                "Moyenne finale": round(moyenne, 2)
            })

            resultats = sorted(resultats, key=lambda x: x["Moyenne finale"], reverse=True)

        return Response(resultats)


class MoyenneFinaleParFiliere(APIView):
    def get(self, request):

        notes = get_notes_grouped()

        # Regrouper les notes par filière
        notes_par_filiere = {}
        for item in notes:
            filiere_id = item["id_filiere_fk"]
            notes_par_filiere.setdefault(filiere_id, []).append(item["note_finale"])

        resultats = []

        for filiere_id, notes_list in notes_par_filiere.items():
            # Récupérer le nom de la filière
            filiere = DimFiliere.objects.get(pk=filiere_id)

            moyenne = sum(notes_list) / len(notes_list)

            resultats.append({
                "Filiere": filiere.filiere,  # nom de la filière
                "Moyenne finale": round(moyenne, 2)
            })

            resultats = sorted(resultats, key=lambda x: x["Moyenne finale"], reverse=True)

        return Response(resultats)