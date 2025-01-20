$(document).ready(function () {
  var table = $("#tabla_usuarios").DataTable({
    columnDefs: [
      
    ],
    columns: [
       // Columna ID oculta 0                  
      { data: "image" }, // 13
      { data: "first_name" }, // 5
      { data: "last_name" }, //  6            
      { data: "username" }, //  4         
      { data: "tipo_usuario" }, // 11   
      { data: "is_active" }, //  9            
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
    var nombre = fila.find("td").eq(1).text(); // Nombre
    var apellido = fila.find("td").eq(2).text(); // Apellido
    var usuario = fila.find("td").eq(3).text(); // Usuario

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
    $("#formAddUsuario").submit(function (event) {
        event.preventDefault(); // Evitar comportamiento predeterminado del formulario

        $.ajax({
            url: $(this).attr("action"),
            method: "POST",
            data: new FormData(this), // FormData para soportar archivos
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status === "success") {
                    // Agregar datos a DataTables
                    var table = $("#tabla_usuarios").DataTable();
                    table.row
                      .add({
                        image: `<img src="${response.usuario.image}" alt="Imagen de usuario" style="width: 50px; height: 50px; border-radius: 50%;">`, // Mostrar la imagen
                        first_name: response.usuario.first_name,
                        last_name: response.usuario.last_name,
                        username: response.usuario.username,
                        tipo_usuario: response.usuario.tipo_usuario,
                        is_active: `
                        <span class="badge bg-success">
                          Activo
                        </span>
                        `,
                        acciones: `                                                      
                            <a href="#" style="margin-right: 2px;" class="btn btn-primary btn-sm view-btn" data-id="${response.usuario.id}" data-bs-toggle="modal" data-bs-target="#verUsuarioModal"><i class="fas fa-eye"></i></a>
                            <a href="#" style="margin-right: 2px;" class="btn btn-sm btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#editIngresoUsuariosModal" data-id="${response.usuario.id}"><i class="bi bi-pencil-fill"></i></a>                                
                            <a href="#" class="btn btn-sm btn-danger btn-delete" data-id="${response.usuario.id}"><i class="bi bi-trash-fill"></i></a>
                        `,
                      })
                      .draw(false);

                    // Mostrar mensaje de éxito
                    Toastify({
                        text: "Usuario guardado correctamente",
                        duration: 5000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)",
                    }).showToast();

                    // Resetear formulario y cerrar el modal
                    $("#formAddUsuario")[0].reset();
                    $("#addIngresoUsuariosModal").modal("hide");
                    $(".modal-backdrop").remove();
                    $("body").removeClass("modal-open");
                    // Asegura que el scroll se restaure en el HTML
                    $('html').css('overflow', 'auto');
                } else {
                    alert(response.message || "Error al agregar el usuario");
                }
            },
            error: function () {
                alert("Error al procesar la solicitud");
            },
        });

        return false; // Prevenir comportamiento predeterminado del formulario
    });
});



});
