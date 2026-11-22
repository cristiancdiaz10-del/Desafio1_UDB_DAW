 // ==========================================
 // PANEL DE CONTROL - PROTALENTO
 // ==========================================

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Componentes reutilizables
import Indicadores from "../componentes/panel/Indicadores";
import FiltrosAspirantes from "../componentes/panel/FiltrosAspirantes";
import TablaAspirantes from "../componentes/panel/TablaAspirantes";
import Graficas from "../componentes/panel/Graficas";

// Servicios
import {
  obtenerAspirantes,
  obtenerSesion,
  filtrarAspirantes,
  exportarAspirantesCSV,
  exportarAspirantesExcel,
  guardarAspiranteParaEvaluar
} from "../servicios_js/panel-control.js";

import { descargarPerfilPDF } from "../servicios_js/descargas-aspirantes";


// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function PanelControl() {
  const navigate = useNavigate();

  // ==========================================
  // 1. ESTADOS
  // ==========================================

  const [aspirantes, setAspirantes] = useState(
    () => obtenerAspirantes()
  );

  const [busqueda, setBusqueda] = useState("");

  // Control del menú lateral en pantallas pequeñas
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [filtroCurso, setFiltroCurso] = useState("todos");

  const [filtroEstado, setFiltroEstado] = useState("todos");

  const [nombreUsuario, setNombreUsuario] = useState(
    "Administrador"
  );

  // ==========================================
  // 2. CARGA INICIAL Y ACTUALIZACIÓN
  // ==========================================

  useEffect(() => {
    const sesion = obtenerSesion();

    if (sesion?.nombre) {
      setNombreUsuario(sesion.nombre);
    }

    const actualizarDatos = () => {
      setAspirantes(obtenerAspirantes());
    };

    // Escuchar cambios de localStorage
    // realizados desde otras pestañas.
    window.addEventListener("storage", actualizarDatos);

    return () => {
      window.removeEventListener("storage", actualizarDatos);
    };
  }, []);

  // ==========================================
  // 3. FILTRADO DE ASPIRANTES
  // ==========================================

  const aspirantesFiltrados = useMemo(() => {
    return filtrarAspirantes(
      aspirantes,
      busqueda,
      filtroCurso,
      filtroEstado
    );
  }, [
    aspirantes,
    busqueda,
    filtroCurso,
    filtroEstado
  ]);

  // Las gráficas responden a la búsqueda y al curso seleccionado.
  // El estado se excluye para conservar todos los segmentos
  // de la gráfica circular y permitir cambiar de estado.
  const aspirantesParaGraficas = useMemo(() => {
    return filtrarAspirantes(
      aspirantes,
      busqueda,
      filtroCurso,
      "todos"
    );
  }, [aspirantes, busqueda, filtroCurso]);

  // ==========================================
  // 4. FILTRO DESDE LAS GRÁFICAS
  // ==========================================

  const cambiarFiltroGrafica = (estado) => {
    setFiltroEstado((actual) =>
      actual === estado ? "todos" : estado
    );
  };

  // ==========================================
  // 5. EVALUAR ASPIRANTE
  // ==========================================

  const evaluarAspirante = (aspirante) => {
    const guardado = guardarAspiranteParaEvaluar(
      aspirante
    );

    if (!guardado) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible preparar la información del aspirante."
      });

      return;
    }

    navigate("/PerfilCandidato");
  };

  // ==========================================
  // 6. DESCARGAR PERFIL EN PDF
  // ==========================================

  const descargarPDF = (aspirante) => {
    descargarPerfilPDF(aspirante);
  };

  // ==========================================
  // 7. EXPORTAR CSV
  // ==========================================

  const manejarExportacionCSV = () => {
    const exportado = exportarAspirantesCSV(
      aspirantesFiltrados
    );

    if (!exportado) {
      Swal.fire({
        icon: "info",
        title: "Sin datos",
        text: "No hay aspirantes para exportar."
      });
    }
  };

  // ==========================================
  // 8. EXPORTAR EXCEL
  // ==========================================

  const manejarExportacionExcel = () => {
    const exportado = exportarAspirantesExcel(
      aspirantesFiltrados
    );

    if (!exportado) {
      Swal.fire({
        icon: "info",
        title: "Sin datos",
        text: "No hay aspirantes para exportar."
      });
    }
  };

  // ==========================================
  // 9. LIMPIAR FILTROS
  // ==========================================

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroCurso("todos");
    setFiltroEstado("todos");
  };

  // ==========================================
  // 10. ACTUALIZAR DATOS
  // ==========================================

  const actualizarDatos = () => {
    setAspirantes(obtenerAspirantes());

    Swal.fire({
      icon: "success",
      title: "Datos actualizados",
      text: "La información del panel se ha actualizado.",
      timer: 1500,
      showConfirmButton: false
    });
  };

  // ==========================================
  // 11. CERRAR SESIÓN
  // ==========================================

  const cerrarSesion = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Deseas salir del sistema?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        localStorage.removeItem("sesion");
        navigate("/Login");
      }
    });
  };

  // ==========================================
  // 12. INTERFAZ VISUAL
  // ==========================================

  return (
    <div className="portal">

      {/* ======================================
          MENÚ LATERAL
      ====================================== */}

      {menuAbierto && (
        <button
          type="button"
          className="panel-menu-overlay"
          aria-label="Cerrar menú lateral"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <aside
        className={`sidebar ${menuAbierto ? "sidebar-abierta" : ""}`}
        id="panel-menu-lateral"
      >

        <button
          type="button"
          className="panel-menu-cerrar"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
        >
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>

        <div>
          <img
            src="./recursos/logo_AIDEL.png"
            alt="Logo del portal"
            className="logo_convocatorias"
          />
        </div>

        <div className="sidebar-title">
          Favoritos
        </div>

        <ul className="sidebar-menu">

          <li>
            <Link
              to="/PanelControl"
              className="active"
            >
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

        <div className="sidebar-title">
          Dashboards
        </div>

        <ul className="sidebar-menu">

          <li>
            <Link
              to="/PanelControl"
              className="active"
            >
              <i className="bi bi-pie-chart-fill"></i>
              Métricas y reportes
            </Link>
          </li>

        </ul>

        <ul className="sidebar-menu">

          <li>
            <Link to="/Aspirantes">
              <i className="bi bi-folder"></i>
              Aspirantes
            </Link>
          </li>

          <li>
            <Link to="/Convocatorias">
              <i className="bi bi-folder"></i>
              Convocatorias y Cursos
            </Link>
          </li>

        </ul>

      </aside>

      {/* ======================================
          CONTENIDO PRINCIPAL
      ====================================== */}

      <div className="main-content">

        {/* BARRA SUPERIOR */}

        <header className="topbar">

          <h1 className="topbar-title">
            Portal del evaluador
          </h1>

          <button
            type="button"
            className="btn-menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-controls="panel-menu-lateral"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <i
              className={`bi ${menuAbierto ? "bi-x-lg" : "bi-list"}`}
              aria-hidden="true"
            ></i>
          </button>

          <div className="topbar-user d-flex align-items-center gap-3 ms-auto">

            <div className="search-box">

              <i className="bi bi-search"></i>

              <input
                type="text"
                id="inputBuscarAspirante"
                placeholder="Buscar por nombre o correo"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

            </div>

            <span id="lbl-admin-topbar">
              {nombreUsuario}
            </span>

            <i className="bi bi-person-circle"></i>

            <button
              type="button"
              onClick={cerrarSesion}
              className="btn btn-outline-danger btn-sm fw-bold"
            >
              Cerrar sesión
            </button>

          </div>

        </header>

        {/* DASHBOARD */}

        <main className="dashboard-container">

          <h2 className="dashboard-title">
            Métricas (KPIs)
          </h2>

          {/* INDICADORES */}

          <Indicadores
            aspirantes={aspirantes}
          />

          {/* GRÁFICAS */}

          <Graficas
            aspirantes={aspirantesParaGraficas}
            onFiltrarEstado={cambiarFiltroGrafica}
          />

          {/* ==================================
              TABLA DE SOLICITUDES
          ================================== */}

          <section className="requests-card">

            <div className="requests-header d-flex flex-wrap align-items-center gap-3">

              <h3 className="mb-0">
                Solicitudes
              </h3>

              <span className="text-muted small">
                Mostrando {aspirantesFiltrados.length} de {aspirantes.length}
              </span>

              <div className="ms-auto">

                <FiltrosAspirantes
                  aspirantes={aspirantes}
                  filtroCurso={filtroCurso}
                  setFiltroCurso={(curso) => {
                    setFiltroCurso(curso);
                    setFiltroEstado("todos");
                  }}
                  filtroEstado={filtroEstado}
                  setFiltroEstado={setFiltroEstado}
                />

              </div>

            </div>

            {/* BOTONES DE ACCIÓN */}

            <div className="d-flex gap-2 flex-wrap my-3">

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={manejarExportacionCSV}
              >
                <i className="bi bi-filetype-csv"></i>
                Descargar CSV
              </button>

              <button
                type="button"
                className="btn btn-outline-success"
                onClick={manejarExportacionExcel}
              >
                <i className="bi bi-file-earmark-excel"></i>
                Descargar Excel
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={actualizarDatos}
              >
                <i className="bi bi-arrow-clockwise"></i>
                Actualizar datos
              </button>

            </div>

            {/* TABLA */}

            <TablaAspirantes
              aspirantes={aspirantesFiltrados}
              onEvaluar={evaluarAspirante}
              onDescargarPDF={descargarPDF}
            />

          </section>

        </main>

      </div>

    </div>
  );
}

export default PanelControl;
