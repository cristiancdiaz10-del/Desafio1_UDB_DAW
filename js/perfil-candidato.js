// Módulo de Evaluaciones y Resultados - ProTalento

function iniciarPerfilCandidato() {

    //Proteger la vista: Solo permite el acceso a Administradores
    if (typeof protegerVista === 'function') {
        protegerVista(['administrador', 'superadministrador']);
    }

    //Obtener datos de la sesión activa
    const sesion = JSON.parse(localStorage.getItem('sesion'));
    if (!sesion) return;

    //Actualizar el nombre en el encabezado
    const lblAdmin = document.getElementById('lbl-admin-topbar') || document.getElementById('lbl-usuario');
    if (lblAdmin) {
        lblAdmin.innerText = sesion.nombre; 
    }

    //Elementos principales del DOM
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

    //Soporte para cargar directamente un candidato
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email') || localStorage.getItem('emailEvaluar');

    const aspiranteGuardado =
        JSON.parse(localStorage.getItem("aspiranteEvaluar"));

    const emailAspiranteGuardado =
        aspiranteGuardado ? aspiranteGuardado.email : null;

    const emailSeleccionadoInicial =
        emailParam || emailAspiranteGuardado;

    if (emailSeleccionadoInicial) {
        seleccionarAspirante.value = emailSeleccionadoInicial;
        cargarDatosAspirante(emailSeleccionadoInicial, aspirantes);

        localStorage.removeItem('emailEvaluar');
        localStorage.removeItem('aspiranteEvaluar');
    }

    //Listener para cambio manual en el selector
    seleccionarAspirante.addEventListener("change", function () {
        cargarDatosAspirante(this.value, aspirantes);
    });

    //Inicializar Eventos de Estrellas
    inicializarEstrellas();

    //Eventos de Botones de Decisiones
    const btnRechazar = document.getElementById("btnRechazar");
    const btnAjustes = document.getElementById("btnAjustes");
    const btnAprobar = document.getElementById("btnAprobar");
    const btnProgramar = document.getElementById("btnProgramar");

    if (btnRechazar) {
    btnRechazar.addEventListener("click", async () => {
        const emailAspirante = seleccionarAspirante.value;

        if (!emailAspirante) {
            mostrarError(
                "Aspirante no seleccionado",
                "Selecciona un aspirante antes de rechazarlo."
            );
            return;
        }

        const nombreAspirante =
            seleccionarAspirante.options[seleccionarAspirante.selectedIndex].text;

        const confirmado = await confirmarRechazo(nombreAspirante);

        if (confirmado) {
            registrarDecision("Rechazado", emailAspirante);
        }
    });
}

    if (btnAjustes) {
        btnAjustes.addEventListener("click", () =>
            registrarDecision("Requiere ajustes", seleccionarAspirante.value)
        );
    }

    if (btnAprobar) {
    btnAprobar.addEventListener("click", async () => {
        const emailAspirante = seleccionarAspirante.value;

        if (!emailAspirante) {
            mostrarError(
                "Aspirante no seleccionado",
                "Selecciona un aspirante antes de aprobarlo."
            );
            return;
        }

        const nombreAspirante =
            seleccionarAspirante.options[seleccionarAspirante.selectedIndex].text;

        const confirmado = await confirmarAprobacion(nombreAspirante);

        if (confirmado) {
            registrarDecision("Aprobado", emailAspirante);
        }
    });
}

    // Evento de Programación (Sincronizado con el usuario)
if (btnProgramar) {
    btnProgramar.addEventListener("click", () => {
        const emailAspirante = seleccionarAspirante.value;
        const fechaEvaluacion = document.getElementById("fechaEvaluacion").value;

        if (!emailAspirante) {
            Swal.fire({
            icon: 'warning',
            title: 'Aspirante no seleccionado',
            text: 'Selecciona un aspirante antes de continuar.',
            confirmButtonText: 'Entendido'
            });
            return;
        }

        if (!fechaEvaluacion) {
            Swal.fire({
            icon: 'warning',
            title: 'Fecha requerida',
            text: 'Selecciona una fecha para la evaluación.',
            confirmButtonText: 'Entendido'
            });
            return;
        }

        // 1. Guardar en 'programacionesEvaluacion'
        let programaciones = JSON.parse(localStorage.getItem("programacionesEvaluacion")) || [];
        const indiceProg = programaciones.findIndex(p => p.aspiranteEmail === emailAspirante);

        const nuevaProgramacion = {
            aspiranteEmail: emailAspirante,
            fechaEvaluacion: fechaEvaluacion
        };

        if (indiceProg !== -1) {
            programaciones[indiceProg] = nuevaProgramacion;
        } else {
            programaciones.push(nuevaProgramacion);
        }

        localStorage.setItem("programacionesEvaluacion", JSON.stringify(programaciones));

        // 2. Sincronizar directamente con el perfil del usuario en 'usuarios'
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const indiceUsuario = usuarios.findIndex(u => u.email === emailAspirante);

        if (indiceUsuario !== -1) {
            usuarios[indiceUsuario].fechaEvaluacion = fechaEvaluacion;
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }

        Swal.fire({
        icon: 'success',
        title: '¡Programación exitosa!',
        text: 'La evaluación se programó correctamente.',
        confirmButtonText: 'Aceptar'
        });
    });
}

// Completar validación y pasar a Entrevista Virtual (Etapa 4)
const btnCompletarValidacion = document.getElementById("btnCompletarValidacion");

if (btnCompletarValidacion) {
    btnCompletarValidacion.addEventListener("click", () => {
        const emailAspirante = seleccionarAspirante.value;

        if (!emailAspirante) {
            Swal.fire({
            icon: 'warning',
            title: 'Aspirante no seleccionado',
            text: 'Selecciona un aspirante antes de continuar.',
            confirmButtonText: 'Entendido'
            });
            return;
        }

        // Avanza a la Etapa 4: Entrevista Virtual
        if (avanzarAspirante(4, "En entrevista")) {
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const aspirante = usuarios.find(u => u.email === emailAspirante);
            if (aspirante) actualizarBotonesEtapa(aspirante);
            
            const estadoCandidato = document.getElementById("estadoCandidato");

            if (estadoCandidato) {
                estadoCandidato.textContent = "Entrevista Virtual";
            }

            Swal.fire({
            icon: 'success',
            title: 'Validación completada',
            text: 'El aspirante ha avanzado a Entrevista Virtual (Etapa 4).',
            confirmButtonText: 'Continuar'
            });
        }
    });
}

// Completar entrevista y pasar a Pruebas Psicométricas (Etapa 5)
const btnCompletarEntrevista = document.getElementById("btnCompletarEntrevista");

if (btnCompletarEntrevista) {
    btnCompletarEntrevista.addEventListener("click", () => {
        const emailAspirante = seleccionarAspirante.value;

        if (!emailAspirante) {
            Swal.fire({
            icon: 'warning',
            title: 'Aspirante no seleccionado',
            text: 'Selecciona un aspirante antes de continuar.',
            confirmButtonText: 'Entendido'
            });
            return;
        }

        // Avanza a la Etapa 5: Pruebas Psicométricas
        if (avanzarAspirante(5, "En psicométricas")) {
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const aspirante = usuarios.find(u => u.email === emailAspirante);
            if (aspirante) actualizarBotonesEtapa(aspirante);
            
            const estadoCandidato = document.getElementById("estadoCandidato");

            if (estadoCandidato) {
                estadoCandidato.textContent = "Pruebas Psicométricas";
            }

            Swal.fire({
            icon: 'success',
            title: 'Entrevista completada',
            text: 'El aspirante ha avanzado a Pruebas Psicométricas (Etapa 5).',
            confirmButtonText: 'Continuar'
            });
        }
    });
}

// Completar psicométricas y pasar a Prueba Técnica (Etapa 6)
const btnCompletarPsicometrica = document.getElementById("btnCompletarPsicometrica");

if (btnCompletarPsicometrica) {
    btnCompletarPsicometrica.addEventListener("click", () => {
        const emailAspirante = seleccionarAspirante.value;

        if (!emailAspirante) {
            Swal.fire({
            icon: 'warning',
            title: 'Aspirante no seleccionado',
            text: 'Selecciona un aspirante antes de continuar.',
            confirmButtonText: 'Entendido'
            });
            return;
        }

        // Avanza a la Etapa 6: Prueba Técnica
        if (avanzarAspirante(6, "En prueba técnica")) {
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const aspirante = usuarios.find(u => u.email === emailAspirante);
            if (aspirante) actualizarBotonesEtapa(aspirante);
            
            const estadoCandidato = document.getElementById("estadoCandidato");

            if (estadoCandidato) {
                estadoCandidato.textContent = "Prueba Técnica";
            }

            Swal.fire({
            icon: 'success',
            title: 'Evaluación completada',
            text: 'El aspirante ha avanzado a Prueba Técnica (Etapa 6).',
            confirmButtonText: 'Continuar'
            });
        }
    });
}
    // Aprobar candidato al finalizar la etapa Técnica
const btnAprobarFinal = document.getElementById("btnAprobarFinal");

if (btnAprobarFinal) {
    btnAprobarFinal.addEventListener("click", async () => {
        const emailAspirante = seleccionarAspirante.value;

        if (!emailAspirante) {
            Swal.fire({
            icon: 'warning',
            title: 'Aspirante no seleccionado',
            text: 'Selecciona un aspirante antes de aprobarlo.',
            confirmButtonText: 'Entendido'
            });
            return;
        }

        const usuariosActuales =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        const indice = usuariosActuales.findIndex(
            usuario => usuario.email === emailAspirante
        );

        if (indice === -1) {
            mostrarError(
                "Aspirante no encontrado",
                "No fue posible encontrar el aspirante seleccionado."
            );
            return;
        }

        const nombreAspirante =
            seleccionarAspirante.options[seleccionarAspirante.selectedIndex].text;

        const confirmado = await confirmarAprobacion(nombreAspirante);

        if (!confirmado) return;

        usuariosActuales[indice].resultadoFinal = "Seleccionado/a";
        usuariosActuales[indice].estado = "Seleccionado/a";

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosActuales)
        );

        const estadoCandidato =
            document.getElementById("estadoCandidato");

        if (estadoCandidato) {
            estadoCandidato.textContent = "Seleccionado/a";
        }

        mostrarExito(
            "Aspirante aprobado",
            "El aspirante ha sido seleccionado exitosamente."
        );
    });
}

