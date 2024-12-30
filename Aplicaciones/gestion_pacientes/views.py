from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

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
    return render(request, 'gestion_pacientes/inicio_doctor.html')
