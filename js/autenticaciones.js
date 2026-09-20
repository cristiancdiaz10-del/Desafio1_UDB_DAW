//AUTENTICACIONES

//Creación de usuarios administradores
function crearUsuariosIniciales() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Lista de cuentas administrativas iniciales
    const usuariosSemilla = [
        {
            id: "USR-0001",
            nombre: "Administrador",
            nombreCompleto: "Administrador Sistema",
            email: "admin@ejemplo.com",
            correo: "admin@ejemplo.com",
            password: "123",
            rol: "administrador",
            fechaRegistro: new Date().toISOString()
        },
        {
            id: "USR-0002",
            nombre: "SuperAdmin",
            nombreCompleto: "Super Administrador",
            email: "super@ejemplo.com",
            correo: "super@ejemplo.com",
            password: "123",
            rol: "superadministrador",
            fechaRegistro: new Date().toISOString()
        }
    ];

    // Verificar e insertar solo los administradores que aún no existan en localStorage
    let seAñadieronNuevos = false;

    usuariosSemilla.forEach(admin => {
        const existe = usuarios.some(u => 
            (u.email || u.correo || "").toLowerCase() === admin.email.toLowerCase()
        );

        if (!existe) {
            usuarios.push(admin);
            seAñadieronNuevos = true;
        }
    });

    // Guardar si hubo cambios sin sobrescribir los usuarios registrados
    if (seAñadieronNuevos) {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

// Ejecutar la verificación de administradores
crearUsuariosIniciales();

//Control de Inicio de Sesión y Redirección por Rol
document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", function(e) {
            e.preventDefault();

            const inputEmail = document.getElementById("email");
            const inputPass = document.getElementById("password");

            if (!inputEmail || !inputPass) {
                alert("Error: No se encontraron los campos de inicio de sesión.");
                return;
            }

            const emailIngresado = inputEmail.value.trim().toLowerCase();
            const passIngresada = inputPass.value.trim();

            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            // Buscar coincidencia exacta
            const usuarioValido = usuarios.find(u => {
                const correoGuardado = String(u.email || u.correo || "").trim().toLowerCase();
                const passGuardada = String(u.password || "").trim();

                return correoGuardado === emailIngresado && passGuardada === passIngresada;
            });

            if (!usuarioValido) {
                alert("Correo o contraseña incorrectos.");
                return;
            }

            // Crear datos de sesión activa
            const nombreUsuario = usuarioValido.nombre || usuarioValido.nombreCompleto || "Usuario";
            
            localStorage.setItem("sesion", JSON.stringify({
                id: usuarioValido.id || "USR-" + Date.now().toString().slice(-4),
                nombre: nombreUsuario,
                nombreCompleto: nombreUsuario,
                email: usuarioValido.email || usuarioValido.correo,
                rol: usuarioValido.rol
            }));

            // Redirección en función del Rol del usuario
            if (usuarioValido.rol === "usuario") {
                window.location.href = "portal-aspirante.html";
            } else if (usuarioValido.rol === "administrador" || usuarioValido.rol === "superadministrador") {
                window.location.href = "panel-control.html";
            }
        });
    }
});

//Función para cerrar sesión globalmente
function cerrarSesion() {
    localStorage.removeItem("sesion");
    window.location.href = "login.html";
}