// ============================================
// AUTENTICACIONES Y GESTIÓN DE SESIONES
// ============================================

// Roles reconocidos por el sistema
const ROLES_VALIDOS = [
    "administrador",
    "superadministrador",
    "usuario"
];

// ============================================
// Obtener usuarios almacenados
// ============================================
function obtenerUsuarios() {
    try {
        const usuarios = JSON.parse(
            localStorage.getItem("usuarios") || "[]"
        );

        return Array.isArray(usuarios) ? usuarios : [];
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return [];
    }
}

// ============================================
// Crear usuarios administrativos iniciales
// ============================================
export function crearUsuariosIniciales() {
    const usuarios = obtenerUsuarios();

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

    let seAñadieronNuevos = false;

    usuariosSemilla.forEach(admin => {
        const correoAdmin = admin.email.toLowerCase();

        const existe = usuarios.some(usuario => {
            if (!usuario || typeof usuario !== "object") {
                return false;
            }

            const correoGuardado = String(
                usuario.email || usuario.correo || ""
            ).trim().toLowerCase();

            return correoGuardado === correoAdmin;
        });

        if (!existe) {
            usuarios.push(admin);
            seAñadieronNuevos = true;
        }
    });

    if (seAñadieronNuevos) {
        try {
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        } catch (error) {
            console.error(
                "No fue posible crear los usuarios iniciales:",
                error
            );
        }
    }
}

// ============================================
// Iniciar sesión
// ============================================
export function iniciarSesion(emailIngresado, passwordIngresada) {

    // Validar datos recibidos
    if (
        typeof emailIngresado !== "string" ||
        typeof passwordIngresada !== "string" ||
        !emailIngresado.trim() ||
        !passwordIngresada
    ) {
        return {
            correcto: false,
            mensaje: "Debes ingresar tu correo electrónico y contraseña."
        };
    }

    const email = emailIngresado.trim().toLowerCase();

    const usuarios = obtenerUsuarios();

    // Buscar usuario por correo y contraseña
    const usuarioValido = usuarios.find(usuario => {

        if (!usuario || typeof usuario !== "object") {
            return false;
        }

        const correoGuardado = String(
            usuario.email || usuario.correo || ""
        ).trim().toLowerCase();

        const passGuardada = String(usuario.password || "");

        return (
            correoGuardado === email &&
            passGuardada === passwordIngresada
        );
    });

    // Credenciales incorrectas
    if (!usuarioValido) {
        return {
            correcto: false,
            mensaje: "Correo o contraseña incorrectos."
        };
    }

    // Validar rol
    if (!ROLES_VALIDOS.includes(usuarioValido.rol)) {
        return {
            correcto: false,
            mensaje: "La cuenta no tiene un rol válido. Contacta al administrador."
        };
    }

    // Construir información de sesión
    const nombre = usuarioValido.nombre ||
        usuarioValido.nombreCompleto ||
        "Usuario";

    const sesion = {
        id: usuarioValido.id || `USR-${Date.now()}`,
        nombre: nombre,
        nombreCompleto: usuarioValido.nombreCompleto || nombre,
        email: String(
            usuarioValido.email || usuarioValido.correo
        ).trim().toLowerCase(),
        rol: usuarioValido.rol
    };

    // Guardar sesión
    try {
        localStorage.setItem("sesion", JSON.stringify(sesion));
    } catch (error) {
        console.error("Error al guardar la sesión:", error);

        return {
            correcto: false,
            mensaje: "No fue posible iniciar la sesión. Intenta nuevamente."
        };
    }

    return {
        correcto: true,
        usuario: sesion
    };
}

// ============================================
// Obtener sesión activa
// ============================================
export function obtenerSesion() {
    try {
        const sesion = JSON.parse(
            localStorage.getItem("sesion")
        );

        if (
            !sesion ||
            typeof sesion !== "object" ||
            !sesion.id ||
            !sesion.rol ||
            !ROLES_VALIDOS.includes(sesion.rol)
        ) {
            return null;
        }

        return sesion;

    } catch (error) {
        console.error("Error al recuperar la sesión:", error);
        return null;
    }
}

// ============================================
// Cerrar sesión
// ============================================
export function cerrarSesion() {
    try {
        localStorage.removeItem("sesion");
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
    }
}

// ============================================
// Comprobar si el usuario tiene acceso
// ============================================
export function protegerVista(rolesPermitidos = []) {

    if (!Array.isArray(rolesPermitidos)) {
        return false;
    }

    const sesion = obtenerSesion();

    if (!sesion) {
        cerrarSesion();
        return false;
    }

    return rolesPermitidos.includes(sesion.rol);
}