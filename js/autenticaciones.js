//Modulo de autenticacion

function crearUsuariosIniciales() {

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica si ya existe un administrador
    const existeAdministrador = usuarios.some(function(usuario) {
        return usuario.rol === "administrador";
    });

    // Verifica si ya existe un superadministrador
    const existeSuperadministrador = usuarios.some(function(usuario) {
        return usuario.rol === "superadministrador";
    });

    // Crea administrador si no existe
    if (!existeAdministrador) {

        usuarios.push({
            nombreCompleto: "Administrador",
            email: "admin@ejemplo.com",
            password: "admin123",
            rol: "administrador"
        });
    }

    // Crea superadministrador si no existe
    if (!existeSuperadministrador) {

        usuarios.push({
            nombreCompleto: "Superadministrador",
            email: "superadmin@ejemplo.com",
            password: "super123",
            rol: "superadministrador"
        });
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

crearUsuariosIniciales();

//login

const formularioLogin = document.getElementById("formLogin");

if (formularioLogin) {

    formularioLogin.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const usuarios = JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];

        const usuarioEncontrado = usuarios.find(function(usuario) {

            return usuario.email === email &&
                   usuario.password === password;

        });

        if (!usuarioEncontrado) {

            alert("Correo o contraseña incorrectos.");
            return;

        }

        const sesion = {
            email: usuarioEncontrado.email,
            rol: usuarioEncontrado.rol
        };

        localStorage.setItem(
            "sesion",
            JSON.stringify(sesion)
        );

        if (usuarioEncontrado.rol === "usuario") {

            window.location.href = "portal-aspirante.html";

        } else if (usuarioEncontrado.rol === "administrador") {

            window.location.href = "administrador.html";

        } else if (usuarioEncontrado.rol === "superadministrador") {

            window.location.href = "superadministrador.html";
        }

    });

}