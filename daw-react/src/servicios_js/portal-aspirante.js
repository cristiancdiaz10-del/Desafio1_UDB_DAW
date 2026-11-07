// Lógica del Portal del Aspirante.
// Los archivos se almacenan en IndexedDB y los datos del expediente
// se actualizan en localStorage.

import { obtenerSesion } from "./autenticaciones";

const DB_NOMBRE = "ProTalentoDB";
const DB_VERSION = 2;

const ALMACENES = {
    cv: "curriculums",
    video: "videos"
};

const LIMITES = {
    cv: 5 * 1024 * 1024,
    video: 50 * 1024 * 1024
};

function leerUsuarios() {
    try {
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
        return Array.isArray(usuarios) ? usuarios : [];
    } catch (error) {
        console.error("Error al leer usuarios:", error);
        return [];
    }
}

function guardarUsuarios(usuarios) {
    try {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        return true;
    } catch (error) {
        console.error("Error al guardar usuarios:", error);
        return false;
    }
}

function abrirBaseDatos() {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
            reject(new Error("Este navegador no permite utilizar IndexedDB."));
            return;
        }

        const solicitud = indexedDB.open(DB_NOMBRE, DB_VERSION);

        solicitud.onupgradeneeded = (evento) => {
            const db = evento.target.result;

            Object.values(ALMACENES).forEach(nombreAlmacen => {
                if (!db.objectStoreNames.contains(nombreAlmacen)) {
                    db.createObjectStore(nombreAlmacen, {
                        keyPath: "email"
                    });
                }
            });
        };

        solicitud.onsuccess = () => resolve(solicitud.result);

        solicitud.onerror = () => {
            reject(solicitud.error || new Error("No se pudo abrir la base de datos."));
        };

        solicitud.onblocked = () => {
            reject(new Error(
                "La actualización de la base de datos está bloqueada. Cierra otras pestañas de la aplicación e inténtalo nuevamente."
            ));
        };
    });
}

function obtenerAlmacen(tipo) {
    const almacen = ALMACENES[tipo];

    if (!almacen) {
        throw new Error("Tipo de archivo no válido.");
    }

    return almacen;
}

export function validarArchivo(tipo, archivo) {
    if (!archivo) {
        return {
            correcto: false,
            mensaje: "Selecciona un archivo antes de continuar."
        };
    }

    if (tipo === "cv") {
        const esPDF =
            archivo.type === "application/pdf" ||
            archivo.name.toLowerCase().endsWith(".pdf");

        if (!esPDF) {
            return {
                correcto: false,
                mensaje: "El currículum debe estar en formato PDF."
            };
        }

        if (archivo.size > LIMITES.cv) {
            return {
                correcto: false,
                mensaje: "El currículum no puede superar los 5 MB."
            };
        }

        return { correcto: true, mensaje: "Archivo PDF válido." };
    }

    if (tipo === "video") {
        const nombre = archivo.name.toLowerCase();

        const extensionValida =
            nombre.endsWith(".mp4") ||
            nombre.endsWith(".mov");

        if (!extensionValida) {
            return {
                correcto: false,
                mensaje: "El vídeo debe estar en formato MP4 o MOV."
            };
        }

        if (archivo.size > LIMITES.video) {
            return {
                correcto: false,
                mensaje: "El vídeo no puede superar los 50 MB."
            };
        }

        return { correcto: true, mensaje: "Archivo de vídeo válido." };
    }

    return {
        correcto: false,
        mensaje: "El tipo de archivo no es válido."
    };
}

