from django.urls import path

from Aplicaciones.admisionistas import views
from .views import ingreso_pacientes
app_name = 'admisionistas'

urlpatterns = [
    path('ingreso_pacientes/', views.ingreso_pacientes , name='ingreso_pacientes'),

]
