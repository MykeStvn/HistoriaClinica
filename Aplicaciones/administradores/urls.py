from django.urls import path
from . import views
# from Aplicaciones.administradores import views
app_name = 'administradores'

urlpatterns = [    
    path('inicio_administrador/', views.inicio_administrador, name='inicio_administrador'),
    path('gestion_usuarios/', views.gestion_usuarios, name='gestion_usuarios'),
    path('obtener_usuarios/', views.obtener_usuarios, name='obtener_usuarios'),
    path('agregar_usuario/', views.agregar_usuario, name='agregar_usuario'),
    path('eliminar_usuario/<int:usuario_id>/', views.eliminar_usuario, name='eliminar_usuario')
]
