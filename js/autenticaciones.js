// Modulo de autenticacion

document.addEventListener("DOMContentLoaded", function () {

    const formLogin = document.getElementById("formLogin");

    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        const correo = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Obtener usuarios registrados
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscar usuario por correo y contraseña
        const usuario = usuarios.find(function (usuario) {
            return usuario.email === correo &&
                   usuario.password === password;
        });

        // Si no existe el usuario
        if (!usuario) {
            alert("Correo o contraseña incorrectos.");
            return;
        }

        // Guardar el usuario que inició sesión
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));

        // Comprobar el rol del usuario
        if (usuario.rol === "superadministrador") {

            window.location.href = "dashboard.html";

        } else if (usuario.rol === "administrador") {

            window.location.href = "dashboard.html";

        } else {

            window.location.href = "portal-aspirante.html";
        }
    });

});


// Función global para cerrar sesión
function cerrarSesion() {

    // Eliminar únicamente la sesión activa
    localStorage.removeItem("usuarioActual");

    // Redirigir al login
    window.location.href = "login.html";
}