import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  obtenerConvocatorias,
  obtenerCursos,
  guardarConvocatorias,
  guardarCursos,
  validarFechasConvocatoria,
  validarCursoDuplicado,
  cursoEstaEnUso,
  guardarConvocatoria,
  eliminarConvocatoria,
  guardarCurso,
  eliminarCurso,
  exportarConvocatoriasCSV,
  exportarConvocatoriasExcel
} from "../servicios_js/scriptConvocatorias.js";

function Convocatorias() {
  // ==========================================
  // 1. ESTADOS Y DATOS INICIALES
  // ==========================================

  const [convocatorias, setConvocatorias] = useState(
  () => obtenerConvocatorias()
);

const [cursos, setCursos] = useState(
  () => obtenerCursos()
);

  const [mostrarModalConvocatoria, setMostrarModalConvocatoria] =
    useState(false);

  const [mostrarModalCurso, setMostrarModalCurso] = useState(false);

  const [idConvocatoriaEditar, setIdConvocatoriaEditar] = useState(null);
  const [idCursoEditar, setIdCursoEditar] = useState(null);

  const [formConvocatoria, setFormConvocatoria] = useState({
    curso: "",
    fechaInicio: "",
    fechaCierre: "",
    plazas: "",
    estado: "Activa"
  });

  const [formCurso, setFormCurso] = useState({
    nombre: "",
    descripcion: ""
  });

  const navigate = useNavigate();

  // ==========================================
  // 2. PERSISTENCIA EN LOCALSTORAGE
  // ==========================================

  const actualizarConvocatorias = (datos) => {
  guardarConvocatorias(datos);
  setConvocatorias(datos);
  };

const actualizarCursos = (datos) => {
  guardarCursos(datos);
  setCursos(datos);
  };

  // ==========================================
  // 3. FORMULARIO DE CONVOCATORIAS
  // ==========================================

  const prepararCreacionConvocatoria = () => {
    setIdConvocatoriaEditar(null);

    setFormConvocatoria({
      curso: "",
      fechaInicio: "",
      fechaCierre: "",
      plazas: "",
      estado: "Activa"
    });

    setMostrarModalConvocatoria(true);
  };

  const prepararEdicionConvocatoria = (id) => {
    const convocatoria = convocatorias.find((c) => c.id === id);

    if (!convocatoria) return;

    setIdConvocatoriaEditar(id);

    setFormConvocatoria({
      curso: convocatoria.curso,
      fechaInicio: convocatoria.fechaInicio,
      fechaCierre: convocatoria.fechaCierre,
      plazas: String(convocatoria.plazas),
      estado: convocatoria.estado
    });

    setMostrarModalConvocatoria(true);
  };

  const guardarFormularioConvocatoria = (e) => {
  e.preventDefault();

  if (!formConvocatoria.curso) {
  Swal.fire({
    icon: "warning",
    title: "Curso requerido",
    text: "Debes seleccionar un curso."
  });
  return;
}

  if (!validarFechasConvocatoria(formConvocatoria)) {
    Swal.fire({
      icon: "warning",
      title: "Fechas incorrectas",
      text: "La fecha de cierre no puede ser anterior a la fecha de inicio."
    });
    return;
  }

  const resultado = guardarConvocatoria(
    convocatorias,
    formConvocatoria,
    idConvocatoriaEditar
  );

  actualizarConvocatorias(resultado);

  setMostrarModalConvocatoria(false);

  Swal.fire({
    icon: "success",
    title: "¡Guardado!",
    text: "La convocatoria se ha guardado correctamente.",
    timer: 2000,
    showConfirmButton: false
  });
};

  const eliminarConvocatoriaUI = async (id) => {
  const resultado = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (resultado.isConfirmed) {
    const nuevasConvocatorias = eliminarConvocatoria(
      convocatorias,
      id
    );

    actualizarConvocatorias(nuevasConvocatorias);

    Swal.fire({
      icon: "success",
      title: "¡Eliminada!",
      text: "La convocatoria se eliminó correctamente.",
      timer: 2000,
      showConfirmButton: false
    });
  }
};

  // ==========================================
  // 4. FORMULARIO DE CURSOS
  // ==========================================

  const prepararCreacionCurso = () => {
    setIdCursoEditar(null);

    setFormCurso({
      nombre: "",
      descripcion: ""
    });

    setMostrarModalCurso(true);
  };

  const prepararEdicionCurso = (id) => {
    const curso = cursos.find((c) => c.id === id);

    if (!curso) return;

    setIdCursoEditar(id);

    setFormCurso({
      nombre: curso.nombre,
      descripcion: curso.descripcion
    });

    setMostrarModalCurso(true);
  };

  const guardarFormularioCurso = (e) => {
  e.preventDefault();

  if (validarCursoDuplicado(cursos, formCurso, idCursoEditar)) {
    Swal.fire({
      icon: "warning",
      title: "Curso existente",
      text: "Ya existe un curso con ese nombre."
    });
    return;
  }

  const resultado = guardarCurso(
    cursos,
    convocatorias,
    formCurso,
    idCursoEditar
  );

  actualizarCursos(resultado.cursos);
  actualizarConvocatorias(resultado.convocatorias);

  setMostrarModalCurso(false);

  Swal.fire({
    icon: "success",
    title: "¡Guardado!",
    text: "El curso se ha guardado correctamente.",
    timer: 2000,
    showConfirmButton: false
  });
  };  
const eliminarCursoUI = async (id) => {
  const curso = cursos.find((c) => c.id === id);

  if (!curso) return;

  if (cursoEstaEnUso(convocatorias, curso)) {
    Swal.fire({
      icon: "warning",
      title: "Curso en uso",
      text: "No puedes eliminar este curso porque está asociado a una o más convocatorias."
    });
    return;
  }

  const confirmacion = await Swal.fire({
    title: "¿Eliminar curso?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545"
  });

  if (confirmacion.isConfirmed) {
    const nuevosCursos = eliminarCurso(cursos, id);

    actualizarCursos(nuevosCursos);

    Swal.fire({
      icon: "success",
      title: "Curso eliminado",
      text: "El curso se eliminó correctamente."
    });
  }
};

  // ==========================================
  // 5. EXPORTACIONES CSV Y EXCEL
  // ==========================================
  
  const manejarExportacionCSV = () => {
    const exportado = exportarConvocatoriasCSV(convocatorias);

    if (!exportado) {
      Swal.fire({
        icon: "info",
        title: "Sin datos",
        text: "No hay convocatorias activas para exportar."
      });
    }
  };

  const manejarExportacionExcel = () => {
    const exportado = exportarConvocatoriasExcel(convocatorias);

    if (!exportado) {
      Swal.fire({
        icon: "info",
        title: "Sin datos",
        text: "No hay convocatorias activas para exportar."
      });
    }
  };


  // ==========================================
  // 6. CERRAR SESIÓN
  // ==========================================

  const cerrarSesion = () => {
    navigate("/Login");
  };

  // ==========================================
  // 7. INTERFAZ VISUAL
  // ==========================================

  return (
    <>
      <div className="portal">

        {/* MENÚ LATERAL */}
        <aside className="sidebar">

          <div>
            <img
              src="recursos/logo_AIDEL.png"
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
              <Link to="/PanelControl">
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
                <i className="bi bi-chevron-right ms-auto"></i>
              </Link>
            </li>

            <li>
              <Link to="/Convocatorias" className="active">
                <i className="bi bi-folder"></i>
                Convocatorias y Cursos
                <i className="bi bi-chevron-right ms-auto"></i>
              </Link>
            </li>
          </ul>

        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="main-content">

          <header className="topbar">

            <h1 className="topbar-title">
              Portal del Evaluador
            </h1>

            <div className="topbar-user d-flex align-items-center gap-3 ms-auto">

              <div className="search-box">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  id="inputBuscarAspirante"
                  placeholder="Buscar aspirante"
                />
              </div>

              <span id="lbl-admin-topbar">
                Administrador
              </span>

              <i className="bi bi-person-circle"></i>

              <button
                onClick={cerrarSesion}
                className="btn btn-outline-danger btn-sm font-weight-bold"
              >
                Cerrar sesión
              </button>

            </div>
          </header>

          <main className="dashboard-container">

            {/* GESTIÓN DE CONVOCATORIAS */}
            <div className="d-flex justify-content-between align-items-center mb-4">

              <h2 className="dashboard-title mb-0">
                Gestión de Convocatorias
              </h2>

              <button
                className="btn btn-primary"
                onClick={prepararCreacionConvocatoria}
              >
                + Nueva Convocatoria
              </button>

            </div>

            <div className="card card-custom p-3 mb-5">

              <div className="d-flex gap-2 flex-wrap mb-3">

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

              </div>

              <div className="table-responsive">

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

                  <tbody>

                    {convocatorias.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-muted py-4"
                        >
                          No hay convocatorias registradas
                        </td>
                      </tr>
                    ) : (
                      convocatorias.map((conv) => {

                        let badgeClass = "badge-activa";

                        if (conv.estado === "Cerrada") {
                          badgeClass = "badge-cerrada";
                        }

                        if (conv.estado === "Próximamente") {
                          badgeClass = "badge-proximamente";
                        }

                        return (
                          <tr key={conv.id}>

                            <td className="fw-semibold">
                              {conv.curso}
                            </td>

                            <td>
                              <small className="text-muted">
                                Del {conv.fechaInicio} al {conv.fechaCierre}
                              </small>
                            </td>

                            <td>
                              {conv.plazas} plazas
                            </td>

                            <td>
                              <span className={badgeClass}>
                                {conv.estado}
                              </span>
                            </td>

                            <td>
  <button
    type="button"
    className="btn btn-sm btn-outline-primary me-1"
    onClick={() => prepararEdicionConvocatoria(conv.id)}
    title="Editar"
  >
    Editar
  </button>

  <button
    type="button"
    className="btn btn-sm btn-outline-danger"
    onClick={() => eliminarConvocatoriaUI(conv.id)}
    title="Eliminar"
  >
    Eliminar
  </button>
</td>

                          </tr>
                        );
                      })
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* GESTIÓN DE CURSOS */}
            <div className="d-flex justify-content-between align-items-center mb-4">

              <h2 className="dashboard-title mb-0">
                Gestión de Cursos
              </h2>

              <button
                className="btn btn-primary"
                onClick={prepararCreacionCurso}
              >
                + Nuevo Curso
              </button>

            </div>

            <div className="row g-4 mb-5">

              {cursos.length === 0 ? (
                <div className="col-12 text-center text-muted py-3">
                  <p>No hay cursos registrados en el sistema.</p>
                </div>
              ) : (
                cursos.map((curso) => (
                  <div className="col-md-4 col-sm-6" key={curso.id}>

                    <div className="card curso-card h-100 p-3 d-flex flex-column justify-content-between">

                      <div>
                        <h5 className="card-title mb-2">
                          {curso.nombre}
                        </h5>

                        <p className="card-text mb-3">
                          {curso.descripcion}
                        </p>
                      </div>

                      <div className="d-flex justify-content-end gap-2 pt-2 border-top">

                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => prepararEdicionCurso(curso.id)}
                        >
                          <i className="bi bi-pencil-square"></i>
                          Editar
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarCursoUI(curso.id)}
                        >
                          <i className="bi bi-trash"></i>
                          Eliminar
                        </button>

                      </div>

                    </div>

                  </div>
                ))
              )}

            </div>

          </main>

        </div>

      </div>

      {/* =====================================
          MODAL DE CONVOCATORIAS
      ===================================== */}

      {mostrarModalConvocatoria && (

        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >

          <div className="modal-dialog">

            <div className="modal-content card-custom p-3">

              <div className="modal-header border-0">

                <h5 className="modal-title fw-bold">
                 {idConvocatoriaEditar !== null
                  ? "Editar Convocatoria"
                  : "Nueva Convocatoria"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModalConvocatoria(false)}
                  aria-label="Cerrar"
                ></button>

              </div>

              <div className="modal-body">

                <form onSubmit={guardarFormularioConvocatoria}>

                  <div className="mb-3">

                    <label
                      htmlFor="cursoSelect"
                      className="form-label fw-semibold small"
                    >
                      Cursos Disponibles
                    </label>

                    <select
                      className="form-select"
                      id="cursoSelect"
                      value={formConvocatoria.curso}
                      onChange={(e) =>
                        setFormConvocatoria({
                          ...formConvocatoria,
                          curso: e.target.value
                        })
                      }
                      required
                    >

                      <option value="" disabled>
                        Seleccione un curso...
                      </option>

                      {cursos.map((curso) => (
                        <option key={curso.id} value={curso.nombre}>
                          {curso.nombre}
                        </option>
                      ))}

                    </select>

                  </div>

                  <div className="mb-3">

                    <label
                      htmlFor="fechaInicio"
                      className="form-label fw-semibold small"
                    >
                      Fecha de Inicio
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      id="fechaInicio"
                      value={formConvocatoria.fechaInicio}
                      onChange={(e) =>
                        setFormConvocatoria({
                          ...formConvocatoria,
                          fechaInicio: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div className="mb-3">

                    <label
                      htmlFor="fechaCierre"
                      className="form-label fw-semibold small"
                    >
                      Fecha de Cierre
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      id="fechaCierre"
                      min={formConvocatoria.fechaInicio}
                      value={formConvocatoria.fechaCierre}
                      onChange={(e) =>
                        setFormConvocatoria({
                          ...formConvocatoria,
                          fechaCierre: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div className="mb-3">

                    <label
                      htmlFor="numPlazas"
                      className="form-label fw-semibold small"
                    >
                      Número de Plazas
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      id="numPlazas"
                      min="1"
                      step="1"
                      value={formConvocatoria.plazas}
                      onChange={(e) =>
                        setFormConvocatoria({
                          ...formConvocatoria,
                          plazas: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div className="mb-3">

                    <label
                      htmlFor="estadoSelect"
                      className="form-label fw-semibold small"
                    >
                      Estado de Convocatoria
                    </label>

                    <select
                      className="form-select"
                      id="estadoSelect"
                      value={formConvocatoria.estado}
                      onChange={(e) =>
                        setFormConvocatoria({
                          ...formConvocatoria,
                          estado: e.target.value
                        })
                      }
                      required
                    >

                      <option value="Activa">Activa</option>
                      <option value="Cerrada">Cerrada</option>
                      <option value="Próximamente">Próximamente</option>

                    </select>

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2"
                  >
                    Guardar Convocatoria
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          MODAL DE CURSOS
      ===================================== */}

      {mostrarModalCurso && (

        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >

          <div className="modal-dialog modal-sm">

            <div className="modal-content card-custom p-3">

              <div className="modal-header border-0 pb-0">

                <h5 className="modal-title fw-bold fs-6">
                  {idCursoEditar !== null
                    ? "Editar Curso"
                    : "Nuevo Curso"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModalCurso(false)}
                  aria-label="Cerrar"
                ></button>

              </div>

              <div className="modal-body pt-2">

                <form onSubmit={guardarFormularioCurso}>

                  <div className="mb-2">

                    <label
                      htmlFor="nombreCurso"
                      className="form-label fw-semibold small"
                    >
                      Nombre del Curso
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="nombreCurso"
                      placeholder="Ej. Redes informáticas"
                      value={formCurso.nombre}
                      onChange={(e) =>
                        setFormCurso({
                          ...formCurso,
                          nombre: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div className="mb-3">

                    <label
                      htmlFor="descCurso"
                      className="form-label fw-semibold small"
                    >
                      Breve Descripción
                    </label>

                    <textarea
                      className="form-control form-control-sm"
                      id="descCurso"
                      rows="3"
                      placeholder="Detalles administrativos..."
                      value={formCurso.descripcion}
                      onChange={(e) =>
                        setFormCurso({
                          ...formCurso,
                          descripcion: e.target.value
                        })
                      }
                      required
                    ></textarea>

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-sm w-100"
                  >
                    Guardar Curso
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default Convocatorias;
