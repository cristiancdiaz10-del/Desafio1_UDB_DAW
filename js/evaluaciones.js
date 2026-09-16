// Módulo de Evaluaciones y Resultados - ProTalento

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
