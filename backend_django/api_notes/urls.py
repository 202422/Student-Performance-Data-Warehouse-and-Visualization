from django.urls import path
from .views import login_user, HistogrammeNotes, MoyenneParCours, TauxReussite, PoidsMoyenParActivite, NoteFinaleParEtudiant, MoyenneFinaleParFiliere, MoyenneFinaleParClasse, MoyenneParSessionParCours, ListeCours

urlpatterns = [
    path("stats/moyenne-par-cours/", MoyenneParCours.as_view(), name="moyenne-par-cours"),
    path('stats/taux-reussite/', TauxReussite.as_view()),
    path('stats/poids-moyen-activite/', PoidsMoyenParActivite.as_view()),
    path('stats/note-finale-etudiant/', NoteFinaleParEtudiant.as_view()),
    path('stats/moyenne-par-filiere/', MoyenneFinaleParFiliere.as_view()),
    path('stats/moyenne-par-classe/', MoyenneFinaleParClasse.as_view()),
    path('stats/histogramme-notes/', HistogrammeNotes.as_view()),
    path('stats/moyenne-par-session/', MoyenneParSessionParCours.as_view()),
    path('cours/', ListeCours.as_view()),
    path('login/', login_user),    
]
