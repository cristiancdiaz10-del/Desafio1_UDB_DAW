// Módulo de Evaluaciones y Resultados - ProTalento

document.addEventListener('DOMContentLoaded', () => {

    // 1. Proteger la vista: Solo permite el acceso a Administradores
    if (typeof protegerVista === 'function') {
        protegerVista(['administrador', 'superadministrador']);
    }

    // 2. Obtener datos de la sesión activa
    const sesion = JSON.parse(localStorage.getItem('sesion'));
    if (!sesion) return;

    // 3. Actualizar el nombre en el encabezado
    const lblAdmin = document.getElementById('lbl-admin-topbar') || document.getElementById('lbl-usuario');
    if (lblAdmin) {
        lblAdmin.innerText = sesion.nombre; 
    }

    // 4. Elementos principales del DOM
    const seleccionarAspirante = document.getElementById("seleccionarAspirante");
    if (!seleccionarAspirante) return; // Detener si no existe el selector

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const aspirantes = usuarios.filter(u => u.rol === "usuario");

    // Limpiar y cargar opciones de aspirantes en el selector
    seleccionarAspirante.innerHTML = '<option value="">-- Seleccione un aspirante --</option>';

    aspirantes.forEach(aspirante => {
        const opcion = document.createElement("option");
        opcion.value = aspirante.email;
        opcion.textContent = aspirante.nombreCompleto || aspirante.nombre || aspirante.email;
        seleccionarAspirante.appendChild(opcion);
    });

    // 5. Soporte para cargar directamente un candidato desde "aspirantes.html"
    // Comprueba si hay una URL con ?email=... o un almacenamiento temporal "emailEvaluar"
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email') || localStorage.getItem('emailEvaluar');

    if (emailParam) {
        seleccionarAspirante.value = emailParam;
        cargarDatosAspirante(emailParam, aspirantes);
        localStorage.removeItem('emailEvaluar'); // Limpiar despues de usar
    }

    // 6. Listener para cambio manual en el selector
    seleccionarAspirante.addEventListener("change", function () {
        cargarDatosAspirante(this.value, aspirantes);
    });

    // 7. Inicializar Eventos de Estrellas
    inicializarEstrellas();

    // 8. Eventos de Botones de Decisiones
    const btnRechazar = document.getElementById("btnRechazar");
    const btnAjustes = document.getElementById("btnAjustes");
    const btnAprobar = document.getElementById("btnAprobar");
    const btnProgramar = document.getElementById("btnProgramar");

    if (btnRechazar) btnRechazar.addEventListener("click", () => registrarDecision("Rechazado", seleccionarAspirante.value));
    if (btnAjustes) btnAjustes.addEventListener("click", () => registrarDecision("Requiere ajustes", seleccionarAspirante.value));
    if (btnAprobar) btnAprobar.addEventListener("click", () => registrarDecision("Aprobado", seleccionarAspirante.value));

    // Evento de Programación
    if (btnProgramar) {
        btnProgramar.addEventListener("click", () => {
            const emailAspirante = seleccionarAspirante.value;
            const fechaEvaluacion = document.getElementById("fechaEvaluacion").value;

            if (!emailAspirante) {
                alert("Debe seleccionar un aspirante.");
                return;
            }
            if (!fechaEvaluacion) {
                alert("Debe seleccionar una fecha para la evaluación.");
                return;
            }

            let programaciones = JSON.parse(localStorage.getItem("programacionesEvaluacion")) || [];
            const indice = programaciones.findIndex(p => p.aspiranteEmail === emailAspirante);

            const nuevaProgramacion = { aspiranteEmail: emailAspirante, fechaEvaluacion: fechaEvaluacion };

            if (indice !== -1) {
                programaciones[indice] = nuevaProgramacion;
            } else {
                programaciones.push(nuevaProgramacion);
            }

            localStorage.setItem("programacionesEvaluacion", JSON.stringify(programaciones));
            alert("Evaluación programada correctamente.");
        });
    }
});

// --- FUNCIONES AUXILIARES ---

