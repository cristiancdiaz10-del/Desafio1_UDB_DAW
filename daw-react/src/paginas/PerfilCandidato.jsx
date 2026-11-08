import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    obtenerAspirantesPerfil,
    obtenerAspirantePorEmail,
    calcularEdad,
    obtenerEvaluacion,
    guardarEvaluacion,
    obtenerProgramacion,
    guardarProgramacion,
    avanzarEtapaAspirante,
    registrarResultadoFinal,
    obtenerEtapaActual,
    procesoFinalizado
} from "../servicios_js/perfil-candidato";

import {
    obtenerSesion,
    cerrarSesion,
    protegerVista
} from "../servicios_js/autenticaciones";

function PerfilCandidato() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [aspirantes, setAspirantes] = useState([]);
    const [emailSeleccionado, setEmailSeleccionado] = useState("");
    const [nombreEvaluador, setNombreEvaluador] = useState("");

    const [fechaEvaluacion, setFechaEvaluacion] = useState("");
    const [habilidades, setHabilidades] = useState(0);
    const [calidadVideo, setCalidadVideo] = useState(0);
    const [perfilAcademico, setPerfilAcademico] = useState(0);
    const [comentarios, setComentarios] = useState("");

    const [accesoAutorizado, setAccesoAutorizado] = useState(false);

    const aspiranteSeleccionado = useMemo(
        () => aspirantes.find(
            aspirante => aspirante.email === emailSeleccionado
        ) || null,
        [aspirantes, emailSeleccionado]
    );

    const promedio = (
        Number(habilidades) +
        Number(calidadVideo) +
        Number(perfilAcademico)
    ) / 3;

    const etapaActual = obtenerEtapaActual(aspiranteSeleccionado);
    const finalizado = procesoFinalizado(aspiranteSeleccionado);

    // Protección de la vista y carga inicial.
    useEffect(() => {
        const sesion = obtenerSesion();
        const rolesPermitidos = ["administrador", "superadministrador"];

        if (!sesion || !protegerVista(rolesPermitidos)) {
            navigate("/Login", { replace: true });
            return;
        }

        setNombreEvaluador(
            sesion.nombreCompleto || sesion.nombre || "Usuario"
        );

        const lista = obtenerAspirantesPerfil();
        setAspirantes(lista);

        const emailInicial =
            searchParams.get("email") ||
            localStorage.getItem("emailEvaluar") ||
            (() => {
                try {
                    const guardado = JSON.parse(
                        localStorage.getItem("aspiranteEvaluar") || "null"
                    );
                    return guardado?.email || "";
                } catch {
                    return "";
                }
            })();

        if (emailInicial && lista.some(item => item.email === emailInicial)) {
            setEmailSeleccionado(emailInicial);
        }

        localStorage.removeItem("emailEvaluar");
        localStorage.removeItem("aspiranteEvaluar");

        setAccesoAutorizado(true);
    }, [navigate, searchParams]);

    // Cargar evaluación y programación cada vez que cambia el aspirante.
    useEffect(() => {
        if (!emailSeleccionado) {
            limpiarEvaluacion();
            setFechaEvaluacion("");
            return;
        }

        const evaluacion = obtenerEvaluacion(emailSeleccionado);
        const programacion = obtenerProgramacion(emailSeleccionado);

        setHabilidades(Number(evaluacion?.habilidades || 0));
        setCalidadVideo(Number(evaluacion?.calidadVideo || 0));
        setPerfilAcademico(Number(evaluacion?.perfilAcademico || 0));
        setComentarios(evaluacion?.observaciones || "");
        setFechaEvaluacion(programacion?.fechaEvaluacion || "");
    }, [emailSeleccionado]);

    function limpiarEvaluacion() {
        setHabilidades(0);
        setCalidadVideo(0);
        setPerfilAcademico(0);
        setComentarios("");
    }

    function refrescarAspirantes() {
        setAspirantes(obtenerAspirantesPerfil());
    }

    function mostrarAlerta(icon, title, text) {
        return Swal.fire({
            icon,
            title,
            text,
            confirmButtonText: "Aceptar"
        });
    }

    async function confirmarAccion(tipo, nombre) {
        const esAprobacion = tipo === "aprobar";

        const resultado = await Swal.fire({
            icon: "warning",
            title: esAprobacion ? "¿Aprobar candidato?" : "¿Rechazar candidato?",
            text: `¿Confirmas esta decisión para ${nombre}?`,
            showCancelButton: true,
            confirmButtonText: esAprobacion ? "Sí, aprobar" : "Sí, rechazar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: esAprobacion ? "#198754" : "#dc3545"
        });

        return resultado.isConfirmed;
    }

    function seleccionarAspirante(event) {
        setEmailSeleccionado(event.target.value);
    }

    async function programarEvaluacion() {
        if (!aspiranteSeleccionado) {
            await mostrarAlerta(
                "warning",
                "Aspirante no seleccionado",
                "Selecciona un aspirante antes de continuar."
            );
            return;
        }

        if (!fechaEvaluacion) {
            await mostrarAlerta(
                "warning",
                "Fecha requerida",
                "Selecciona una fecha para la evaluación."
            );
            return;
        }

        const resultado = guardarProgramacion(
            emailSeleccionado,
            fechaEvaluacion
        );

        if (!resultado.correcto) {
            await mostrarAlerta("error", "No se pudo programar", resultado.mensaje);
            return;
        }

        refrescarAspirantes();

        await mostrarAlerta(
            "success",
            "¡Programación exitosa!",
            "La evaluación se programó correctamente."
        );
    }

    async function registrarDecision(estado) {
        if (!aspiranteSeleccionado) {
            await mostrarAlerta(
                "warning",
                "Aspirante no seleccionado",
                "Selecciona un aspirante antes de continuar."
            );
            return;
        }

        if (
            habilidades === 0 ||
            calidadVideo === 0 ||
            perfilAcademico === 0
        ) {
            await mostrarAlerta(
                "warning",
                "Criterios no evaluados",
                "Debes evaluar los tres criterios antes de registrar una decisión."
            );
            return;
        }

        if (estado === "Aprobado" || estado === "Rechazado") {
            const confirmado = await confirmarAccion(
                estado === "Aprobado" ? "aprobar" : "rechazar",
                aspiranteSeleccionado.nombreCompleto ||
                aspiranteSeleccionado.nombre ||
                aspiranteSeleccionado.email
            );

            if (!confirmado) return;
        }

        const resultado = guardarEvaluacion({
            aspiranteEmail: emailSeleccionado,
            habilidades: Number(habilidades),
            calidadVideo: Number(calidadVideo),
            perfilAcademico: Number(perfilAcademico),
            promedio: Number(promedio.toFixed(2)),
            observaciones: comentarios,
            estado
        });

        if (!resultado.correcto) {
            await mostrarAlerta("error", "Error", resultado.mensaje);
            return;
        }

        refrescarAspirantes();

        await mostrarAlerta(
            "success",
            "Evaluación registrada",
            `La evaluación se registró correctamente con el estado: ${estado}.`
        );
    }

    async function completarEtapa(etapa, estado, titulo, mensaje) {
        if (!aspiranteSeleccionado) {
            await mostrarAlerta(
                "warning",
                "Aspirante no seleccionado",
                "Selecciona un aspirante antes de continuar."
            );
            return;
        }

        const resultado = avanzarEtapaAspirante(
            emailSeleccionado,
            etapa,
            estado
        );

        if (!resultado.correcto) {
            await mostrarAlerta("error", "No se pudo avanzar", resultado.mensaje);
            return;
        }

        refrescarAspirantes();

        await mostrarAlerta("success", titulo, mensaje);
    }

    async function resultadoFinal(resultadoFinal) {
        if (!aspiranteSeleccionado) {
            await mostrarAlerta(
                "warning",
                "Aspirante no seleccionado",
                "Selecciona un aspirante antes de continuar."
            );
            return;
        }

        if (etapaActual < 6) {
            await mostrarAlerta(
                "warning",
                "Etapa pendiente",
                "El resultado final solo puede registrarse después de completar la etapa técnica."
            );
            return;
        }

        const esAprobacion = resultadoFinal === "Seleccionado/a";

        const confirmado = await confirmarAccion(
            esAprobacion ? "aprobar" : "rechazar",
            aspiranteSeleccionado.nombreCompleto ||
            aspiranteSeleccionado.nombre ||
            aspiranteSeleccionado.email
        );

        if (!confirmado) return;

        const resultado = registrarResultadoFinal(
            emailSeleccionado,
            resultadoFinal
        );

        if (!resultado.correcto) {
            await mostrarAlerta("error", "Error", resultado.mensaje);
            return;
        }

        refrescarAspirantes();

        await mostrarAlerta(
            "success",
            esAprobacion ? "Aspirante aprobado" : "Aspirante rechazado",
            esAprobacion
                ? "El aspirante ha sido seleccionado exitosamente."
                : "El aspirante no ha sido seleccionado."
        );
    }

    function cerrarSesionUsuario() {
        cerrarSesion();
        navigate("/Login", { replace: true });
    }

    function mostrarArchivo(tipo) {
        if (!aspiranteSeleccionado) {
            mostrarAlerta(
                "warning",
                "Aspirante no seleccionado",
                "Selecciona un aspirante primero."
            );
            return;
        }

        const esCV = tipo === "CV";

        // El registro actual solo almacena indicadores de adjunto,
        // no una ruta o URL que permita abrir el documento.
        const adjuntado = esCV
            ? aspiranteSeleccionado.cvAdjuntado
            : aspiranteSeleccionado.videoAdjuntado;

        if (!adjuntado) {
            mostrarAlerta(
                "info",
                `${tipo} no disponible`,
                `El aspirante no tiene un ${esCV ? "CV" : "vídeo"} marcado como adjunto.`
            );
            return;
        }

        mostrarAlerta(
            "info",
            `${tipo} registrado`,
            `El registro indica que existe un ${esCV ? "CV" : "vídeo"} adjunto, pero todavía no almacena la ruta del archivo para abrirlo.`
        );
    }

    function mostrarEstrellas(valor, cambiarValor) {
        return (
            <div className="estrellas">
                {[1, 2, 3, 4, 5].map(numero => (
                    <button
                        key={numero}
                        type="button"
                        className={`estrella ${numero <= valor ? "seleccionada" : ""}`}
                        onClick={() => cambiarValor(numero)}
                        aria-label={`${numero} de 5 estrellas`}
                        aria-pressed={numero === valor}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    }

    if (!accesoAutorizado) {
        return null;
    }

    const edad = calcularEdad(aspiranteSeleccionado?.fechaNacimiento);

    return (
        <>
            <header className="encabezado">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-8 d-flex align-items-center gap-3">
                            <div>
                                <img
                                    src="/recursos/logo_AIDEL.png"
                                    alt="Logo ProTalento"
                                    className="logo_evaluaciones"
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate("/PanelControl")}
                                >
                                    Volver a inicio
                                </button>
                            </div>

                            <h1 className="titulo-principal">
                                ProTalento - Perfil de candidato
                            </h1>
                        </div>

                        <div className="col-4 d-flex align-items-center justify-content-end gap-3">
                            <span>{nombreEvaluador}</span>
                            <i className="bi bi-person-circle fs-5"></i>
                            <button
                                type="button"
                                onClick={cerrarSesionUsuario}
                                className="btn btn-outline-danger btn-sm fw-bold"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container-fluid contenido-principal">
                <div className="row g-4">
                    {/* COLUMNA IZQUIERDA */}
                    <section className="col-lg-7">
                        <h2 className="titulo-seccion">
                            Información general del candidato
                        </h2>

                        <div className="mb-3">
                            <label htmlFor="seleccionarAspirante" className="form-label">
                                Seleccionar aspirante
                            </label>

                            <select
                                id="seleccionarAspirante"
                                className="form-select"
                                value={emailSeleccionado}
                                onChange={seleccionarAspirante}
                            >
                                <option value="">Seleccione un aspirante</option>

                                {aspirantes.map(aspirante => (
                                    <option
                                        key={aspirante.email}
                                        value={aspirante.email}
                                    >
                                        {aspirante.nombreCompleto ||
                                            aspirante.nombre ||
                                            aspirante.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="fechaEvaluacion" className="form-label">
                                Fecha de evaluación
                            </label>

                            <input
                                type="date"
                                id="fechaEvaluacion"
                                className="form-control"
                                value={fechaEvaluacion}
                                onChange={event => setFechaEvaluacion(event.target.value)}
                                disabled={!aspiranteSeleccionado}
                            />
                        </div>

                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={programarEvaluacion}
                                disabled={!aspiranteSeleccionado}
                            >
                                Programar evaluación
                            </button>
                        </div>

                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-success w-100"
                                onClick={() => completarEtapa(
                                    4,
                                    "En entrevista",
                                    "Validación completada",
                                    "El aspirante ha avanzado a Entrevista Virtual (Etapa 4)."
                                )}
                               disabled={!aspiranteSeleccionado || finalizado || etapaActual > 3}
                            >
                                Validación completada → Pasar Entrevista Virtual
                            </button>
                        </div>

                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-success w-100"
                                onClick={() => completarEtapa(
                                    5,
                                    "En psicométricas",
                                    "Entrevista completada",
                                    "El aspirante ha avanzado a Pruebas Psicométricas (Etapa 5)."
                                )}
                                disabled={!aspiranteSeleccionado || finalizado || etapaActual !== 4}
                            >
                                Entrevista virtual completada → Pasar a Pruebas Psicométricas
                            </button>
                        </div>

                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-success w-100"
                                onClick={() => completarEtapa(
                                    6,
                                    "En prueba técnica",
                                    "Evaluación completada",
                                    "El aspirante ha avanzado a Prueba Técnica (Etapa 6)."
                                )}
                                disabled={!aspiranteSeleccionado || finalizado || etapaActual !== 5}
                            >
                                Pruebas Psicométricas completadas → Pasar a Prueba Técnica
                            </button>
                        </div>

                        {/* INFORMACIÓN DEL ASPIRANTE */}
                        <div className="panel candidato-panel">
                            <div className="row align-items-center">
                                <div className="col-md-4 text-center">
                                    <div className="foto-candidato">
                                        Foto del aspirante
                                    </div>
                                </div>

                                <div className="col-md-8" style={{ textAlign: "left" }}>
                                    <h2>
                                        {aspiranteSeleccionado?.nombreCompleto ||
                                            aspiranteSeleccionado?.nombre ||
                                            "Candidato seleccionado"}
                                    </h2>

                                    <p className="curso-aspirante">
                                        <strong>Aspirante: </strong>
                                        {aspiranteSeleccionado?.curso ||
                                            aspiranteSeleccionado?.cursoFormacion ||
                                            "--"}
                                    </p>

                                    <p>
                                        <strong>Edad: </strong>
                                        {edad !== null ? `${edad} años` : "--"}
                                    </p>

                                    <p>
                                        <strong>Número de DUI: </strong>
                                        {aspiranteSeleccionado?.DUI || "--"}
                                    </p>

                                    <p>
                                        <strong>Teléfono: </strong>
                                        {aspiranteSeleccionado?.telefono1 ||
                                            aspiranteSeleccionado?.telefono ||
                                            "--"}
                                    </p>

                                    <p>
                                        <strong>E-mail: </strong>
                                        {aspiranteSeleccionado?.email || "--"}
                                    </p>

                                    <p>
                                        <strong>Domicilio: </strong>
                                        {aspiranteSeleccionado
                                            ? [
                                                aspiranteSeleccionado.departamento,
                                                aspiranteSeleccionado.municipio,
                                                aspiranteSeleccionado.distrito
                                            ].filter(Boolean).join(", ") || "--"
                                            : "--"}
                                    </p>

                                    <div className="estado-candidato">
                                        <strong>Estatus: </strong>
                                        <span className="estado-evaluacion">
                                            {aspiranteSeleccionado?.estado || "En evaluación"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ARCHIVOS ADJUNTOS */}
                        <div className="panel archivos-panel">
                            <h3 className="titulo-archivos">
                                Archivos adjuntos
                            </h3>

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="archivo">
                                        <div className="archivo-nombre">
                                            📄 CV del aspirante
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-primary w-100"
                                            onClick={() => mostrarArchivo("CV")}
                                            disabled={!aspiranteSeleccionado}
                                        >
                                            Ver CV
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="archivo">
                                        <div className="archivo-nombre">
                                            ▶ Video de presentación
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-primary w-100"
                                            onClick={() => mostrarArchivo("vídeo")}
                                            disabled={!aspiranteSeleccionado}
                                        >
                                            Reproducir vídeo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* COLUMNA DERECHA */}
                    <section className="col-lg-5">
                        <h2 className="titulo-seccion">
                            Panel de evaluación
                        </h2>

                        <div className="panel evaluacion-panel">
                            <div className="criterios-evaluacion">
                                <div className="criterio">
                                    <label>Habilidades técnicas y de expresión:</label>
                                    {mostrarEstrellas(habilidades, setHabilidades)}
                                </div>

                                <div className="criterio">
                                    <label>Calidad del vídeo:</label>
                                    {mostrarEstrellas(calidadVideo, setCalidadVideo)}
                                </div>

                                <div className="criterio">
                                    <label>Perfil académico y laboral:</label>
                                    {mostrarEstrellas(perfilAcademico, setPerfilAcademico)}
                                </div>

                                <div className="resultado-puntuacion">
                                    <strong>Puntuación promedio: </strong>
                                    <span>{promedio.toFixed(2)} / 5</span>
                                </div>
                            </div>

                            <div className="observaciones">
                                <label htmlFor="comentarios" className="form-label">
                                    Observaciones del evaluador
                                </label>

                                <textarea
                                    id="comentarios"
                                    className="form-control"
                                    rows="6"
                                    placeholder="Comentarios del evaluador..."
                                    value={comentarios}
                                    onChange={event => setComentarios(event.target.value)}
                                    disabled={!aspiranteSeleccionado}
                                />
                            </div>
                        </div>

                        {/* DECISIÓN DE EVALUACIÓN */}
                        <div className="acciones-evaluacion">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => registrarDecision("Rechazado")}
                                disabled={!aspiranteSeleccionado || finalizado}
                            >
                                Rechazar
                            </button>

                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => registrarDecision("Requiere ajustes")}
                                disabled={!aspiranteSeleccionado || finalizado}
                            >
                                Requiere ajustes
                            </button>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => registrarDecision("Aprobado")}
                                disabled={!aspiranteSeleccionado || finalizado}
                            >
                                Aprobar
                            </button>
                        </div>

                        {/* RESULTADO FINAL */}
                        <div className="mt-4">
                            <h3 className="titulo-seccion">
                                Resultado final - Etapa Técnica
                            </h3>

                            <button
                                type="button"
                                className="btn btn-success w-100 mb-2"
                                onClick={() => resultadoFinal("Seleccionado/a")}
                                disabled={!aspiranteSeleccionado || finalizado || etapaActual < 6}
                            >
                                Aprobar candidato
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger w-100"
                                onClick={() => resultadoFinal("No seleccionado/a")}
                                disabled={!aspiranteSeleccionado || finalizado || etapaActual < 6}
                            >
                                Denegar candidato
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default PerfilCandidato;