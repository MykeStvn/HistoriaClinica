$(document).ready(function() {
    // Inicializar DataTable
    var table = $('#tabla_pacientes').DataTable({
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay datos disponibles en la tabla",
            "info":           "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty":      "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered":   "(filtrado de _MAX_ entradas totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Mostrar _MENU_ entradas",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se han encontrado resultados",
            "paginate": {
                "first":      "Primero",
                "last":       "Último",
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
            "aria": {
                "sortAscending":  ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    // Lógica para mostrar/ocultar el campo "Otro" en el formulario de género
    $('#genero_pacientes_select').on('change', function() {
        const value = $(this).val();
        const generoOtroDiv = $('#genero_otro_div');
        const generoOtroInput = $('#genero_otro');

        if (value === 'Otro') {
            generoOtroDiv.show();
            generoOtroInput.prop('required', true);
        } else {
            generoOtroDiv.hide();
            generoOtroInput.val(''); // Limpia el valor si no es "Otro"
            generoOtroInput.prop('required', false);
        }
    });

    // Lógica para mostrar/ocultar el campo "Otro" en el formulario de seguro
    $('#seguro_pacientes_select').on('change', function() {
        const value = $(this).val();
        const seguroOtroDiv = $('#seguro_otro_div');
        const seguroOtroInput = $('#seguro_otro');

        if (value === 'Otro') {
            seguroOtroDiv.show();
            seguroOtroInput.prop('required', true);
        } else {
            seguroOtroDiv.hide();
            seguroOtroInput.val(''); // Limpia el valor si no es "Otro"
            seguroOtroInput.prop('required', false);
        }
    });

    // Enviar formulario a través de AJAX
    $('#formAddPaciente').on('submit', function(event) {
        event.preventDefault();  // Previene el envío del formulario para usar AJAX
    
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                // Asegúrate de que la respuesta tenga un formato esperado
                if (response.status === 'success') {
                    // Agregar el nuevo paciente a la tabla sin recargar la página
                    table.row.add([
                        response.paciente.apellido_paterno,      // Apellido Paterno
                        response.paciente.apellido_materno,      // Apellido Materno
                        response.paciente.nombres,              // Nombres
                        response.paciente.cedula,               // Cédula
                        response.paciente.fecha_nacimiento,     // Fecha de nacimiento
                        response.paciente.edad,                 // Edad
                        response.paciente.direccion,            // Dirección
                        response.paciente.email,                // Email
                        response.paciente.genero,               // Género
                        response.paciente.telefono,             // Teléfono
                        response.paciente.emergencia_informar,  // Emergencia a informar
                        response.paciente.contacto_emergencia,  // Contacto emergencia
                        response.paciente.seguro,               // Seguro
                        response.paciente.admisionista,          // Admisionista
                        '<button class="edit-btn btn btn-warning">Editar</button>' +
                        '<button class="delete-btn btn btn-danger">Eliminar</button>'
                    ]).draw(false); // Actualiza la tabla sin recargarla

                    // Mostrar un mensaje de éxito
                    alert("Paciente agregado correctamente");

                    // Limpiar el formulario después de agregar el paciente
                    $('#formAddPaciente')[0].reset();
                    //cierro modal
                    $('#addIngresoPacientesModal').modal('hide');  // Cierra el modal (ajusta el ID de tu modal si es diferente)
                } else {
                    alert("Hubo un error al agregar el paciente");
                }
            },
            error: function(xhr, status, error) {
                console.log(error);
                alert("Hubo un error al agregar el paciente");
            }
        });
    });
});
