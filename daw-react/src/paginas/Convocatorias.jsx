import {Link} from "react-router-dom";

function Convocatorias() {
  return (
    <>
     {/* CONTENEDOR PRINCIPAL DEL PORTAL **/}
    <div className="portal">

        {/* MENÚ LATERAL **/}
        <aside className="sidebar">

            {/* LOGO **/}
            <div>
                <img src="recursos/logo_AIDEL.png" alt="logo_convocatorias" className="logo_convocatorias"/>
            </div>

            {/* FAVORITOS **/}
            <div className="sidebar-title">
                Favoritos
            </div>

            <ul className="sidebar-menu">
                <li>
                    <Link to="/PanelControl">
                        <i className="bi bi-house"></i>
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link to="/Aspirantes">
                        <i className="bi bi-people"></i>
                        Aspirantes
                    </Link>
                </li>
            </ul>

            {/* DASHBOARDS **/}
            <div className="sidebar-title">
                Dashboards
            </div>

            <ul className="sidebar-menu">
                <li>
                    <Link to="/PanelControl">
                        <i className="bi bi-pie-chart-fill"></i>
                        Métricas y reportes
                    </Link>
                </li>
            </ul>

            {/* MÓDULOS **/}
            <ul className="sidebar-menu">
                <li>
                    <Link to="/Aspirantes">
                        <i className="bi bi-folder"></i>
                        Aspirantes
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                </li>
                <li>
                    {/* Enlace activo **/}
                    <Link to="/Convocatorias" className="active">
                        <i className="bi bi-folder"></i>
                        Convocatorias y Cursos
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                </li>
            </ul>

        </aside>

        {/* CONTENIDO PRINCIPAL **/}
        <div className="main-content">

            {/* BARRA SUPERIOR **/}
            <header className="topbar">
                <h1 className="topbar-title">
                    Portal del Evaluador
                </h1>

                <div className="topbar-user d-flex align-items-center gap-3 ms-auto">
                {/* BUSCADOR **/}
                <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input type="text" id="inputBuscarAspirante" placeholder="Buscar aspirante"/>
                </div>

                {/* USUARIO **/}
                    <span id="lbl-admin-topbar">Cargando...</span>
                    <i className="bi bi-person-circle"></i>
                    <button onclick="cerrarSesion()" className="btn btn-outline-danger btn-sm font-weight-bold">
                        Cerrar sesión
                    </button>
                </div>
            </header>

            {/* SECCIÓN PRINCIPAL DE GESTIÓN **/}
            <main className="dashboard-container">

                {/* 1. SECCIÓN DE CONVOCATORIAS **/}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="dashboard-title mb-0">
                        Gestión de Convocatorias
                    </h2>
                    <button className="btn btn-primary" onclick="prepararCreacionConvocatoria()">
                        + Nueva Convocatoria
                    </button>
                </div>

                {/* Tarjeta contenedora de la tabla de convocatorias **/}
                <div className="card card-custom p-3 mb-5">
                    <div className="table-responsive">
                        {/*botones para exportar archivos**/}
                <div className="d-flex gap-2 flex-wrap">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onclick="exportarConvocatoriasCSV()">
                        <i className="bi bi-filetype-csv"></i>
                        Descargar CSV
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-success"
                        onclick="exportarConvocatoriasExcel()">
                        <i className="bi bi-file-earmark-excel"></i>
                        Descargar Excel
                    </button>
                </div>
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Curso</th>
                                    <th>Fechas (Inicio / Cierre)</th>
                                    <th>Plazas</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaConvocatorias">
                                {/* Los datos se inyectarán dinámicamente con JavaScript **/}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. SECCIÓN DE GESTIÓN DE CURSOS **/}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="dashboard-title mb-0">
                        Gestión de Cursos
                    </h2>
                    <button className="btn btn-primary" onclick="prepararCreacionCurso()">
                        + Nuevo Curso
                    </button>
                </div>

                {/* Contenedor en grilla de Tarjetas de Cursos **/}
                <div className="row g-4 mb-5" id="contenedorCursos">
                    {/* Las tarjetas de cursos se inyectarán dinámicamente con JavaScript **/}
                </div>

            </main>

        </div>

    </div>

    {/* MODAL PARA CREAR / EDITAR CONVOCATORIA **/}
    <div className="modal fade" id="modalConvocatoria" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content card-custom p-3">
                <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold" id="modalTituloConvocatoria">Nueva Convocatoria</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form id="formConvocatoria">
                        <input type="hidden" id="convocatoriaId"/>
                       
                        <div className="mb-3">
                            <label for="cursoSelect" className="form-label fw-semibold small">Cursos Disponibles</label>
                            <select className="form-select" id="cursoSelect" required>
                                <option value="" selected disabled>Seleccione un curso...</option>
                                <option value="Análisis de datos con herramientas de IA">Análisis de datos con herramientas de IA</option>
                                <option value="Logística portuaria y cadena de suministros">Logística portuaria y cadena de suministros</option>
                                <option value="Lenguajes de programación: JavaScript y C#">Lenguajes de programación: JavaScript y C#</option>
                                <option value="Asistente Administrativo y Manejo de Caja">Asistente Administrativo y Manejo de Caja</option>
                                <option value="Redes informáticas">Redes informáticas</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label for="fechaInicio" className="form-label fw-semibold small">Fecha de Inicio</label>
                            <input type="date" className="form-control" id="fechaInicio" required/>
                        </div>

                        <div className="mb-3">
                            <label for="fechaCierre" className="form-label fw-semibold small">Fecha de Cierre</label>
                            <input type="date" className="form-control" id="fechaCierre" required/>
                        </div>

                        <div className="mb-3">
                            <label for="numPlazas" className="form-label fw-semibold small">Número de Plazas</label>
                            <input type="number" className="form-control" id="numPlazas" min="1" required/>
                        </div>

                        <div className="mb-3">
                            <label for="estadoSelect" className="form-label fw-semibold small">Estado de Convocatoria</label>
                            <select className="form-select" id="estadoSelect" required>
                                <option value="Activa">Activa</option>
                                <option value="Cerrada">Cerrada</option>
                                <option value="Próximamente">Próximamente</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-2">Guardar Convocatoria</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    {/* MODAL COMPACTO PARA CREAR / EDITAR CURSO **/}
    <div className="modal fade" id="modalCurso" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-sm">
            <div className="modal-content card-custom p-3">
                <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold fs-6" id="modalCursoTitulo">Nuevo Curso</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body pt-2">
                    <form id="formCurso">
                        <input type="hidden" id="cursoId"/>
                       
                        <div className="mb-2">
                            <label for="nombreCurso" className="form-label fw-semibold small">Nombre del Curso</label>
                            <input type="text" className="form-control form-control-sm" id="nombreCurso" placeholder="Ej. Redes informáticas" required/>
                        </div>

                        <div className="mb-3">
                            <label for="descCurso" className="form-label fw-semibold small">Breve Descripción</label>
                            <textarea className="form-control form-control-sm" id="descCurso" rows="3" placeholder="Detalles administrativos..." required></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary btn-sm w-100">Guardar Curso</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    </>
  )
}

export default Convocatorias