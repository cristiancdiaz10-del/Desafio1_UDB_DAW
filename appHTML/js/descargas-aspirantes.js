//Módulo de descarga de perfiles individuales en PDF para ProTalento.
 
(function () {
    "use strict";

    const STORAGE_KEY = "usuarios";
    const TABLE_BODY_ID = "tablaAspirantesBody";

    function obtenerUsuarios() {
        try {
            const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            console.error("No se pudieron leer los usuarios guardados.", error);
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
        if (dato === null || dato === undefined || String(dato).trim() === "") {
            return "No registrado";
        }
        return String(dato).trim();
    }

    function fechaLegible(fecha) {
        if (!fecha) return "No registrada";
        const partes = String(fecha).split("-");
        if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
        return fecha;
    }

    function descargarPerfilPDF(email) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("No se pudo cargar la herramienta para generar PDF. Verifica tu conexión a internet y recarga la página.");
            return;
        }

        const aspirante = obtenerUsuarios().find(function (usuario) {
            return (usuario.email || "").toLowerCase() === String(email || "").toLowerCase()
                && usuario.rol === "usuario";
        });

        if (!aspirante) {
            alert("No se encontró el perfil del aspirante seleccionado.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        const margenIzquierdo = 18;
        const margenDerecho = 18;
        const anchoUtil = 210 - margenIzquierdo - margenDerecho;
        const altoPagina = 297;
        let y = 20;

        function asegurarEspacio(altura) {
            if (y + altura > altoPagina - 18) {
                pdf.addPage();
                y = 20;
            }
        }

        function encabezadoSeccion(titulo) {
            asegurarEspacio(13);
            y += 4;
            pdf.setFillColor(230, 238, 248);
            pdf.roundedRect(margenIzquierdo, y - 5, anchoUtil, 9, 1.5, 1.5, "F");
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
            asegurarEspacio(lineas.length * 5 + 2);
            pdf.text(lineas, margenIzquierdo + 2, y);
            y += lineas.length * 5 + 1.5;
        }

        // Encabezado
        pdf.setFillColor(28, 67, 110);
        pdf.rect(0, 0, 210, 34, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("ProTalento", margenIzquierdo, 15);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text("Perfil individual del aspirante", margenIzquierdo, 23);
        pdf.setFontSize(8.5);
        pdf.text(`Generado: ${new Date().toLocaleDateString("es-SV")}`, margenIzquierdo, 29);
        y = 43;
        pdf.setTextColor(35, 35, 35);

        // Datos principales
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        const nombre = valor(aspirante.nombreCompleto);
        const nombreLineas = pdf.splitTextToSize(nombre, anchoUtil);
        pdf.text(nombreLineas, margenIzquierdo, y);
        y += nombreLineas.length * 7 + 2;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        pdf.text(`Correo: ${valor(aspirante.email)}`, margenIzquierdo, y);
        y += 6;
        pdf.text(`Curso de interés: ${valor(aspirante.curso || aspirante.cursoFormacion)}`, margenIzquierdo, y);
        y += 5;
        pdf.setTextColor(35, 35, 35);

        encabezadoSeccion("1. Información personal");
        campo("Fecha de nacimiento", fechaLegible(aspirante.fechaNacimiento));
        campo("Sexo", aspirante.sexo);
        campo("DUI", aspirante.DUI);
        campo("NIT", aspirante.NIT);
        campo("Discapacidad", aspirante.discapacidad);

        encabezadoSeccion("2. Ubicación y contacto");
        campo("Departamento", aspirante.departamento);
        campo("Municipio", aspirante.municipio);
        campo("Distrito", aspirante.distrito);
        campo("Teléfono principal", aspirante.telefono1 || aspirante.telefono);
        campo("Teléfono alternativo", aspirante.telefono2);
        campo("Medio de contacto preferido", aspirante.medioPreferido);

        encabezadoSeccion("3. Formación y situación actual");
        campo("Nivel educativo", aspirante.nivelEducativo);
        campo("Situación actual", aspirante.situacionActual);
        campo("Curso de interés", aspirante.curso || aspirante.cursoFormacion);
        campo("Interés en vinculación laboral", aspirante.vinculacionLaboral);

        encabezadoSeccion("4. Acceso y competencias digitales");
        campo("Acceso a internet", aspirante.internet);
        campo("Acceso a computadora", aspirante.computadora);
        campo("Dominio de computadora", aspirante.dominioComputadora);

        encabezadoSeccion("5. Estado de la solicitud");
        campo("Estado", aspirante.estado || "Postulado");
        campo("CV adjuntado", aspirante.cvAdjuntado ? "Sí" : "No registrado");
        campo("Vídeo adjuntado", aspirante.videoAdjuntado ? "Sí" : "No registrado");

        // Pie de página numerado en todas las páginas.
        const totalPaginas = pdf.getNumberOfPages();
        for (let pagina = 1; pagina <= totalPaginas; pagina++) {
            pdf.setPage(pagina);
            pdf.setDrawColor(210, 215, 220);
            pdf.line(margenIzquierdo, altoPagina - 13, 210 - margenDerecho, altoPagina - 13);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text("Documento de uso administrativo. Contiene datos personales.", margenIzquierdo, altoPagina - 7);
            pdf.text(`Página ${pagina} de ${totalPaginas}`, 210 - margenDerecho, altoPagina - 7, { align: "right" });
        }

        pdf.save(`perfil_${limpiarNombreArchivo(aspirante.nombreCompleto)}.pdf`);
    }

    // Agrega el botón a cada fila cuando la tabla de aspirantes se renderiza.
    function agregarBotonesDescarga() {
        const tbody = document.getElementById(TABLE_BODY_ID);
        if (!tbody) return;

        tbody.querySelectorAll("tr").forEach(function (fila) {
            const celdas = fila.querySelectorAll("td");
            if (celdas.length < 5 || fila.querySelector(".btn-descargar-perfil")) return;

            const botonEvaluar = celdas[4].querySelector("button");
            const email = botonEvaluar && botonEvaluar.getAttribute("onclick")
                ? (botonEvaluar.getAttribute("onclick").match(/evaluarAspirante\(['"](.+?)['"]\)/) || [])[1]
                : null;

            if (!email) return;

            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "btn btn-sm btn-outline-success btn-descargar-perfil ms-1";
            boton.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> PDF';
            boton.title = "Descargar perfil en PDF";
            boton.setAttribute("data-email-aspirante", email);
            boton.addEventListener("click", function () {
                descargarPerfilPDF(this.getAttribute("data-email-aspirante"));
            });
            celdas[4].appendChild(boton);
        });
    }

    function iniciarModulo() {
        const tbody = document.getElementById(TABLE_BODY_ID);
        if (!tbody) return;

        agregarBotonesDescarga();
        const observador = new MutationObserver(agregarBotonesDescarga);
        observador.observe(tbody, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarModulo);
    } else {
        iniciarModulo();
    }

    // Exponer función por si se necesita invocarla desde otra vista.
    window.descargarPerfilPDF = descargarPerfilPDF;
})();
