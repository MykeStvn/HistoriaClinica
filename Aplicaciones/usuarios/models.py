from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

class Usuarios(AbstractUser):
    TIPO_USUARIO_CHOICES = (
        ('admisionista', 'Admisionista'),
        ('doctor', 'Doctor'),
        ('administrador', 'Administrador'),
    )
    especialidad_choices = (
        ('medico_general', 'Médico General'), #si se inserta con guión bajo es por esto e igual 
        ('admisionista', 'Admisionista'), #en minúscula, puedo cambiar pero estoy probando
    )
    
    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPO_USUARIO_CHOICES,
        default='admisionista',
    )
    
    especialidad = models.CharField(
        max_length=50,
        choices=especialidad_choices,  # Solo puede ser Médico General o Admisionista
        blank=True,
        null=True,
        verbose_name="Especialidad",
    )

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_sha256'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
