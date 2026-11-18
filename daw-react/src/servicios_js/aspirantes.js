// ==========================================
// SERVICIO DE GESTIÓN DE ASPIRANTES
// ==========================================

import * as XLSX from "xlsx";

// ==========================================
// 1. OBTENER ASPIRANTES
// ==========================================

export function obtenerAspirantes() {
  try {
    const usuarios = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    if (!Array.isArray(usuarios)) {
      return [];
    }

    return usuarios.filter(
      (usuario) =>
        usuario &&
        usuario.rol === "usuario"
    );

  } catch (error) {
    console.error("Error al obtener aspirantes:", error);
    return [];
  }
}

// ==========================================
// 2. NORMALIZAR INFORMACIÓN
// ==========================================

function obtenerNombre(aspirante) {
  return (
    aspirante.nombreCompleto ||
    aspirante.nombre ||
    "Sin nombre"
  );
}

function obtenerCorreo(aspirante) {
  return (
    aspirante.email ||
    aspirante.correo ||
    ""
  );
}

function obtenerCurso(aspirante) {
  return (
    aspirante.cursoInteres ||
    aspirante.curso ||
    aspirante.cursoFormacion ||
    "Sin curso"
  );
}

function obtenerEstado(aspirante) {
  return aspirante.estado || "Postulado";
}

// ==========================================
// 3. BUSCAR ASPIRANTES
// ==========================================

export function buscarAspirantes(
  aspirantes,
  textoBusqueda = ""
) {
  const texto = String(textoBusqueda)
    .trim()
    .toLowerCase();

  if (!texto) {
    return aspirantes;
  }

  return aspirantes.filter((aspirante) => {
    const nombre = obtenerNombre(aspirante)
      .toLowerCase();

    const correo = obtenerCorreo(aspirante)
      .toLowerCase();

    const curso = String(obtenerCurso(aspirante))
      .toLowerCase();

    return (
      nombre.includes(texto) ||
      correo.includes(texto) ||
      curso.includes(texto)
    );
  });
}

// ==========================================
// 4. PREPARAR ASPIRANTE PARA EVALUACIÓN
// ==========================================

export function guardarAspiranteParaEvaluar(aspirante) {
  if (!aspirante || aspirante.rol !== "usuario") {
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

// ==========================================
// 5. PREPARAR DATOS PARA EXPORTACIÓN
// ==========================================

export function obtenerDatosExportacion(aspirantes) {
  return aspirantes.map((aspirante) => ({
    Nombre: obtenerNombre(aspirante),
    Correo: obtenerCorreo(aspirante),
    Curso: obtenerCurso(aspirante),
    Estado: obtenerEstado(aspirante),

    CV: aspirante.cvAdjuntado
      ? "Adjunto"
      : "Pendiente",

    Video: aspirante.videoAdjuntado
      ? "Adjunto"
      : "Pendiente"
  }));
}

// ==========================================
// 6. EXPORTAR A CSV
// ==========================================

export function exportarCSVParticipantes(aspirantes) {
  const datos = obtenerDatosExportacion(aspirantes);

  if (datos.length === 0) {
    return false;
  }

  const columnas = Object.keys(datos[0]);

  const escapar = (valor) => {
    return (
      '"' +
      String(valor ?? "").replace(/"/g, '""') +
      '"'
    );
  };

  const contenido = [
    columnas.map(escapar).join(";"),

    ...datos.map((fila) =>
      columnas
        .map((columna) => escapar(fila[columna]))
        .join(";")
    )
  ].join("\r\n");

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
// 7. EXPORTAR A EXCEL
// ==========================================

export function exportarExcelParticipantes(aspirantes) {
  const datos = obtenerDatosExportacion(aspirantes);

  if (datos.length === 0) {
    return false;
  }

  const hoja = XLSX.utils.json_to_sheet(datos);

  // Ajustar ancho de las columnas.
  hoja["!cols"] = [
    { wch: 30 },
    { wch: 32 },
    { wch: 38 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 }
  ];

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
// 8. DESCARGAR ARCHIVO
// ==========================================

function descargarArchivo(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombreArchivo;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}