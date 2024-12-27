from datetime import date, datetime
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from Aplicaciones.admisionistas.models import Pacientes
from Aplicaciones.usuarios.models import Usuarios
from django.views.decorators.csrf import csrf_exempt

# Vista para obtener todos los datos del paciente

def obtener_pacientes(request):
    pacientes = Pacientes.objects.all().values(
        'id_pacientes',  # Asegúrate de incluir el id
        'apellido_paterno_pacientes',
        'apellido_materno_pacientes', 
        'nombres_pacientes', 
        'cedula_pacientes', 
        'fecha_nacimiento_pacientes', 
        'direccion_pacientes', 
        'email_pacientes', 
        'genero_pacientes',
        'telefono_pacientes', 
        'emergencia_informar_pacientes',
        'contacto_emergencia_pacientes',
        'seguro_pacientes',
        'fk_id_admisionista__username'  # Relación de admisionista
    )
    return JsonResponse({'pacientes': list(pacientes)})

# Vista para ingresar pacientes
@login_required
def ingreso_pacientes(request):
    if request.user.tipo_usuario != 'admisionista':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es admisionista
    
    pacientesBdd = Pacientes.objects.all()
    for paciente in pacientesBdd:
        paciente.edad = calculate_age(paciente.fecha_nacimiento_pacientes)
    
    admisionistas = Usuarios.objects.filter(tipo_usuario='admisionista')
    
    return render(request, 'admisionistas/ingreso_pacientes.html', {'pacientes': pacientesBdd, 'usuarios': admisionistas})


# Vista para agregar un nuevo paciente
@login_required
def agregar_paciente(request):
    if request.method == 'POST':
        # Recoger los datos del paciente
        apellido_paterno_pacientes = request.POST.get('apellido_paterno_pacientes')
        apellido_materno_pacientes = request.POST.get('apellido_materno_pacientes')
        nombres_pacientes = request.POST.get('nombres_pacientes')
        cedula_pacientes = request.POST.get('cedula_pacientes')
        fecha_nacimiento_pacientes = request.POST.get('fecha_nacimiento_pacientes')
        direccion_pacientes = request.POST.get('direccion_pacientes')
        email_pacientes = request.POST.get('email_pacientes')
        genero_pacientes = request.POST.get('genero_pacientes')
        # Si el género es "Otro", usa el valor ingresado por el usuario
        if genero_pacientes == 'Otro':
            genero_pacientes = request.POST.get('genero_otro')
        telefono_pacientes = request.POST.get('telefono_pacientes')
        emergencia_informar_pacientes = request.POST.get('emergencia_informar_pacientes')
        contacto_emergencia_pacientes = request.POST.get('contacto_emergencia_pacientes')
        seguro_pacientes = request.POST.get('seguro_pacientes')
        if seguro_pacientes == 'Otro':
            seguro_pacientes = request.POST.get('seguro_otro')
        # Cálculo de la edad
        fecha_nacimiento = datetime.strptime(fecha_nacimiento_pacientes, "%Y-%m-%d").date()
        edad_paciente = calculate_age(fecha_nacimiento)

        # Obtener el admisionista (usuario autenticado)
        admisionista = request.user

        # Crear el paciente
        paciente = Pacientes.objects.create(
            apellido_paterno_pacientes=apellido_paterno_pacientes,
            apellido_materno_pacientes=apellido_materno_pacientes,
            nombres_pacientes=nombres_pacientes,
            cedula_pacientes=cedula_pacientes,
            fecha_nacimiento_pacientes=fecha_nacimiento_pacientes,
            direccion_pacientes=direccion_pacientes,
            email_pacientes=email_pacientes,
            genero_pacientes=genero_pacientes,
            telefono_pacientes=telefono_pacientes,
            emergencia_informar_pacientes=emergencia_informar_pacientes,
            contacto_emergencia_pacientes=contacto_emergencia_pacientes,
            seguro_pacientes=seguro_pacientes,
            fk_id_admisionista=admisionista  # Asignar el usuario autenticado como admisionista
        )

        # Enviar la respuesta con los datos del paciente y la edad calculada
        return JsonResponse({'status': 'success', 'message': 'Paciente agregado correctamente', 'paciente': {
            'id_pacientes': paciente.id_pacientes,
            'apellido_paterno': paciente.apellido_paterno_pacientes,
            'apellido_materno': paciente.apellido_materno_pacientes,
            'nombres': paciente.nombres_pacientes,
            'cedula': paciente.cedula_pacientes,
            'fecha_nacimiento': paciente.fecha_nacimiento_pacientes,
            'edad': edad_paciente,
            'direccion': paciente.direccion_pacientes,
            'email': paciente.email_pacientes,
            'genero': paciente.genero_pacientes,
            'telefono': paciente.telefono_pacientes,
            'emergencia_informar': paciente.emergencia_informar_pacientes,
            'contacto_emergencia': paciente.contacto_emergencia_pacientes,
            'seguro': paciente.seguro_pacientes,
            'admisionista': paciente.fk_id_admisionista.username,  # Mostrar el nombre del admisionista
        }})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})

