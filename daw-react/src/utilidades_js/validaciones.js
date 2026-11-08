
// ============================================
// VALIDACIONES Y UTILIDADES DEL SISTEMA
// ============================================

// ============================================
// Calcular edad a partir de la fecha de nacimiento
// ============================================
export function calcularEdad(fechaNacimiento) {
    if (typeof fechaNacimiento !== "string" || !fechaNacimiento.trim()) {
        return null;
    }

    // Validar formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
        return null;
    }

    const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);

    const fechaNac = new Date(anio, mes - 1, dia);

    // Comprobar que la fecha sea real
    if (
        fechaNac.getFullYear() !== anio ||
        fechaNac.getMonth() !== mes - 1 ||
        fechaNac.getDate() !== dia
    ) {
        return null;
    }

    const hoy = new Date();

    // No permitir fechas futuras
    if (fechaNac > hoy) {
        return null;
    }

    let edad = hoy.getFullYear() - anio;

    const mesActual = hoy.getMonth() + 1;
    const diaActual = hoy.getDate();

    if (
        mesActual < mes ||
        (mesActual === mes && diaActual < dia)
    ) {
        edad--;
    }

    return edad;
}

// ============================================
// Validar formato de DUI
// ============================================
export function validarDUI(dui) {
    if (typeof dui !== "string") {
        return false;
    }

    return /^[0-9]{8}-[0-9]$/.test(dui.trim());
}

// ============================================
// Validar formato de NIT
// ============================================
export function validarNIT(nit) {
    if (typeof nit !== "string") {
        return false;
    }

    return /^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]$/.test(nit.trim());
}

// ============================================
// Normalizar documentos de identidad
// ============================================
export function normalizarDocumento(documento) {
    if (typeof documento !== "string") {
        return "";
    }

    // Eliminar espacios y guiones
    return documento.replace(/[\s-]/g, "");
}

// ============================================
// Normalizar correo electrónico
// ============================================
export function normalizarCorreo(email) {
    if (typeof email !== "string") {
        return "";
    }

    return email.trim().toLowerCase();
}

// ============================================
// Validar contraseña
// ============================================
export function validarPassword(password) {
    if (typeof password !== "string") {
        return false;
    }

    // Mínimo 8 caracteres, una mayúscula,
    // una minúscula y un número
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// ============================================
// Obtener fecha actual en formato YYYY-MM-DD
// ============================================
export function obtenerFechaActual() {
    const hoy = new Date();

    const year = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${year}-${mes}-${dia}`;
}

// ============================================
// API de departamentos, municipios y distritos
// de El Salvador
// ============================================
const URL_API =
    "https://juanmedina100.github.io/departamentos-distritos-municipios-el-salvador/departamentos-distritos-municipios-sv.json";

// ============================================
// Obtener información de domicilio
// ============================================
export async function obtenerDomicilio() {
    const respuesta = await fetch(URL_API);

    if (!respuesta.ok) {
        throw new Error(
            "No se pudieron cargar los datos de domicilio."
        );
    }

    const datos = await respuesta.json();

    if (
        !datos ||
        !Array.isArray(datos.departamentos)
    ) {
        throw new Error(
            "La información de departamentos recibida no tiene un formato válido."
        );
    }

    return datos.departamentos;
}

// ============================================
// Obtener cursos almacenados en Convocatorias
// ============================================
export function obtenerCursos() {
    try {
        const cursos = JSON.parse(
            localStorage.getItem("cursos") || "[]"
        );

        return Array.isArray(cursos) ? cursos : [];

    } catch (error) {
        console.error("Error al cargar los cursos:", error);
        return [];
    }
}

// ============================================
// Registrar aspirante
// ============================================
export function registrarAspirante(nuevoUsuario) {

    // Validar objeto recibido
    if (
        !nuevoUsuario ||
        typeof nuevoUsuario !== "object" ||
        Array.isArray(nuevoUsuario)
    ) {
        return {
            correcto: false,
            campo: null,
            mensaje: "Los datos del aspirante no son válidos."
        };
    }

    const emailNormalizado = normalizarCorreo(nuevoUsuario.email);
    const duiNormalizado = normalizarDocumento(nuevoUsuario.DUI || "");
    const nitNormalizado = normalizarDocumento(nuevoUsuario.NIT || "");

    // Validar correo
    if (!emailNormalizado) {
        return {
            correcto: false,
            campo: "email",
            mensaje: "Debes proporcionar un correo electrónico válido."
        };
    }

    let usuarios;

    try {
        usuarios = JSON.parse(
            localStorage.getItem("usuarios") || "[]"
        );

    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        return {
            correcto: false,
            campo: null,
            mensaje: "No fue posible consultar los usuarios registrados."
        };
    }

    if (!Array.isArray(usuarios)) {
        return {
            correcto: false,
            campo: null,
            mensaje: "Los datos de usuarios almacenados no son válidos."
        };
    }

    // ========================================
    // Comprobar correo duplicado
    // ========================================
    const correoExiste = usuarios.some(usuario => {
        if (!usuario || typeof usuario !== "object") {
            return false;
        }

        const correoRegistrado = normalizarCorreo(
            usuario.email || usuario.correo || ""
        );

        return correoRegistrado === emailNormalizado;
    });

    if (correoExiste) {
        return {
            correcto: false,
            campo: "email",
            mensaje: "Este correo ya está registrado. Utiliza otro correo."
        };
    }

    // ========================================
    // Comprobar DUI duplicado
    // ========================================
    if (duiNormalizado) {
        const duiExiste = usuarios.some(usuario => {
            if (!usuario || typeof usuario !== "object") {
                return false;
            }

            return (
                normalizarDocumento(usuario.DUI || "") === duiNormalizado
            );
        });

        if (duiExiste) {
            return {
                correcto: false,
                campo: "DUI",
                mensaje: "Este DUI ya está registrado."
            };
        }
    }

    // ========================================
    // Comprobar NIT duplicado
    // ========================================
    if (nitNormalizado) {
        const nitExiste = usuarios.some(usuario => {
            if (!usuario || typeof usuario !== "object") {
                return false;
            }

            return (
                normalizarDocumento(usuario.NIT || "") === nitNormalizado
            );
        });

        if (nitExiste) {
            return {
                correcto: false,
                campo: "NIT",
                mensaje: "Este NIT ya está registrado."
            };
        }
    }

    // ========================================
    // Construir nuevo registro
    // ========================================
    const usuarioRegistrado = {
        ...nuevoUsuario,
        email: emailNormalizado,
        DUI: nuevoUsuario.DUI?.trim() || "",
        NIT: nuevoUsuario.NIT?.trim() || "",
        rol: "usuario"
    };

    usuarios.push(usuarioRegistrado);

    // ========================================
    // Guardar registro
    // ========================================
    try {
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );

        return {
            correcto: true
        };

    } catch (error) {
        console.error("Error al guardar el aspirante:", error);

        return {
            correcto: false,
            campo: null,
            mensaje: "No fue posible guardar el registro. Verifica el almacenamiento del navegador e intenta nuevamente."
        };
    }
}
