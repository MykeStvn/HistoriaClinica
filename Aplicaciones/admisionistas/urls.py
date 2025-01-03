from django.urls import path
from django.views.generic import TemplateView

from Aplicaciones.admisionistas import views

app_name = 'admisionistas'

urlpatterns = [
    path('ingreso_pacientes/', views.ingreso_pacientes, name='ingreso_pacientes'),
    path('agregar_paciente/', views.agregar_paciente, name='agregar_paciente'),
    path('obtener_paciente/<int:paciente_id>/', views.obtener_paciente, name='obtener_paciente'),
    path('actualizar_paciente/', views.actualizar_paciente, name='actualizar_paciente'),  # Nueva ruta para actualizar
    path('eliminar_paciente/<int:paciente_id>/', views.eliminar_paciente, name='eliminar_paciente'),
    path('obtener_pacientes/', views.obtener_pacientes, name='obtener_pacientes'),
    path('verificar_cedula/', views.verificar_cedula, name='verificar_cedula'),
    path('verificar_cedula_actualizar/', views.verificar_cedula_actualizar, name='verificar_cedula_actualizar'),
]