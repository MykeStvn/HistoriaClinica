$(document).ready(function () {
  var table = $("#tabla_pacientes").DataTable({
    columnDefs: [
      { targets: 0, visible: false }, // Ocultar la primera columna (ID)
    ],
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

  // Evento de clic en el botón de eliminar (delegación de eventos)  OK
  $(document).on("click", ".btn-delete", function () {
    var pacienteId = $(this).data("id"); // Obtén el ID del paciente a eliminar
    var fila = $(this).closest("tr"); // Almacena la fila donde se encuentra el botón

    // Obtener el nombre y apellido del paciente desde la fila
    var apellidoPaterno = fila.find("td").eq(0).text(); // Apellido Paterno
    var apellidoMaterno = fila.find("td").eq(1).text(); // Apellido Materno
    var nombres = fila.find("td").eq(2).text(); // Nombres

    // Preguntar al usuario si está seguro de eliminar
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Eliminarás a " + apellidoPaterno + " " + apellidoMaterno + " " + nombres,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutar la petición AJAX para eliminar al paciente
        $.ajax({
          url: "/admisionistas/eliminar_paciente/" + pacienteId + "/",
          method: "DELETE", // O el método adecuado según tu backend
          success: function (response) {
            if (response.status === "success") {
              var table = $("#tabla_pacientes").DataTable();
              table.row(fila).remove().draw(); // Elimina la fila de la tabla

              // Mostrar Toastify al eliminar
              Toastify({
                text: "Paciente eliminado correctamente.",
                duration: 3000,
                close: false,
                gravity: "top",
                position: "center",
                backgroundColor: "linear-gradient(to right,rgb(253, 42, 42),rgb(253, 42, 42))",
              }).showToast();
            } else {
              Swal.fire("Error", "Hubo un error al eliminar el paciente.", "error");
            }
          },
          error: function () {
            Swal.fire("Error", "Error al eliminar el paciente.", "error");
          },
        });
      }
    });

  });
  //ingresar paciente
  $(document).ready(function () {
    // Validación del formulario de agregar paciente
    $("#formAddPaciente").validate({
      rules: {
        apellido_paterno_pacientes: {
          required: true,
          maxlength: 50
        },
        apellido_materno_pacientes: {
          required: true,
          maxlength: 50
        },
        nombres_pacientes: {
          required: true,
          maxlength: 100
        },
        cedula_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 10,
          remote: { // Validación remota para la cédula
            url: "/admisionistas/verificar_cedula/", // Cambia la ruta si es necesario
            type: "post",
            data: {
              cedula_pacientes: function () {
                return $("#cedula_pacientes").val(); // Obtiene el valor de la cédula
              },
              csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
            },
            dataFilter: function (response) {
              const data = JSON.parse(response);
              return !data.exists; // Retorna true si no existe
            }
          }
        },
        fecha_nacimiento_pacientes: {
          required: true,
          date: true
        },
        direccion_pacientes: {
          required: true,
          maxlength: 200
        },
        email_pacientes: {
          required: true,
          email: true
        },
        telefono_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 15
        },
        emergencia_informar_pacientes: {
          required: true,
          maxlength: 100
        },
        contacto_emergencia_pacientes: {
          required: true,
          maxlength: 100
        },
        genero_pacientes: {
          required: true
        },
        seguro_pacientes: {
          required: true
        },
        fk_id_admisionista: {
          required: true
        }
      },
      messages: {
        apellido_paterno_pacientes: {
          required: "Por favor, ingrese el apellido paterno.",
          maxlength: "El apellido paterno no puede exceder los 50 caracteres."
        },
        apellido_materno_pacientes: {
          required: "Por favor, ingrese el apellido materno.",
          maxlength: "El apellido materno no puede exceder los 50 caracteres."
        },
        nombres_pacientes: {
          required: "Por favor, ingrese los nombres.",
          maxlength: "El nombre no puede exceder los 100 caracteres."
        },
        cedula_pacientes: {
          required: "Por favor, ingrese la cédula.",
          minlength: "La cédula debe tener al menos 10 caracteres.",
          maxlength: "La cédula no puede exceder los 10 caracteres.",
          remote: "Esta cédula ya está registrada en el sistema."
        },
        fecha_nacimiento_pacientes: {
          required: "Por favor, ingrese la fecha de nacimiento.",
          date: "Por favor, ingrese una fecha válida."
        },
        direccion_pacientes: {
          required: "Por favor, ingrese la dirección.",
          maxlength: "La dirección no puede exceder los 200 caracteres."
        },
        email_pacientes: {
          required: "Por favor, ingrese el correo electrónico.",
          email: "Por favor, ingrese un correo electrónico válido."
        },
        telefono_pacientes: {
          required: "Por favor, ingrese el teléfono.",
          minlength: "El teléfono debe tener al menos 10 caracteres.",
          maxlength: "El teléfono no puede exceder los 15 caracteres."
        },
        emergencia_informar_pacientes: {
          required: "Por favor, ingrese el nombre de la persona a la que se debe informar en caso de emergencia.",
          maxlength: "El nombre de la persona no puede exceder los 100 caracteres."
        },
        contacto_emergencia_pacientes: {
          required: "Por favor, ingrese el contacto de emergencia.",
          maxlength: "El contacto de emergencia no puede exceder los 100 caracteres."
        },
        genero_pacientes: {
          required: "Por favor, seleccione el género."
        },
        seguro_pacientes: {
          required: "Por favor, seleccione el seguro médico."
        },
        fk_id_admisionista: {
          required: "Este campo es obligatorio."
        }
      },
      errorClass: "invalid",
      validClass: "valid",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest('.mb-3').append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).addClass("is-valid").removeClass("is-invalid");
      },
      submitHandler: function (form) {
        // Enviar el formulario por AJAX si la validación es exitosa
        $.ajax({
          url: $(form).attr("action"),
          method: "POST",
          data: $(form).serialize(),
          success: function (response) {
            if (response.status === "success") {
              var table = $("#tabla_pacientes").DataTable();
              let fechaFormateada = moment(response.paciente.fecha_nacimiento).locale('es').format('DD [de] MMMM [de] YYYY');
              table.row.add({
                id_pacientes: response.paciente.id_pacientes,
                apellido_paterno_pacientes: response.paciente.apellido_paterno,
                apellido_materno_pacientes: response.paciente.apellido_materno,
                nombres_pacientes: response.paciente.nombres,
                cedula_pacientes: response.paciente.cedula,
                fecha_nacimiento_pacientes: fechaFormateada,
                edad: response.paciente.edad,
                direccion_pacientes: response.paciente.direccion,
                email_pacientes: response.paciente.email,
                genero_pacientes: response.paciente.genero,
                telefono_pacientes: response.paciente.telefono,
                emergencia_informar_pacientes: response.paciente.emergencia_informar,
                contacto_emergencia_pacientes: response.paciente.contacto_emergencia,
                seguro_pacientes: response.paciente.seguro,
                fk_id_admisionista__username: response.paciente.admisionista,
                acciones: `<a href="#" class="btn-sm rounded-pill btn-warning edit-btn" data-id="${response.paciente.id_pacientes}">Editar</a>
                                      <a href="#" class="btn-sm rounded-pill btn-danger btn-delete" data-id="${response.paciente.id_pacientes}">Eliminar</a>`
              }).draw(false);

              Toastify({
                text: "Paciente guardado correctamente",
                duration: 5000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)",
              }).showToast();

              $("#formAddPaciente")[0].reset();
              $("#addIngresoPacientesModal").modal("hide");
              $(".modal-backdrop").remove();
              $("body").removeClass("modal-open");
            } else {
              alert("Error al agregar el paciente");
            }
          },
          error: function () {
            alert("Error al procesar la solicitud");
          }
        });
      }
    });
  });


  // Función para cargar datos de un paciente en el modal de edición
  function editarPaciente(pacienteId) {
    // Cierra el modal si está abierto
    $("#editIngresoPacientesModal").modal("hide");
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

  $(document).on("click", ".edit-btn", function () {
    var pacienteId = $(this).data("id");
    editarPaciente(pacienteId);
  });
  //actualizar
  $(document).ready(function () {
    // Validación del formulario de editar paciente
    $("#formEditPaciente").validate({
      rules: {
        apellido_paterno_pacientes: {
          required: true,
          maxlength: 50
        },
        apellido_materno_pacientes: {
          required: true,
          maxlength: 50
        },
        nombres_pacientes: {
          required: true,
          maxlength: 100
        },
        cedula_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 10
        },
        fecha_nacimiento_pacientes: {
          required: true,
          date: true
        },
        direccion_pacientes: {
          required: true,
          maxlength: 200
        },
        email_pacientes: {
          required: true,
          email: true
        },
        telefono_pacientes: {
          required: true,
          minlength: 10,
          maxlength: 15
        },
        emergencia_informar_pacientes: {
          required: true,
          maxlength: 100
        },
        contacto_emergencia_pacientes: {
          required: true,
          maxlength: 100
        },
        genero_pacientes: {
          required: true
        },
        seguro_pacientes: {
          required: true
        },
        fk_id_admisionista: {
          required: true
        }
      },
      messages: {
        apellido_paterno_pacientes: {
          required: "Por favor, ingrese el apellido paterno.",
          maxlength: "El apellido paterno no puede exceder los 50 caracteres."
        },
        apellido_materno_pacientes: {
          required: "Por favor, ingrese el apellido materno.",
          maxlength: "El apellido materno no puede exceder los 50 caracteres."
        },
        nombres_pacientes: {
          required: "Por favor, ingrese los nombres.",
          maxlength: "El nombre no puede exceder los 100 caracteres."
        },
        cedula_pacientes: {
          required: "Por favor, ingrese la cédula.",
          minlength: "La cédula debe tener al menos 10 caracteres.",
          maxlength: "La cédula no puede exceder los 10 caracteres."
        },
        fecha_nacimiento_pacientes: {
          required: "Por favor, ingrese la fecha de nacimiento.",
          date: "Por favor, ingrese una fecha válida."
        },
        direccion_pacientes: {
          required: "Por favor, ingrese la dirección.",
          maxlength: "La dirección no puede exceder los 200 caracteres."
        },
        email_pacientes: {
          required: "Por favor, ingrese el correo electrónico.",
          email: "Por favor, ingrese un correo electrónico válido."
        },
        telefono_pacientes: {
          required: "Por favor, ingrese el teléfono.",
          minlength: "El teléfono debe tener al menos 10 caracteres.",
          maxlength: "El teléfono no puede exceder los 15 caracteres."
        },
        emergencia_informar_pacientes: {
          required: "Por favor, ingrese el nombre de la persona a la que se debe informar en caso de emergencia.",
          maxlength: "El nombre de la persona no puede exceder los 100 caracteres."
        },
        contacto_emergencia_pacientes: {
          required: "Por favor, ingrese el contacto de emergencia.",
          maxlength: "El contacto de emergencia no puede exceder los 100 caracteres."
        },
        genero_pacientes: {
          required: "Por favor, seleccione el género."
        },
        seguro_pacientes: {
          required: "Por favor, seleccione el seguro médico."
        },
        fk_id_admisionista: {
          required: "Este campo es obligatorio."
        }
        // Otros mensajes de validación
      },
      errorClass: "invalid",
      validClass: "valid",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest('.mb-3').append(error);
      },
      highlight: function (element) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
      submitHandler: function (form) {
        var formData = $(form).serialize();
        $.ajax({
          url: "/admisionistas/actualizar_paciente/", // URL de tu endpoint de actualización
          method: "POST",
          data: formData,
          dataType: 'json',
          success: function (response) {
            if (response.status === "success") {
              var pacienteId = response.paciente.id_pacientes;
              var table = $("#tabla_pacientes").DataTable();
  
              var row = table.row(function (idx, data, node) {
                if (data && data.id_pacientes !== undefined) {
                  return data.id_pacientes == pacienteId;
                }
                return false;
              });
  
              if (row.length) {
                var rowData = row.data();
                let fechaFormateada = "";
                if (response.paciente.fecha_nacimiento) {
                  fechaFormateada = moment(response.paciente.fecha_nacimiento).locale('es').format('DD [de] MMMM [de] YYYY');
                }
  
                let edadCalculada = "";
                if (response.paciente.fecha_nacimiento) {
                  const fechaNacimiento = moment(response.paciente.fecha_nacimiento);
                  edadCalculada = moment().diff(fechaNacimiento, 'years');
                }
  
                rowData.apellido_paterno_pacientes = response.paciente.apellido_paterno || "";
                rowData.apellido_materno_pacientes = response.paciente.apellido_materno || "";
                rowData.nombres_pacientes = response.paciente.nombres || "";
                rowData.cedula_pacientes = response.paciente.cedula || "";
                rowData.fecha_nacimiento_pacientes = fechaFormateada;
                rowData.edad = edadCalculada;
                rowData.direccion_pacientes = response.paciente.direccion || "";
                rowData.email_pacientes = response.paciente.email || "";
                rowData.genero_pacientes = response.paciente.genero || "";
                rowData.telefono_pacientes = response.paciente.telefono || "";
                rowData.emergencia_informar_pacientes = response.paciente.emergencia_informar || "";
                rowData.contacto_emergencia_pacientes = response.paciente.contacto_emergencia || "";
                rowData.seguro_pacientes = response.paciente.seguro || "";
                rowData.fk_id_admisionista__username = response.paciente.admisionista || "";
  
                row.data(rowData).draw(false); // Redibujar la fila
  
                Toastify({
                  text: "Paciente actualizado correctamente",
                  duration: 5000,
                  close: true,
                  gravity: "bottom",
                  position: "right",
                  backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)",
                }).showToast();
  
                $("#editIngresoPacientesModal").modal("hide");
                $(".modal-backdrop").remove();
                $("body").removeClass("modal-open");
              } else {
                console.error("No se encontró la fila con ID: " + pacienteId);
                alert("Error: No se encontró el paciente en la tabla.");
              }
            } else {
              Toastify({
                text: "Cédula duplicada, imposible actualizar.",
                duration: 5000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #FF3B30, #FF5C5C)",
              }).showToast();
              console.error("Error del servidor:", response);
            }
          },
          error: function (xhr, status, error) {
            console.error("Error en la petición AJAX:", status, error, xhr.responseText);
            alert("Hubo un problema al actualizar el paciente. Revisa la consola.");
          }
        });
      }
    });
  });  
});