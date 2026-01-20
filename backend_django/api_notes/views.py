from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Sum
from .models import FaitNotes, DimEtudiant, DimCours, DimFiliere, DimClasse, DimSession
from .utils import get_notes_grouped
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from collections import defaultdict


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



class ListeClasses(APIView):
    def get(self, request):
        classes = DimClasse.objects.all().order_by("classe")

        resultats = [
            {
                "id": classe.id_classe_pk,
                "classe": classe.classe
            }
            for classe in classes
        ]

        return Response(resultats)
    


class ListeEtudiantsParClasse(APIView):
    def get(self, request):

        classe_id = request.GET.get("classe")

        if not classe_id:
            return Response(
                {"error": "Paramètre 'classe' requis"},
                status=400
            )

        # Vérifier que la classe existe
        try:
            classe = DimClasse.objects.get(pk=classe_id)
        except DimClasse.DoesNotExist:
            return Response(
                {"error": "Classe introuvable"},
                status=404
            )

        # 🔹 Récupération des étudiants DISTINCTS de cette classe
        etudiants_ids = (
            FaitNotes.objects
            .filter(id_classe_fk=classe)
            .values_list("id_etudiant_fk", flat=True)
            .distinct()
        )

        etudiants = DimEtudiant.objects.filter(
            id_etudiant_pk__in=etudiants_ids
        ).order_by("nom_etudiant")

        resultats = [
            {
                "id": etu.id_etudiant_pk,
                "nom": etu.nom_etudiant
            }
            for etu in etudiants
        ]

        return Response(resultats)



@api_view(["GET"])
def moyenne_etudiant(request):
    """
    GET /api/stats/etudiant/moyenne/?etudiant=E1
    """
    etudiant_id = request.GET.get("etudiant")

    if not etudiant_id:
        return Response(
            {"error": "Paramètre etudiant manquant"},
            status=400
        )

    notes = get_notes_grouped()

    # récupérer les notes de l'étudiant
    notes_etudiant = [
        n["note_finale"]
        for n in notes
        if str(n["id_etudiant_fk"]) == str(etudiant_id)
    ]

    if not notes_etudiant:
        return Response(
            {"etudiant": etudiant_id, "moyenne_finale": None}
        )

    moyenne = round(sum(notes_etudiant) / len(notes_etudiant), 2)

    return Response({
        "etudiant": etudiant_id,
        "moyenne_finale": moyenne,
        "nombre_cours": len(notes_etudiant)
    })


@api_view(["GET"])
def classement_etudiant(request):
    """
    GET /api/stats/etudiant/classement/?etudiant=E1&classe=1
    """

    etudiant_id = request.GET.get("etudiant")
    classe_id = request.GET.get("classe")

    if not etudiant_id or not classe_id:
        return Response(
            {"error": "Paramètres etudiant et classe requis"},
            status=400
        )

    notes = get_notes_grouped()

    # filtrer par classe
    notes_classe = [
        n for n in notes
        if str(n["id_classe_fk"]) == str(classe_id)
    ]

    # total par étudiant
    totals = {}

    for n in notes_classe:
        etu = str(n["id_etudiant_fk"])
        totals.setdefault(etu, 0)
        totals[etu] += float(n["note_finale"])

    # classement décroissant
    classement = sorted(
        totals.items(),
        key=lambda x: x[1],
        reverse=True
    )

    # attribution des rangs
    rangs = {}
    rang = 1
    for etu, score in classement:
        rangs[etu] = rang
        rang += 1

    return Response({
        "etudiant": etudiant_id,
        "classe": classe_id,
        "rang": rangs.get(str(etudiant_id)),
        "effectif_classe": len(classement)
    })



@api_view(["GET"])
def evolution_notes_etudiant(request):
    """
    Évolution des notes d'un étudiant par session
    (tous cours confondus)

    Paramètre :
        ?etudiant=<id_etudiant>

    Retour :
    [
        {
            "Session": "Session 1",
            "Moyenne étudiant": 12.45
        },
        {
            "Session": "Session 2",
            "Moyenne étudiant": 13.80
        }
    ]
    """

    etudiant_id = request.GET.get("etudiant")

    if not etudiant_id:
        return JsonResponse(
            {"error": "Paramètre etudiant manquant"},
            status=400
        )

    # 🔹 Données DW déjà agrégées
    notes = get_notes_grouped()

    # 🔹 Filtrer uniquement l'étudiant
    notes_etudiant = [
        n for n in notes
        if str(n["id_etudiant_fk"]) == str(etudiant_id)
    ]

    if not notes_etudiant:
        return JsonResponse([], safe=False)

    # ===============================
    # Regroupement par session
    # ===============================
    sessions = defaultdict(list)

    for note in notes_etudiant:
        session_id = note["id_session_fk"]
        sessions[session_id].append(note["note_finale"])

    # ===============================
    # Récupération noms sessions
    # ===============================
    session_map = {
        s.id_session_pk: s.session_label
        for s in DimSession.objects.all()
    }

    # ===============================
    # Construction réponse finale
    # ===============================
    resultat = []

    for session_id, notes_session in sessions.items():
        moyenne = round(
            sum(notes_session) / len(notes_session),
            2
        )

        resultat.append({
            "Session": session_map.get(session_id, f"Session {session_id}"),
            "Moyenne étudiant": moyenne
        })

    # 🔹 ordre chronologique
    resultat.sort(key=lambda x: x["Session"])

    return JsonResponse(resultat, safe=False)