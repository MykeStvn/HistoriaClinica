from django.urls import path
from django.views.generic import TemplateView

from Aplicaciones.admisionistas import views

app_name = 'admisionistas'

urlpatterns = [
    path('ingreso_pacientes/', views.ingreso_pacientes , name='ingreso_pacientes'),
    path('agregar_paciente/', views.agregar_paciente, name='agregar_paciente'),
]