export async function guardarArchivo(email, tipo, archivo) {
    if (!email) {
        throw new Error("No se identificó el correo del aspirante.");
    }

    const validacion = validarArchivo(tipo, archivo);

    if (!validacion.correcto) {
        throw new Error(validacion.mensaje);
    }

    const nombreAlmacen = obtenerAlmacen(tipo);
    const db = await abrirBaseDatos();

    return new Promise((resolve, reject) => {
        let transaccion;

        try {
            transaccion = db.transaction(nombreAlmacen, "readwrite");

            const almacen = transaccion.objectStore(nombreAlmacen);

            almacen.put({
                email,
                nombreArchivo: archivo.name,
                tipoArchivo: archivo.type || (
                    tipo === "cv" ? "application/pdf" : "video"
                ),
                tamano: archivo.size,
                fecha: new Date().toISOString(),
                archivo
            });

            transaccion.oncomplete = () => {
                db.close();
                resolve({
                    correcto: true,
                    nombreArchivo: archivo.name
                });
            };

            transaccion.onerror = () => {
                const error = transaccion.error;
                db.close();
                reject(error || new Error("No se pudo guardar el archivo."));
            };

            transaccion.onabort = () => {
                const error = transaccion.error;
                db.close();
                reject(error || new Error("Se canceló el almacenamiento del archivo."));
            };
        } catch (error) {
            db.close();
            reject(error);
        }
    });
}

export async function obtenerArchivo(email, tipo) {
    if (!email) return null;

    const nombreAlmacen = obtenerAlmacen(tipo);
    const db = await abrirBaseDatos();

    return new Promise((resolve, reject) => {
        const transaccion = db.transaction(nombreAlmacen, "readonly");
        const solicitud = transaccion.objectStore(nombreAlmacen).get(email);

        solicitud.onsuccess = () => {
            const resultado = solicitud.result || null;
            db.close();
            resolve(resultado);
        };

        solicitud.onerror = () => {
            const error = solicitud.error;
            db.close();
            reject(error || new Error("No se pudo recuperar el archivo."));
        };
    });
}

export async function eliminarArchivo(email, tipo) {
    if (!email) {
        throw new Error("No se identificó al aspirante.");
    }

    const nombreAlmacen = obtenerAlmacen(tipo);
    const db = await abrirBaseDatos();

    return new Promise((resolve, reject) => {
        const transaccion = db.transaction(nombreAlmacen, "readwrite");

        transaccion.objectStore(nombreAlmacen).delete(email);

        transaccion.oncomplete = () => {
            db.close();
            resolve(true);
        };

        transaccion.onerror = () => {
            const error = transaccion.error;
            db.close();
            reject(error || new Error("No se pudo eliminar el archivo."));
        };
    });
}

export function obtenerPerfilAspirante(sesion = obtenerSesion()) {
    if (!sesion) return null;

    const usuarios = leerUsuarios();

    return usuarios.find(usuario =>
        usuario.rol === "usuario" &&
        (
            (sesion.email && usuario.email === sesion.email) ||
            (sesion.id && usuario.id && usuario.id === sesion.id)
        )
    ) || null;
}

export function obtenerProgreso(aspirante) {
    if (!aspirante) return 1;

    const resultadoFinal = aspirante.resultadoFinal;

    if (
        resultadoFinal === "Seleccionado/a" ||
        resultadoFinal === "No seleccionado/a"
    ) {
        return 6;
    }

    const etapa = Number(aspirante.etapaActual || 2);

    return Math.min(6, Math.max(1, etapa));
}

export function obtenerMensajeResultado(aspirante) {
    if (!aspirante?.resultadoFinal) return null;

    if (aspirante.resultadoFinal === "Seleccionado/a") {
        return {
            tipo: "success",
            mensaje: "¡Felicidades! Has sido seleccionado/a."
        };
    }

    if (aspirante.resultadoFinal === "No seleccionado/a") {
        return {
            tipo: "danger",
            mensaje: "Tu proceso ha finalizado. No has sido seleccionado/a."
        };
    }

    return null;
}

export function obtenerEstadoEntrega(aspirante) {
    return {
        cvAdjuntado: Boolean(aspirante?.cvAdjuntado),
        videoAdjuntado: Boolean(aspirante?.videoAdjuntado),
        etapaActual: obtenerProgreso(aspirante),
        completo: Boolean(
            aspirante?.cvAdjuntado && aspirante?.videoAdjuntado
        )
    };
}