# Vista para obtener los datos del paciente (para el modal)
@login_required
def obtener_paciente(request, paciente_id):
    try:
        print(f"Buscando paciente con id: {paciente_id}") 
        paciente = Pacientes.objects.get(id_pacientes=paciente_id)
        # Si existe el paciente, enviar los datos en formato JSON
        return JsonResponse({
            'paciente': {
                'id_pacientes': paciente.id_pacientes,
                'apellido_paterno': paciente.apellido_paterno_pacientes,
                'apellido_materno': paciente.apellido_materno_pacientes,
                'nombres': paciente.nombres_pacientes,
                'cedula': paciente.cedula_pacientes,
                'fecha_nacimiento': paciente.fecha_nacimiento_pacientes,
                'direccion': paciente.direccion_pacientes,
                'email': paciente.email_pacientes,
                'genero': paciente.genero_pacientes,
                'telefono': paciente.telefono_pacientes,
                'emergencia_informar': paciente.emergencia_informar_pacientes,
                'contacto_emergencia': paciente.contacto_emergencia_pacientes,
                'seguro': paciente.seguro_pacientes,
                'genero_otro': paciente.genero_otro if paciente.genero_pacientes == 'Otro' else None,
                'seguro_otro': paciente.seguro_otro if paciente.seguro_pacientes == 'Otro' else None,
                'admisionista': paciente.fk_id_admisionista.username if paciente.fk_id_admisionista else None,
            }
        })
    except Pacientes.DoesNotExist:
        return JsonResponse({'error': 'Paciente no encontrado'}, status=404)
# Vista para actualizar los datos de un paciente
@login_required
def actualizar_paciente(request):
    if request.method == 'POST':
        paciente_id = request.POST.get('id_pacientes')
        try:
            paciente = Pacientes.objects.get(id_pacientes=paciente_id)

            # Recoger los datos enviados desde el formulario
            paciente.apellido_paterno_pacientes = request.POST.get('apellido_paterno_pacientes')
            paciente.apellido_materno_pacientes = request.POST.get('apellido_materno_pacientes')
            paciente.nombres_pacientes = request.POST.get('nombres_pacientes')
            paciente.cedula_pacientes = request.POST.get('cedula_pacientes')
            paciente.fecha_nacimiento_pacientes = request.POST.get('fecha_nacimiento_pacientes')
            paciente.direccion_pacientes = request.POST.get('direccion_pacientes')
            paciente.email_pacientes = request.POST.get('email_pacientes')

            # Género
            genero = request.POST.get('genero_pacientes')
            paciente.genero_pacientes = genero
            if genero == 'Otro':
                paciente.genero_otro = request.POST.get('genero_otro')  # Guardar el valor si se seleccionó 'Otro'
            else:
                paciente.genero_otro = None  # Limpiar el campo 'Otro' si no se seleccionó

            paciente.telefono_pacientes = request.POST.get('telefono_pacientes')
            paciente.emergencia_informar_pacientes = request.POST.get('emergencia_informar_pacientes')
            paciente.contacto_emergencia_pacientes = request.POST.get('contacto_emergencia_pacientes')

            # Seguro
            seguro = request.POST.get('seguro_pacientes')
            paciente.seguro_pacientes = seguro
            if seguro == 'Otro':
                paciente.seguro_otro = request.POST.get('seguro_otro')  # Guardar el valor si se seleccionó 'Otro'
            else:
                paciente.seguro_otro = None  # Limpiar el campo 'Otro' si no se seleccionó

            # Guardar los cambios en la base de datos
            paciente.save()

            # Enviar la respuesta con los datos actualizados
            return JsonResponse({'status': 'success', 'message': 'Paciente actualizado correctamente', 'paciente': {
                'apellido_paterno': paciente.apellido_paterno_pacientes,
                'apellido_materno': paciente.apellido_materno_pacientes,
                'nombres': paciente.nombres_pacientes,
                'cedula': paciente.cedula_pacientes,
                'fecha_nacimiento': paciente.fecha_nacimiento_pacientes,
                'direccion': paciente.direccion_pacientes,
                'email': paciente.email_pacientes,
                'genero': paciente.genero_pacientes,
                'telefono': paciente.telefono_pacientes,
                'emergencia_informar': paciente.emergencia_informar_pacientes,
                'contacto_emergencia': paciente.contacto_emergencia_pacientes,
                'seguro': paciente.seguro_pacientes,
                'admisionista': paciente.fk_id_admisionista.username,
            }})
        except Pacientes.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Paciente no encontrado'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})



#Eliminar
@csrf_exempt  # Si tu configuración de CSRF está causando problemas (asegúrate de que se maneje correctamente)
@login_required
def eliminar_paciente(request, paciente_id):
    if request.method == 'DELETE':
        try:
            paciente = Pacientes.objects.get(id_pacientes=paciente_id)
            paciente.delete()
            return JsonResponse({'status': 'success'})
        except Pacientes.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Paciente no encontrado'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})

# Función para calcular la edad
def calculate_age(birth_date):
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))