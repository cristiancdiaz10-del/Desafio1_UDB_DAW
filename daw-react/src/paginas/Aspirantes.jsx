// ==========================================
// PÁGINA DE GESTIÓN DE ASPIRANTES
// ==========================================

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Servicios
import {
  obtenerAspirantes,
  buscarAspirantes,
  guardarAspiranteParaEvaluar,
  exportarCSVParticipantes,
  exportarExcelParticipantes
} from "../servicios_js/aspirantes.js";

import {
  obtenerSesion,
  cerrarSesion as cerrarSesionServicio,
  protegerVista
} from "../servicios_js/autenticaciones.js";

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function Aspirantes() {
  const navigate = useNavigate();

  // ==========================================
  // 1. ESTADOS
  // ==========================================

  const [aspirantes, setAspirantes] = useState(
    () => obtenerAspirantes()
  );

  const [busqueda, setBusqueda] = useState("");

  const [nombreUsuario, setNombreUsuario] = useState(
    "Usuario"
  );

  const [accesoAutorizado, setAccesoAutorizado] =
    useState(false);

  // ==========================================
  // 2. VERIFICAR SESIÓN Y PERMISOS
  // ==========================================

  useEffect(() => {
    const sesion = obtenerSesion();

    const rolesPermitidos = [
      "administrador",
      "superadministrador",
      "evaluador"
    ];

    if (
      !sesion ||
      !protegerVista(rolesPermitidos)
    ) {
      navigate("/Login", { replace: true });
      return;
    }

    setNombreUsuario(
      sesion.nombreCompleto ||
      sesion.nombre ||
      "Usuario"
    );

    setAccesoAutorizado(true);

  }, [navigate]);

  // ==========================================
  // 3. ACTUALIZAR ASPIRANTES
  // ==========================================

  useEffect(() => {
    const actualizarAspirantes = () => {
      setAspirantes(obtenerAspirantes());
    };

    window.addEventListener(
      "storage",
      actualizarAspirantes
    );

    return () => {
      window.removeEventListener(
        "storage",
        actualizarAspirantes
      );
    };
  }, []);

  // ==========================================
  // 4. BUSCAR ASPIRANTES
  // ==========================================

  const aspirantesFiltrados = useMemo(() => {
    return buscarAspirantes(
      aspirantes,
      busqueda
    );
  }, [aspirantes, busqueda]);

  // ==========================================
  // 5. EVALUAR ASPIRANTE
  // ==========================================

  const evaluarAspirante = (aspirante) => {
    const guardado =
      guardarAspiranteParaEvaluar(aspirante);

    if (!guardado) {
      Swal.fire({
        icon: "error",
        title: "No se pudo seleccionar",
        text: "No fue posible preparar los datos del aspirante."
      });

      return;
    }

    navigate("/PerfilCandidato");
  };

  // ==========================================
  // 6. EXPORTAR CSV
  // ==========================================

  const manejarExportacionCSV = () => {
    try {
      const exportado = exportarCSVParticipantes(
        aspirantesFiltrados
      );

      if (!exportado) {
        Swal.fire({
          icon: "info",
          title: "Sin registros",
          text: "No hay aspirantes para exportar."
        });
      }

    } catch (error) {
      console.error("Error al exportar CSV:", error);

      Swal.fire({
        icon: "error",
        title: "Error al exportar",
        text: "No fue posible generar el archivo CSV."
      });
    }
  };

  // ==========================================
  // 7. EXPORTAR EXCEL
  // ==========================================

  const manejarExportacionExcel = () => {
    try {
      const exportado = exportarExcelParticipantes(
        aspirantesFiltrados
      );

      if (!exportado) {
        Swal.fire({
          icon: "info",
          title: "Sin registros",
          text: "No hay aspirantes para exportar."
        });
      }

    } catch (error) {
      console.error("Error al exportar Excel:", error);

      Swal.fire({
        icon: "error",
        title: "Error al exportar",
        text: "No fue posible generar el archivo Excel."
      });
    }
  };

  // ==========================================
  // 8. ACTUALIZAR TABLA
  // ==========================================

  const actualizarTabla = () => {
    setAspirantes(obtenerAspirantes());

    Swal.fire({
      icon: "success",
      title: "Información actualizada",
      text: "La lista de aspirantes se actualizó correctamente.",
      timer: 1500,
      showConfirmButton: false
    });
  };

  // ==========================================
  // 9. LIMPIAR BÚSQUEDA
  // ==========================================

  const limpiarBusqueda = () => {
    setBusqueda("");
  };

  // ==========================================
  // 10. CERRAR SESIÓN
  // ==========================================

  const manejarCerrarSesion = async () => {
    const resultado = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Deseas salir del sistema?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545"
    });

    if (resultado.isConfirmed) {
      cerrarSesionServicio();

      navigate("/Login", {
        replace: true
      });
    }
  };

  // ==========================================
  // 11. NO MOSTRAR LA VISTA SIN AUTORIZACIÓN
  // ==========================================

  if (!accesoAutorizado) {
    return null;
  }

  // ==========================================
  // 12. INTERFAZ
  // ==========================================

  return (
    <div className="portal">

      {/* ======================================
          MENÚ LATERAL
      ====================================== */}

      <aside className="sidebar">

        <div>
          <img
            src="/recursos/logo_AIDEL.png"
            alt="Logo AIDEL"
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
            <Link
              to="/Aspirantes"
              className="active"
            >
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
            <Link
              to="/Aspirantes"
              className="active"
            >
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

      {/* ======================================
          CONTENIDO PRINCIPAL
      ====================================== */}

      <div className="main-content">

        {/* BARRA SUPERIOR */}

        <header className="topbar">

          <h1 className="topbar-title">
            Portal del evaluador
          </h1>

          <div className="topbar-user d-flex align-items-center gap-3 ms-auto">

            <div className="search-box">

              <i className="bi bi-search"></i>

              <input
                type="text"
                id="inputBuscarAspirante"
                placeholder="Buscar por nombre, correo o curso"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
              />

            </div>

            <span id="lbl-admin-topbar">
              {nombreUsuario}
            </span>

            <i className="bi bi-person-circle"></i>

            <button
              type="button"
              onClick={manejarCerrarSesion}
              className="btn btn-outline-danger btn-sm fw-bold"
            >
              Cerrar sesión
            </button>

          </div>

        </header>

        {/* ======================================
            CONTENIDO DE ASPIRANTES
        ====================================== */}

        <main className="dashboard-container">

          <section className="requests-card">

            {/* ENCABEZADO */}

            <div className="requests-header d-flex flex-wrap align-items-center gap-3">

              <div>
                <h3 className="mb-1">
                  Solicitudes
                </h3>

                <small className="text-muted">
                  Mostrando {aspirantesFiltrados.length} de {aspirantes.length} aspirantes
                </small>
              </div>

              <button
                type="button"
                className="options-button ms-auto"
                aria-label="Actualizar aspirantes"
                title="Actualizar información"
                onClick={actualizarTabla}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>

            </div>

            {/* BOTONES DE EXPORTACIÓN */}

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
                onClick={limpiarBusqueda}
              >
                <i className="bi bi-x-circle"></i>
                Limpiar búsqueda
              </button>

            </div>

            {/* TABLA */}

            <div className="table-responsive">

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

                  {aspirantesFiltrados.length === 0 ? (

                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-muted py-4"
                      >
                        {aspirantes.length === 0
                          ? "No hay aspirantes registrados."
                          : "No se encontraron aspirantes con esa búsqueda."}
                      </td>
                    </tr>

                  ) : (

                    aspirantesFiltrados.map((aspirante, index) => (

                      <tr
                        key={
                          aspirante.id ||
                          aspirante.email ||
                          index
                        }
                      >

                        <td className="fw-semibold">
                          {aspirante.nombreCompleto ||
                            aspirante.nombre ||
                            "Sin nombre"}
                        </td>

                        <td>
                          {aspirante.cursoInteres ||
                            aspirante.curso ||
                            aspirante.cursoFormacion ||
                            "Sin curso"}
                        </td>

                        <td>
                          <span className="status">
                            {aspirante.estado || "Postulado"}
                          </span>
                        </td>

                        <td>
                          <small className="text-muted">
                            CV: {aspirante.cvAdjuntado
                              ? "Adjunto"
                              : "Pendiente"}

                            {" | "}

                            Vídeo: {aspirante.videoAdjuntado
                              ? "Adjunto"
                              : "Pendiente"}
                          </small>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              evaluarAspirante(aspirante)
                            }
                          >
                            <i className="bi bi-clipboard-check"></i>
                            Evaluar
                          </button>
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default Aspirantes;