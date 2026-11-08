// ==========================================
// SERVICIO DE GESTIÓN DEL PANEL DE CONTROL
// ==========================================

import * as XLSX from "xlsx";

// ==========================================
// 1. LECTURA DE DATOS
// ==========================================

export function obtenerAspirantes() {
  try {
    const datos = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos.filter(
      (usuario) => usuario && usuario.rol === "usuario"
    );
  } catch (error) {
    console.error("Error al obtener aspirantes:", error);
    return [];
  }
}

export function obtenerSesion() {
  try {
    return JSON.parse(
      localStorage.getItem("sesion") || "null"
    );
  } catch (error) {
    console.error("Error al obtener la sesión:", error);
    return null;
  }
}

// ==========================================
// 2. NORMALIZACIÓN DE DATOS
// ==========================================

function obtenerNombre(aspirante) {
  return (
    aspirante.nombreCompleto ||
    aspirante.nombre ||
    "Sin nombre"
  );
}

function obtenerCurso(aspirante) {
  const curso =
    aspirante.cursoInteres ||
    aspirante.curso ||
    "General";

  return String(curso).trim();
}

function obtenerEstado(aspirante) {
  return String(
    aspirante.estado || "Postulado"
  )
    .trim()
    .toLowerCase();
}

// ==========================================
// 3. FILTRADO DE ASPIRANTES
// ==========================================

export function coincideEstado(aspirante, filtro) {
  if (filtro === "todos") {
    return true;
  }

  const estado = obtenerEstado(aspirante);

  const grupos = {
    "En revisión": [
      "en revisión",
      "en revision"
    ],

    Entrevistados: [
      "entrevistado",
      "entrevistados",
      "en entrevista"
    ],

    Seleccionados: [
      "aprobado",
      "seleccionado",
      "seleccionado/a"
    ],

    "No seleccionados": [
      "rechazado",
      "no seleccionado",
      "no seleccionado/a"
    ],

    Postulado: [
      "postulado",
      "postulados"
    ]
  };

  const estadosPermitidos =
    grupos[filtro] || [filtro.toLowerCase()];

  return estadosPermitidos.includes(estado);
}

export function filtrarAspirantes(
  aspirantes,
  busqueda = "",
  filtroCurso = "todos",
  filtroEstado = "todos"
) {
  const texto = String(busqueda)
    .trim()
    .toLowerCase();

  return aspirantes.filter((aspirante) => {
    const nombre = obtenerNombre(aspirante)
      .toLowerCase();

    const correo = String(
      aspirante.email || ""
    ).toLowerCase();

    const curso = obtenerCurso(aspirante);

    const cumpleBusqueda =
      nombre.includes(texto) ||
      correo.includes(texto);

    const cumpleCurso =
      filtroCurso === "todos" ||
      curso.toLowerCase() ===
        filtroCurso.toLowerCase();

    const cumpleEstado = coincideEstado(
      aspirante,
      filtroEstado
    );

    return (
      cumpleBusqueda &&
      cumpleCurso &&
      cumpleEstado
    );
  });
}

// ==========================================
// 4. OBTENER CURSOS DISPONIBLES
// ==========================================

export function obtenerCursosDisponibles(aspirantes) {
  const cursos = aspirantes
    .map((aspirante) => obtenerCurso(aspirante))
    .filter((curso) => curso && curso !== "General");

  return [...new Set(cursos)].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

// ==========================================
// 5. INDICADORES DEL DASHBOARD
// ==========================================

export function obtenerIndicadores(aspirantes) {
  return {
    total: aspirantes.length,

    revision: aspirantes.filter((a) =>
      coincideEstado(a, "En revisión")
    ).length,

    entrevistados: aspirantes.filter((a) =>
      coincideEstado(a, "Entrevistados")
    ).length,

    seleccionados: aspirantes.filter((a) =>
      coincideEstado(a, "Seleccionados")
    ).length,

    rechazados: aspirantes.filter((a) =>
      coincideEstado(a, "No seleccionados")
    ).length,

    postulados: aspirantes.filter((a) =>
      coincideEstado(a, "Postulado")
    ).length
  };
}

// ==========================================
// 6. DATOS PARA GRÁFICA MENSUAL
// ==========================================

export function obtenerPostulacionesPorMes(aspirantes) {
  const conteoPorMes = new Array(12).fill(0);

  aspirantes.forEach((aspirante) => {
    if (aspirante.fechaRegistro) {
      const fecha = new Date(aspirante.fechaRegistro);

      if (!Number.isNaN(fecha.getTime())) {
        conteoPorMes[fecha.getMonth()]++;
      }
    } else {
      // Si no existe fecha de registro,
      // se contabiliza en el mes actual.
      conteoPorMes[new Date().getMonth()]++;
    }
  });

  return conteoPorMes;
}

// ==========================================
// 7. PREPARAR DATOS PARA EXPORTACIÓN
// ==========================================

export function obtenerDatosExportacion(aspirantes) {
  return aspirantes.map((aspirante) => ({
    Nombre: obtenerNombre(aspirante),
    Correo: aspirante.email || "",
    Curso: obtenerCurso(aspirante),
    Estado: aspirante.estado || "Postulado",
    CV: aspirante.cvAdjuntado
      ? "Adjunto"
      : "Pendiente",
    Video: aspirante.videoAdjuntado
      ? "Adjunto"
      : "Pendiente"
  }));
}

// ==========================================
// 8. DESCARGA DE ARCHIVOS
// ==========================================

function descargarArchivo(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombreArchivo;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  // Se libera la URL después de iniciar la descarga.
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

// ==========================================
// 9. EXPORTAR ASPIRANTES A CSV
// ==========================================

export function exportarAspirantesCSV(aspirantes) {
  const datos = obtenerDatosExportacion(aspirantes);

  if (datos.length === 0) {
    return false;
  }

  const hoja = XLSX.utils.json_to_sheet(datos);

  const contenido = XLSX.utils.sheet_to_csv(
    hoja,
    { FS: ";" }
  );

  const blob = new Blob(
    ["\uFEFF" + contenido],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  descargarArchivo(
    blob,
    "reporte_participantes_protalento.csv"
  );

  return true;
}

// ==========================================
// 10. EXPORTAR ASPIRANTES A EXCEL
// ==========================================

export function exportarAspirantesExcel(aspirantes) {
  const datos = obtenerDatosExportacion(aspirantes);

  if (datos.length === 0) {
    return false;
  }

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    "Aspirantes"
  );

  XLSX.writeFile(
    libro,
    "reporte_aspirantes_protalento.xlsx"
  );

  return true;
}

// ==========================================
// 11. SELECCIONAR ASPIRANTE PARA EVALUACIÓN
// ==========================================

export function guardarAspiranteParaEvaluar(aspirante) {
  if (!aspirante) {
    return false;
  }

  try {
    localStorage.setItem(
      "aspiranteEvaluar",
      JSON.stringify(aspirante)
    );

    return true;
  } catch (error) {
    console.error(
      "Error al guardar el aspirante para evaluación:",
      error
    );

    return false;
  }
}