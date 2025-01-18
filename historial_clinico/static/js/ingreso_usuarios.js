$(document).ready(function () {
  var table = $("#tabla_usuarios").DataTable({
    columnDefs: [],
    columns: [
      { data: "id" }, // Columna ID oculta 0
      { data: "password" }, //  1
      { data: "last_login" }, //  2
      { data: "is_superuser" }, // 3
      { data: "username" }, //  4
      { data: "first_name" }, // 5
      { data: "last_name" }, //  6
      { data: "email" }, //  7
      { data: "is_staff" }, //  8
      { data: "is_active" }, //  9
      { data: "date_joined" }, //  10
      { data: "tipo_usuario" }, // 11
      { data: "especialidad" }, // 12
      { data: "image" }, // 13
      { data: "acciones" }, // Acciones
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
        sortDescending:
          ": activar para ordenar la columna de manera descendente",
      },
    },
  });

  // Evento de clic en el botón de eliminar (delegación de eventos)  OK
  $(document).on("click", ".btn-delete", function () {
    var usuarioId = $(this).data("id"); // Obtén el ID del paciente a eliminar
    var fila = $(this).closest("tr"); // Almacena la fila donde se encuentra el botón

    // Obtener el nombre y apellido del paciente desde la fila
    var nombre = fila.find("td").eq(2).text(); // Apellido Paterno
    var apellido = fila.find("td").eq(3).text(); // Apellido Materno
    var usuario = fila.find("td").eq(5).text(); // Apellido Materno

    // Preguntar al usuario si está seguro de eliminar
    Swal.fire({
      title: "¿Estás seguro de eliminar a este usuario?",
      text:
        "Eliminarás a: " + nombre + " " + apellido + " | Usuario: " + usuario,
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
          url: "/administradores/eliminar_usuario/" + usuarioId + "/",
          method: "DELETE", // O el método adecuado según tu backend
          success: function (response) {
            if (response.status === "success") {
              var table = $("#tabla_usuarios").DataTable();
              table.row(fila).remove().draw(); // Elimina la fila de la tabla

              // Mostrar Toastify al eliminar
              Toastify({
                text: "Usuario eliminado correctamente.",
                duration: 3000,
                close: false,
                gravity: "top",
                position: "center",
                backgroundColor:
                  "linear-gradient(to right,rgb(253, 42, 42),rgb(253, 42, 42))",
              }).showToast();
            } else {
              Swal.fire(
                "Error",
                "Hubo un error al eliminar el usuario.",
                "error"
              );
            }
          },
          error: function () {
            Swal.fire("Error", "Error al eliminar el usuario.", "error");
          },
        });
      }
    });
  });

  //ver detalles del usuario

  // Función para ver detalles del usuario
  $(document).on("click", ".view-btn", function () {
    var usuarioId = $(this).data("id");

    $.ajax({
      url: `/administradores/obtener_usuario/${usuarioId}/`,
      type: "GET",
      success: function (response) {
        if (response.status === "success") {
          const usuario = response.usuario;

          // Llenar los campos del modal
          $("#ver_first_name").text(usuario.first_name);
          $("#ver_last_name").text(usuario.last_name);
          $("#ver_username").text(usuario.username);
          $("#ver_tipo_usuario").text(usuario.tipo_usuario);
          $("#ver_especialidad").text(usuario.especialidad);
          $("#ver_email").text(usuario.email);
          $("#ver_is_active")
            .text(usuario.is_active)
            .removeClass("badge-activo badge-inactivo")
            .addClass(
              usuario.is_active === "Activo" ? "badge-activo" : "badge-inactivo"
            );                                  
          $("#ver_date_joined").text(usuario.date_joined);
          $("#ver_last_login").text(usuario.last_login);
          $("#ver_is_staff").text(usuario.is_staff);
          $("#ver_is_superuser").text(usuario.is_superuser);

          // Manejar la imagen
          if (usuario.image_url) {
            $("#ver_imagen").attr("src", usuario.image_url);
          } else {
            $("#ver_imagen").attr("src", "/static/img/default-profile.png");
          }

          // Mostrar el modal
          $("#verUsuarioModal").modal("show");
        } else {
          Toastify({
            text: "Error al cargar los datos del usuario",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          }).showToast();
        }
      },
    });
  });

  // AGREGAR USUARIO
  $(document).ready(function () {
    // Validación del formulario de agregar usuario
    $("#formAddUsuario").validate({
      rules: {
        first_name: {
          required: true,
          maxlength: 50,
        },
        last_name: {
          required: true,
          maxlength: 50,
        },
        username: {
          required: true,
          maxlength: 30,
        },
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 8,
        },
        tipo_usuario: {
          required: true,
        },
        especialidad: {
          required: true,
        },
        // is_superuser: {
        //     required: true
        // },
        // is_staff: {
        //     required: true
        // },
        // is_active: {
        //     required: true
        // }
      },
      messages: {
        first_name: {
          required: "Por favor, ingrese el nombre.",
          maxlength: "El nombre no puede exceder los 50 caracteres.",
        },
        last_name: {
          required: "Por favor, ingrese el apellido.",
          maxlength: "El apellido no puede exceder los 50 caracteres.",
        },
        username: {
          required: "Por favor, ingrese el nombre de usuario.",
          maxlength: "El nombre de usuario no puede exceder los 30 caracteres.",
        },
        email: {
          required: "Por favor, ingrese el correo electrónico.",
          email: "Por favor, ingrese un correo electrónico válido.",
        },
        password: {
          required: "Por favor, ingrese la contraseña.",
          minlength: "La contraseña debe tener al menos 8 caracteres.",
        },
        tipo_usuario: {
          required: "Por favor, seleccione el tipo de usuario.",
        },
        especialidad: {
          required: "Por favor, ingrese la especialidad.",
        },
        // is_superuser: {
        //     required: "Por favor, indique si es superusuario."
        // },
        // is_staff: {
        //     required: "Por favor, indique si es personal administrativo."
        // },
        // is_active: {
        //     required: "Por favor, indique si el usuario está activo."
        // }
      },
      errorClass: "invalid",
      validClass: "valid",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest(".mb-3").append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).addClass("is-valid").removeClass("is-invalid");
      },
      submitHandler: function (form, event) {
        event.preventDefault();
        // Enviar el formulario por AJAX si la validación es exitosa

        $.ajax({
          url: $(form).attr("action"),
          method: "POST",
          data: $(form).serialize(),
          success: function (response) {
            if (response.status === "success") {
              var table = $("#tabla_usuarios").DataTable();
              let fechaCreacion = moment(response.usuario.date_joined)
                .locale("es")
                .format("YYYY [de] MMMM [de] DD");
              let ultimoLogin = response.usuario.last_login
                ? moment(response.usuario.last_login)
                    .locale("es")
                    .format("YYYY [de] MMMM [de] DD")
                : "Nunca ha iniciado sesión";

              table.row
                .add({
                  id: response.usuario.id,
                  first_name: response.usuario.first_name,
                  last_name: response.usuario.last_name,
                  username: response.usuario.username,
                  tipo_usuario: response.usuario.tipo_usuario,
                  especialidad: response.usuario.especialidad,
                  date_joined: fechaCreacion,
                  last_login: ultimoLogin,
                  is_superuser: response.usuario.is_superuser ? "Sí" : "No",
                  is_staff: response.usuario.is_staff ? "Sí" : "No",                  
                  email: response.usuario.email,
                  image: response.usuario.image,
                  acciones: `
                              <a href="#" class="btn btn-warning edit-btn" data-id="${response.usuario.id}">Editar</a>
                              <a href="#" class="btn btn-danger btn-delete" data-id="${response.usuario.id}">Eliminar</a>
                          `,
                })
                .draw(false);

              Toastify({
                text: "Usuario guardado correctamente",
                duration: 5000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)",
              }).showToast();

              $("#formAddUsuario")[0].reset();
              $("#addIngresoUsuariosModal").modal("hide");
              $(".modal-backdrop").remove();
              $("body").removeClass("modal-open");
            } else {
              alert(response.message || "Error al agregar el usuario");
            }
          },
          error: function () {
            alert("Error al procesar la solicitud");
          },
        });
      },
    });
  });
});
