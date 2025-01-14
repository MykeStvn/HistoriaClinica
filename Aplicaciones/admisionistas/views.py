from datetime import date, datetime
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from Aplicaciones.admisionistas.models import Pacientes
from Aplicaciones.usuarios.models import Usuarios
from django.views.decorators.csrf import csrf_exempt



# Vista para buscar pacientes por cédula (BUSCADOR)
def buscar_pacientes(request):
    pacientes = []  # Inicializa como lista vacía
    query = request.GET.get('cedula_pacientes')  # Obtén el parámetro de búsqueda desde la solicitud

    if query:  # Si hay una búsqueda
        pacientes = Pacientes.objects.filter(cedula_pacientes__icontains=query)  # Realiza la búsqueda

    for paciente in pacientes:
        paciente.edad = calculate_age(paciente.fecha_nacimiento_pacientes)

    return render(request, 'admisionistas/ingreso_pacientes.html', {'pacientes': pacientes})

# Vista para ingresar pacientes OK
@login_required
def ingreso_pacientes(request):
    if request.user.tipo_usuario != 'admisionista':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es admisionista
    
    pacientesBdd = Pacientes.objects.all()
    for paciente in pacientesBdd:
        paciente.edad = calculate_age(paciente.fecha_nacimiento_pacientes)
    
    admisionistas = Usuarios.objects.filter(tipo_usuario='admisionista')
    
    return render(request, 'admisionistas/ingreso_pacientes.html', {'pacientes': pacientesBdd, 'usuarios': admisionistas})


# Vista para agregar un nuevo paciente OK
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
        estado_civil_pacientes = request.POST.get('estado_civil_pacientes')
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
            estado_civil_pacientes = estado_civil_pacientes,
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
            'estado_civil': paciente.estado_civil_pacientes,
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
                'estado_civil': paciente.estado_civil_pacientes,
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
#Actualizar
@login_required
def actualizar_paciente(request):
    if request.method == 'POST':
        paciente_id = request.POST.get('id_pacientes')
        try:
            paciente = Pacientes.objects.get(id_pacientes=paciente_id)

            # Actualizar los campos (excepto la fecha por ahora)
            paciente.apellido_paterno_pacientes = request.POST.get('apellido_paterno_pacientes')
            paciente.apellido_materno_pacientes = request.POST.get('apellido_materno_pacientes')
            paciente.nombres_pacientes = request.POST.get('nombres_pacientes')
            paciente.cedula_pacientes = request.POST.get('cedula_pacientes')
            paciente.direccion_pacientes = request.POST.get('direccion_pacientes')
            paciente.email_pacientes = request.POST.get('email_pacientes')
            paciente.estado_civil_pacientes = request.POST.get('estado_civil_pacientes')

            # Manejo del género
            genero = request.POST.get('genero_pacientes')
            paciente.genero_pacientes = request.POST.get('genero_otro') if genero == 'Otro' else genero

            paciente.telefono_pacientes = request.POST.get('telefono_pacientes')
            paciente.emergencia_informar_pacientes = request.POST.get('emergencia_informar_pacientes')
            paciente.contacto_emergencia_pacientes = request.POST.get('contacto_emergencia_pacientes')

            # Manejo del seguro
            seguro = request.POST.get('seguro_pacientes')
            paciente.seguro_pacientes = request.POST.get('seguro_otro') if seguro == 'Otro' else seguro


            #MANEJO DE LA FECHA DE NACIMIENTO IMPORTANTE
            fecha_nacimiento_str = request.POST.get('fecha_nacimiento_pacientes')
            if fecha_nacimiento_str:  # Verifica que la cadena no esté vacía
                try:
                    paciente.fecha_nacimiento_pacientes = datetime.strptime(fecha_nacimiento_str, '%Y-%m-%d').date()
                except ValueError:  # Intenta otro formato si falla el primero
                    try:
                        paciente.fecha_nacimiento_pacientes = datetime.strptime(fecha_nacimiento_str, '%d/%m/%Y').date()
                    except ValueError:
                        return JsonResponse({'status': 'error', 'message': 'Formato de fecha inválido. Use AAAA-MM-DD o DD/MM/AAAA'})
            else:
                paciente.fecha_nacimiento_pacientes = None  # Maneja el caso de fecha vacía

            paciente.save()  # Guarda el paciente *después* de procesar la fecha

            # Calcular la edad *solo si hay fecha de nacimiento*
            edad = calculate_age(paciente.fecha_nacimiento_pacientes) if paciente.fecha_nacimiento_pacientes else None

            # Construir la respuesta JSON
            response_data = {
                'status': 'success',
                'message': 'Paciente actualizado correctamente',
                'paciente': {
                    'id_pacientes': paciente.id_pacientes,
                    'apellido_paterno': paciente.apellido_paterno_pacientes,
                    'apellido_materno': paciente.apellido_materno_pacientes,
                    'nombres': paciente.nombres_pacientes,
                    'cedula': paciente.cedula_pacientes,
                    'fecha_nacimiento': paciente.fecha_nacimiento_pacientes.strftime('%Y-%m-%d') if paciente.fecha_nacimiento_pacientes else None,  # Formato para JavaScript
                    'edad': edad,
                    'direccion': paciente.direccion_pacientes,
                    'email': paciente.email_pacientes,
                    'estado_civil': paciente.estado_civil_pacientes,
                    'genero': paciente.genero_pacientes,
                    'telefono': paciente.telefono_pacientes,
                    'emergencia_informar': paciente.emergencia_informar_pacientes,
                    'contacto_emergencia': paciente.contacto_emergencia_pacientes,
                    'seguro': paciente.seguro_pacientes,
                    'admisionista': paciente.fk_id_admisionista.username,
                }
            }
            return JsonResponse(response_data)

        except Pacientes.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Paciente no encontrado'})
        except Exception as e:
            import traceback #Para ver el error completo
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': f'Error al actualizar: {str(e)}'}) #Devuelve el error
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


