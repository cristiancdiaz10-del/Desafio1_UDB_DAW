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

const modal = document.getElementById("modalConsentimiento");
const abrir = document.getElementById("abrirConsentimiento");
const cerrar = document.getElementById("cerrarConsentimiento");

abrir.addEventListener("click", function(evento) {
    evento.preventDefault();
    modal.style.display = "flex";
});

cerrar.addEventListener("click", function() {
    modal.style.display = "none";
});

//Guardado de registros

const formulario = document.getElementById("formRegistro");

if(formulario){
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();

    // Obtener lista actual de usuarios en localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    //Validar si el correo ya existe
    const correoExiste = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (correoExiste) {
            alert("Este correo electrónico ya se encuentra registrado. Por favor, inicia sesión o usa otro correo.");
            return;
        }
    
    const usuario = {
    cursoTecnico: document.getElementById("curso") ? document.getElementById("curso").value: "",
    nombreCompleto: document.getElementById("nombre") ? document.getElementById("nombre").value: "",
    sexo: document.getElementById("sexo") ? document.getElementById("sexo").value: "",
    fechaNacimiento: document.getElementById("nacimiento") ? document.getElementById("nacimiento").value: "",
    departamento: document.getElementById("departamento") ? document.getElementById("departamento").value: "",
    municipio: document.getElementById("municipio") ? document.getElementById("municipio").value: "",
    distrito: document.getElementById("distrito") ? document.getElementById("distrito").value: "",
    DUI: document.getElementById("DUI") ? document.getElementById("DUI").value: "",
    NIT: document.getElementById("NIT") ? document.getElementById("NIT").value: "",
    discapacidad: document.getElementById("discapacidad") ? document.getElementById("discapacidad").value: "",
    nivelEducativo: document.getElementById("nivel-educativo") ? document.getElementById("nivel-educativo").value: "",
    situacionActual: document.getElementById("situacion-actual") ? document.getElementById("situacion-actual").value: "",
    internet: document.getElementById("internet") ? document.getElementById("internet").value: "",
    computadora: document.getElementById("computadora") ? document.getElementById("computadora").value: "",
    dominioComputadora: document.getElementById("dominio-computadora") ? document.getElementById("dominio-computadora").value: "",
    vinculacionLaboral: document.getElementById("vinculacion") ? document.getElementById("vinculacion").value:"",
    medioPreferido: document.getElementById("medio-contacto") ? document.getElementById("medio-contacto").value: "",
    telefono1: document.getElementById("telefono") ? document.getElementById("telefono").value: "",
    telefono2: document.getElementById("telefono2") ? document.getElementById("telefono2").value: "",
    email: email,
    password: document.getElementById("password").value,
    consentimientoInformado: document.getElementById("aceptarConsentimiento").checked,

        rol: "usuario",
        estadoProceso: "Pendiente",
        fechaRegistro: new Date().toLocaleDateString()
    };

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales");

    window.location.href = "login.html";
});
}