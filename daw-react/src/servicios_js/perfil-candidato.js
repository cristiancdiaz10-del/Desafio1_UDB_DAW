// Módulo de datos y lógica del Perfil del Candidato

const CLAVE_USUARIOS = "usuarios";
const CLAVE_EVALUACIONES = "evaluaciones";
const CLAVE_PROGRAMACIONES = "programacionesEvaluacion";

function leerLista(clave) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error(`Error al leer ${clave}:`, error);
        return [];
    }
}

function guardarLista(clave, datos) {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
        return true;
    } catch (error) {
        console.error(`Error al guardar ${clave}:`, error);
        return false;
    }
}

export function obtenerAspirantesPerfil() {
    return leerLista(CLAVE_USUARIOS).filter(
        usuario => usuario && usuario.rol === "usuario"
    );
}

export function obtenerAspirantePorEmail(email) {
    if (!email) return null;

    return obtenerAspirantesPerfil().find(
        aspirante => aspirante.email === email
    ) || null;
}

export function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;

    const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);

    if (Number.isNaN(nacimiento.getTime())) return null;

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

    if (
        diferenciaMes < 0 ||
        (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    return edad >= 0 ? edad : null;
}

export function obtenerEvaluacion(email) {
    if (!email) return null;

    return leerLista(CLAVE_EVALUACIONES).find(
        evaluacion => evaluacion.aspiranteEmail === email
    ) || null;
}

export function guardarEvaluacion(evaluacion) {
    if (!evaluacion?.aspiranteEmail) {
        return { correcto: false, mensaje: "No se identificó al aspirante." };
    }

    const evaluaciones = leerLista(CLAVE_EVALUACIONES);

    const indice = evaluaciones.findIndex(
        item => item.aspiranteEmail === evaluacion.aspiranteEmail
    );

    if (indice >= 0) {
        evaluaciones[indice] = evaluacion;
    } else {
        evaluaciones.push(evaluacion);
    }

    if (!guardarLista(CLAVE_EVALUACIONES, evaluaciones)) {
        return { correcto: false, mensaje: "No fue posible guardar la evaluación." };
    }

    const resultado = actualizarDatosAspirante(
        evaluacion.aspiranteEmail,
        { estado: evaluacion.estado }
    );

    if (!resultado.correcto) {
        return resultado;
    }

    return { correcto: true, mensaje: "Evaluación registrada correctamente." };
}

export function obtenerProgramacion(email) {
    if (!email) return null;

    return leerLista(CLAVE_PROGRAMACIONES).find(
        programacion => programacion.aspiranteEmail === email
    ) || null;
}

export function guardarProgramacion(email, fechaEvaluacion) {
    if (!email || !fechaEvaluacion) {
        return { correcto: false, mensaje: "El aspirante y la fecha son obligatorios." };
    }

    const programaciones = leerLista(CLAVE_PROGRAMACIONES);

    const nuevaProgramacion = {
        aspiranteEmail: email,
        fechaEvaluacion
    };

    const indice = programaciones.findIndex(
        item => item.aspiranteEmail === email
    );

    if (indice >= 0) {
        programaciones[indice] = nuevaProgramacion;
    } else {
        programaciones.push(nuevaProgramacion);
    }

    if (!guardarLista(CLAVE_PROGRAMACIONES, programaciones)) {
        return { correcto: false, mensaje: "No fue posible guardar la programación." };
    }

    return actualizarDatosAspirante(email, { fechaEvaluacion });
}

export function actualizarDatosAspirante(email, cambios) {
    if (!email) {
        return { correcto: false, mensaje: "No se proporcionó el correo del aspirante." };
    }

    const usuarios = leerLista(CLAVE_USUARIOS);

    const indice = usuarios.findIndex(
        usuario => usuario.email === email && usuario.rol === "usuario"
    );

    if (indice === -1) {
        return { correcto: false, mensaje: "No se encontró al aspirante." };
    }

    usuarios[indice] = {
        ...usuarios[indice],
        ...cambios
    };

    if (!guardarLista(CLAVE_USUARIOS, usuarios)) {
        return { correcto: false, mensaje: "No fue posible actualizar al aspirante." };
    }

    return { correcto: true, aspirante: usuarios[indice] };
}

export function avanzarEtapaAspirante(email, etapa, estado) {
    if (!Number.isInteger(etapa) || etapa < 1) {
        return { correcto: false, mensaje: "La etapa indicada no es válida." };
    }

    return actualizarDatosAspirante(email, {
        etapaActual: etapa,
        estado
    });
}

export function registrarResultadoFinal(email, resultado) {
    const valoresPermitidos = ["Seleccionado/a", "No seleccionado/a"];

    if (!valoresPermitidos.includes(resultado)) {
        return { correcto: false, mensaje: "El resultado final no es válido." };
    }

    return actualizarDatosAspirante(email, {
        resultadoFinal: resultado,
        estado: resultado
    });
}

export function obtenerEtapaActual(aspirante) {
    return Number(aspirante?.etapaActual || 2);
}

export function procesoFinalizado(aspirante) {
    const estado = aspirante?.resultadoFinal || aspirante?.estado;

    return [
        "Seleccionado/a",
        "No seleccionado/a",
        "Rechazado"
    ].includes(estado);
}