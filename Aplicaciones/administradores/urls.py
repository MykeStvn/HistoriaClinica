from django.urls import path
from . import views
# from Aplicaciones.administradores import views
app_name = 'administradores'

urlpatterns = [    
    path('inicio_administrador/', views.inicio_administrador, name='inicio_administrador'),
    path('gestion_usuarios/', views.gestion_usuarios, name='gestion_usuarios')
]
