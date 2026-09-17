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

    // Validar que todos los criterios tengan puntuación
    if (habilidades === 0 || calidadVideo === 0 || perfilAcademico === 0) {
        alert("Debe evaluar todos los criterios antes de registrar una decisión.");
        return;
    }

    // Mostrar el estado seleccionado
    document.getElementById("estadoCandidato").textContent = estado;
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
