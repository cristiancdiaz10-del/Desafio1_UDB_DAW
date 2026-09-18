//Modulo de autenticacion

//Creación de usuarios iniciales
function crearUsuariosIniciales() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.length === 0) {
        usuarios = [
            { nombreCompleto: "Aspirante Prueba", email: "user@ejemplo.com", password: "123", rol: "usuario" },
            { nombreCompleto: "Administrador", email: "admin@ejemplo.com", password: "123", rol: "administrador" },
            { nombreCompleto: "SuperAdmin", email: "super@ejemplo.com", password: "123", rol: "superadministrador" }
        ];
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}
crearUsuariosIniciales();

//Validación de registro
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    formRegistro.addEventListener("submit", function(e) {
        e.preventDefault();

        const emailVal = document.getElementById("email").value.trim().toLowerCase();
        const passVal = document.getElementById("contrasena") ? document.getElementById("contrasena").value.trim() : document.getElementById("password").value.trim();
        const nombreVal = document.getElementById("nombre") ? document.getElementById("nombre").value.trim() : "Nuevo Usuario";

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Validar si el correo ya existe
        if (usuarios.some(u => u.email.toLowerCase() === emailVal)) {
            alert("Este correo ya está registrado.");
            return;
        }

        // Crear objeto uniforme
        const nuevoUsuario = {
            nombreCompleto: nombreVal,
            email: emailVal,
            password: passVal,
            rol: "usuario"
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("¡Registro exitoso! Redirigiendo al login...");
        window.location.href = "login.html";
    });
}

//Validación de login
const formLogin = document.getElementById("formLogin");
if (formLogin) {
    formLogin.addEventListener("submit", function(e) {
        e.preventDefault();

        const emailInput = document.getElementById("email").value.trim().toLowerCase();
        const passInput = document.getElementById("contrasena") ? document.getElementById("contrasena").value.trim() : document.getElementById("password").value.trim();

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscar coincidencia exacta
        const usuarioValido = usuarios.find(u => u.email.toLowerCase() === emailInput && u.password === passInput);

        if (!usuarioValido) {
            alert("Correo o contraseña incorrectos.");
            return;
        }

        // Guardar sesión y redirigir
        localStorage.setItem("sesion", JSON.stringify({
            nombre: usuarioValido.nombreCompleto,
            email: usuarioValido.email,
            rol: usuarioValido.rol
        }));

        if (usuarioValido.rol === "usuario") {
            window.location.href = "portal-aspirante.html";
        } else {
            window.location.href = "dashboard.html";
        }
    });
}