// Denegar candidato al finalizar la etapa Técnica
const btnDenegarFinal = document.getElementById("btnDenegarFinal");

if (btnDenegarFinal) {
    btnDenegarFinal.addEventListener("click", async () => {
        const emailAspirante = seleccionarAspirante.value;

        if (!emailAspirante) {
            mostrarError(
                "Aspirante no seleccionado",
                "Selecciona un aspirante antes de rechazarlo."
            );
            return;
        }

        const usuariosActuales =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        const indice = usuariosActuales.findIndex(
            usuario => usuario.email === emailAspirante
        );

        if (indice === -1) {
            mostrarError(
                "Aspirante no encontrado",
                "No fue posible encontrar el aspirante seleccionado."
            );
            return;
        }

        const nombreAspirante =
            seleccionarAspirante.options[seleccionarAspirante.selectedIndex].text;

        const confirmado = await confirmarRechazo(nombreAspirante);

        if (!confirmado) return;

        usuariosActuales[indice].resultadoFinal = "No seleccionado/a";
        usuariosActuales[indice].estado = "No seleccionado/a";

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosActuales)
        );

        const estadoCandidato =
            document.getElementById("estadoCandidato");

        if (estadoCandidato) {
            estadoCandidato.textContent = "No seleccionado/a";
        }

        mostrarExito(
            "Aspirante rechazado",
            "El/la aspirante no ha sido seleccionado/a."
        );
    });
}
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPerfilCandidato);
} else {
    iniciarPerfilCandidato();
}

