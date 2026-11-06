 import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

import Indicadores from "../componentes/panel/Indicadores";
import FiltrosAspirantes from "../componentes/panel/FiltrosAspirantes";
import TablaAspirantes from "../componentes/panel/TablaAspirantes";
import Graficas from "../componentes/panel/Graficas";

function leerUsuarios() {
  try {
    const datos = JSON.parse(localStorage.getItem("usuarios") || "[]");
    return Array.isArray(datos)
      ? datos.filter((usuario) => usuario.rol === "usuario")
      : [];
  } catch (error) {
    console.error("Error leyendo aspirantes:", error);
    return [];
  }
}

function coincideEstado(aspirante, filtro) {
  if (filtro === "todos") return true;

  const estado = (aspirante.estado || "Postulado")
    .trim()
    .toLowerCase();

  const grupos = {
    "En revisión": ["en revisión", "en revision"],
    Entrevistados: ["entrevistado", "en entrevista"],
    Seleccionados: ["aprobado", "seleccionado", "seleccionado/a"],
    "No seleccionados": [
      "rechazado",
      "no seleccionado",
      "no seleccionado/a",
    ],
    Postulado: ["postulado"],
  };

  return (grupos[filtro] || [filtro.toLowerCase()]).includes(estado);
}

function PanelControl() {
  const navigate = useNavigate();

  const [aspirantes, setAspirantes] = useState(leerUsuarios);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [nombreUsuario, setNombreUsuario] = useState("Usuario");

  useEffect(() => {
    try {
      const sesion = JSON.parse(localStorage.getItem("sesion") || "null");
      if (sesion?.nombre) {
        setNombreUsuario(sesion.nombre);
      }
    } catch (error) {
      console.error("Error leyendo sesión:", error);
    }

    const actualizarDatos = () => setAspirantes(leerUsuarios());

    // Detecta cambios de almacenamiento realizados desde otras pestañas.
    window.addEventListener("storage", actualizarDatos);

    return () => {
      window.removeEventListener("storage", actualizarDatos);
    };
  }, []);

  const aspirantesFiltrados = aspirantes.filter((aspirante) => {
    const texto = busqueda.trim().toLowerCase();

    const nombre = (
      aspirante.nombreCompleto ||
      aspirante.nombre ||
      ""
    ).toLowerCase();

    const correo = (aspirante.email || "").toLowerCase();

    const curso = (
      aspirante.cursoInteres ||
      aspirante.curso ||
      "General"
    ).trim();

    const cumpleBusqueda =
      nombre.includes(texto) || correo.includes(texto);

    const cumpleCurso =
      filtroCurso === "todos" ||
      curso.toLowerCase() === filtroCurso.toLowerCase();

    const cumpleEstado = coincideEstado(aspirante, filtroEstado);

    return cumpleBusqueda && cumpleCurso && cumpleEstado;
  });

  const cambiarFiltroGrafica = (estado) => {
    setFiltroEstado((actual) =>
      actual === estado ? "todos" : estado
    );
  };

  const evaluarAspirante = (aspirante) => {
    localStorage.setItem(
      "aspiranteEvaluar",
      JSON.stringify(aspirante)
    );

    navigate("/PerfilCandidato");
  };

  const descargarPDF = (aspirante) => {
    const pdf = new jsPDF();

    const nombre =
      aspirante.nombreCompleto ||
      aspirante.nombre ||
      "Sin nombre";

    const datos = [
      `Nombre: ${nombre}`,
      `Correo: ${aspirante.email || "No registrado"}`,
      `Curso: ${aspirante.cursoInteres || aspirante.curso || "General"}`,
      `Estado: ${aspirante.estado || "Postulado"}`,
      `CV: ${aspirante.cvAdjuntado ? "Adjunto" : "Pendiente"}`,
      `Video: ${aspirante.videoAdjuntado ? "Adjunto" : "Pendiente"}`,
    ];

    pdf.setFontSize(17);
    pdf.text("Perfil del aspirante - ProTalento", 15, 20);

    pdf.setFontSize(11);
    datos.forEach((linea, index) => {
      const texto = pdf.splitTextToSize(linea, 175);
      pdf.text(texto, 15, 38 + index * 17);
    });

    pdf.save("perfil_aspirante.pdf");
  };

  const obtenerDatosExportacion = () =>
    aspirantesFiltrados.map((aspirante) => ({
      Nombre:
        aspirante.nombreCompleto ||
        aspirante.nombre ||
        "Sin nombre",
      Correo: aspirante.email || "",
      Curso: aspirante.cursoInteres || aspirante.curso || "General",
      Estado: aspirante.estado || "Postulado",
      CV: aspirante.cvAdjuntado ? "Adjunto" : "Pendiente",
      Video: aspirante.videoAdjuntado ? "Adjunto" : "Pendiente",
    }));

  const exportarCSV = () => {
    const datos = obtenerDatosExportacion();

    if (datos.length === 0) {
      alert("No hay aspirantes para exportar.");
      return;
    }

    const hoja = XLSX.utils.json_to_sheet(datos);
    const csv = XLSX.utils.sheet_to_csv(hoja);

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = "reporte_participantes_protalento.csv";
    enlace.click();

    URL.revokeObjectURL(url);
  };

  const exportarExcel = () => {
    const datos = obtenerDatosExportacion();

    if (datos.length === 0) {
      alert("No hay aspirantes para exportar.");
      return;
    }

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Aspirantes");
    XLSX.writeFile(libro, "reporte_aspirantes_protalento.xlsx");
  };

  const cerrarSesion = () => {
    // Conservamos los usuarios registrados.
    localStorage.removeItem("sesion");
    navigate("/Login");
  };

  return (
    <div className="portal">
      <aside className="sidebar">
        <div>
          <img
            src="/recursos/logo_AIDEL.png"
            alt="Logo del portal"
            className="logo_convocatorias"
          />
        </div>

        <div className="sidebar-title">Favoritos</div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/PanelControl" className="active">
              <i className="bi bi-house"></i> Inicio
            </Link>
          </li>

          <li>
            <Link to="/Aspirantes">
              <i className="bi bi-people"></i> Aspirantes
            </Link>
          </li>
        </ul>

        <div className="sidebar-title">Dashboards</div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/PanelControl" className="active">
              <i className="bi bi-pie-chart-fill"></i> Métricas y reportes
            </Link>
          </li>
        </ul>

        <ul className="sidebar-menu">
          <li>
            <Link to="/Aspirantes">
              <i className="bi bi-folder"></i> Aspirantes
            </Link>
          </li>

          <li>
            <Link to="/Convocatorias">
              <i className="bi bi-folder"></i> Convocatorias y Cursos
            </Link>
          </li>
        </ul>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">Portal del evaluador</h1>

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

            <span id="lbl-admin-topbar">{nombreUsuario}</span>

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

        <main className="dashboard-container">
          <h2 className="dashboard-title">Métricas (KPIs)</h2>

          <Indicadores aspirantes={aspirantes} />

          <Graficas
            aspirantes={aspirantes}
            onFiltrarEstado={cambiarFiltroGrafica}
          />

          <section className="requests-card">
            <div className="requests-header d-flex flex-wrap align-items-center gap-3">
              <h3 className="mb-0">Solicitudes</h3>

              <span className="text-muted small">
                Mostrando {aspirantesFiltrados.length} de {aspirantes.length}
              </span>

              <div className="ms-auto">
                <FiltrosAspirantes
                  aspirantes={aspirantes}
                  filtroCurso={filtroCurso}
                  setFiltroCurso={setFiltroCurso}
                  filtroEstado={filtroEstado}
                  setFiltroEstado={setFiltroEstado}
                />
              </div>
            </div>

            <div className="d-flex gap-2 flex-wrap my-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={exportarCSV}
              >
                <i className="bi bi-filetype-csv"></i> Descargar CSV
              </button>

              <button
                type="button"
                className="btn btn-outline-success"
                onClick={exportarExcel}
              >
                <i className="bi bi-file-earmark-excel"></i> Descargar Excel
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setBusqueda("");
                  setFiltroCurso("todos");
                  setFiltroEstado("todos");
                }}
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setAspirantes(leerUsuarios())}
              >
                Actualizar datos
              </button>
            </div>

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