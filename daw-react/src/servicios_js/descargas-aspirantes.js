// Módulo para generar y descargar el perfil individual de un aspirante en PDF.

import { jsPDF } from "jspdf";

const STORAGE_KEY = "usuarios";

function obtenerUsuarios() {
    try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error("No se pudieron leer los usuarios guardados:", error);
        return [];
    }
}

function limpiarNombreArchivo(nombre) {
    return (nombre || "aspirante")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase() || "aspirante";
}

function valor(dato) {
    if (
        dato === null ||
        dato === undefined ||
        String(dato).trim() === ""
    ) {
        return "No registrado";
    }

    return String(dato).trim();
}

function fechaLegible(fecha) {
    if (!fecha) return "No registrada";

    const partes = String(fecha).split("-");

    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return fecha;
}

function obtenerAspirante(referencia) {
    // Permite recibir directamente el objeto desde React.
    if (referencia && typeof referencia === "object") {
        if (referencia.rol !== "usuario") return null;
        return referencia;
    }

    // También permite buscar al aspirante por correo.
    if (typeof referencia === "string") {
        return obtenerUsuarios().find(usuario =>
            usuario.rol === "usuario" &&
            (usuario.email || "").toLowerCase() === referencia.toLowerCase()
        ) || null;
    }

    return null;
}

/**
 * Genera y descarga el perfil individual de un aspirante en PDF.
 *
 * @param {Object|string} referencia Objeto del aspirante o correo electrónico.
 * @returns {boolean} Indica si se inició correctamente la descarga.
 */
export function descargarPerfilPDF(referencia) {
    try {
        const aspirante = obtenerAspirante(referencia);

        if (!aspirante) {
            console.error("No se encontró el perfil del aspirante.");
            return false;
        }

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const anchoPagina = 210;
        const altoPagina = 297;
        const margenIzquierdo = 18;
        const margenDerecho = 18;
        const anchoUtil = anchoPagina - margenIzquierdo - margenDerecho;

        let y = 43;

        function asegurarEspacio(alturaNecesaria) {
            if (y + alturaNecesaria > altoPagina - 18) {
                pdf.addPage();
                y = 20;
            }
        }

        function encabezadoSeccion(titulo) {
            asegurarEspacio(15);

            y += 3;

            pdf.setFillColor(230, 238, 248);
            pdf.roundedRect(
                margenIzquierdo,
                y - 5,
                anchoUtil,
                9,
                1.5,
                1.5,
                "F"
            );

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(11);
            pdf.setTextColor(35, 67, 105);

            pdf.text(titulo, margenIzquierdo + 3, y + 1);

            y += 9;

            pdf.setTextColor(35, 35, 35);
        }

        function campo(etiqueta, dato) {
            const texto = `${etiqueta}: ${valor(dato)}`;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9.5);

            const lineas = pdf.splitTextToSize(texto, anchoUtil - 2);
            const alturaTexto = lineas.length * 5 + 2;

            asegurarEspacio(alturaTexto);

            pdf.text(lineas, margenIzquierdo + 2, y);

            y += alturaTexto;
        }

        // Encabezado del documento.
        pdf.setFillColor(28, 67, 110);
        pdf.rect(0, 0, anchoPagina, 34, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);

        pdf.text("ProTalento", margenIzquierdo, 15);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);

        pdf.text("Perfil individual del aspirante", margenIzquierdo, 23);

        pdf.setFontSize(8.5);

        pdf.text(
            `Generado: ${new Date().toLocaleDateString("es-SV")}`,
            margenIzquierdo,
            29
        );

        // Información principal.
        pdf.setTextColor(35, 35, 35);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);

        const nombre = valor(
            aspirante.nombreCompleto || aspirante.nombre
        );

        const nombreLineas = pdf.splitTextToSize(nombre, anchoUtil);

        pdf.text(nombreLineas, margenIzquierdo, y);

        y += nombreLineas.length * 7 + 2;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);

        pdf.text(
            `Correo: ${valor(aspirante.email)}`,
            margenIzquierdo,
            y
        );

        y += 6;

        pdf.text(
            `Curso de interés: ${valor(
                aspirante.cursoInteres ||
                aspirante.curso ||
                aspirante.cursoFormacion
            )}`,
            margenIzquierdo,
            y
        );

        y += 8;
        pdf.setTextColor(35, 35, 35);

        // 1. Información personal.
        encabezadoSeccion("1. Información personal");

        campo("Fecha de nacimiento", fechaLegible(aspirante.fechaNacimiento));
        campo("Sexo", aspirante.sexo);
        campo("DUI", aspirante.DUI);
        campo("NIT", aspirante.NIT);
        campo("Discapacidad", aspirante.discapacidad);

        // 2. Ubicación y contacto.
        encabezadoSeccion("2. Ubicación y contacto");

        campo("Departamento", aspirante.departamento);
        campo("Municipio", aspirante.municipio);
        campo("Distrito", aspirante.distrito);
        campo("Teléfono principal", aspirante.telefono1 || aspirante.telefono);
        campo("Teléfono alternativo", aspirante.telefono2);
        campo("Medio de contacto preferido", aspirante.medioPreferido);

        // 3. Formación y situación actual.
        encabezadoSeccion("3. Formación y situación actual");

        campo("Nivel educativo", aspirante.nivelEducativo);
        campo("Situación actual", aspirante.situacionActual);
        campo(
            "Curso de interés",
            aspirante.cursoInteres ||
            aspirante.curso ||
            aspirante.cursoFormacion
        );
        campo("Interés en vinculación laboral", aspirante.vinculacionLaboral);

        // 4. Acceso y competencias digitales.
        encabezadoSeccion("4. Acceso y competencias digitales");

        campo("Acceso a internet", aspirante.internet);
        campo("Acceso a computadora", aspirante.computadora);
        campo("Dominio de computadora", aspirante.dominioComputadora);

        // 5. Estado de la solicitud.
        encabezadoSeccion("5. Estado de la solicitud");

        campo("Estado", aspirante.estado || "Postulado");
        campo("Etapa actual", aspirante.etapaActual || 2);
        campo("CV adjuntado", aspirante.cvAdjuntado ? "Sí" : "No");
        campo("Nombre del CV", aspirante.cvNombreArchivo);
        campo("Vídeo adjuntado", aspirante.videoAdjuntado ? "Sí" : "No");
        campo("Nombre del vídeo", aspirante.videoNombreArchivo);

        // Pie de página de todas las páginas.
        const totalPaginas = pdf.getNumberOfPages();

        for (let pagina = 1; pagina <= totalPaginas; pagina++) {
            pdf.setPage(pagina);

            pdf.setDrawColor(210, 215, 220);

            pdf.line(
                margenIzquierdo,
                altoPagina - 13,
                anchoPagina - margenDerecho,
                altoPagina - 13
            );

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);

            pdf.text(
                "Documento de uso administrativo. Contiene datos personales.",
                margenIzquierdo,
                altoPagina - 7
            );

            pdf.text(
                `Página ${pagina} de ${totalPaginas}`,
                anchoPagina - margenDerecho,
                altoPagina - 7,
                { align: "right" }
            );
        }

        const nombreArchivo = limpiarNombreArchivo(
            aspirante.nombreCompleto || aspirante.nombre
        );

        pdf.save(`perfil_${nombreArchivo}.pdf`);

        return true;
    } catch (error) {
        console.error("Error al generar el PDF del aspirante:", error);
        return false;
    }
}