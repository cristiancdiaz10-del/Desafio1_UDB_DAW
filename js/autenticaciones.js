//Modulo de autenticacion

document.addEventListener("DOMContentLoaded", function () {

    const formLogin = document.getElementById("formLogin");

    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        const correo = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuario = usuarios.find(function (usuario) {
            return usuario.email === email &&
                   usuario.password === password;
        });

        if (!usuario) {
            alert("Correo o contraseña incorrectos.");
            return;
        }

        // Guardamos la sesión
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));

        // Comprobar el rol
        if (usuario.rol === "superadministrador") {

            window.location.href = "dashboard.html";

        } else if (usuario.rol === "administrador") {

            window.location.href = "dashboard.html";

        } else {

            window.location.href = "portal-aspirante.html";
        }
    });

});

// Función global para cerrar sesión y redirigir
function cerrarSesion() {
    // 1. Eliminar los datos de la sesión activa
    localStorage.removeItem('sesion');
    
    // 2. Redirigir al usuario al login
    window.location.href = 'login.html';
}