// --- FUNCIONES AUXILIARES ---

function cargarDatosAspirante(emailSeleccionado, aspirantes) {

    if (!emailSeleccionado) return;

    const aspirante =
        aspirantes.find(u => u.email === emailSeleccionado);

    if (!aspirante) return;
    actualizarBotonesEtapa(aspirante);

    // Renderizar información del perfil
    const elemNombre = document.getElementById("nombreCandidato");
    const elemCurso = document.getElementById("cursoCandidato");
    const elemDui = document.getElementById("duiCandidato");
    const elemTel = document.getElementById("telefonoCandidato");
    const elemCorreo = document.getElementById("correoCandidato");
    const elemDomicilio = document.getElementById("domicilioCandidato");
    const elemEdad = document.getElementById("edadCandidato");

    if (elemNombre) {
        elemNombre.textContent =
            aspirante.nombreCompleto || aspirante.nombre;
    }

    if (elemCurso) {
        elemCurso.textContent =
            aspirante.curso ||
            aspirante.cursoFormacion ||
            "--";
    }

    if (elemDui) {
        elemDui.textContent =
            aspirante.DUI || "--";
    }

    if (elemTel) {
        elemTel.textContent =
            aspirante.telefono1 ||
            aspirante.telefono ||
            "--";
    }

    if (elemCorreo) {
        elemCorreo.textContent =
            aspirante.email;
    }

    if (elemDomicilio) {
        elemDomicilio.textContent =
            `${aspirante.departamento || ''}, ${aspirante.municipio || ''}, ${aspirante.distrito || ''}`;
    }

    if (elemEdad) {
        elemEdad.textContent =
            aspirante.fechaNacimiento
                ? calcularEdad(aspirante.fechaNacimiento)
                : "--";
    }

    // Cargar evaluación previa si existe
    const evaluaciones =
        JSON.parse(localStorage.getItem("evaluaciones")) || [];

    const evaluacionGuardada =
        evaluaciones.find(
            e => e.aspiranteEmail === emailSeleccionado
        );

    // Limpiar los datos de la evaluación anterior
    document.getElementById("habilidades").value = 0;
    document.getElementById("calidadVideo").value = 0;
    document.getElementById("perfilAcademico").value = 0;
    document.getElementById("comentarios").value = "";

    document.getElementById("promedioEvaluacion").textContent = "0.00 / 5";

    document.querySelectorAll(".estrella").forEach(estrella => {
    estrella.classList.remove("seleccionada");
    });

    if (evaluacionGuardada) {

        const estadoCandidato =
            document.getElementById("estadoCandidato");

        if (estadoCandidato) {
            estadoCandidato.textContent =
                evaluacionGuardada.estado;
        }

        const promedioEvaluacion =
            document.getElementById("promedioEvaluacion");

        if (promedioEvaluacion) {
            promedioEvaluacion.textContent =
                evaluacionGuardada.promedio.toFixed(2) + " / 5";
        }

        const comentarios =
            document.getElementById("comentarios");

        if (comentarios) {
            comentarios.value =
                evaluacionGuardada.observaciones || "";
        }

        const habilidades =
            document.getElementById("habilidades");

        if (habilidades) {
            habilidades.value =
                evaluacionGuardada.habilidades || 0;
        }

        const calidadVideo =
            document.getElementById("calidadVideo");

        if (calidadVideo) {
            calidadVideo.value =
                evaluacionGuardada.calidadVideo || 0;
        }

        const perfilAcademico =
            document.getElementById("perfilAcademico");

        if (perfilAcademico) {
            perfilAcademico.value =
                evaluacionGuardada.perfilAcademico || 0;
        }

        // Pintar estrellas guardadas
        const grupos =
            document.querySelectorAll(".estrellas");

        grupos.forEach(grupo => {

            const criterio =
                grupo.getAttribute("data-criterio");

            const valor =
                evaluacionGuardada[criterio] || 0;

            const estrellas =
                grupo.querySelectorAll(".estrella");

            estrellas.forEach((est, idx) => {

                if (idx < valor) {
                    est.classList.add("seleccionada");
                } else {
                    est.classList.remove("seleccionada");
                }

            });
        });
    }

    // Cargar fecha de evaluación si existe
    const programaciones =
        JSON.parse(localStorage.getItem("programacionesEvaluacion")) || [];

    const prog =
        programaciones.find(
            p => p.aspiranteEmail === emailSeleccionado
        );

    const fechaEvaluacion =
        document.getElementById("fechaEvaluacion");

    if (fechaEvaluacion) {
        fechaEvaluacion.value =
            prog ? prog.fechaEvaluacion : "";
    }
}

