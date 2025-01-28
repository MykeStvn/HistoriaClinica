from datetime import date
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse

from Aplicaciones.usuarios.models import Usuarios
from Aplicaciones.admisionistas.models import Citas, Pacientes
from Aplicaciones.gestion_pacientes.models import HistorialClinico




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

#cargar la tabla (listar citas de hoy)
@login_required
def cargar_citas(request):
    """Carga las citas del día actual en formato JSON para DataTables."""
    if request.method == "GET" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        fecha_actual = date.today()  # Obtener la fecha actual
        citas = Citas.objects.select_related('fk_id_paciente').filter(fecha_cita=fecha_actual)  # Filtrar por fecha actual

        data = []
        for cita in citas:
            acciones_html = (
            f'<a href="{reverse("gestion_pacientes:registro_cita", kwargs={"id_cita": cita.id_cita})}" '
            f'class="btn btn-success btn-sm registrar-cita">'
            f'<i class="bi bi-check-circle-fill"></i></a>'
            
            f'<button class="btn btn-danger btn-sm cancelar-cita" data-id="{cita.id_cita}">'
            f'<i class="bi bi-x-circle-fill"></i></button>'
        )


            data.append({
                'apellido_paterno_pacientes': cita.fk_id_paciente.apellido_paterno_pacientes,
                'apellido_materno_pacientes': cita.fk_id_paciente.apellido_materno_pacientes,
                'nombres_pacientes': cita.fk_id_paciente.nombres_pacientes,
                'cedula_pacientes': cita.fk_id_paciente.cedula_pacientes,
                'fecha_cita': cita.fecha_cita.strftime('%Y-%m-%d'),
                'hora_cita': cita.hora_cita.strftime('%H:%M'),
                'estado_cita': cita.estado_cita,
                'acciones': acciones_html,
            })

        return JsonResponse({'data': data}, status=200)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

