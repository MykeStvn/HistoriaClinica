from datetime import date
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from Aplicaciones.usuarios.models import Usuarios
from Aplicaciones.admisionistas.models import Citas
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
                f'<button class="btn btn-success btn-sm registrar-cita" data-id="{cita.id_cita}">'
                f'<i class="bi bi-check-circle-fill"></i> </button>'
                
                f'<button class="btn btn-danger btn-sm cancelar-cita" data-id="{cita.id_cita}">'
                f'<i class="bi bi-x-circle-fill"></i> </button>'
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