function calcularEdad(fechaNacimiento) {

    const nacimiento =
        new Date(fechaNacimiento);

    const hoy =
        new Date();

    let edad =
        hoy.getFullYear() -
        nacimiento.getFullYear();

    const mes =
        hoy.getMonth() -
        nacimiento.getMonth();

    if (
        mes < 0 ||
        (mes === 0 &&
            hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    return isNaN(edad)
        ? "--"
        : edad + " años";
}

function inicializarEstrellas() {

    const gruposEstrellas =
        document.querySelectorAll(".estrellas");

    gruposEstrellas.forEach(grupo => {

        const estrellas =
            grupo.querySelectorAll(".estrella");

        const criterio =
            grupo.getAttribute("data-criterio");

        estrellas.forEach(estrella => {

            estrella.addEventListener("click", function () {

                const valor =
                    parseInt(
                        this.getAttribute("data-valor")
                    );

                estrellas.forEach((e, idx) => {

                    if (idx < valor) {
                        e.classList.add("seleccionada");
                    } else {
                        e.classList.remove("seleccionada");
                    }

                });

                const inputCriterio =
                    document.getElementById(criterio);

                if (inputCriterio) {
                    inputCriterio.value = valor;
                }

                calcularPromedio();
            });
        });
    });
}

function calcularPromedio() {

    const hab =
        parseInt(
            document.getElementById("habilidades")?.value || 0
        );

    const vid =
        parseInt(
            document.getElementById("calidadVideo")?.value || 0
        );

    const aca =
        parseInt(
            document.getElementById("perfilAcademico")?.value || 0
        );

    const promedio =
        (hab + vid + aca) / 3;

    const elemPromedio =
        document.getElementById("promedioEvaluacion");

    if (elemPromedio) {
        elemPromedio.textContent =
            promedio.toFixed(2) + " / 5";
    }
}

function avanzarAspirante(etapa, estado) {

    const seleccionarAspirante =
        document.getElementById("seleccionarAspirante");

    if (!seleccionarAspirante) {
        return false;
    }

    const emailAspirante =
        seleccionarAspirante.value;

    const usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const indice =
        usuarios.findIndex(
            usuario => usuario.email === emailAspirante
        );

    if (indice === -1) {
        return false;
    }

    usuarios[indice].etapaActual = etapa;
    usuarios[indice].estado = estado;

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    return true;
}

function actualizarBotonesEtapa(aspirante) {
    const botonesPorEtapa = [
        { id: "btnCompletarValidacion", etapa: 3 },
        { id: "btnCompletarEntrevista", etapa: 4 },
        { id: "btnCompletarPsicometrica", etapa: 5 }
    ];

    const etapaActual = Number(aspirante?.etapaActual || 2);
    const procesoFinalizado = [
        "Seleccionado/a",
        "No seleccionado/a",
        "Rechazado"
    ].includes(aspirante?.resultadoFinal || aspirante?.estado);

    botonesPorEtapa.forEach(({ id, etapa }) => {
        const boton = document.getElementById(id);

        if (boton) {
            boton.classList.toggle(
                "d-none",
                procesoFinalizado || etapaActual > etapa
            );
        }
    });

    // Aprobar o denegar al terminar la prueba técnica
    ["btnAprobarFinal", "btnDenegarFinal"].forEach(id => {
        const boton = document.getElementById(id);

        if (boton) {
            boton.classList.toggle(
                "d-none",
                procesoFinalizado || etapaActual < 6
            );
        }
    });
}

function registrarDecision(estado, emailAspirante) {

    if (!emailAspirante) {
        Swal.fire({
        icon: 'warning',
        title: 'Aspirante no seleccionado',
        text: 'Selecciona un aspirante antes de continuar.',
        confirmButtonText: 'Entendido'
        });
        return;
    }

    const hab =
        parseInt(
            document.getElementById("habilidades")?.value || 0
        );

    const vid =
        parseInt(
            document.getElementById("calidadVideo")?.value || 0
        );

    const aca =
        parseInt(
            document.getElementById("perfilAcademico")?.value || 0
        );

    if (hab === 0 || vid === 0 || aca === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Criterios no evaluados',
            text: 'Debe evaluar todos los criterios antes de registrar una decisión.',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    const promedio =
        (hab + vid + aca) / 3;

    const observaciones =
        document.getElementById("comentarios")?.value || "";

    const evaluacion = {
        aspiranteEmail: emailAspirante,
        habilidades: hab,
        calidadVideo: vid,
        perfilAcademico: aca,
        promedio: parseFloat(promedio.toFixed(2)),
        observaciones: observaciones,
        estado: estado
    };

    let evaluaciones =
        JSON.parse(localStorage.getItem("evaluaciones")) || [];

    const index =
        evaluaciones.findIndex(
            e => e.aspiranteEmail === emailAspirante
        );

    if (index !== -1) {
        evaluaciones[index] = evaluacion;
    } else {
        evaluaciones.push(evaluacion);
    }

    localStorage.setItem(
        "evaluaciones",
        JSON.stringify(evaluaciones)
    );

    // Sincronizar el estado del aspirante
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const indiceAspirante = usuarios.findIndex(
    u => u.email === emailAspirante
    );

    if (indiceAspirante !== -1) {
    usuarios[indiceAspirante].estado = estado;

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );
    }

    const estadoCandidato =
        document.getElementById("estadoCandidato");

    if (estadoCandidato) {
        estadoCandidato.textContent = estado;
    }

    Swal.fire({
    icon: 'success',
    title: 'Evaluación registrada',
    text: `Evaluación registrada correctamente con el estado: ${estado}`,
    confirmButtonText: 'Aceptar'
    });
}
