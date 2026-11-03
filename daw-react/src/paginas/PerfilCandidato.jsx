import{useNavigate} from "react-router-dom";

function PerfilCandidato() {
  const navigate = useNavigate();

  return (
   <>
   <header className="encabezado">
    <div className="container-fluid">
        <div className="row align-items-center">

            <div className="col-8 d-flex align-items-center">
                <div>
                    <img src="recursos/logo_AIDEL.png" alt="logo_evaluaciones" className="logo_evaluaciones"/>
                    <button className="btn btn-primary" onClick={() => navigate('/PanelControl')}>
                        Volver a inicio
                    </button>
                </div>

                <h1 className="titulo-principal">
                    ProTalento - Perfil de candidato
                </h1>
            </div>
            <div className="col-4 d-flex align-items-center justify-content-end gap-3">
                <span id="lbl-admin-topbar">Cargando...</span>
                <i className="bi bi-person-circle fs-5"></i>
                <button onclick="cerrarSesion()" className="btn btn-outline-danger btn-sm font-weight-bold">
                    Cerrar sesión
                </button>
            </div>
        </div>
    </div>
</header>


{/* CONTENIDO PRINCIPAL **/}
<main className="container-fluid contenido-principal">

    <div className="row g-4">

        {/* COLUMNA IZQUIERDA **/}
        <section className="col-lg-7">

            <h2 className="titulo-seccion">
                Información general del candidato
            </h2>
            
            <div className="mb-3">
                 <label for="seleccionarAspirante" className="form-label">
                    Seleccionar aspirante
            </label>

            <select id="seleccionarAspirante" className="form-select">
                <option value="">Seleccione un aspirante</option>
            </select>
            </div>

            <div className="mb-3">
             <label for="fechaEvaluacion" className="form-label">
            Fecha de evaluación
             </label>
            <input type="date"
            id="fechaEvaluacion"
             className="form-control"/>
            </div>

            <div className="mb-3">
                <button type="button"
                        id="btnProgramar"
                        className="btn btn-primary w-100">
                    Programar evaluación
                </button>
            </div>

            {/* NUEVO: AVANCE DEL PROCESO DE EVALUACIÓN **/}
            <div className="mb-3">
                <button type="button"
                        id="btnCompletarValidacion"
                        className="btn btn-success w-100">
                    Validación completada → Pasar Entrevista Virtual
                </button>
            </div>
            
            <div className="mb-3">
                <button type="button"
                        id="btnCompletarEntrevista"
                        className="btn btn-success w-100">
                    Entrevista virtual completada → Pasar a Pruebas Psicométricas
                </button>
            </div>

            <div className="mb-3">
                <button type="button"
                        id="btnCompletarPsicometrica"
                        className="btn btn-success w-100">
                    Pruebas Psicométricas completadas → Pasar a Prueba Técnica
                </button>
            </div>

            {/* INFORMACIÓN DEL ASPIRANTE **/}
            <div className="panel candidato-panel">

                <div className="row align-items-center">

                    {/* Fotografía **/}
                    <div className="col-md-4 text-center">
                        <div className="foto-candidato">
                            Foto del aspirante
                        </div>
                    </div>

                    {/* Datos **/}
                    <div className="col-md-8" style="text-align: left;">

                        <h2>
                            <span id="nombreCandidato">
                                Candidato seleccionado
                            </span>
                        </h2>

                        <p className="curso-aspirante">
                            <strong>Aspirante</strong>
                            <span id="cursoCandidato">--</span>
                        </p>

                        <p>
                            <strong>Edad:</strong>
                            <span id="edadCandidato">--</span>
                        </p>

                        <p>
                            <strong>Número de DUI:</strong>
                            <span id="duiCandidato">--</span>
                        </p>

                        <p>
                            <strong>Teléfono:</strong>
                            <span id="telefonoCandidato">--</span>
                        </p>

                        <p>
                            <strong>E-mail:</strong>
                            <span id="correoCandidato">--</span>
                        </p>

                        <p>
                            <strong>Domicilio:</strong>
                            <span id="domicilioCandidato">--</span>
                        </p>

                        <div className="estado-candidato">
                            <strong>Estatus:</strong>

                            <span id="estadoCandidato"
                                  className="estado-evaluacion">
                                En evaluación
                            </span>
                        </div>

                    </div>

                </div>

            </div>


            {/* ARCHIVOS ADJUNTOS **/}
            <div className="panel archivos-panel">

                <h3 className="titulo-archivos">
                    Archivos adjuntos
                </h3>

                <div className="row g-4">

                    {/* CV **/}
                    <div className="col-md-6">

                        <div className="archivo">

                            <div className="archivo-nombre">
                                📄 CV del aspirante
                            </div>

                            <button type="button"
                                    id="btnCV"
                                    className="btn btn-primary w-100">
                                Ver CV
                            </button>

                        </div>

                    </div>


                    {/* VIDEO **/}
                    <div className="col-md-6">

                        <div className="archivo">

                            <div className="archivo-nombre">
                                ▶ Video de presentación
                            </div>

                            <button type="button"
                                    id="btnVideo"
                                    className="btn btn-primary w-100">
                                Reproducir vídeo
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </section>


        {/* COLUMNA DERECHA **/}
        <section className="col-lg-5">

            <h2 className="titulo-seccion">
                Panel de evaluación
            </h2>

            <div className="panel evaluacion-panel">

                {/* CRITERIOS **/}
                <div className="criterios-evaluacion">

<div className="criterio">
    <label for="habilidades">
        Habilidades técnicas y de expresión:
    </label>

    <div className="estrellas" data-criterio="habilidades">
        <span className="estrella" data-valor="1">★</span>
        <span className="estrella" data-valor="2">★</span>
        <span className="estrella" data-valor="3">★</span>
        <span className="estrella" data-valor="4">★</span>
        <span className="estrella" data-valor="5">★</span>
    </div>

    <input type="hidden" id="habilidades" value="0"/>
</div>


<div className="criterio">
    <label for="calidadVideo">
        Calidad del vídeo:
    </label>

    <div className="estrellas" data-criterio="calidadVideo">
        <span className="estrella" data-valor="1">★</span>
        <span className="estrella" data-valor="2">★</span>
        <span className="estrella" data-valor="3">★</span>
        <span className="estrella" data-valor="4">★</span>
        <span className="estrella" data-valor="5">★</span>
    </div>

    <input type="hidden" id="calidadVideo" value="0"/>
</div>

   <div className="criterio">
    <label for="perfilAcademico">
        Perfil académico y laboral:
    </label>

<div className="estrellas" data-criterio="perfilAcademico">
    <span className="estrella" data-valor="1">★</span>
    <span className="estrella" data-valor="2">★</span>
    <span className="estrella" data-valor="3">★</span>
    <span className="estrella" data-valor="4">★</span>
    <span className="estrella" data-valor="5">★</span>
</div>

<input type="hidden" id="perfilAcademico" value="0"/>

</div>

<div className="resultado-puntuacion">
    <strong>Puntuación promedio:</strong>
    <span id="promedioEvaluacion">0.00 / 5</span>
</div>

</div>
                    {/* OBSERVACIONES **/}
                    <div className="observaciones">

                    <label for="comentarios"
                           className="form-label">
                        Observaciones del evaluador
                    </label>

                    <textarea id="comentarios"
                              className="form-control"
                              rows="6"
                              placeholder="Comentarios del evaluador..."></textarea>

                </div>

            </div>


            {/* BOTONES DE RESULTADO **/}
            <div className="acciones-evaluacion">

                <button type="button"
                        id="btnRechazar"
                        className="btn btn-danger">
                    Rechazar
                </button>

                <button type="button"
                        id="btnAjustes"
                        className="btn btn-warning">
                    Requiere ajustes
                </button>

                <button type="button"
                        id="btnAprobar"
                        className="btn btn-success">
                    Aprobar
                </button>

            </div>

            {/* NUEVO: RESULTADO FINAL DE LA ETAPA TÉCNICA **/}
            <div className="mt-4">

                <h3 className="titulo-seccion">
                    Resultado final - Etapa Técnica
                </h3>

                <button type="button"
                        id="btnAprobarFinal"
                        className="btn btn-success w-100 mb-2">
                    Aprobar candidato
                </button>

                <button type="button"
                        id="btnDenegarFinal"
                        className="btn btn-danger w-100">
                    Denegar candidato
                </button>

            </div>

        </section>

    </div>

</main>
   
   </>
  );
}

export default PerfilCandidato