#validación cédula ECUATORIANA
# Función para validar el dígito verificador de la cédula
def validar_cedula(cedula):
    # Validar longitud
    if len(cedula) != 10:
        return False
    
    # Validar los dos primeros dígitos (provincia) [01-24]
    provincia = int(cedula[:2])
    if provincia < 1 or provincia > 24:
        return False
    
    # Validar el tercer dígito [0-5]
    tercer_digito = int(cedula[2])
    if tercer_digito < 0 or tercer_digito > 5:
        return False

    # Coeficientes para el cálculo del dígito verificador
    coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
    suma = 0

    # Multiplicar cada dígito de la cédula por su coeficiente y ajustar si es mayor o igual a 10
    for i in range(9):
        resultado = int(cedula[i]) * coeficientes[i]
        if resultado >= 10:
            resultado -= 9
        suma += resultado

    # Calcular la decena superior de la suma
    decena_superior = (suma // 10 + 1) * 10

    # Calcular el dígito verificador
    digito_verificador = decena_superior - suma

    # Verificar si el dígito verificador coincide con el décimo dígito
    return digito_verificador == int(cedula[9])

#verifico cédula INGRESAR
@login_required
def verificar_cedula(request):
    if request.method == 'POST':
        cedula = request.POST.get('cedula_pacientes')  # Campo esperado del formulario
        # Validación de la cédula
        if not validar_cedula(cedula):
            return JsonResponse({'exists': True, 'valid': False, 'message': 'Cédula inválida'})
        # Verificar si la cédula existe en la base de datos
        exists = Pacientes.objects.filter(cedula_pacientes=cedula).exists()
        return JsonResponse({'exists': exists})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido'})
#verifico cedula ACTUALIZAR
@login_required
def verificar_cedula_actualizar(request):
    if request.method == "POST":
        paciente_id = request.POST.get('id_pacientes')  # Usar 'id_pacientes' en lugar de 'paciente_id'
        cedula = request.POST.get('cedula_pacientes')  # Usar 'cedula_pacientes' en lugar de 'cedula'

        # Validar que paciente_id y cedula no estén vacíos
        if not paciente_id or not cedula:
            return JsonResponse({'status': 'error', 'message': 'Faltan datos importantes.'}, status=400)

        try:
            paciente_id = int(paciente_id)  # Convertir el id del paciente a entero
        except ValueError:
            return JsonResponse({'status': 'error', 'message': 'ID de paciente no válido.'}, status=400)

        # Verificar si ya existe otro paciente con la misma cédula pero con un id diferente
        existe = Pacientes.objects.filter(cedula_pacientes=cedula).exclude(id_pacientes=paciente_id).exists()

        if existe:
            return JsonResponse({'status': 'error', 'message': 'Ya existe un paciente con esta cédula.'}, status=400)

        return JsonResponse({'status': 'success', 'message': 'Cédula disponible.'})


# Función para calcular la edad
def calculate_age(birth_date):
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))