// Módulo de Evaluaciones y Resultados - ProTalento

// Obtener los aspirantes almacenados en localStorage
var aspirantes = JSON.parse(localStorage.getItem("aspirantes")) || [];

// Obtener el elemento select del formulario
var selectAspirante = document.getElementById("aspirante");

// Función para cargar los aspirantes en el select
function cargarAspirantes() {

    // Limpiar las opciones existentes
    selectAspirante.innerHTML =
        '<option value="">Seleccione un aspirante</option>';

    // Recorrer el arreglo de aspirantes
    for (var i = 0; i < aspirantes.length; i++) {

        var opcion = document.createElement("option");

        opcion.value = i;

        opcion.textContent =
            aspirantes[i].nombre;

        selectAspirante.appendChild(opcion);
    }
}

// Ejecutar la función al cargar la página
cargarAspirantes();
