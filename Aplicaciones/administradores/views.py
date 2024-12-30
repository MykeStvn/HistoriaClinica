from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

@login_required
def gestion_usuarios(request):
    if request.user.tipo_usuario != 'administrador':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    return render(request, 'administradores/gestion_usuarios.html')

#RENDERIZAR HOME DOCTORES
@login_required
def inicio_administrador(request):
    if request.user.tipo_usuario != 'administrador':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    return render(request, 'administradores/inicio_administrador.html')

