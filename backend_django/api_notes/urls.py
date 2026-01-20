from django.urls import path
from .views import evolution_notes_etudiant, moyenne_etudiant, classement_etudiant, login_user, ListeEtudiantsParClasse, HistogrammeNotes, MoyenneParCours, TauxReussite, PoidsMoyenParActivite, NoteFinaleParEtudiant, MoyenneFinaleParFiliere, MoyenneFinaleParClasse, MoyenneParSessionParCours, ListeCours, ListeClasses

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
    path("classes/", ListeClasses.as_view()),
    path("etudiants/", ListeEtudiantsParClasse.as_view()),
    path(
        "moyenne-etudiant/",
        moyenne_etudiant,
        name="moyenne-etudiant"
    ),
    path(
        "classement-etudiant/",
        classement_etudiant,
        name="classement-etudiant"
    ),
    path(
        "progression-sessions/",
        evolution_notes_etudiant,
        name="evolution_notes_etudiant"
    )
]
