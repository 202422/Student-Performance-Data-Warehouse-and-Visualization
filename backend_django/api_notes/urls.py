from django.urls import path
from .views import MoyenneParCours, TauxReussite, PoidsMoyenParActivite, NoteFinaleParEtudiant, MoyenneFinaleParFiliere

urlpatterns = [
    path("moyenne-par-cours/", MoyenneParCours.as_view(), name="moyenne-par-cours"),
    path('taux-reussite/', TauxReussite.as_view()),
    path('poids-moyen-activite/', PoidsMoyenParActivite.as_view()),
    path('note-finale-etudiant/', NoteFinaleParEtudiant.as_view()),
    path('moyenne-par-filiere/', MoyenneFinaleParFiliere.as_view()),
]
