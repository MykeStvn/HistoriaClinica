from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from Aplicaciones.usuarios.models import Usuarios

@login_required
def manejo_pacientes(request):
    if request.user.tipo_usuario != 'doctor':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    return render(request, 'gestion_pacientes/manejo_pacientes.html')

#RENDERIZAR HOME DOCTORES
@login_required
def inicio_doctor(request):
    if request.user.tipo_usuario != 'doctor':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    
    doctores = Usuarios.objects.filter(tipo_usuario='doctor')
    return render(request, 'gestion_pacientes/inicio_doctor.html',{'usuarios': doctores})

#VISTA PARA CITAS
@login_required
def citas(request):
    if request.user.tipo_usuario != 'doctor':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    
    doctores = Usuarios.objects.filter(tipo_usuario='doctor')
    return render(request, 'gestion_pacientes/citas.html',{'usuarios': doctores})