#cargar la vista para cada uno de los pacients con ID
@login_required
def registro_cita(request, id_cita):
    if request.user.tipo_usuario != 'doctor':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es doctor

    # Busca la cita usando el id_cita
    cita = get_object_or_404(Citas.objects.select_related('fk_id_paciente'), id_cita=id_cita)

    # Verificar el estado de la cita
    if cita.estado_cita in ['CANCELADO', 'COMPLETADO']:
        return redirect('gestion_pacientes:citas')  # Redirige a la lista de citas si está cancelada o completada

    doctores = Usuarios.objects.filter(tipo_usuario='doctor')
    doctor = request.user

    if request.method == 'POST':
        # Capturamos los datos desde request.POST (suponiendo que los campos se envían en el formulario)
        fecha_atencion = request.POST.get('fecha_atencion_historial')
        hora_atencion = request.POST.get('hora_atencion_historial')
        presion_arterial = request.POST.get('presion_arterial_historial')
        temperatura = request.POST.get('temperatura_historial')
        saturacion_oxigeno = request.POST.get('saturacion_oxigeno_historial')
        frecuencia_respiratoria = request.POST.get('frecuencia_respiratoria_historial')
        peso = request.POST.get('peso_historial')
        talla = request.POST.get('talla_historial')
        nombre_sintoma = request.POST.get('nombre_sintoma_historial')
        descripcion_sintoma = request.POST.get('descripcion_sintoma_historial')
        gravedad_sintoma = request.POST.get('gravedad_sintoma_historial')
        inicio_sintoma = request.POST.get('inicio_sintoma_historial')
        duracion_sintoma = request.POST.get('duracion_sintoma_historial')
        frecuencia_sintoma = request.POST.get('frecuecia_sintoma_historial')
        tipo_sintoma = request.POST.get('tipo_sintoma_historial')
        nombre_diagnostico = request.POST.get('nombre_diagnostico_historial')
        descripcion_diagnostico = request.POST.get('descripcion_diagnostico_historial')
        cie10_diagnostico = request.POST.get('cie10_diagnostico_historial')
        medicamento_tratamiento = request.POST.get('medicamento_tratamiento_historial')
        instrucciones_tratamiento = request.POST.get('instrucciones_tratamiento_historial')
        fecha_inicio_tratamiento = request.POST.get('fecha_inicio_tratamiento_historial')
        fecha_fin_tratamiento = request.POST.get('fecha_fin_tratamiento_historial')
        observaciones_tratamiento = request.POST.get('observaciones_tratamiento_historial')

        # Creamos el historial clínico sin guardar aún
        historial = HistorialClinico(
            fk_id_cita=cita,
            fk_id_doctor=doctor,  # Usamos el doctor logueado
            fecha_atencion_historial=fecha_atencion,
            hora_atencion_historial=hora_atencion,
            presion_arterial_historial=presion_arterial,
            temperatura_historial=temperatura,
            saturacion_oxigeno_historial=saturacion_oxigeno,
            frecuencia_respiratoria_historial=frecuencia_respiratoria,
            peso_historial=peso,
            talla_historial=talla,
            nombre_sintoma_historial=nombre_sintoma,
            descripcion_sintoma_historial=descripcion_sintoma,
            gravedad_sintoma_historial=gravedad_sintoma,
            inicio_sintoma_historial=inicio_sintoma,
            duracion_sintoma_historial=duracion_sintoma,
            frecuecia_sintoma_historial=frecuencia_sintoma,
            tipo_sintoma_historial=tipo_sintoma,
            nombre_diagnostico_historial=nombre_diagnostico,
            descripcion_diagnostico_historial=descripcion_diagnostico,
            cie10_diagnostico_historial=cie10_diagnostico,
            medicamento_tratamiento_historial=medicamento_tratamiento,
            instrucciones_tratamiento_historial=instrucciones_tratamiento,
            fecha_inicio_tratamiento_historial=fecha_inicio_tratamiento,
            fecha_fin_tratamiento_historial=fecha_fin_tratamiento,
            observaciones_tratamiento_historial=observaciones_tratamiento
        )

        # Guardamos el historial clínico
        historial.save()

        # Actualizamos el estado de la cita a COMPLETADO
        cita.estado_cita = 'COMPLETADO'  # Cambiamos el estado de la cita
        cita.save()  # Guardamos los cambios en la cita

        # Redirigimos a una vista donde se muestre la lista de citas
        return redirect('gestion_pacientes:citas')  # Usa el nombre definido en urls.py

    context = {
        'cita': cita,
        'paciente': cita.fk_id_paciente,  # Paciente relacionado con la cita
        'doctores': doctores,
        'doctor': doctor,  # Incluimos al doctor que está registrando el historial
    }

    return render(request, 'gestion_pacientes/registro_cita.html', context)

#PARA CANCELAR LA CITA
@login_required
def cancelar_cita(request, id_cita):
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        cita = get_object_or_404(Citas, id_cita=id_cita)

        # Actualiza el estado de la cita
        cita.estado_cita = "CANCELADO"
        cita.save()

        return JsonResponse({'message': 'Cita cancelada correctamente.'}, status=200)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

#LISTO LAS HISTORIAS CLINICAS (tabla historial clinico)
def historias_clinicas(request):
    historias = HistorialClinico.objects.select_related('fk_id_cita__fk_id_paciente').all() 
    #el SELCT_RELATED ayuda a cargar datos relaciones por las llaves foráneas
    return render(request, 'gestion_pacientes/historias_clinicas.html', {'historias': historias})

# VER EL HISTORIAL CLINICO DE CADA UNA DE LAS CITAS
def ver_historial_clinico(request, id_paciente):
    # Obtén el paciente
    paciente = get_object_or_404(Pacientes, id_pacientes=id_paciente)

    # Obtén el historial clínico más reciente del paciente
    historial_clinico = HistorialClinico.objects.filter(fk_id_cita__fk_id_paciente=paciente).last()

    # Renderiza la plantilla con los datos
    return render(request, 'gestion_pacientes/ver_historial_clinico.html', {
        'paciente': paciente,
        'historial_clinico': historial_clinico,
    })



