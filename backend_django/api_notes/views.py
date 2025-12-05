from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Sum
from .models import FaitNotes, DimEtudiant, DimCours, DimFiliere
from .utils import get_notes_grouped
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

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

        # Étape 3 : Compter ceux qui ont >= 10/20
        reussites = sum(1 for m in moyennes if m >= 10)

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
    

class MoyenneFinaleParClasse(APIView):
    def get(self, request):
        notes = get_notes_grouped()  # chaque note a -> id_classe_fk + note_finale

        notes_par_classe = {}
        for item in notes:
            classe_id = item["id_classe_fk"]
            notes_par_classe.setdefault(classe_id, []).append(item["note_finale"])

        resultats = []
        from .models import DimClasse
        for classe_id, notes_list in notes_par_classe.items():
            classe = DimClasse.objects.get(pk=classe_id)
            moyenne = sum(notes_list) / len(notes_list)
            resultats.append({
                "Classe": classe.classe,
                "Moyenne finale": round(moyenne, 2)
            })
        resultats = sorted(resultats, key=lambda x: x["Moyenne finale"], reverse=True)
        return Response(resultats)


class ListeCours(APIView):
    def get(self, request):
        from .models import DimCours
        cours_list = DimCours.objects.all().order_by("cours")
        resultats = [
            {
                "id": cours.id_cours_pk,
                "cours": cours.cours
            }
            for cours in cours_list
        ]
        return Response(resultats)


class HistogrammeNotes(APIView):
    """
    Retourne les intervalles de notes avec le nombre d'étudiants dans chaque intervalle.
    Exemple de retour :
    [
        {"intervalle": "0-5", "count": 10},
        {"intervalle": "5-10", "count": 25},
        {"intervalle": "10-15", "count": 40},
        {"intervalle": "15-20", "count": 15},
    ]
    """

    def get(self, request):
        notes = get_notes_grouped()
        
        # Initialisation des intervalles
        intervalles = [
            {"min": 0, "max": 5, "label": "0-5", "count": 0},
            {"min": 5, "max": 10, "label": "5-10", "count": 0},
            {"min": 10, "max": 15, "label": "10-15", "count": 0},
            {"min": 15, "max": 20, "label": "15-20", "count": 0},
        ]

        for note in notes:
            valeur = note["note_finale"]
            for intervalle in intervalles:
                # On inclut la borne supérieure uniquement pour le dernier intervalle
                if intervalle["min"] <= valeur < intervalle["max"] or (intervalle["max"] == 20 and valeur == 20):
                    intervalle["count"] += 1
                    break

        # On prépare la sortie JSON
        resultats = [{"intervalle": i["label"], "count": i["count"]} for i in intervalles]

        return Response(resultats)


class MoyenneParSessionParCours(APIView):
    def get(self, request):
        from .models import DimSession, DimCours
        cours_param = request.GET.get("cours")
        if not cours_param:
            return Response({"error": "Paramètre 'cours' requis."}, status=400)
        try:
            # Accepter l'ID ou le nom du cours comme paramètre
            try:
                cours_obj = DimCours.objects.get(pk=int(cours_param))
            except ValueError:
                cours_obj = DimCours.objects.get(cours=cours_param)
        except DimCours.DoesNotExist:
            return Response({"error": "Cours introuvable."}, status=404)
        notes = get_notes_grouped()
        notes_par_session = {}
        for item in notes:
            if item["id_cours_fk"] == cours_obj.pk:
                session_id = item["id_session_fk"]
                notes_par_session.setdefault(session_id, []).append(item["note_finale"])
        resultats = []
        for session_id, notes_list in notes_par_session.items():
            session = DimSession.objects.get(pk=session_id)
            moyenne = sum(notes_list) / len(notes_list)
            resultats.append({
                "Session": session.session_label if hasattr(session, 'session_label') else str(session_id),
                "Moyenne finale": round(moyenne, 2)
            })
        resultats = sorted(resultats, key=lambda x: x["Session"])
        return Response(resultats)


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)

    data = json.loads(request.body.decode("utf-8"))
    username = data.get("username")
    password = data.get("password")

    # ----- Authentification manuelle -----
    if username == "admin" and password == "admin":
        role = "admin"

    elif username == "professeur" and password == "professeur":
        role = "prof"

    else:
        return JsonResponse({"error": "Identifiants invalides"}, status=401)

    # Si on arrive ici, auth réussie
    return JsonResponse({
        "message": "Connexion réussie",
        "role": role,
        "username": username,
    })