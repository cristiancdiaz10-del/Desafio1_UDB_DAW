// Módulo de Evaluaciones y Resultados - ProTalento

// Cargar aspirantes registrados

var seleccionarAspirante = document.getElementById("seleccionarAspirante");

var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

var aspirantes = usuarios.filter(function(usuario) {
    return usuario.rol === "usuario";
});

// Agregar los aspirantes al selector
for (var i = 0; i < aspirantes.length; i++) {

    var opcion = document.createElement("option");

    opcion.value = aspirantes[i].email;
    opcion.textContent = aspirantes[i].nombreCompleto;

    seleccionarAspirante.appendChild(opcion);
}

// Mostrar información del aspirante seleccionado
seleccionarAspirante.addEventListener("change", function () {

    var emailSeleccionado = seleccionarAspirante.value;

    var aspiranteSeleccionado = aspirantes.find(function(aspirante) {
        return aspirante.email === emailSeleccionado;
    });

    if (!aspiranteSeleccionado) {
        return;
    }

    document.getElementById("nombreCandidato").textContent =
        aspiranteSeleccionado.nombreCompleto;

    document.getElementById("cursoCandidato").textContent =
        aspiranteSeleccionado.cursoFormacion;

    document.getElementById("duiCandidato").textContent =
        aspiranteSeleccionado.numeroDUI || "--";

    document.getElementById("telefonoCandidato").textContent =
        aspiranteSeleccionado.numeroTelefono || "--";

    document.getElementById("correoCandidato").textContent =
        aspiranteSeleccionado.email;

    document.getElementById("domicilioCandidato").textContent =
        aspiranteSeleccionado.departamento + ", " +
        aspiranteSeleccionado.municipio + ", " +
        aspiranteSeleccionado.distrito;

document.getElementById("edadCandidato").textContent =
    calcularEdad(aspiranteSeleccionado.fechaNacimiento);


// Buscar si el aspirante ya tiene una evaluación registrada
var evaluaciones =
    JSON.parse(localStorage.getItem("evaluaciones")) || [];

var evaluacionGuardada = evaluaciones.find(function(evaluacion) {
    return evaluacion.aspiranteEmail === emailSeleccionado;
});

if (evaluacionGuardada) {

    document.getElementById("estadoCandidato").textContent =
        evaluacionGuardada.estado;

    document.getElementById("promedioEvaluacion").textContent =
        evaluacionGuardada.promedio.toFixed(2) + " / 5";

    document.getElementById("comentarios").value =
        evaluacionGuardada.observaciones;

            // Recuperar las puntuaciones guardadas
    document.getElementById("habilidades").value =
        evaluacionGuardada.habilidades;

    document.getElementById("calidadVideo").value =
        evaluacionGuardada.calidadVideo;

    document.getElementById("perfilAcademico").value =
        evaluacionGuardada.perfilAcademico;

    // Mostrar visualmente las estrellas guardadas
    var grupos = document.querySelectorAll(".estrellas");

    for (var i = 0; i < grupos.length; i++) {

        var criterio = grupos[i].getAttribute("data-criterio");
        var valorGuardado = evaluacionGuardada[criterio];
        var estrellas = grupos[i].querySelectorAll(".estrella");

        for (var j = 0; j < estrellas.length; j++) {

            if (j < valorGuardado) {
                estrellas[j].classList.add("seleccionada");
            } else {
                estrellas[j].classList.remove("seleccionada");
            }
        }
    }
}

});


// Calcular edad a partir de la fecha de nacimiento
function calcularEdad(fechaNacimiento) {

    var nacimiento = new Date(fechaNacimiento);
    var hoy = new Date();

    var edad = hoy.getFullYear() - nacimiento.getFullYear();

    var mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 ||
        (mes === 0 && hoy.getDate() < nacimiento.getDate())) {

        edad--;
    }

    return edad;
}

