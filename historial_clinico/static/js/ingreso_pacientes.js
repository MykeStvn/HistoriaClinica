$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#tabla_pacientes').DataTable({
        "language": {
            "decimal": "",
            "emptyTable": "No hay datos disponibles en la tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de _MAX_ entradas totales)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "No se han encontrado resultados",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    // Lógica para mostrar/ocultar el campo "Otro" en el formulario de género
    $('#genero_pacientes_select').on('change', function () {
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
    $('#seguro_pacientes_select').on('change', function () {
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
    
    // Mostrar/Ocultar campos adicionales en el modal de edición
    $('#edit_genero_pacientes_select').on('change', function () {
        if ($(this).val() === "Otro") {
            $('#edit_genero_otro_div').show();
        } else {
            $('#edit_genero_otro_div').hide();
            $('#edit_genero_otro').val('');
        }
    });

    $('#edit_seguro_pacientes_select').on('change', function () {
        if ($(this).val() === "Otro") {
            $('#edit_seguro_otro_div').show();
        } else {
            $('#edit_seguro_otro_div').hide();
            $('#edit_seguro_otro').val('');
        }
    });

    // Función para agregar paciente mediante AJAX
    $('#formAddPaciente').on('submit', function (event) {
        event.preventDefault();  // Previene el envío del formulario para usar AJAX

        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                // Asegúrate de que la respuesta tenga un formato esperado
                if (response.status === 'success') {
                    // Crear la nueva fila con los datos del paciente
                    var newRow = [
                        response.paciente.apellido_paterno,
                        response.paciente.apellido_materno,
                        response.paciente.nombres,
                        response.paciente.cedula,
                        response.paciente.fecha_nacimiento,
                        response.paciente.edad,
                        response.paciente.direccion,
                        response.paciente.email,
                        response.paciente.genero,
                        response.paciente.telefono,
                        response.paciente.emergencia_informar,
                        response.paciente.contacto_emergencia,
                        response.paciente.seguro,
                        response.paciente.admisionista,
                        `<a href="#" class="btn btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#editIngresoPacientesModal" data-id="${response.paciente.id_pacientes}">Editar</a>
                        <a href="#" class="btn btn-danger btn-delete" data-id="${response.paciente.id_pacientes}">Eliminar</a>`
                        //para que complete la tabla si no me sale un error de que hay menos columnas
                        //igual inserto uno nuevo y ese no permite ni editar ni eliminar pero los otros si 
                    ];
                    
                    // Obtener la instancia del DataTable
                    var table = $('#tabla_pacientes').DataTable();

                    // Agregar la nueva fila al DataTable
                    table.row.add(newRow).draw(true);  // Esto agrega la fila y actualiza la tabla automáticamente

                    // Mostrar un mensaje de éxito
                    alert("Paciente agregado correctamente");

                    // Limpiar el formulario después de agregar el paciente
                    $('#formAddPaciente')[0].reset();
                    // Cierra el modal
                    $('#addIngresoPacientesModal').modal('hide');
                } else {
                    alert("Hubo un error al agregar el paciente");
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert("Hubo un error al agregar el paciente");
            }
        });
    });

    // Función para cargar datos de un paciente en el modal de edición
    function editarPaciente(pacienteId) {
        $.ajax({
            url: '/admisionistas/obtener_paciente/' + pacienteId + '/', // Ruta para obtener datos del paciente
            method: 'GET',
            headers: {
                'X-CSRFToken': '{{ csrf_token }}'
            },
            success: function (data) {
                // Verifica los datos en la consola para depuración
                console.log(data);

                // Llenar los campos del formulario
                $('#edit_pacienteId').val(data.paciente.id_pacientes);
                $('#edit_apellido_paterno_pacientes').val(data.paciente.apellido_paterno);
                $('#edit_apellido_materno_pacientes').val(data.paciente.apellido_materno);
                $('#edit_nombres_pacientes').val(data.paciente.nombres);
                $('#edit_cedula_pacientes').val(data.paciente.cedula);
                $('#edit_fecha_nacimiento_pacientes').val(data.paciente.fecha_nacimiento);
                $('#edit_direccion_pacientes').val(data.paciente.direccion);
                $('#edit_email_pacientes').val(data.paciente.email);
                $('#edit_telefono_pacientes').val(data.paciente.telefono);
                $('#edit_emergencia_informar_pacientes').val(data.paciente.emergencia_informar);
                $('#edit_contacto_emergencia_pacientes').val(data.paciente.contacto_emergencia);
                $('#edit_fk_id_admisionista').val(data.paciente.admisionista);
                // Género
                if (data.paciente.genero !== "Masculino" && data.paciente.genero !== "Femenino") {
                    $('#edit_genero_otro_div').show(); // Mostrar el campo adicional
                    $('#edit_genero_otro').val(data.paciente.genero); // Cargar el valor ingresado en el campo de texto
                    $('#edit_genero_pacientes_select').val("Otro"); // Seleccionar automáticamente "Otro" en el select
                } else {
                    $('#edit_genero_otro_div').hide(); // Ocultar el campo adicional
                    $('#edit_genero_otro').val(''); // Limpiar el campo de texto
                    $('#edit_genero_pacientes_select').val(data.paciente.genero); // Seleccionar el valor correspondiente en el select
                }
                // Seguro
                if (data.paciente.seguro !== "IESS" && data.paciente.seguro !== "ISSPOL" && data.paciente.seguro !== "ISSFA") {
                    $('#edit_seguro_otro_div').show(); // Mostrar el campo adicional
                    $('#edit_seguro_otro').val(data.paciente.seguro); // Cargar el valor ingresado en el campo de texto
                    $('#edit_seguro_pacientes_select').val("Otro"); // Seleccionar automáticamente "Otro" en el select
                } else {
                    $('#edit_seguro_otro_div').hide(); // Ocultar el campo adicional
                    $('#edit_seguro_otro').val(''); // Limpiar el campo de texto
                    $('#edit_seguro_pacientes_select').val(data.paciente.seguro); // Seleccionar el valor correspondiente en el select
                }
                // Mostrar el modal
                $('#editIngresoPacientesModal').modal('show');
            },
            error: function () {
                alert('Error al obtener los datos del paciente.');
            }
        });
    }

    // Enviar el formulario de actualización mediante AJAX
    $(document).on('submit', '#formEditPaciente', function (e) {
        e.preventDefault(); // Prevenir el envío normal del formulario

        var formData = $(this).serialize(); // Serializar los datos del formulario

        $.ajax({
            url: '/admisionistas/actualizar_paciente/',  // Ruta para actualizar paciente
            method: 'POST',
            data: formData,
            headers: {
                'X-CSRFToken': '{{ csrf_token }}'
            },
            success: function (response) {
                if (response.status === 'success') {
                    alert('Paciente actualizado correctamente');
                    // Aquí puedes agregar código para actualizar la tabla sin recargar la página si es necesario
                    $('#editIngresoPacientesModal').modal('hide'); // Cerrar el modal
                } else {
                    alert('Error al actualizar el paciente: ' + response.message);
                }
            },
            error: function () {
                alert('Hubo un problema al actualizar el paciente.');
            }
        });
    });

    $(document).on('click', '.edit-btn', function () {
        var pacienteId = $(this).data('id');
        editarPaciente(pacienteId);
    });

    // Lógica para eliminar paciente con AJAX
    $(document).on('click', '.btn-delete', function (e) {
        e.preventDefault();  // Evitar el comportamiento por defecto del enlace
    
        var pacienteId = $(this).data('id');  // Obtener el ID del paciente desde el data-id
    
        if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
            $.ajax({
                url: '/admisionistas/eliminar_paciente/' + pacienteId + '/',  // Asegúrate de que no haya barras dobles
                method: 'DELETE',  // Método DELETE
                success: function (response) {
                    if (response.status === 'success') {
                        alert('Paciente eliminado correctamente');
                        // Eliminar la fila de la tabla
                        $('#paciente-row-' + pacienteId).remove();  // Suponiendo que cada fila tiene el ID paciente-row-{id}
                    } else {
                        alert('Error al eliminar el paciente: ' + response.message);
                    }
                },
                error: function (xhr, status, error) {
                    alert('Hubo un problema al eliminar el paciente.');
                }
            });
        }
    });    
});
