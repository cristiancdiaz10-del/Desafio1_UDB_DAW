function PortalAspirante() {
  return (
    <>
    {/* NAVBAR / ENCABEZADO **/}
<header className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4 py-3">
    <div className="container-fluid">
        <div className="d-flex align-items-center gap-2">
            <div>
                <img src="recursos/logo_AIDEL.png" alt="logo-portalAspirante" className="logo_portalAspirante"/>
            </div>
            <span className="fs-4 fw-bold text-dark mb-0">ProTalento</span>
        </div>

        {/* Usuario autenticado + Botón Salir **/}
        <div className="d-flex align-items-center gap-3">
            <span id="lbl-usuario" className="fw-semibold text-secondary small">Bienvenido, Cargando...</span>
            <div className="topbar-user">
                <span id="lbl-admin-topbar"></span>
                <i className="bi bi-person-circle"></i>
            </div>
            <button onclick="cerrarSesion()" className="btn btn-outline-danger btn-sm font-weight-bold">
                Cerrar sesión
            </button>
        </div>
    </div>
</header>

{/* CONTENIDO PRINCIPAL **/}
<main className="container my-5 flex-grow-1">
    
    {/* Mensaje de Motivación **/}
    <div className="text-center mb-5">
        <p className="text-muted fs-5 max-w-75 mx-auto">
            ¡No te detengas ahora! Estás cada vez más cerca de tu meta. Completa tu proceso de selección y demuestra tu potencial.
        </p>
    </div>

    {/* LÍNEA DE TIEMPO / BARRA DE PROGRESO **/}
    <div className="mb-5 overflow-auto pb-3">
        <div className="d-flex justify-content-between align-items-center position-relative min-w-750px px-3">
            
            {/* Línea de fondo **/}
            <div className="position-absolute w-100 bg-secondary-subtle" style="height: 4px; top: 18px; z-index: 0; left: 0;"></div>
            
            <div id="linea-progreso"
                className="position-absolute bg-primary"
                style="height: 4px; top: 18px; z-index: 0; left: 0; width: 0%;">
            </div>
            {/* Paso 1: Registro (Completado) **/}
            <div className="text-center z-1">
                <div className="step-badge bg-primary text-white mx-auto shadow-sm">✓</div>
                <span className="badge bg-primary mt-2 rounded-pill px-3 py-1">Registro</span>
            </div>

            {/* Paso 2: CV y Vídeo (Activo) **/}
            <div className="text-center z-1">
                <div className="step-badge bg-white border border-primary text-primary mx-auto shadow-sm">2</div>
                <span className="badge bg-primary mt-2 rounded-pill px-3 py-1">Envío de CV y Vídeo</span>
            </div>

            {/* Paso 3: Validación **/}
            <div className="text-center z-1">
                <div className="step-badge bg-secondary-subtle text-secondary mx-auto">3</div>
                <span className="badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1">Validación</span>
            </div>

            {/* Paso 4: Entrevista **/}
            <div className="text-center z-1">
                <div className="step-badge bg-secondary-subtle text-secondary mx-auto">4</div>
                <span className="badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1">Entrevista virtual</span>
            </div>

            {/* Paso 5: Psicométricas **/}
            <div className="text-center z-1">
                <div className="step-badge bg-secondary-subtle text-secondary mx-auto">5</div>
                <span className="badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1">Pruebas Psicométricas</span>
            </div>

            {/* Paso 6: Técnica **/}
            <div className="text-center z-1">
                <div className="step-badge bg-secondary-subtle text-secondary mx-auto">6</div>
                <span className="badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1">Prueba Técnica</span>
            </div>

        </div>
    </div>

    {/* Alerta dinámica **/}
    <div id="alerta-portal" className="alert alert-success d-none text-center rounded-3 mb-4"></div>

    {/* CARDS DE CARGA **/}
    <div className="row g-4">
        
        {/* CARD 1: Adjuntar CV (PDF) **/}
        <div className="col-md-6">
            <div className="card bg-custom-card border-info-subtle rounded-4 h-100 p-4 d-flex flex-column justify-content-between shadow-sm">
                <div>
                    <h2 className="h5 fw-bold text-dark mb-1">Adjuntar Currículum Vitae (PDF)</h2>
                    <p className="text-muted small">
                        Por favor adjunta tu currículum en formato PDF. Asegúrate de que el archivo no supere los 5 MB.
                    </p>

                    {/* Zone Drop File **/}
                    <div className="border border-2 border-dashed border-info rounded-4 p-4 text-center bg-white bg-opacity-50 mt-4">
                        <div className="fs-1 text-primary mb-2">☁️</div>
                        <p className="fw-bold text-dark small mb-0">Arrastra tu archivo aquí o explora</p>
                        <p className="text-muted text-xs mb-3">Formato: .pdf & Tamaño máx.: 5 MB</p>
                        
                        <label className="btn btn-naranja btn-sm px-4 rounded-3 shadow-sm cursor-pointer">
                            Buscar Archivo
                            <input type="file" id="inputCV" accept=".pdf" className="d-none" onchange="mostrarArchivoCV(this)"/>
                        </label>
                    </div>
                </div>

                <div className="row g-2 mt-4">
                    <div className="col-6">
                        <button type="button" className="btn btn-light border w-100 rounded-3 text-secondary fw-bold btn-sm">
                            Cancelar
                        </button>
                    </div>
                    <div className="col-6">
                        <button type="button" onclick="guardarEntregaEtapa2(event, 'cv')" className="btn btn-primary w-100 rounded-3 fw-bold btn-sm shadow-sm">
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* CARD 2: Vídeo de Presentación **/}
        <div className="col-md-6">
            <div className="card bg-custom-card border-info-subtle rounded-4 h-100 p-4 d-flex flex-column justify-content-between shadow-sm">
                <div>
                    <h2 className="h5 fw-bold text-dark mb-1">Vídeo de Presentación</h2>
                    <p className="text-muted small">
                        Explica brevemente por qué deseas participar en el curso de formación técnica de AIDEL.
                    </p>

                    {/* Zone Drop File Video **/}
                    <div className="border border-2 border-dashed border-info rounded-4 p-4 text-center bg-white bg-opacity-50 mt-4">
                        <div className="fs-1 text-primary mb-2">☁️</div>
                        <p className="fw-bold text-dark small mb-0">Arrastra tu archivo de vídeo aquí o explora</p>
                        <p className="text-muted text-xs mb-3">Formatos: .mp4, .mov & Tamaño máx.: 50 MB</p>
                        
                        <label className="btn btn-naranja btn-sm px-4 rounded-3 shadow-sm cursor-pointer">
                            Buscar Vídeo
                            <input type="file" id="inputVideo" accept="video/*" className="d-none" onchange="mostrarArchivoVideo(this)"/>
                        </label>
                    </div>
                </div>

                <div className="row g-2 mt-4">
                    <div className="col-6">
                        <button type="button" className="btn btn-light border w-100 rounded-3 text-secondary fw-bold btn-sm">
                            Cancelar
                        </button>
                    </div>
                    <div className="col-6">
                        <button type="button" onclick="guardarEntregaEtapa2(event, 'video')" className="btn btn-primary w-100 rounded-3 fw-bold btn-sm shadow-sm">
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>

</main>
    
    </>
  )
}

export default PortalAspirante