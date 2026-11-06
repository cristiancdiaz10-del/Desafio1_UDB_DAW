//AUTENTICACIONES

//Creación de usuarios administradores
export function crearUsuariosIniciales() {

        let usuarios = [];

    try {
        usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        if (!Array.isArray(usuarios)) {
            usuarios = [];
        }
    } catch {
        usuarios = [];
    }

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

// Iniciar sesión
export function iniciarSesion(emailIngresado, passwordIngresada) {
    let usuarios = [];

    try {
        usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        if (!Array.isArray(usuarios)) {
            usuarios = [];
        }
    } catch {
        usuarios = [];
    }

    const email = emailIngresado.trim().toLowerCase();

    const usuarioValido = usuarios.find(u => {
        const correoGuardado = String(u.email || u.correo || "").trim().toLowerCase();

        const passGuardada = String(u.password || "");
        return correoGuardado === email && passGuardada === passwordIngresada;
    });

    if (!usuarioValido){
        return {correcto: false, mensaje: "Correo o contraseña incorrectos."};
    }

    const nombreUsuario = usuarioValido.nombre || usuarioValido.nombreCompleto || "Usuario";

    const sesion = {
        id: usuarioValido.id || "USR-" + Date.now().toString().slice(-4),
        nombre: nombreUsuario,
        nombreCompleto: nombreUsuario,
        email: usuarioValido.email || usuarioValido.correo,
        rol: usuarioValido.rol
    };

    localStorage.setItem("sesion", JSON.stringify(sesion));

    return {correcto: true, usuario: sesion};
}

// Obtener sesión activa
export function obtenerSesion() {
    try {
        return JSON.parse(localStorage.getItem("sesion"));
    } catch {
        return null;
    }
}

// Cerrar sesión
export function cerrarSesion() {
    localStorage.removeItem("sesion");
}

// Comprobar si el usuario tiene un rol permitido
export function protegerVista(rolesPermitidos = []) {
    const sesion = obtenerSesion();
    
    if (!sesion || !sesion.rol) {
        cerrarSesion();
        return false;
    }

    return rolesPermitidos.includes(sesion.rol);
}