function cargarDatosAspirante(emailSeleccionado, aspirantes) {
    if (!emailSeleccionado) return;

    const aspirante = aspirantes.find(u => u.email === emailSeleccionado);
    if (!aspirante) return;

    // Renderizar información del perfil
    const elemNombre = document.getElementById("nombreCandidato");
    const elemCurso = document.getElementById("cursoCandidato");
    const elemDui = document.getElementById("duiCandidato");
    const elemTel = document.getElementById("telefonoCandidato");
    const elemCorreo = document.getElementById("correoCandidato");
    const elemDomicilio = document.getElementById("domicilioCandidato");
    const elemEdad = document.getElementById("edadCandidato");

    if (elemNombre) elemNombre.textContent = aspirante.nombreCompleto || aspirante.nombre;
    if (elemCurso) elemCurso.textContent = aspirante.curso || aspirante.cursoFormacion || "--";
    if (elemDui) elemDui.textContent = aspirante.DUI || "--";
    if (elemTel) elemTel.textContent = aspirante.telefono1 || "--";
    if (elemCorreo) elemCorreo.textContent = aspirante.email;
    if (elemDomicilio) elemDomicilio.textContent = `${aspirante.departamento || ''}, ${aspirante.municipio || ''}, ${aspirante.distrito || ''}`;
    if (elemEdad) elemEdad.textContent = aspirante.fechaNacimiento ? calcularEdad(aspirante.fechaNacimiento) : "--";

    // Cargar evaluación previa si existe
    const evaluaciones = JSON.parse(localStorage.getItem("evaluaciones")) || [];
    const evaluacionGuardada = evaluaciones.find(e => e.aspiranteEmail === emailSeleccionado);

    if (evaluacionGuardada) {
        if (document.getElementById("estadoCandidato")) document.getElementById("estadoCandidato").textContent = evaluacionGuardada.estado;
        if (document.getElementById("promedioEvaluacion")) document.getElementById("promedioEvaluacion").textContent = evaluacionGuardada.promedio.toFixed(2) + " / 5";
        if (document.getElementById("comentarios")) document.getElementById("comentarios").value = evaluacionGuardada.observaciones || "";

        if (document.getElementById("habilidades")) document.getElementById("habilidades").value = evaluacionGuardada.habilidades || 0;
        if (document.getElementById("calidadVideo")) document.getElementById("calidadVideo").value = evaluacionGuardada.calidadVideo || 0;
        if (document.getElementById("perfilAcademico")) document.getElementById("perfilAcademico").value = evaluacionGuardada.perfilAcademico || 0;

        // Pintar estrellas guardadas
        const grupos = document.querySelectorAll(".estrellas");
        grupos.forEach(grupo => {
            const criterio = grupo.getAttribute("data-criterio");
            const valor = evaluacionGuardada[criterio] || 0;
            const estrellas = grupo.querySelectorAll(".estrella");

            estrellas.forEach((est, idx) => {
                if (idx < valor) est.classList.add("seleccionada");
                else est.classList.remove("seleccionada");
            });
        });
    }

    // Cargar fecha de evaluación si existe
    const programaciones = JSON.parse(localStorage.getItem("programacionesEvaluacion")) || [];
    const prog = programaciones.find(p => p.aspiranteEmail === emailSeleccionado);
    if (document.getElementById("fechaEvaluacion")) {
        document.getElementById("fechaEvaluacion").value = prog ? prog.fechaEvaluacion : "";
    }
}

function calcularEdad(fechaNacimiento) {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return isNaN(edad) ? "--" : edad + " años";
}

function inicializarEstrellas() {
    const gruposEstrellas = document.querySelectorAll(".estrellas");

    gruposEstrellas.forEach(grupo => {
        const estrellas = grupo.querySelectorAll(".estrella");
        const criterio = grupo.getAttribute("data-criterio");

        estrellas.forEach((estrella) => {
            estrella.addEventListener("click", function () {
                const valor = parseInt(this.getAttribute("data-valor"));

                estrellas.forEach((e, idx) => {
                    if (idx < valor) e.classList.add("seleccionada");
                    else e.classList.remove("seleccionada");
                });

                const inputCriterio = document.getElementById(criterio);
                if (inputCriterio) inputCriterio.value = valor;

                calcularPromedio();
            });
        });
    });
}

function calcularPromedio() {
    const hab = parseInt(document.getElementById("habilidades")?.value || 0);
    const vid = parseInt(document.getElementById("calidadVideo")?.value || 0);
    const aca = parseInt(document.getElementById("perfilAcademico")?.value || 0);

    const promedio = (hab + vid + aca) / 3;

    const elemPromedio = document.getElementById("promedioEvaluacion");
    if (elemPromedio) elemPromedio.textContent = promedio.toFixed(2) + " / 5";
}

function registrarDecision(estado, emailAspirante) {
    if (!emailAspirante) {
        alert("Debe seleccionar un aspirante.");
        return;
    }

    const hab = parseInt(document.getElementById("habilidades")?.value || 0);
    const vid = parseInt(document.getElementById("calidadVideo")?.value || 0);
    const aca = parseInt(document.getElementById("perfilAcademico")?.value || 0);

    if (hab === 0 || vid === 0 || aca === 0) {
        alert("Debe evaluar todos los criterios antes de registrar una decisión.");
        return;
    }

    const promedio = (hab + vid + aca) / 3;
    const observaciones = document.getElementById("comentarios")?.value || "";

    const evaluacion = {
        aspiranteEmail: emailAspirante,
        habilidades: hab,
        calidadVideo: vid,
        perfilAcademico: aca,
        promedio: parseFloat(promedio.toFixed(2)),
        observaciones: observaciones,
        estado: estado
    };

    let evaluaciones = JSON.parse(localStorage.getItem("evaluaciones")) || [];
    const index = evaluaciones.findIndex(e => e.aspiranteEmail === emailAspirante);

    if (index !== -1) evaluaciones[index] = evaluacion;
    else evaluaciones.push(evaluacion);

    localStorage.setItem("evaluaciones", JSON.stringify(evaluaciones));

    if (document.getElementById("estadoCandidato")) {
        document.getElementById("estadoCandidato").textContent = estado;
    }

    alert(`Evaluación registrada correctamente con el estado: ${estado}`);
}