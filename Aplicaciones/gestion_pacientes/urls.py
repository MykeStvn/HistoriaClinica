from django.urls import path
from . import views
app_name = 'gestion_pacientes'

urlpatterns = [
    path('manejo_pacientes/', views.manejo_pacientes, name='manejo_pacientes'),
    path('inicio_doctor/', views.inicio_doctor, name='inicio_doctor'),
    path('citas/', views.citas, name='citas'),
    path('cargar_citas/', views.cargar_citas, name='cargar_citas'),

]
