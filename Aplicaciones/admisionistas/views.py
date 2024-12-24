from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from datetime import date
from Aplicaciones.admisionistas.models import Pacientes

#Con esto cargo la vista
@login_required
def ingreso_pacientes(request):
    if request.user.tipo_usuario != 'admisionista':
        return redirect('usuarios:login')  # Redirige a la página de login si el usuario no es admisionista
    # Obtener pacientes y calcular edad
    pacientesBdd = Pacientes.objects.all()
    for paciente in pacientesBdd:
        paciente.edad = calculate_age(paciente.fecha_nacimiento_pacientes)

    return render(request, 'admisionistas/ingreso_pacientes.html',{'pacientes': pacientesBdd})

# Función para calcular edad
def calculate_age(birth_date):
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
