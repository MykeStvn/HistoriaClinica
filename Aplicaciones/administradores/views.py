from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from Aplicaciones.usuarios.models import Usuarios
from django.views.decorators.csrf import csrf_exempt

@login_required
def gestion_usuarios(request):
    if request.user.tipo_usuario != 'administrador':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    usuarios = Usuarios.objects.all()  # Verifica que `Usuarios` es un modelo y no un módulo
    return render(request, 'administradores/gestion_usuarios.html',{'usuarios': usuarios})

#RENDERIZAR HOME DOCTORES
@login_required
def inicio_administrador(request):
    if request.user.tipo_usuario != 'administrador':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor
    return render(request, 'administradores/inicio_administrador.html')


# Vista para obtener todos los datos de los usuarios

def obtener_usuarios(request):
    usuarios = Usuarios.objects.all().values(
        'id',  # Asegúrate de incluir el id
        'password',
        'last_login', 
        'is_superuser', 
        'username', 
        'first_name', 
        'last_name', 
        'email', 
        'is_staff',
        'is_active', 
        'date_joined',
        'tipo_usuario',
        'especialidad'        
    )
    return JsonResponse({'usuarios': list(usuarios)})

#Eliminar
@csrf_exempt  # Si tu configuración de CSRF está causando problemas (asegúrate de que se maneje correctamente)
@login_required
def eliminar_usuario(request, usuario_id):
    if request.method == 'DELETE':
        try:
            usuario = Usuarios.objects.get(id=usuario_id)
            usuario.delete()
            return JsonResponse({'status': 'success'})
        except Usuarios.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Usuario no encontrado'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})


# Vista para agregar un nuevo usuario OK
@login_required
def agregar_usuario(request):
    if request.method == 'POST':
        # Obtener los valores de los checkboxes, si están seleccionados será True, si no False
        is_superuser = request.POST.get('is_superuser') == 'True'  # True si está seleccionado
        is_staff = request.POST.get('is_staff') == 'True'  # True si está seleccionado
        is_active = request.POST.get('is_active') == 'True'  # True si está seleccionado


        # Recoger los datos del paciente
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        tipo_usuario = request.POST.get('tipo_usuario')
        especialidad = request.POST.get('especialidad')
        # date_joined = request.POST.get('date_joined')
        last_login = request.POST.get('last_login')        
        email = request.POST.get('email')
        password = request.POST.get('password')                

        # Crear el paciente
        usuario = Usuarios.objects.create(
            first_name=first_name,
            last_name=last_name,
            username=username,
            tipo_usuario=tipo_usuario,
            especialidad=especialidad,
            # date_joined=date_joined,
            last_login=last_login,
            is_superuser=is_superuser,
            is_staff=is_staff,
            is_active=is_active,
            email=email,
            password=password            
        )

        # Enviar la respuesta con los datos del paciente y la edad calculada
        return JsonResponse({'status': 'success', 'message': 'Usuario agregado correctamente', 'usuario': {
            'id': usuario.id,
            'first_name': usuario.first_name,
            'last_name': usuario.last_name,
            'username': usuario.username,
            'tipo_usuario': usuario.tipo_usuario,
            'especialidad': usuario.especialidad,
            'date_joined': usuario.date_joined,
            'last_login': usuario.last_login,
            'is_superuser': usuario.is_superuser,
            'is_staff': usuario.is_staff,
            'is_active': usuario.is_active,
            'email': usuario.email,
            'password': usuario.password
        }})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})