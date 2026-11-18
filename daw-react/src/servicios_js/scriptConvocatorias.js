
// ==========================================
// SERVICIO DE GESTIÓN DE CONVOCATORIAS Y CURSOS
// ==========================================

import * as XLSX from "xlsx";

// ==========================================
// 1. DATOS INICIALES
// ==========================================

const convocatoriasIniciales = [
  {
    id: 1,
    curso: "Análisis de datos con herramientas de IA",
    fechaInicio: "2026-10-01",
    fechaCierre: "2026-10-25",
    plazas: 30,
    estado: "Activa"
  },
  {
    id: 2,
    curso: "Lenguajes de programación: JavaScript y C#",
    fechaInicio: "2026-11-05",
    fechaCierre: "2026-11-30",
    plazas: 25,
    estado: "Próximamente"
  }
];

const cursosIniciales = [
  {
    id: 1,
    nombre: "Análisis de datos con herramientas de IA",
    descripcion:
      "Capacitación avanzada en modelos predictivos y análisis estadístico enfocado a toma de decisiones."
  },
  {
    id: 2,
    nombre: "Lenguajes de programación: JavaScript y C#",
    descripcion:
      "Fundamentos de lógica, desarrollo frontend interactivo y backend robusto orientado a objetos."
  }
];

// ==========================================
// 2. LECTURA Y PERSISTENCIA
// ==========================================

function obtenerDatos(clave, datosIniciales) {
  try {
    const datos = localStorage.getItem(clave);

    if (datos === null) {
      return datosIniciales;
    }

    const datosParseados = JSON.parse(datos);

    return Array.isArray(datosParseados)
      ? datosParseados
      : datosIniciales;

  } catch (error) {
    console.error(`Error al leer ${clave}:`, error);
    return datosIniciales;
  }
}

export function obtenerConvocatorias() {
  return obtenerDatos("convocatorias", convocatoriasIniciales);
}

export function obtenerCursos() {
  return obtenerDatos("cursos", cursosIniciales);
}

export function guardarConvocatorias(datos) {
  localStorage.setItem("convocatorias", JSON.stringify(datos));
}

export function guardarCursos(datos) {
  localStorage.setItem("cursos", JSON.stringify(datos));
}

// ==========================================
// 3. VALIDACIONES
// ==========================================

export function validarFechasConvocatoria(datos) {
  if (!datos.fechaInicio || !datos.fechaCierre) {
    return false;
  }

  return datos.fechaCierre >= datos.fechaInicio;
}

export function validarCursoDuplicado(cursos, formulario, idEditar) {
  const nombre = formulario.nombre.trim().toLowerCase();

  return cursos.some(
    (curso) =>
      curso.nombre.trim().toLowerCase() === nombre &&
      curso.id !== idEditar
  );
}

export function cursoEstaEnUso(convocatorias, curso) {
  return convocatorias.some(
    (conv) => conv.curso === curso.nombre
  );
}

// ==========================================
// 4. GESTIÓN DE CONVOCATORIAS
// ==========================================

export function guardarConvocatoria(
  convocatorias,
  formulario,
  idEditar

  
) {
    const plazas = Number(formulario.plazas);

    if (!Number.isInteger(plazas) || plazas <= 0) {
    throw new Error("La cantidad de plazas debe ser un número entero positivo.");
    }
  const nuevaData = {
    id: idEditar !== null ? idEditar : Date.now(),
    curso: formulario.curso,
    fechaInicio: formulario.fechaInicio,
    fechaCierre: formulario.fechaCierre,
    plazas: plazas,
    estado: formulario.estado
  };

  if (idEditar !== null) {
    return convocatorias.map((conv) =>
      conv.id === idEditar ? nuevaData : conv
    );
  }

  return [...convocatorias, nuevaData];
}

export function eliminarConvocatoria(convocatorias, id) {
  return convocatorias.filter((conv) => conv.id !== id);
}

// ==========================================
// 5. GESTIÓN DE CURSOS
// ==========================================

export function guardarCurso(
  cursos,
  convocatorias,
  formulario,
  idEditar
) {
  const cursoAnterior = cursos.find(
    (curso) => curso.id === idEditar
  );

  const nuevoCurso = {
    id: idEditar !== null ? idEditar : Date.now(),
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim()
  };

  let nuevosCursos;

  if (idEditar !== null) {
    nuevosCursos = cursos.map((curso) =>
      curso.id === idEditar ? nuevoCurso : curso
    );
  } else {
    nuevosCursos = [...cursos, nuevoCurso];
  }

  let nuevasConvocatorias = convocatorias;

  // Actualizar las convocatorias relacionadas
  // cuando cambia el nombre de un curso.

  if (
    cursoAnterior &&
    cursoAnterior.nombre !== nuevoCurso.nombre
  ) {
    nuevasConvocatorias = convocatorias.map((conv) =>
      conv.curso === cursoAnterior.nombre
        ? { ...conv, curso: nuevoCurso.nombre }
        : conv
    );
  }

  return {
    cursos: nuevosCursos,
    convocatorias: nuevasConvocatorias
  };
}

export function eliminarCurso(cursos, id) {
  return cursos.filter((curso) => curso.id !== id);
}

// ==========================================
// 6. EXPORTACIÓN DE CONVOCATORIAS
// ==========================================

function obtenerConvocatoriasActivas(convocatorias) {
  return convocatorias
    .filter((conv) => conv.estado === "Activa")
    .map((conv) => ({
      Curso: conv.curso,
      Fechas: `Del ${conv.fechaInicio} al ${conv.fechaCierre}`,
      Plazas: `${conv.plazas} plazas`,
      Estado: conv.estado
    }));
}

// ==========================================
// 7. DESCARGA DE ARCHIVOS
// ==========================================

function descargarArchivo(blob, nombre) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombre;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  URL.revokeObjectURL(url);
}

// ==========================================
// 8. EXPORTAR CSV
// ==========================================

export function exportarConvocatoriasCSV(convocatorias) {
  const datos = obtenerConvocatoriasActivas(convocatorias);

  if (datos.length === 0) {
    return false;
  }

  const columnas = ["Curso", "Fechas", "Plazas", "Estado"];

  const escapar = (valor) =>
    '"' + String(valor ?? "").replace(/"/g, '""') + '"';

  const contenido = [
    columnas.map(escapar).join(";"),
    ...datos.map((fila) =>
      columnas.map((columna) => escapar(fila[columna])).join(";")
    )
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + contenido], {
    type: "text/csv;charset=utf-8;"
  });

  descargarArchivo(blob, "convocatorias_activas.csv");

  return true;
}

// ==========================================
// 9. EXPORTAR EXCEL
// ==========================================

export function exportarConvocatoriasExcel(convocatorias) {
  const datos = obtenerConvocatoriasActivas(convocatorias);

  if (datos.length === 0) {
    return false;
  }

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    "Convocatorias activas"
  );

  XLSX.writeFile(libro, "convocatorias_activas.xlsx");

  return true;
}
