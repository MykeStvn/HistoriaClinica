from django.db import models

from Aplicaciones.usuarios.models import Usuarios

#Pacientes
class Pacientes(models.Model):
    id_pacientes = models.AutoField(primary_key=True)
    fk_id_admisionista = models.ForeignKey(
        Usuarios,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='fk_id_admisionista',
        limit_choices_to={'tipo_usuario': 'admisionista'},  # Solo admisionistas
        verbose_name="Admisionista"
    )
    apellido_paterno_pacientes = models.CharField(max_length=255)
    apellido_materno_pacientes = models.CharField(max_length=255)
    nombres_pacientes = models.CharField(max_length=255)
    cedula_pacientes = models.CharField(max_length=15, unique=True)
    fecha_nacimiento_pacientes = models.DateField()
    direccion_pacientes = models.TextField()
    email_pacientes = models.EmailField(max_length=254)
    estado_civil_pacientes = models.TextField(max_length=254,null=True,blank=True)
    genero_pacientes = models.CharField(max_length=255)
    telefono_pacientes = models.CharField(max_length=15)
    emergencia_informar_pacientes = models.CharField(max_length=255)
    contacto_emergencia_pacientes = models.CharField(max_length=15)
    seguro_pacientes = models.CharField(max_length=255)

    class Meta:
        db_table = 'pacientes'

    def __str__(self):
        return f"{self.nombres_pacientes} {self.apellido_paterno_pacientes} {self.apellido_materno_pacientes}"