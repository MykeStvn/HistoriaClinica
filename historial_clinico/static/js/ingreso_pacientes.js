$(document).ready(function () {
    var table = $("#tabla_pacientes").DataTable({
        "columns": [
          { "data": "id_pacientes", "visible": false },  // Columna ID oculta
          { "data": "apellido_paterno_pacientes" }, // Apellido Paterno
          { "data": "apellido_materno_pacientes" }, // Apellido Materno
          { "data": "nombres_pacientes" }, // Nombres
          { "data": "cedula_pacientes" }, // Cédula
          { "data": "fecha_nacimiento_pacientes" }, // Fecha de Nacimiento
          { "data": "edad" }, // Edad
          { "data": "direccion_pacientes" }, // Dirección
          { "data": "email_pacientes" }, // Email
          { "data": "genero_pacientes" }, // Género
          { "data": "telefono_pacientes" }, // Teléfono
          { "data": "emergencia_informar_pacientes" }, // En caso de emergencia informar a
          { "data": "contacto_emergencia_pacientes" }, // Contacto de emergencia
          { "data": "seguro_pacientes" }, // Seguro Médico
          { "data": "fk_id_admisionista__username" }, // Admisionista
          { "data": "acciones" }  // Acciones
        ],
        language: {
          decimal: "",
          emptyTable: "No hay datos disponibles en la tabla",
          info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
          infoEmpty: "Mostrando 0 a 0 de 0 entradas",
          infoFiltered: "(filtrado de _MAX_ entradas totales)",
          infoPostFix: "",
          thousands: ",",
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
          aria: {
            sortAscending: ": activar para ordenar la columna de manera ascendente",
            sortDescending: ": activar para ordenar la columna de manera descendente",
          },
        },
      });
      

  // Lógica para mostrar/ocultar el campo "Otro" en el formulario de género
  $("#genero_pacientes_select, #edit_genero_pacientes_select").on(
    "change",
    function () {
      const value = $(this).val();
      const generoOtroDiv =
        $(this).attr("id") === "genero_pacientes_select"
          ? $("#genero_otro_div")
          : $("#edit_genero_otro_div");
      const generoOtroInput =
        $(this).attr("id") === "genero_pacientes_select"
          ? $("#genero_otro")
          : $("#edit_genero_otro");

      if (value === "Otro") {
        generoOtroDiv.show();
        generoOtroInput.prop("required", true);
      } else {
        generoOtroDiv.hide();
        generoOtroInput.val(""); // Limpia el valor si no es "Otro"
        generoOtroInput.prop("required", false);
      }
    }
  );

  // Lógica para mostrar/ocultar el campo "Otro" en el formulario de seguro
  $("#seguro_pacientes_select, #edit_seguro_pacientes_select").on(
    "change",
    function () {
      const value = $(this).val();
      const seguroOtroDiv =
        $(this).attr("id") === "seguro_pacientes_select"
          ? $("#seguro_otro_div")
          : $("#edit_seguro_otro_div");
      const seguroOtroInput =
        $(this).attr("id") === "seguro_pacientes_select"
          ? $("#seguro_otro")
          : $("#edit_seguro_otro");

      if (value === "Otro") {
        seguroOtroDiv.show();
        seguroOtroInput.prop("required", true);
      } else {
        seguroOtroDiv.hide();
        seguroOtroInput.val(""); // Limpia el valor si no es "Otro"
        seguroOtroInput.prop("required", false);
      }
    }
  );


  // Evento de clic en el botón de eliminar (delegación de eventos)
$(document).on("click", ".btn-delete", function () {
    var pacienteId = $(this).data("id"); // Obtén el ID del paciente a eliminar
    var fila = $(this).closest("tr"); // Almacena la fila donde se encuentra el botón

    // Obtener el nombre y apellido del paciente desde la fila
    var apellidoPaterno = fila.find("td").eq(0).text(); // Apellido Paterno
    var apellidoMaterno = fila.find("td").eq(1).text(); // Apellido Materno
    var nombres = fila.find("td").eq(2).text(); // Nombres
  
    // Preguntar al usuario si está seguro de eliminar
    if (confirm("¿Estás seguro de eliminar a " + apellidoPaterno + " " + apellidoMaterno + " " + nombres + "?")) {
      $.ajax({
        url: "/admisionistas/eliminar_paciente/" + pacienteId + "/",
        method: "DELETE", // O el método adecuado según tu backend
        success: function (response) {
          if (response.status === "success") {
            // Aquí eliminamos la fila de la tabla sin recargar la página
            var table = $("#tabla_pacientes").DataTable();
            table.row(fila).remove().draw(); // Elimina la fila de la tabla
            alert("Paciente eliminado correctamente.");            
          } else {
            alert("Hubo un error al eliminar el paciente.");
          }
        },
        error: function () {
          alert("Error al eliminar el paciente.");
        },
      });
    }
  });
  

  // Función para agregar paciente mediante AJAX
  $("#formAddPaciente").on("submit", function (event) {
    event.preventDefault(); // Previene el envío del formulario para usar AJAX

    $.ajax({
      url: $(this).attr("action"),
      method: "POST",
      data: $(this).serialize(),
      success: function (response) {
        if (response.status === "success") {
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
               <a href="#" class="btn btn-danger btn-delete" data-id="${response.paciente.id_pacientes}">Eliminar</a>`,
          ];

          var table = $("#tabla_pacientes").DataTable();
          table.row.add(newRow).draw(true); // Agrega la fila y actualiza la tabla

          alert("Paciente agregado correctamente");

          $("#formAddPaciente")[0].reset(); // Limpiar formulario
          $("#addIngresoPacientesModal").modal("hide"); // Cerrar modal
          $(".modal-backdrop").remove(); // Eliminar capa de fondo
          $("body").removeClass("modal-open");
        } else {
          alert("Hubo un error al agregar el paciente");
        }
      },
      error: function () {
        alert("Hubo un error al agregar el paciente");
      },
    });
  });

  // Función para cargar datos de un paciente en el modal de edición
  function editarPaciente(pacienteId) {
    $.ajax({
      url: "/admisionistas/obtener_paciente/" + pacienteId + "/",
      method: "GET",
      success: function (data) {
        $("#edit_pacienteId").val(data.paciente.id_pacientes);
        $("#edit_apellido_paterno_pacientes").val(
          data.paciente.apellido_paterno
        );
        $("#edit_apellido_materno_pacientes").val(
          data.paciente.apellido_materno
        );
        $("#edit_nombres_pacientes").val(data.paciente.nombres);
        $("#edit_cedula_pacientes").val(data.paciente.cedula);
        $("#edit_fecha_nacimiento_pacientes").val(
          data.paciente.fecha_nacimiento
        );
        $("#edit_direccion_pacientes").val(data.paciente.direccion);
        $("#edit_email_pacientes").val(data.paciente.email);
        $("#edit_telefono_pacientes").val(data.paciente.telefono);
        $("#edit_emergencia_informar_pacientes").val(
          data.paciente.emergencia_informar
        );
        $("#edit_contacto_emergencia_pacientes").val(
          data.paciente.contacto_emergencia
        );
        $("#edit_fk_id_admisionista").val(data.paciente.admisionista);

        // Género
        if (
          data.paciente.genero !== "Masculino" &&
          data.paciente.genero !== "Femenino"
        ) {
          $("#edit_genero_otro_div").show();
          $("#edit_genero_otro").val(data.paciente.genero);
          $("#edit_genero_pacientes_select").val("Otro");
        } else {
          $("#edit_genero_otro_div").hide();
          $("#edit_genero_otro").val("");
          $("#edit_genero_pacientes_select").val(data.paciente.genero);
        }

        // Seguro
        if (
          data.paciente.seguro !== "IESS" &&
          data.paciente.seguro !== "ISSPOL" &&
          data.paciente.seguro !== "ISSFA"
        ) {
          $("#edit_seguro_otro_div").show();
          $("#edit_seguro_otro").val(data.paciente.seguro);
          $("#edit_seguro_pacientes_select").val("Otro");
        } else {
          $("#edit_seguro_otro_div").hide();
          $("#edit_seguro_otro").val("");
          $("#edit_seguro_pacientes_select").val(data.paciente.seguro);
        }

        $("#editIngresoPacientesModal").modal("show");
      },
      error: function () {
        alert("Error al obtener los datos del paciente.");
      },
    });
  }

  // Enviar el formulario de actualización mediante AJAX
  $(document).on("submit", "#formEditPaciente", function (e) {
    e.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
      url: "/admisionistas/actualizar_paciente/",
      method: "POST",
      data: formData,
      success: function (response) {
        if (response.status === "success") {
          alert("Paciente actualizado correctamente");        
           // Actualizar la fila en la tabla
           var pacienteId = response.paciente.id_pacientes; // Obtener el ID del paciente
           var fila = $("#tabla_pacientes tbody tr").filter(function() {
               return $(this).find("td").eq(0).text() == pacienteId; // Filtrar por ID
           });

           // Actualizar los datos de la fila
           fila.find("td").eq(1).text(response.paciente.apellido_paterno); // Apellido Paterno
           fila.find("td").eq(2).text(response.paciente.apellido_materno); // Apellido Materno
           fila.find("td").eq(3).text(response.paciente.nombres); // Nombres
           fila.find("td").eq(4).text(response.paciente.cedula); // Cédula
           fila.find("td").eq(5).text(response.paciente.fecha_nacimiento); // Fecha de Nacimiento
        //    fila.find("td").eq(6).text(response.paciente.edad); // Edad
           fila.find("td").eq(6).text(response.paciente.direccion); // Dirección
           fila.find("td").eq(7).text(response.paciente.email); // Email
           fila.find("td").eq(8).text(response.paciente.genero); // Género
           fila.find("td").eq(9).text(response.paciente.telefono); // Teléfono
           fila.find("td").eq(10).text(response.paciente.emergencia_informar); // Emergencia Informar
           fila.find("td").eq(11).text(response.paciente.contacto_emergencia); // Contacto Emergencia
           fila.find("td").eq(12).text(response.paciente.seguro); // Seguro Médico
           fila.find("td").eq(13).text(response.paciente.admisionista); // Admisionista

            // actualizarTablaPacientes();

          $("#editIngresoPacientesModal").modal("hide");
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
        } else {
          alert("Error al actualizar el paciente: " + response.message);
        }
      },
      error: function () {
        alert("Hubo un problema al actualizar el paciente.");
      },
    });
  });

  $(document).on("click", ".edit-btn", function () {
    var pacienteId = $(this).data("id");
    editarPaciente(pacienteId);
  });

  // Función para actualizar la tabla con los datos más recientes
  function actualizarTablaPacientes() {
    $.ajax({
      url: "/admisionistas/obtener_pacientes/",
      method: "GET",
      success: function (data) {
        var table = $("#tabla_pacientes").DataTable();
        table.clear();
        $.each(data.pacientes, function (index, paciente) {
          table.row.add([
            paciente.id_pacientes,
            paciente.apellido_paterno,
            paciente.apellido_materno,
            paciente.nombres,
            paciente.cedula,
            paciente.fecha_nacimiento,
            paciente.edad,
            paciente.direccion,
            paciente.email,
            paciente.genero,
            paciente.telefono,
            paciente.emergencia_informar,
            paciente.contacto_emergencia,
            paciente.seguro,
            paciente.admisionista,
            `<a href="#" class="btn btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#editIngresoPacientesModal" data-id="${paciente.id_pacientes}">Editar</a>
               <a href="#" class="btn btn-danger btn-delete" data-id="${paciente.id_pacientes}">Eliminar</a>`,
          ]);
        });
        table.draw();
        console.log(data.pacientes);
      },
      error: function () {
        alert("Error al cargar los pacientes.");
      },
    });
  }
});
  