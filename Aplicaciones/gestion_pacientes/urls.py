from django.urls import path
from . import views
from .views import manejo_pacientes
app_name = 'gestion_pacientes'

urlpatterns = [
    path('manejo_pacientes/', views.manejo_pacientes, name='manejo_pacientes'),
]
