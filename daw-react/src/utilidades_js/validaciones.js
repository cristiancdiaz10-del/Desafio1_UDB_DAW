// Calculo de la edad a partir de la fecha de nacimiento
// Calcular edad a partir de la fecha de nacimiento
export function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;

    const fechaNac = new Date(`${fechaNacimiento}T00:00:00`);

    if (Number.isNaN(fechaNac.getTime())) {
        return null;
    }

    const hoy = new Date();

    if (fechaNac > hoy) return null;

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    return edad;
}

// Validacion de formato de DUI
export function validarDUI(dui) {
    return /^[0-9]{8}-[0-9]$/.test(dui);
}

// Validacion de formato de NIT
export function validarNIT(nit) {
    return /^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]$/.test(nit);
}

// Normalizacion de DUI o NIT para duplicados
export function normalizarDocumento(documento) {
    return documento.replace(/[\s-]/g, ""); // Elimina guiones y espacios
}

// Normalizar correo electrónico
export function normalizarCorreo(email) {
    return email.trim().toLowerCase();
}

// Validar password
export function validarPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// Obtener la fecha actual en formato DD/MM/YYYY
export function obtenerFechaActual() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    
    return `${year}-${mes}-${dia}`;
}

// API de departamentos, municipios y distritos de El Salvador
const URL_API = "https://juanmedina100.github.io/departamentos-distritos-municipios-el-salvador/departamentos-distritos-municipios-sv.json";

// Obtener departamentos, municipios y distritos desde la API
export async function obtenerDomicilio() {
    const respuesta = await fetch(URL_API);

    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los datos de domicilio");
    }

    const datos = await respuesta.json();
    return datos.departamentos;
}

// Obtener cursos guardados en Convocatorias
export function obtenerCursos() {
    try {
        const cursos = JSON.parse(localStorage.getItem("cursos") || "[]");

        return Array.isArray(cursos) ? cursos : [];
    } catch (error) {
        console.error("Error al cargar los cursos:", error);
        return [];
    }
}

// Registrar aspirante
export function registrarAspirante(nuevoUsuario) {
    let usuarios;

    try {
        usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    } catch {
        throw new Error("Error al cargar los usuarios registrados.");
    }

    if (!Array.isArray(usuarios)) {
        throw new Error("Los datos de usuarios no son válidos.");
    }

    const emailNormalizado = normalizarCorreo(nuevoUsuario.email);
    const duiNormalizado = normalizarDocumento(nuevoUsuario.DUI || "");
    const nitNormalizado = normalizarDocumento(nuevoUsuario.NIT || "");

    // Comprobar correo duplicado
    const correoExiste = usuarios.some(usuario =>
        normalizarCorreo(usuario.email || usuario.correo || "") === emailNormalizado
    );

    if (correoExiste) {
        return {
            correcto: false,
            campo: "email",
            mensaje: "Este correo ya está registrado. Utiliza otro correo."
        };
    }

    // Comprobar DUI duplicado
    if (duiNormalizado) {
        const duiExiste = usuarios.some(usuario =>
            normalizarDocumento(usuario.DUI || "") === duiNormalizado
        );

        if (duiExiste) {
            return {
                correcto: false,
                campo: "DUI",
                mensaje: "Este DUI ya está registrado."
            };
        }
    }

    // Comprobar NIT duplicado
    if (nitNormalizado) {
        const nitExiste = usuarios.some(usuario =>
            normalizarDocumento(usuario.NIT || "") === nitNormalizado
        );

        if (nitExiste) {
            return {
                correcto: false,
                campo: "NIT",
                mensaje: "Este NIT ya está registrado."
            };
        }
    }

    usuarios.push({
        ...nuevoUsuario,
        email: emailNormalizado,
        rol: "usuario"
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    return {
        correcto: true
    };
}