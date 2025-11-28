from django.db import models

# Create your models here.

# ========================
# DIMENSIONS
# ========================

class DimEtudiant(models.Model):
    id_etudiant_pk = models.CharField(max_length=100, primary_key=True)
    nom_etudiant = models.CharField(max_length=100)

    class Meta:
        db_table = 'dim_etudiant'
        managed = False

    def __str__(self):
        return self.nom_etudiant  # ✅ OK (attribut existe)


class DimClasse(models.Model):
    id_classe_pk = models.AutoField(primary_key=True)
    classe = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'dim_classe'
        managed = False

    def __str__(self):
        return self.classe  # ✅ CORRIGÉ


class DimFiliere(models.Model):
    id_filiere_pk = models.AutoField(primary_key=True)
    filiere = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'dim_filiere'
        managed = False

    def __str__(self):
        return self.filiere  # ✅ CORRIGÉ


class DimCours(models.Model):
    id_cours_pk = models.AutoField(primary_key=True)
    cours = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'dim_cours'
        managed = False

    def __str__(self):
        return self.cours  # ✅ CORRIGÉ


class DimSession(models.Model):
    id_session_pk = models.AutoField(primary_key=True)
    session_label = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'dim_session'
        managed = False

    def __str__(self):
        return self.session_label  # ✅ CORRIGÉ


class DimTypeSession(models.Model):
    id_typesession_pk = models.AutoField(primary_key=True)
    type_session = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'dim_typesession'
        managed = False

    def __str__(self):
        return self.type_session  # ✅ CORRIGÉ


class DimActivite(models.Model):
    id_activite_pk = models.AutoField(primary_key=True)
    activite = models.CharField(max_length=100, unique=True)
    poids_activite = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'dim_activite'
        managed = False

    def __str__(self):
        return self.activite  # ✅ CORRIGÉ


class DimCritere(models.Model):
    id_critere_pk = models.AutoField(primary_key=True)
    critere = models.CharField(max_length=100, unique=True)
    poids_critere = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'dim_critere'
        managed = False

    def __str__(self):
        return self.critere  # ✅ CORRIGÉ

# ========================
# TABLE DE FAITS
# ========================

class FaitNotes(models.Model):
    id_fact = models.AutoField(primary_key=True)
    id_etudiant_fk = models.ForeignKey(
        DimEtudiant, 
        on_delete=models.CASCADE, 
        db_column='id_etudiant_fk'
    )
    id_classe_fk = models.ForeignKey(
        DimClasse, 
        on_delete=models.CASCADE, 
        db_column='id_classe_fk'
    )
    id_filiere_fk = models.ForeignKey(
        DimFiliere, 
        on_delete=models.CASCADE, 
        db_column='id_filiere_fk'
    )
    id_cours_fk = models.ForeignKey(
        DimCours, 
        on_delete=models.CASCADE, 
        db_column='id_cours_fk'
    )
    id_session_fk = models.ForeignKey(
        DimSession, 
        on_delete=models.CASCADE, 
        db_column='id_session_fk'
    )
    id_typesession_fk = models.ForeignKey(
        DimTypeSession, 
        on_delete=models.CASCADE, 
        db_column='id_typesession_fk'
    )
    id_activite_fk = models.ForeignKey(
        DimActivite, 
        on_delete=models.CASCADE, 
        db_column='id_activite_fk'
    )
    id_critere_fk = models.ForeignKey(
        DimCritere, 
        on_delete=models.CASCADE, 
        db_column='id_critere_fk'
    )
    
    poids_activite = models.DecimalField(max_digits=5, decimal_places=2)
    poids_critere = models.DecimalField(max_digits=5, decimal_places=2)
    
    note = models.DecimalField(max_digits=5, decimal_places=2)
    note_ponderee = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'fact_notes'
        managed = False

    def __str__(self):
        return f"Note {self.id_etudiant_fk.nom_etudiant} - {self.id_cours_fk.cours}"
        # ✅ CORRIGÉ : cours au lieu de nom_cours