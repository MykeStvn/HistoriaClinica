from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
import pytz
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

        # Recoger los datos del usuario
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        tipo_usuario = request.POST.get('tipo_usuario')
        especialidad = request.POST.get('especialidad')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Recoger la imagen de perfil (si se envió una)
        image = request.FILES.get('image')  # Obtener el archivo de imagen

        # Crear el usuario
        usuario = Usuarios.objects.create(
            first_name=first_name,
            last_name=last_name,
            username=username,
            tipo_usuario=tipo_usuario,
            especialidad=especialidad,
            email=email,
            password=password,  # Asegúrate de encriptar la contraseña
            is_superuser=is_superuser,
            is_staff=is_staff,        
            image=image  # Asignar la imagen de perfil al usuario
        )

        # Enviar la respuesta con los datos del usuario
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
            'email': usuario.email,
            'image': usuario.image.url if usuario.image else None,  # Incluir la URL de la imagen si existe
        }})

    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})

#VISTA PARA CARGAR DATOS EN EL MODAL DE VER MÁS DETALLES
@login_required
def obtener_usuario(request, usuario_id):
    try:
        usuario = Usuarios.objects.get(id=usuario_id)
        
        ecuador_tz = pytz.timezone('America/Guayaquil')
        # Formatear fechas
        date_joined = usuario.date_joined.astimezone(ecuador_tz).strftime('%d/%m/%Y %H:%M')
        last_login = usuario.last_login.astimezone(ecuador_tz).strftime('%d/%m/%Y %H:%M') if usuario.last_login else "Nunca ha iniciado sesión"

        data = {
            'status': 'success',
            'usuario': {
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
                'username': usuario.username,
                'tipo_usuario': usuario.tipo_usuario,
                'especialidad': usuario.especialidad,
                'email': usuario.email,
                'is_active': 'Activo' if usuario.is_active else 'Inactivo',
                'image_url': usuario.image.url if usuario.image else None,
                'date_joined':date_joined,
                'last_login': last_login,
                'is_superuser': 'Si' if usuario.is_superuser else 'No',
                'is_staff': 'Si' if usuario.is_staff else 'No',
            }
        }
        return JsonResponse(data)
    except Usuarios.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Usuario no encontrado'})