export function actualizarExpediente(email, cambios) {
    if (!email) {
        return {
            correcto: false,
            mensaje: "No se identificó al aspirante."
        };
    }

    const usuarios = leerUsuarios();

    const indice = usuarios.findIndex(usuario =>
        usuario.rol === "usuario" && usuario.email === email
    );

    if (indice === -1) {
        return {
            correcto: false,
            mensaje: "No se encontró el expediente del aspirante."
        };
    }

    usuarios[indice] = {
        ...usuarios[indice],
        ...cambios
    };

    if (!guardarUsuarios(usuarios)) {
        return {
            correcto: false,
            mensaje: "No se pudieron actualizar los datos del expediente."
        };
    }

    return {
        correcto: true,
        aspirante: usuarios[indice]
    };
}

export async function guardarEntregaEtapa2(email, tipo, archivo) {
    if (!email) {
        return {
            correcto: false,
            mensaje: "No se identificó al aspirante."
        };
    }

    if (tipo !== "cv" && tipo !== "video") {
        return {
            correcto: false,
            mensaje: "El tipo de entrega no es válido."
        };
    }

    const aspirante = leerUsuarios().find(usuario =>
        usuario.rol === "usuario" && usuario.email === email
    );

    if (!aspirante) {
        return {
            correcto: false,
            mensaje: "No se encontró el expediente del aspirante."
        };
    }

    if (
        aspirante.resultadoFinal === "Seleccionado/a" ||
        aspirante.resultadoFinal === "No seleccionado/a"
    ) {
        return {
            correcto: false,
            mensaje: "El proceso de selección ya ha finalizado."
        };
    }

    const validacion = validarArchivo(tipo, archivo);

    if (!validacion.correcto) {
        return {
            correcto: false,
            mensaje: validacion.mensaje
        };
    }

    try {
        await guardarArchivo(email, tipo, archivo);

        const cambios = tipo === "cv"
            ? {
                cvAdjuntado: true,
                cvNombreArchivo: archivo.name,
                cvFechaEnvio: new Date().toISOString()
            }
            : {
                videoAdjuntado: true,
                videoNombreArchivo: archivo.name,
                videoFechaEnvio: new Date().toISOString()
            };

        const usuarios = leerUsuarios();

        const indice = usuarios.findIndex(usuario =>
            usuario.rol === "usuario" && usuario.email === email
        );

        if (indice === -1) {
            return {
                correcto: false,
                mensaje: "El archivo se guardó, pero no se encontró el expediente para actualizarlo."
            };
        }

        usuarios[indice] = {
            ...usuarios[indice],
            ...cambios
        };

        if (
            usuarios[indice].cvAdjuntado &&
            usuarios[indice].videoAdjuntado
        ) {
            usuarios[indice].etapaActual = Math.max(
                Number(usuarios[indice].etapaActual || 2),
                3
            );

            // No sobrescribir estados de etapas posteriores.
            if (
                !usuarios[indice].estado ||
                usuarios[indice].estado === "Postulado"
            ) {
                usuarios[indice].estado = "En revisión";
            }
        } else if (!usuarios[indice].etapaActual) {
            usuarios[indice].etapaActual = 2;
        }

        if (!guardarUsuarios(usuarios)) {
            return {
                correcto: false,
                mensaje: "El archivo se guardó, pero no se pudieron actualizar los datos del expediente."
            };
        }

        return {
            correcto: true,
            mensaje: tipo === "cv"
                ? "Tu currículum se envió correctamente."
                : "Tu vídeo de presentación se envió correctamente.",
            aspirante: usuarios[indice]
        };
    } catch (error) {
        console.error("Error al guardar la entrega:", error);

        return {
            correcto: false,
            mensaje: error.message || "No se pudo guardar el archivo."
        };
    }
}