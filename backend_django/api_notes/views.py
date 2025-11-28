from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg
from .models import FaitNotes

class MoyenneParCours(APIView):
    def get(self, request):
        data = (
            FaitNotes.objects
            .values("id_cours_fk__cours")
            .annotate(moyenne=Avg("note_ponderee"))
            .order_by("-moyenne")
        )

        # Réponse nettoyée
        response = [
            {
                "cours": item["id_cours_fk__cours"],
                "moyenne": float(item["moyenne"]) if item["moyenne"] else None
            }
            for item in data
        ]

        return Response(response)
