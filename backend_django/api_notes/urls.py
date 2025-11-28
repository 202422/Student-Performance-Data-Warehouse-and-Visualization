from django.urls import path
from .views import MoyenneParCours

urlpatterns = [
    path("moyenne-par-cours/", MoyenneParCours.as_view(), name="moyenne-par-cours"),
]
