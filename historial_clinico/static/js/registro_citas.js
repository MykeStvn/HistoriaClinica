$(document).ready(function () {
    // Inicializar DataTable con datos dinámicos
    var table = $("#tabla_citas").DataTable({
        ajax: {
            url: "/admisionistas/cargar_citas/",
            type: "GET",
            dataSrc: "data", // Ruta donde están los datos en el JSON
        },
        columns: [
            { data: "apellido_paterno_pacientes" }, // Apellido Paterno
            { data: "apellido_materno_pacientes" }, // Apellido Materno
            { data: "nombres_pacientes" }, // Apellido Materno
            { data: "cedula_pacientes" }, // Cédula
            { data: "fecha_cita" }, // Fecha Cita
            { data: "hora_cita" }, // Hora Cita
            { data: "estado_cita" }, // Hora Cita
            { data: "acciones" } // Acciones (botón eliminar)
        ],
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100],
        language: {
            decimal: "",
            emptyTable: "No existen citas para el día de hoy",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de _MAX_ entradas totales)",
            lengthMenu: "Mostrar _MENU_ entradas",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Buscar:",
            zeroRecords: "No se han encontrado resultados",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior",
            },
        },
    });

    // Manejar la eliminación de citas con AJAX
    $('#tabla_citas').on('click', '.eliminar-cita', function () {
        const idCita = $(this).data('id'); // Obtener el ID de la cita
        const url = `/admisionistas/eliminar_cita/${idCita}/`; // Ruta para eliminar la cita

        if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
                },
                success: function (response) {
                    // Mostrar mensaje de éxito
                    alert(response.success);
                    // Recargar la tabla para reflejar los cambios
                    table.ajax.reload();
                },
                error: function (xhr) {
                    if (xhr.status === 404) {
                        alert('Cita no encontrada.');
                    } else {
                        alert('Error al eliminar la cita.');
                    }
                },
            });
        }
    });
});