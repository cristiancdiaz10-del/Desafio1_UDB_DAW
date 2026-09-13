//REGISTRO DE ASPIRANTES
//Departamentos, municipios y distritos
const URL_API = "https://juanmedina100.github.io/departamentos-distritos-municipios-el-salvador/departamentos-distritos-municipios-sv.json";

const selectDepto = document.getElementById("departamento");
const selectMuni = document.getElementById("municipio");
const selectDist = document.getElementById("distrito");

let datosElSalvador = [];

// Consumo de la API
fetch(URL_API)
    .then(res => {
        if (!res.ok) {
            throw new Error("Error en la respuesta");
        }
        return res.json();
    })
    .then(data => {
        datosElSalvador = data.departamentos;

        cargarDepartamentos();
    })
    .catch(err => {
        console.error("Error al cargar datos:", err);
        selectDepto.innerHTML =
            '<option value="">Error al cargar los departamentos</option>';
    });

// Cargar departamentos
function cargarDepartamentos() {
    selectDepto.innerHTML =
        '<option value="">Selecciona tu departamento</option>';

    datosElSalvador.forEach(departamento => {
        const nombreDepto = departamento.nombre;

        selectDepto.innerHTML +=
            `<option value="${nombreDepto}">${nombreDepto}</option>`;
    });
}
// Departamento - Municipios
selectDepto.addEventListener("change", () => {

    const deptoEncontrado = datosElSalvador.find(
        departamento => departamento.nombre === selectDepto.value
    );

    selectMuni.innerHTML =
        '<option value="">Selecciona tu municipio</option>';

    selectDist.innerHTML =
        '<option value="">Selecciona tu distrito</option>';

    selectMuni.disabled = true;
    selectDist.disabled = true;

    if (deptoEncontrado) {

        selectMuni.disabled = false;

        deptoEncontrado.municipios.forEach(municipio => {

            selectMuni.innerHTML +=
                `<option value="${municipio.nombre}">
                    ${municipio.nombre}
                </option>`;
        });
    }
});

// Municipio - Distritos
selectMuni.addEventListener("change", () => {

    const deptoEncontrado = datosElSalvador.find(
        departamento => departamento.nombre === selectDepto.value
    );

    const muniEncontrado = deptoEncontrado.municipios.find(
        municipio => municipio.nombre === selectMuni.value
    );

    selectDist.innerHTML =
        '<option value="">Selecciona tu distrito</option>';

    selectDist.disabled = true;

    if (muniEncontrado) {

        selectDist.disabled = false;

        muniEncontrado.distritos.forEach(distrito => {

            selectDist.innerHTML +=
                `<option value="${distrito.nombre}">
                    ${distrito.nombre}
                </option>`;
        });
    }
});

//Mayor y menor de edad
const inputFecha = document.getElementById("nacimiento");
const inputDui = document.getElementById("DUI");
const inputNit = document.getElementById("NIT");

const grupoDui = document.getElementById("NDUI");
const grupoNit = document.getElementById("NNIT");

inputFecha.addEventListener("change", () => {
  const fechaNac = new Date(inputFecha.value);
  if (isNaN(fechaNac.getTime())) return;

  // Calcular edad
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }

  if (edad >= 18) {
    // Si es Mayor de edad: DUI es obligatorio, NIT es opcional/oculto
    inputDui.required = true;
    inputNit.required = false;

    grupoDui.classList.remove("d-none"); // Muestra DUI
  } else {
    // Si es Menor de edad: NIT es obligatorio, DUI es opcional/oculto
    inputDui.required = false;
    inputNit.required = true;

    grupoNit.classList.remove("d-none"); // Muestra NIT
  }
});

//Consentimiento informado
const checkConsent = document.getElementById("checkConsentimiento");
const btnAceptarModal = document.getElementById("btnAceptarModal");

// Al hacer clic en "He leído y Acepto" dentro del modal
btnAceptarModal.addEventListener("click", () => {
  checkConsent.disabled = false;
  checkConsent.checked = true;
});