from django.db.models import Sum
from .models import FaitNotes


def get_notes_grouped():
    """
    Regroupe les notes pondérées par :
    - étudiant
    - cours
    - session
    - classe
    - filière
    
    Retourne la liste de records annotés :
    [
        {
            'id_etudiant_fk': 1,
            'id_cours_fk': 3,
            'id_session_fk': 2,
            'id_classe_fk': 1,
            'id_filiere_fk': 1,
            'note_finale': 14.5
        },
        ...
    ]
    """
    notes_finales = (
        FaitNotes.objects
        .values(
            'id_etudiant_fk',
            'id_cours_fk',
            'id_session_fk',
            'id_classe_fk',
            'id_filiere_fk'
        )
        .annotate(note_finale=Sum('note_ponderee'))
    )

    return list(notes_finales)
