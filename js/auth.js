// auth.js - Sistema de Autenticación, Roles y Sesiones (Etapa 2)

// A. REGISTRO DE NUEVO ASPIRANTE
function registrarAspiranteCompleto(datos) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_protalento')) || [];
    const aspirantes = JSON.parse(localStorage.getItem('aspirantes_protalento')) || [];

    // Validar si el correo ya existe
    const existe = usuarios.some(u => u.correo.toLowerCase() === datos.correo.toLowerCase());
    if (existe) {
        return { exito: false, mensaje: "Este correo electrónico ya se encuentra registrado." };
    }

    const nuevoId = "USR-" + Date.now().toString().slice(-4);

    // 1. Crear usuario para el Login
    const nuevoUsuario = {
        id: nuevoId,
        nombre: datos.nombre,
        correo: datos.correo,
        password: datos.password,
        rol: "aspirante"
    };

    // 2. Crear perfil/expediente de aspirante
    const nuevoAspirante = {
        id: nuevoId,
        nombre: datos.nombre,
        dui: datos.dui || "N/A",
        telefono: datos.telefono,
        correo: datos.correo,
        departamento: datos.departamento,
        municipio: datos.municipio,
        nivelEducativo: datos.nivelEducativo,
        situacionActual: datos.situacionActual,
        cursoInteres: datos.cursoInteres,
        etapaActual: 2, // Inicia en Etapa 2 para adjuntar CV y Video
        estado: "En proceso",
        cvAdjuntado: false,
        videoAdjuntado: false,
        fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    aspirantes.push(nuevoAspirante);

    localStorage.setItem('usuarios_protalento', JSON.stringify(usuarios));
    localStorage.setItem('aspirantes_protalento', JSON.stringify(aspirantes));

    // Auto-login al registrarse
    iniciarSesionDirecta(nuevoUsuario);
    return { exito: true, usuario: nuevoUsuario };
}

// B. INICIO DE SESIÓN
function iniciarSesion(correo, password) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_protalento')) || [];

    const usuarioEncontrado = usuarios.find(
        u => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password
    );

    if (usuarioEncontrado) {
        iniciarSesionDirecta(usuarioEncontrado);
        return { exito: true, usuario: usuarioEncontrado };
    } else {
        return { exito: false, mensaje: "Correo o contraseña incorrectos." };
    }
}

// C. CONTROL DE SESIÓN
function iniciarSesionDirecta(usuario) {
    const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        fechaInicio: new Date().toISOString()
    };
    localStorage.setItem('sesion_activa', JSON.stringify(sesion));
}

function obtenerSesion() {
    const sesion = localStorage.getItem('sesion_activa');
    return sesion ? JSON.parse(sesion) : null;
}

function cerrarSesion() {
    localStorage.removeItem('sesion_activa');
    window.location.href = 'login.html';
}

// D. REDIRECCIÓN SEGÚN ROL
function redireccionarSegunRol(rol) {
    switch (rol) {
        case 'superadmin':
        case 'admin':
            window.location.href = 'portal-evaluador.html';
            break;
        case 'aspirante':
            window.location.href = 'portal-aspirante.html';
            break;
        default:
            window.location.href = 'login.html';
            break;
    }
}

// E. PROTECCIÓN DE RUTA
function protegerVista(rolesPermitidos = []) {
    const sesion = obtenerSesion();
    if (!sesion) {
        window.location.href = 'login.html';
        return;
    }
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(sesion.rol)) {
        alert("Acceso denegado: No tienes permisos para acceder.");
        redireccionarSegunRol(sesion.rol);
    }
}