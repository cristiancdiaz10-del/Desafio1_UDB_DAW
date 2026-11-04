import {Link} from "react-router-dom";

function Aspirantes() {
  return (
    <>
 <div className="portal">

        {/*MENÚ LATERAL**/}
        <aside className="sidebar">

            {/** LOGO **/}
            <div>
                <img src="recursos/logo_AIDEL.png"
                    alt="logo dashboard"
                    className="logo_convocatorias"/>
            </div>
 
            {/* FAVORITOS */}
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
                    <Link to="/Aspirantes" className="active">
                        <i className="bi bi-people"></i>
                        Aspirantes
                    </Link>
                </li>

            </ul>

            {/* DASHBOARDS */}
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

            {/* MÓDULOS */}
            <ul className="sidebar-menu">

                <li>
                    <Link to="/Aspirantes" className="active">
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


        {/* CONTENIDO PRINCIPAL */}
        <div className="main-content">

            {/* BARRA SUPERIOR */}
            <header className="topbar">

                <h1 className="topbar-title">
                    Portal del evaluador
                </h1>

                <div className="topbar-user d-flex align-items-center gap-3 ms-auto">

                    {/* BUSCADOR */}
                    <div className="search-box">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            id="inputBuscarAspirante"
                            placeholder="Buscar aspirante"/>
                    </div>

                    {/* USUARIO */}
                    <span id="lbl-admin-topbar">
                        Cargando...
                    </span>

                    <i className="bi bi-person-circle"></i>

                    <button
                        onclick={cerrarSesion}
                        className="btn btn-outline-danger btn-sm font-weight-bold">
                        Cerrar sesión
                    </button>

                </div>

            </header>


            {/* CONTENIDO */}
            <main className="dashboard-container">

                {/* TABLA DE ASPIRANTES */}
                <section className="requests-card">

                    <div className="requests-header">

                        <h3>
                            Solicitudes
                        </h3>

                        <button
                            className="options-button"
                            type="button"
                            aria-label="Más opciones">

                            <i className="bi bi-three-dots"></i>

                        </button>

                    </div>

                {/*botones para exportar archivos*/}
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

                        <tbody id="tablaAspirantesBody">

                            {/*Los aspirantes se cargarán con JavaScript**/}

                        </tbody>

                    </table>

                </section>

            </main>

        </div>

    </div>
    </>
  )
}

export default Aspirantes