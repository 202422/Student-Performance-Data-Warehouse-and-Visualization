from rest_framework import serializers
from .models import FaitNotes




class NotesDetailSerializer(serializers.ModelSerializer):
    """
    Serializer DÉTAILLÉ pour les notes
    Inclut les informations complètes des dimensions liées
    
    Exemple de sortie JSON :
    {
        "id_fact": 1,
        "note": 15.5,
        "etudiant_nom": "Ahmed Benali",
        "etudiant_code": "E001",
        "cours_nom": "Base de données",
        ...
    }
    """
    
    # Champs supplémentaires (lecture seule)
    # Récupérés depuis les relations ForeignKey
    etudiant_code = serializers.CharField(
        source='id_etudiant_fk.id_etudiant_pk', 
        read_only=True
    )
    etudiant_nom = serializers.CharField(
        source='id_etudiant_fk.nom_etudiant', 
        read_only=True
    )
    classe_nom = serializers.CharField(
        source='id_classe_fk.classe', 
        read_only=True
    )
    filiere_nom = serializers.CharField(
        source='id_filiere_fk.filiere', 
        read_only=True
    )
    cours_nom = serializers.CharField(
        source='id_cours_fk.cours', 
        read_only=True
    )
    session_nom = serializers.CharField(
        source='id_session_fk.session_label', 
        read_only=True
    )
    type_session_nom = serializers.CharField(
        source='id_typesession_fk.type_session', 
        read_only=True
    )
    activite_nom = serializers.CharField(
        source='id_activite_fk.activite', 
        read_only=True
    )
    critere_nom = serializers.CharField(
        source='id_critere_fk.critere', 
        read_only=True
    )
    
    class Meta:
        model = FaitNotes
        fields = [
            # IDs (clés primaires et étrangères)
            'id_fact',
            'id_etudiant_fk',
            'id_classe_fk',
            'id_filiere_fk',
            'id_cours_fk',
            'id_session_fk',
            'id_typesession_fk',
            'id_activite_fk',
            'id_critere_fk',
            
            # Informations détaillées (champs supplémentaires)
            'etudiant_code',
            'etudiant_nom',
            'classe_nom',
            'filiere_nom',
            'cours_nom',
            'session_nom',
            'type_session_nom',
            'activite_nom',
            'critere_nom',
            
            # Mesures
            'poids_activite',
            'poids_critere',
            'note',
            'note_ponderee',
        ]
