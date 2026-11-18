import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    obtenerPerfilAspirante,
    obtenerProgreso,
    obtenerMensajeResultado,
    obtenerEstadoEntrega,
    validarArchivo,
    guardarEntregaEtapa2
} from "../servicios_js/portal-aspirante";

import {
    obtenerSesion,
    cerrarSesion,
    protegerVista
} from "../servicios_js/autenticaciones";

const ETAPAS = [
    "Registro",
    "Envío de CV y Vídeo",
    "Validación",
    "Entrevista virtual",
    "Pruebas Psicométricas",
    "Prueba Técnica"
];

function PortalAspirante() {
    const navigate = useNavigate();

    const inputCVRef = useRef(null);
    const inputVideoRef = useRef(null);

    const [sesion] = useState(() => obtenerSesion());

    const [aspirante, setAspirante] = useState(
        () => obtenerPerfilAspirante(sesion)
    );

    const [archivoCV, setArchivoCV] = useState(null);
    const [archivoVideo, setArchivoVideo] = useState(null);

    const [guardandoCV, setGuardandoCV] = useState(false);
    const [guardandoVideo, setGuardandoVideo] = useState(false);

    const [alerta, setAlerta] = useState(null);

    const rolesPermitidos = ["usuario", "administrador", "superadministrador"];

    const accesoAutorizado = Boolean(
        sesion &&
        protegerVista(rolesPermitidos)
    );

    const nombreUsuario =
        sesion?.nombreCompleto ||
        sesion?.nombre ||
        "Aspirante";

    const progreso = obtenerProgreso(aspirante);
    const estadoEntrega = obtenerEstadoEntrega(aspirante);
    const resultadoFinal = obtenerMensajeResultado(aspirante);

    const procesoFinalizado = Boolean(aspirante?.resultadoFinal);

    useEffect(() => {
        if (!accesoAutorizado) {
            navigate("/Login", { replace: true });
        }
    }, [accesoAutorizado, navigate]);

    useEffect(() => {
        if (!sesion || sesion.rol !== "usuario") return;

        function actualizarDesdeStorage() {
            setAspirante(obtenerPerfilAspirante(sesion));
        }

        window.addEventListener("storage", actualizarDesdeStorage);

        return () => {
            window.removeEventListener("storage", actualizarDesdeStorage);
        };
    }, [sesion]);

    function mostrarAlerta(tipo, mensaje) {
        setAlerta({ tipo, mensaje });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function seleccionarArchivo(tipo, archivo) {
        if (!archivo) return;

        const validacion = validarArchivo(tipo, archivo);

        if (!validacion.correcto) {
            if (tipo === "cv") {
                setArchivoCV(null);

                if (inputCVRef.current) {
                    inputCVRef.current.value = "";
                }
            } else {
                setArchivoVideo(null);

                if (inputVideoRef.current) {
                    inputVideoRef.current.value = "";
                }
            }

            Swal.fire({
                icon: "warning",
                title: "Archivo no válido",
                text: validacion.mensaje,
                confirmButtonText: "Aceptar"
            });

            return;
        }

        if (tipo === "cv") {
            setArchivoCV(archivo);
        } else {
            setArchivoVideo(archivo);
        }

        mostrarAlerta(
            "info",
            `Archivo seleccionado: ${archivo.name}. Recuerda presionar Enviar para guardarlo.`
        );
    }

    function manejarCambioCV(event) {
        seleccionarArchivo("cv", event.target.files?.[0]);
    }

    function manejarCambioVideo(event) {
        seleccionarArchivo("video", event.target.files?.[0]);
    }

    function cancelarSeleccion(tipo) {
        if (tipo === "cv") {
            setArchivoCV(null);

            if (inputCVRef.current) {
                inputCVRef.current.value = "";
            }
        } else {
            setArchivoVideo(null);

            if (inputVideoRef.current) {
                inputVideoRef.current.value = "";
            }
        }

        setAlerta(null);
    }

    async function enviarArchivo(tipo) {
        if (!aspirante?.email) {
            mostrarAlerta(
                "danger",
                "No se pudo identificar tu expediente. Cierra sesión e ingresa nuevamente."
            );
            return;
        }

        const archivo = tipo === "cv" ? archivoCV : archivoVideo;

        if (!archivo) {
            mostrarAlerta(
                "warning",
                tipo === "cv"
                    ? "Debes seleccionar tu currículum antes de enviarlo."
                    : "Debes seleccionar tu vídeo antes de enviarlo."
            );
            return;
        }

        if (tipo === "cv") {
            setGuardandoCV(true);
        } else {
            setGuardandoVideo(true);
        }

        setAlerta(null);

        try {
            const resultado = await guardarEntregaEtapa2(
                aspirante.email,
                tipo,
                archivo
            );

            if (!resultado.correcto) {
                mostrarAlerta("danger", resultado.mensaje);
                return;
            }

            setAspirante(resultado.aspirante);

            if (tipo === "cv") {
                setArchivoCV(null);

                if (inputCVRef.current) {
                    inputCVRef.current.value = "";
                }
            } else {
                setArchivoVideo(null);

                if (inputVideoRef.current) {
                    inputVideoRef.current.value = "";
                }
            }

            await Swal.fire({
                icon: "success",
                title: "Entrega registrada",
                text: resultado.mensaje,
                confirmButtonText: "Aceptar"
            });

            if (
                resultado.aspirante.cvAdjuntado &&
                resultado.aspirante.videoAdjuntado
            ) {
                mostrarAlerta(
                    "success",
                    "¡Excelente! Has completado el envío de tu CV y vídeo. Tu expediente avanzó a la etapa de Validación."
                );
            } else {
                mostrarAlerta(
                    "success",
                    `${resultado.mensaje} Recuerda completar también el otro archivo para avanzar a la siguiente etapa.`
                );
            }
        } catch (error) {
            console.error("Error al enviar archivo:", error);

            mostrarAlerta(
                "danger",
                error.message || "Ocurrió un error al enviar el archivo."
            );
        } finally {
            if (tipo === "cv") {
                setGuardandoCV(false);
            } else {
                setGuardandoVideo(false);
            }
        }
    }

    function cerrarSesionUsuario() {
        cerrarSesion();
        navigate("/Login", { replace: true });
    }

    function obtenerClaseEtapa(numeroEtapa) {
        if (numeroEtapa < progreso) {
            return "bg-primary text-white";
        }

        if (numeroEtapa === progreso) {
            return "bg-white border border-primary text-primary";
        }

        return "bg-secondary-subtle text-secondary";
    }

    function obtenerEtiquetaEtapa(numeroEtapa) {
        if (numeroEtapa <= progreso) {
            return "badge bg-primary mt-2 rounded-pill px-3 py-1";
        }

        return "badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1";
    }

    function nombreArchivo(tipo) {
        if (tipo === "cv") {
            return archivoCV?.name ||
                aspirante?.cvNombreArchivo ||
                (aspirante?.cvAdjuntado ? "CV enviado" : "Ningún archivo seleccionado");
        }

        return archivoVideo?.name ||
            aspirante?.videoNombreArchivo ||
            (aspirante?.videoAdjuntado ? "Vídeo enviado" : "Ningún archivo seleccionado");
    }

    if (!accesoAutorizado) {
        return null;
    }

    if (!aspirante) {
        return (
            <main className="container py-5">
                <div className="alert alert-warning text-center">
                    <h4>No se encontró tu expediente</h4>
                    <p>
                        La sesión está activa, pero no se encontró un registro
                        de aspirante asociado a tu cuenta.
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={cerrarSesionUsuario}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </main>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* ENCABEZADO */}
            <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4 py-3">
                <div className="container-fluid">
                    <div className="d-flex align-items-center gap-2">
                        <img
                            src="/recursos/logo_AIDEL.png"
                            alt="Logo ProTalento"
                            className="logo_portalAspirante"
                        />

                        <span className="fs-4 fw-bold text-dark mb-0">
                            ProTalento
                        </span>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold text-secondary small">
                            Bienvenido, {nombreUsuario}
                        </span>

                        <div className="topbar-user">
                            <i className="bi bi-person-circle fs-4"></i>
                        </div>

                        <button
                            type="button"
                            onClick={cerrarSesionUsuario}
                            className="btn btn-outline-danger btn-sm fw-bold"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="container my-5 flex-grow-1">

                {/* MENSAJE DE MOTIVACIÓN */}
                <div className="text-center mb-5">
                    <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "850px" }}>
                        ¡No te detengas ahora! Estás cada vez más cerca de tu meta.
                        Completa tu proceso de selección y demuestra tu potencial.
                    </p>
                </div>

                {/* PROGRESO DEL PROCESO */}
                <section className="mb-5 overflow-auto pb-3">
                    <div
                        className="d-flex justify-content-between align-items-start position-relative px-3"
                        style={{ minWidth: "750px" }}
                    >
                        <div
                            className="position-absolute bg-secondary-subtle"
                            style={{
                                height: "4px",
                                top: "18px",
                                left: "0",
                                width: "100%",
                                zIndex: 0
                            }}
                        />

                        <div
                            className="position-absolute bg-primary"
                            style={{
                                height: "4px",
                                top: "18px",
                                left: "0",
                                width: `${((progreso - 1) / 5) * 100}%`,
                                zIndex: 0,
                                transition: "width 0.3s ease"
                            }}
                        />

                        {ETAPAS.map((etapa, index) => {
                            const numero = index + 1;

                            return (
                                <div
                                    key={etapa}
                                    className="text-center position-relative"
                                    style={{ zIndex: 1, width: "16.66%" }}
                                >
                                    <div
                                        className={`step-badge mx-auto shadow-sm ${obtenerClaseEtapa(numero)}`}
                                    >
                                        {numero < progreso ? "✓" : numero}
                                    </div>

                                    <span className={obtenerEtiquetaEtapa(numero)}>
                                        {etapa}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* INDICADOR DE ETAPA */}
                <div className="text-center mb-4">
                    <span className="badge bg-primary fs-6 px-3 py-2">
                        Etapa {progreso} de 6
                    </span>
                </div>

                {/* ALERTAS */}
                {alerta && (
                    <div
                        className={`alert alert-${alerta.tipo} text-center rounded-3 mb-4`}
                        role="alert"
                    >
                        {alerta.mensaje}

                        <button
                            type="button"
                            className="btn-close float-end"
                            aria-label="Cerrar"
                            onClick={() => setAlerta(null)}
                        />
                    </div>
                )}

                {resultadoFinal && (
                    <div
                        className={`alert alert-${resultadoFinal.tipo} text-center rounded-3 mb-4`}
                        role="alert"
                    >
                        <strong>{resultadoFinal.mensaje}</strong>
                    </div>
                )}

                {/* RESUMEN DEL EXPEDIENTE */}
                <section className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-8">
                                <h2 className="h5 fw-bold mb-2">
                                    Mi expediente
                                </h2>

                                <p className="text-muted mb-1">
                                    <strong>Nombre:</strong>{" "}
                                    {aspirante.nombreCompleto || nombreUsuario}
                                </p>

                                <p className="text-muted mb-1">
                                    <strong>Curso:</strong>{" "}
                                    {aspirante.curso || "No especificado"}
                                </p>

                                <p className="text-muted mb-0">
                                    <strong>Estado:</strong>{" "}
                                    {aspirante.estado || "En proceso"}
                                </p>
                            </div>

                            <div className="col-md-4">
                                <div className="d-flex flex-column gap-2">
                                    <span className={`badge ${estadoEntrega.cvAdjuntado ? "bg-success" : "bg-secondary"}`}>
                                        {estadoEntrega.cvAdjuntado ? "✓ CV enviado" : "CV pendiente"}
                                    </span>

                                    <span className={`badge ${estadoEntrega.videoAdjuntado ? "bg-success" : "bg-secondary"}`}>
                                        {estadoEntrega.videoAdjuntado ? "✓ Vídeo enviado" : "Vídeo pendiente"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CARGA DE ARCHIVOS */}
                {!procesoFinalizado && (
                    <>
                        <div className="text-center mb-4">
                            <h2 className="h4 fw-bold">
                                Envío de CV y vídeo de presentación
                            </h2>

                            <p className="text-muted">
                                Completa ambos documentos para que tu expediente
                                avance a la etapa de validación.
                            </p>
                        </div>

                        <div className="row g-4">

                            {/* CARD CV */}
                            <div className="col-md-6">
                                <div className="card bg-custom-card border-info-subtle rounded-4 h-100 p-4 shadow-sm">
                                    <div>
                                        <h3 className="h5 fw-bold text-dark mb-1">
                                            Adjuntar Currículum Vitae (PDF)
                                        </h3>

                                        <p className="text-muted small">
                                            Adjunta tu currículum en formato PDF.
                                            El archivo no debe superar los 5 MB.
                                        </p>

                                        <div className="border border-2 border-dashed border-info rounded-4 p-4 text-center bg-white bg-opacity-50 mt-4">
                                            <div className="fs-1 text-primary mb-2">
                                                <i className="bi bi-cloud-arrow-up"></i>
                                            </div>

                                            <p className="fw-bold text-dark small mb-0">
                                                Selecciona tu currículum
                                            </p>

                                            <p className="text-muted small mb-3">
                                                Formato PDF · Máximo 5 MB
                                            </p>

                                            <label className="btn btn-naranja btn-sm px-4 rounded-3 shadow-sm">
                                                Buscar archivo

                                                <input
                                                    ref={inputCVRef}
                                                    type="file"
                                                    accept=".pdf,application/pdf"
                                                    className="d-none"
                                                    onChange={manejarCambioCV}
                                                    disabled={guardandoCV || procesoFinalizado}
                                                />
                                            </label>
                                        </div>

                                        <div className="mt-3 small text-break">
                                            <strong>Archivo:</strong> {nombreArchivo("cv")}
                                        </div>

                                        {aspirante.cvAdjuntado && (
                                            <p className="text-success small mt-2 mb-0">
                                                <i className="bi bi-check-circle-fill"></i>{" "}
                                                Tu CV ya fue enviado.
                                            </p>
                                        )}
                                    </div>

                                    <div className="row g-2 mt-4">
                                        <div className="col-6">
                                            <button
                                                type="button"
                                                className="btn btn-light border w-100 rounded-3 text-secondary fw-bold btn-sm"
                                                onClick={() => cancelarSeleccion("cv")}
                                                disabled={guardandoCV || !archivoCV}
                                            >
                                                Cancelar
                                            </button>
                                        </div>

                                        <div className="col-6">
                                            <button
                                                type="button"
                                                onClick={() => enviarArchivo("cv")}
                                                className="btn btn-primary w-100 rounded-3 fw-bold btn-sm shadow-sm"
                                                disabled={guardandoCV || !archivoCV}
                                            >
                                                {guardandoCV ? "Enviando..." : "Enviar CV"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CARD VIDEO */}
                            <div className="col-md-6">
                                <div className="card bg-custom-card border-info-subtle rounded-4 h-100 p-4 shadow-sm">
                                    <div>
                                        <h3 className="h5 fw-bold text-dark mb-1">
                                            Vídeo de presentación
                                        </h3>

                                        <p className="text-muted small">
                                            Explica brevemente por qué deseas
                                            participar en el curso de formación
                                            técnica de AIDEL.
                                        </p>

                                        <div className="border border-2 border-dashed border-info rounded-4 p-4 text-center bg-white bg-opacity-50 mt-4">
                                            <div className="fs-1 text-primary mb-2">
                                                <i className="bi bi-camera-video"></i>
                                            </div>

                                            <p className="fw-bold text-dark small mb-0">
                                                Selecciona tu vídeo
                                            </p>

                                            <p className="text-muted small mb-3">
                                                Formatos MP4 o MOV · Máximo 50 MB
                                            </p>

                                            <label className="btn btn-naranja btn-sm px-4 rounded-3 shadow-sm">
                                                Buscar vídeo

                                                <input
                                                    ref={inputVideoRef}
                                                    type="file"
                                                    accept=".mp4,.mov,video/mp4,video/quicktime"
                                                    className="d-none"
                                                    onChange={manejarCambioVideo}
                                                    disabled={guardandoVideo || procesoFinalizado}
                                                />
                                            </label>
                                        </div>

                                        <div className="mt-3 small text-break">
                                            <strong>Archivo:</strong> {nombreArchivo("video")}
                                        </div>

                                        {aspirante.videoAdjuntado && (
                                            <p className="text-success small mt-2 mb-0">
                                                <i className="bi bi-check-circle-fill"></i>{" "}
                                                Tu vídeo ya fue enviado.
                                            </p>
                                        )}
                                    </div>

                                    <div className="row g-2 mt-4">
                                        <div className="col-6">
                                            <button
                                                type="button"
                                                className="btn btn-light border w-100 rounded-3 text-secondary fw-bold btn-sm"
                                                onClick={() => cancelarSeleccion("video")}
                                                disabled={guardandoVideo || !archivoVideo}
                                            >
                                                Cancelar
                                            </button>
                                        </div>

                                        <div className="col-6">
                                            <button
                                                type="button"
                                                onClick={() => enviarArchivo("video")}
                                                className="btn btn-primary w-100 rounded-3 fw-bold btn-sm shadow-sm"
                                                disabled={guardandoVideo || !archivoVideo}
                                            >
                                                {guardandoVideo ? "Enviando..." : "Enviar vídeo"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* MENSAJE DE ENTREGA COMPLETA */}
                {estadoEntrega.completo && !procesoFinalizado && (
                    <div className="alert alert-success text-center mt-4 rounded-3">
                        <h4 className="h5 fw-bold">
                            <i className="bi bi-check-circle-fill"></i>{" "}
                            ¡Has completado el envío de documentos!
                        </h4>

                        <p className="mb-0">
                            Tu CV y vídeo fueron recibidos. Tu expediente se
                            encuentra en la etapa de validación.
                        </p>
                    </div>
                )}

                {/* PROCESO FINALIZADO */}
                {procesoFinalizado && (
                    <div className="card border-0 shadow-sm rounded-4 mt-4">
                        <div className="card-body text-center p-5">
                            <i className="bi bi-flag-fill fs-1 text-primary"></i>

                            <h2 className="h4 fw-bold mt-3">
                                Proceso de selección finalizado
                            </h2>

                            <p className="text-muted mb-0">
                                {resultadoFinal?.mensaje}
                            </p>
                        </div>
                    </div>
                )}
            </main>

            {/* PIE DE PÁGINA */}
            <footer className="text-center text-muted small py-4 border-top mt-auto">
                ProTalento - AIDEL
            </footer>
        </div>
    );
}

export default PortalAspirante;