import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion, obtenerSesion } from '../servicios_js/autenticaciones';

function Aspirantes() {
    const [aspirantes, setAspirantes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [usuarioSesion, setUsuarioSesion] = useState(null);

    const navigate = useNavigate();

    // Cargar aspirantes y usuario de la sesión
    useEffect(() => {
        try {
            const usuariosGuardados = JSON.parse(
                localStorage.getItem('usuarios') || '[]'
            );

            const sesion = obtenerSesion();
            setUsuarioSesion(sesion);

            // Filtrar únicamente los aspirantes registrados
            const listaAspirantes = usuariosGuardados.filter(
                usuario => usuario.rol === 'usuario'
            );

            setAspirantes(listaAspirantes);
        } catch (error) {
            console.error('Error al cargar aspirantes:', error);
            setAspirantes([]);
        }
    }, []);

    // Cerrar sesión
    function handleCerrarSesion() {
        cerrarSesion();
        navigate('/Login');
    }

    // Filtrar por nombre o correo
    const aspirantesFiltrados = aspirantes.filter(aspirante => {
        const nombre = (
            aspirante.nombreCompleto ||
            aspirante.nombre ||
            ''
        ).toLowerCase();

        const correo = (
            aspirante.email ||
            aspirante.correo ||
            ''
        ).toLowerCase();

        const textoBusqueda = busqueda.toLowerCase();

        return (
            nombre.includes(textoBusqueda) ||
            correo.includes(textoBusqueda)
        );
    });

    // Obtener el nombre del curso
    function obtenerNombreCurso(aspirante) {
        return (
            aspirante.nombreCurso ||
            aspirante.curso ||
            aspirante.cursoSeleccionado ||
            aspirante.nombreConvocatoria ||
            'No asignado'
        );
    }

    // Obtener estado del aspirante
    function obtenerEstado(aspirante) {
        if (aspirante.estado) {
            return aspirante.estado;
        }

        if (aspirante.cvAdjuntado && aspirante.videoAdjuntado) {
            return 'En revisión';
        }

        return 'Pendiente';
    }

    // Estado de documentos
    function obtenerDocumentos(aspirante) {
        const cv = aspirante.cvAdjuntado ? 'CV ✓' : 'CV pendiente';
        const video = aspirante.videoAdjuntado ? 'Video ✓' : 'Video pendiente';

        return `${cv} | ${video}`;
    }

    return (
        <div className="portal">

            {/* MENÚ LATERAL */}
            <aside className="sidebar">

                <div>
                    <img
                        src="recursos/logo_AIDEL.png"
                        alt="Logo dashboard"
                        className="logo_convocatorias"
                    />
                </div>

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
                                placeholder="Buscar aspirante"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        {/* USUARIO */}
                        <span>
                            {usuarioSesion?.nombre || 'Usuario'}
                        </span>

                        <i className="bi bi-person-circle"></i>

                        <button
                            onClick={handleCerrarSesion}
                            className="btn btn-outline-danger btn-sm font-weight-bold"
                        >
                            Cerrar sesión
                        </button>

                    </div>

                </header>

                {/* CONTENIDO */}
                <main className="dashboard-container">

                    <section className="requests-card">

                        <div className="requests-header">
                            <h3>
                                Solicitudes
                            </h3>

                            <button
                                className="options-button"
                                type="button"
                                aria-label="Más opciones"
                            >
                                <i className="bi bi-three-dots"></i>
                            </button>
                        </div>

                        {/* EXPORTACIÓN */}
                        <div className="d-flex gap-2 flex-wrap mb-3">

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                disabled
                                title="Exportación pendiente de migrar a React"
                            >
                                <i className="bi bi-filetype-csv"></i>
                                Descargar CSV
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-success"
                                disabled
                                title="Exportación pendiente de migrar a React"
                            >
                                <i className="bi bi-file-earmark-excel"></i>
                                Descargar Excel
                            </button>

                        </div>

                        {/* TABLA */}
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

                            <tbody>

                                {aspirantesFiltrados.length > 0 ? (

                                    aspirantesFiltrados.map((aspirante, index) => (

                                        <tr key={aspirante.id || aspirante.email || index}>

                                            <td>
                                                {aspirante.nombreCompleto ||
                                                    aspirante.nombre ||
                                                    'Sin nombre'}

                                                <br />

                                                <small>
                                                    {aspirante.email ||
                                                        aspirante.correo ||
                                                        ''}
                                                </small>
                                            </td>

                                            <td>
                                                {obtenerNombreCurso(aspirante)}
                                            </td>

                                            <td>
                                                {obtenerEstado(aspirante)}
                                            </td>

                                            <td>
                                                {obtenerDocumentos(aspirante)}
                                            </td>

                                            <td>
                                                —
                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            {busqueda
                                                ? 'No se encontraron aspirantes con esa búsqueda.'
                                                : 'No hay aspirantes registrados.'}
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                        {/* TOTAL */}
                        <div className="mt-3">
                            <strong>
                                Total de aspirantes: {aspirantesFiltrados.length}
                            </strong>
                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default Aspirantes;