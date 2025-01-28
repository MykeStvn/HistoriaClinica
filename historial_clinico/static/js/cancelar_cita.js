document.addEventListener('DOMContentLoaded', function () {
    // Escucha los clics en los botones de cancelar cita
    $(document).on('click', '.cancelar-cita', function (event) {
        const button = $(this); // El botón que fue clickeado
        const citaId = button.data('id'); // Obtener el id de la cita del atributo data-id

        if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
            // Realiza la petición AJAX para cancelar la cita
            $.ajax({
                url: `/gestion_pacientes/cancelar_cita/${citaId}/`, // URL del endpoint
                type: 'POST', // Método HTTP
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Indica que es una solicitud AJAX
                    'X-CSRFToken': getCookie('csrftoken'), // Token CSRF
                },
                success: function (data) {
                    if (data.message) {
                        alert(data.message); // Muestra mensaje de éxito
                        location.reload(); // Recarga la página o actualiza la tabla
                    } else if (data.error) {
                        alert(data.error); // Muestra mensaje de error
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                    alert('Hubo un error al cancelar la cita. Por favor, inténtalo de nuevo.');
                },
            });
        }
    });

    // Función para obtener el token CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