// Seleccionar los grupos de estrellas
var gruposEstrellas = document.querySelectorAll(".estrellas");

// Recorrer cada grupo de estrellas
for (var i = 0; i < gruposEstrellas.length; i++) {

    var estrellas = gruposEstrellas[i].querySelectorAll(".estrella");

    // Recorrer las cinco estrellas de cada criterio
    for (var j = 0; j < estrellas.length; j++) {

        estrellas[j].addEventListener("click", function () {

            // Obtener el valor de la estrella seleccionada
            var valor = parseInt(this.getAttribute("data-valor"));

            // Obtener el grupo al que pertenece la estrella
            var grupo = this.parentElement;

            // Obtener el criterio que se está evaluando
            var criterio = grupo.getAttribute("data-criterio");

            var estrellasGrupo = grupo.querySelectorAll(".estrella");

            // Pintar las estrellas seleccionadas
            for (var k = 0; k < estrellasGrupo.length; k++) {

                if (k < valor) {
                    estrellasGrupo[k].classList.add("seleccionada");
                } else {
                    estrellasGrupo[k].classList.remove("seleccionada");
                }
            }

            // Guardar el valor seleccionado
            document.getElementById(criterio).value = valor;

            // Calcular el promedio
            calcularPromedio();

        });

    }

}
// Función para calcular la puntuación promedio
function calcularPromedio() {

    var habilidades = parseInt(document.getElementById("habilidades").value);
    var calidadVideo = parseInt(document.getElementById("calidadVideo").value);
    var perfilAcademico = parseInt(document.getElementById("perfilAcademico").value);

    var promedio = (habilidades + calidadVideo + perfilAcademico) / 3;

    document.getElementById("promedioEvaluacion").textContent =
        promedio.toFixed(2) + " / 5";
}
// Función para registrar la decisión de la evaluación

function registrarDecision(estado) {

    var habilidades = parseInt(document.getElementById("habilidades").value);
    var calidadVideo = parseInt(document.getElementById("calidadVideo").value);
    var perfilAcademico = parseInt(document.getElementById("perfilAcademico").value);

    var emailAspirante = seleccionarAspirante.value;

    // Validar que se haya seleccionado un aspirante
    if (emailAspirante === "") {
        alert("Debe seleccionar un aspirante.");
        return;
    }

    // Validar que todos los criterios tengan puntuación
    if (habilidades === 0 || calidadVideo === 0 || perfilAcademico === 0) {
        alert("Debe evaluar todos los criterios antes de registrar una decisión.");
        return;
    }

    var promedio = (habilidades + calidadVideo + perfilAcademico) / 3;

    var observaciones = document.getElementById("comentarios").value;

    // Crear el registro de evaluación
    var evaluacion = {
        aspiranteEmail: emailAspirante,
        habilidades: habilidades,
        calidadVideo: calidadVideo,
        perfilAcademico: perfilAcademico,
        promedio: parseFloat(promedio.toFixed(2)),
        observaciones: observaciones,
        estado: estado
    };

    // Obtener evaluaciones existentes
    var evaluaciones =
        JSON.parse(localStorage.getItem("evaluaciones")) || [];

    // Guardar la nueva evaluación
    evaluaciones.push(evaluacion);

    localStorage.setItem(
        "evaluaciones",
        JSON.stringify(evaluaciones)
    );

    // Mostrar el estado seleccionado
    document.getElementById("estadoCandidato").textContent = estado;

    alert("Evaluación registrada correctamente.");
}

// Botón Rechazar
document.getElementById("btnRechazar").addEventListener("click", function () {
    registrarDecision("Rechazado");
});

// Botón Requiere ajustes
document.getElementById("btnAjustes").addEventListener("click", function () {
    registrarDecision("Requiere ajustes");
});

// Botón Aprobar
document.getElementById("btnAprobar").addEventListener("click", function () {
    registrarDecision("Aprobado");
});
