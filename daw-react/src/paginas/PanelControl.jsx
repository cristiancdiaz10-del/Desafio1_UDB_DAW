import {Link} from "react-router-dom";

function PanelControl() {
  return (
    <>
    {/* CONTENEDOR PRINCIPAL DEL PORTAL **/}
<div className="portal">

    {/* MENÚ LATERAL **/}
    <aside className="sidebar">

        {/* LOGO **/}
        <div>
            <img src="recursos/logo_AIDEL.png" alt="logo dashboard" className="logo_convocatorias"/>
        </div>
        
        {/* FAVORITOS **/}
        <div className="sidebar-title">
            Favoritos
        </div>

        <ul className="sidebar-menu">
            <li>
                <Link to="/PanelControl" className="active">
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
                <Link to="/PanelControl" className="active">
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
                <Link to="/Convocatorias">
                    <i className="bi bi-folder"></i>
                    Convocatorias y Cursos
                    <i className="bi bi-chevron-right ms-auto"></i>
                </Link>
            </li>
        </ul>

    </aside>

    {/* CONTENEDOR PRINCIPAL **/}
    <div className="main-content">

        {/* BARRA SUPERIOR **/}
        <header className="topbar">
            <h1 className="topbar-title">
                Portal del evaluador
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

        {/* DASHBOARD **/}
        <main className="dashboard-container">

            <h2 className="dashboard-title">
                Métricas (KPIs)
            </h2>

            {/* TARJETAS KPI **/}
            <section className="kpi-grid">

                {/* TOTAL POSTULADOS **/}
                <article className="kpi-card">
                    <h3>Total Postulados</h3>
                    <p className="kpi-number" id="kpi-total">0</p>
                </article>

                {/* EN REVISIÓN **/}
                <article className="kpi-card">
                    <h3>En Revisión</h3>
                    <p className="kpi-number" id="kpi-revision">0</p>
                </article>

                {/* ENTREVISTADOS **/}
                <article className="kpi-card">
                    <h3>Entrevistados</h3>
                    <p className="kpi-number" id="kpi-entrevistados">0</p>
                </article>

                {/* SELECCIONADOS **/}
                <article className="kpi-card">
                    <h3>Seleccionados</h3>
                    <p className="kpi-number" id="kpi-seleccionados">0</p>
                </article>

                {/* RECHAZADOS **/}
                <article className="kpi-card">
                    <h3>No seleccionados</h3>
                    <p className="kpi-number" id="kpi-rechazados">0</p>
                </article>

            </section>

            {/* GRÁFICAS **/}
            <section className="charts-grid">

                {/* GRÁFICA DE FLUJO **/}
                <article className="chart-card">
                    <h3>Flujo de solicitudes</h3>
                    <div className="chart-container">
                        <canvas id="flujoSolicitudes"></canvas>
                    </div>
                </article>

                {/* GRÁFICA DE ESTADOS **/}
                <article className="chart-card">
                    <h3>Estados</h3>
                    <div className="chart-container">
                        <canvas id="estadosAspirantes"></canvas>
                    </div>
                </article>

            </section>

            {/* SOLICITUDES **/}
            <section className="requests-card">

              {/* CABECERA DE SOLICITUDES CON FILTRO **/}
              <div className="requests-header d-flex flex-wrap align-items-center gap-3">
                <h3 className="mb-0">Solicitudes</h3>

                    {/* Selector de Curso Técnico para el filtro **/}
                 <div className="ms-auto d-flex align-items-center gap-2">
                      <label for="filtroCurso" className="form-label mb-0 small text-muted fw-semibold">Curso:</label>
                      <select id="filtroCurso" className="form-select form-select-sm" style="width: 180px;">
                      <option value="todos">Todos los cursos</option>
                </select>
         </div>

         <button className="options-button" type="button" aria-label="Más opciones">
            <i className="bi bi-three-dots"></i>
         </button>
     </div>
                 {/*botones para exportar archivos**/}
                <div className="d-flex gap-2 flex-wrap">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onclick="exportarCSVParticipantes()">
                        <i className="bi bi-filetype-csv"></i>
                        Descargar CSV
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-success"
                        onclick="exportarExcelParticipantes()">
                        <i className="bi bi-file-earmark-excel"></i>
                        Descargar Excel
                    </button>
                </div>

                {/* TABLA **/}
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Curso</th>
                            <th>Estado</th>
                            <th>Documentos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tablaSolicitudesBody">
                        {/* Filas dinámicas cargadas desde el JS **/}
                    </tbody>
                </table>
            </section>

        </main>

    </div>

</div>
    
    
    </>
  )
}

export default PanelControl