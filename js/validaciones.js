// REGISTRO DE ASPIRANTES

//Cargar API de Departamentos, Municipios y Distritos
const URL_API = "https://juanmedina100.github.io/departamentos-distritos-municipios-el-salvador/departamentos-distritos-municipios-sv.json";

const selectDepto = document.getElementById("departamento");
const selectMuni = document.getElementById("municipio");
const selectDist = document.getElementById("distrito");

let datosElSalvador = [];

if (selectDepto) {
    fetch(URL_API)
        .then(res => {
            if (!res.ok) throw new Error("Error en la respuesta");
            return res.json();
        })
        .then(data => {
            datosElSalvador = data.departamentos;
            cargarDepartamentos();
        })
        .catch(err => {
            console.error("Error al cargar datos:", err);
            if (selectDepto) selectDepto.innerHTML = '<option value="">Error al cargar los departamentos</option>';
        });
}

function cargarDepartamentos() {
    selectDepto.innerHTML = '<option value="">Selecciona tu departamento</option>';
    datosElSalvador.forEach(departamento => {
        selectDepto.innerHTML += `<option value="${departamento.nombre}">${departamento.nombre}</option>`;
    });
}

if (selectDepto) {
    selectDepto.addEventListener("change", () => {
        const deptoEncontrado = datosElSalvador.find(d => d.nombre === selectDepto.value);

        selectMuni.innerHTML = '<option value="">Selecciona tu municipio</option>';
        selectDist.innerHTML = '<option value="">Selecciona tu distrito</option>';
        selectMuni.disabled = true;
        selectDist.disabled = true;

        if (deptoEncontrado) {
<<<<<<< HEAD

            selectMuni.disabled = false;

            deptoEncontrado.municipios.forEach(municipio => {

                selectMuni.innerHTML +=
                    `<option value="${municipio.nombre}">
                        ${municipio.nombre}
                    </option>`;
=======
            selectMuni.disabled = false;
            deptoEncontrado.municipios.forEach(municipio => {
                selectMuni.innerHTML += `<option value="${municipio.nombre}">${municipio.nombre}</option>`;
>>>>>>> origin/integracion-fase-2
            });
        }
    });
}

<<<<<<< HEAD

if (selectMuni) {

    selectMuni.addEventListener("change", () => {

        const deptoEncontrado = datosElSalvador.find(
            d => d.nombre === selectDepto.value
        );

        const muniEncontrado = deptoEncontrado
            ? deptoEncontrado.municipios.find(
                m => m.nombre === selectMuni.value
            )
            : null;

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
=======
if (selectMuni) {
    selectMuni.addEventListener("change", () => {
        const deptoEncontrado = datosElSalvador.find(d => d.nombre === selectDepto.value);
        const muniEncontrado = deptoEncontrado ? deptoEncontrado.municipios.find(m => m.nombre === selectMuni.value) : null;

        selectDist.innerHTML = '<option value="">Selecciona tu distrito</option>';
        selectDist.disabled = true;

        if (muniEncontrado) {
            selectDist.disabled = false;
            muniEncontrado.distritos.forEach(distrito => {
                selectDist.innerHTML += `<option value="${distrito.nombre}">${distrito.nombre}</option>`;
>>>>>>> origin/integracion-fase-2
            });
        }
    });
}

<<<<<<< HEAD

// Validación Mayor y Menor de edad para mostrar DUI o NIT
=======
//Validación Mayor y Menor de edad para mostrar DUI o NIT
>>>>>>> origin/integracion-fase-2
const inputFecha = document.getElementById("nacimiento");
const inputDui = document.getElementById("DUI");
const inputNit = document.getElementById("NIT");
const grupoDui = document.getElementById("NDUI");
const grupoNit = document.getElementById("NNIT");

<<<<<<< HEAD

if (inputFecha) {

    inputFecha.addEventListener("change", () => {

        const fechaNac = new Date(inputFecha.value);

        if (isNaN(fechaNac.getTime())) return;

        const hoy = new Date();

        let edad =
            hoy.getFullYear() - fechaNac.getFullYear();

        const mes =
            hoy.getMonth() - fechaNac.getMonth();

        if (
            mes < 0 ||
            (mes === 0 && hoy.getDate() < fechaNac.getDate())
        ) {
            edad--;
        }


        if (edad >= 18) {

            inputDui.required = true;
            inputNit.required = false;

            grupoDui.classList.remove("d-none");
            grupoNit.classList.add("d-none");

        } else {

            inputDui.required = false;
            inputNit.required = true;

=======
if (inputFecha) {
    inputFecha.addEventListener("change", () => {
        const fechaNac = new Date(inputFecha.value);
        if (isNaN(fechaNac.getTime())) return;

        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad >= 18) {
            inputDui.required = true;
            inputNit.required = false;
            grupoDui.classList.remove("d-none");
            grupoNit.classList.add("d-none");
        } else {
            inputDui.required = false;
            inputNit.required = true;
>>>>>>> origin/integracion-fase-2
            grupoDui.classList.add("d-none");
            grupoNit.classList.remove("d-none");
        }
    });
}

<<<<<<< HEAD

// Modal de Consentimiento Informado
=======
//Modal de Consentimiento Informado
>>>>>>> origin/integracion-fase-2
const modal = document.getElementById("modalConsentimiento");
const abrir = document.getElementById("abrirConsentimiento");
const cerrar = document.getElementById("cerrarConsentimiento");

<<<<<<< HEAD

if (abrir && modal) {

    abrir.addEventListener("click", function(evento) {

        evento.preventDefault();

=======
if (abrir && modal) {
    abrir.addEventListener("click", function(evento) {
        evento.preventDefault();
>>>>>>> origin/integracion-fase-2
        modal.style.display = "flex";
    });
}

<<<<<<< HEAD

if (cerrar && modal) {

    cerrar.addEventListener("click", function() {

=======
if (cerrar && modal) {
    cerrar.addEventListener("click", function() {
>>>>>>> origin/integracion-fase-2
        modal.style.display = "none";
    });
}

<<<<<<< HEAD

// Guardado de registros de Aspirantes

document.addEventListener("DOMContentLoaded", function () {

    const formRegistro =
        document.getElementById("formRegistro");


=======
//Guardado de registros de Aspirantes

document.addEventListener("DOMContentLoaded", function () {

    const formRegistro = document.getElementById("formRegistro");

    // Verificar que el formulario exista
>>>>>>> origin/integracion-fase-2
    if (!formRegistro) {
        return;
    }

<<<<<<< HEAD

    formRegistro.addEventListener("submit", function (event) {

        event.preventDefault();


        const cursoFormacion =
            document.getElementById("curso").value;

        const nombreCompleto =
            document.getElementById("nombre").value.trim();

        const sexo =
            document.getElementById("sexo").value;

        const fechaNacimiento =
            document.getElementById("nacimiento").value;

        const departamento =
            document.getElementById("departamento").value;

        const municipio =
            document.getElementById("municipio").value;

        const distrito =
            document.getElementById("distrito").value;

        const DUI =
            document.getElementById("DUI").value.trim();

        const NIT =
            document.getElementById("NIT").value.trim();

        const discapacidad =
            document.getElementById("discapacidad").value;

        const nivelEducativo =
            document.getElementById("nivel-educativo").value;

        const situacionActual =
            document.getElementById("situacion-actual").value;

        const internet =
            document.getElementById("internet").value;

        const computadora =
            document.getElementById("computadora").value;

        const dominioComputadora =
            document.getElementById("dominio-computadora").value;

        const vinculacionLaboral =
            document.getElementById("vinculacion").value;

        const medioPreferido =
            document.getElementById("medio-contacto").value;

        const telefono1 =
            document.getElementById("telefono").value.trim();

        const telefono2 =
            document.getElementById("telefono2").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const consentimientoInformado =
            document.getElementById("aceptarConsentimiento").checked;


        // Obtener usuarios registrados
        let usuarios =
            JSON.parse(localStorage.getItem("usuarios")) || [];


        // =====================================================
        // NORMALIZAR DATOS PARA COMPARARLOS
        // =====================================================

        // El correo no distingue entre mayúsculas y minúsculas
        const emailNormalizado =
            email.toLowerCase();
=======
    formRegistro.addEventListener("submit", async function (event) {
        event.preventDefault();

       
        const cursoFormacion = document.getElementById("curso").value;
        const nombreCompleto = document.getElementById("nombre").value.trim();
        const sexo = document.getElementById("sexo").value;
        const fechaNacimiento = document.getElementById("nacimiento").value;
        const departamento = document.getElementById("departamento").value;
        const municipio = document.getElementById("municipio").value;
        const distrito = document.getElementById("distrito").value;
        const DUI = document.getElementById("DUI").value.trim();
        const NIT = document.getElementById("NIT").value.trim();
        const discapacidad = document.getElementById("discapacidad").value;
        const nivelEducativo = document.getElementById("nivel-educativo").value;
        const situacionActual = document.getElementById("situacion-actual").value;
        const internet = document.getElementById("internet").value;
        const computadora = document.getElementById("computadora").value;
        const dominioComputadora = document.getElementById("dominio-computadora").value;
        const vinculacionLaboral = document.getElementById("vinculacion").value;
        const medioPreferido = document.getElementById("medio-contacto").value;
        const telefono1 = document.getElementById("telefono").value.trim();
        const telefono2 = document.getElementById("telefono2").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const consentimientoInformado = document.getElementById("aceptarConsentimiento").checked;

        // Obtener usuarios registrados
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // NORMALIZAR DATOS PARA COMPARARLOS

        // El correo no distingue entre mayúsculas y minúsculas
        const emailNormalizado = email.toLowerCase();
>>>>>>> origin/integracion-fase-2

        // Se eliminan espacios y guiones para evitar
        // que se pueda registrar el mismo documento
        // usando un formato diferente.
<<<<<<< HEAD
        const duiNormalizado =
            DUI.replace(/[\s-]/g, "");

        const nitNormalizado =
            NIT.replace(/[\s-]/g, "");


        // =====================================================
        // VERIFICAR CORREO DUPLICADO
        // =====================================================

        const correoExiste =
            usuarios.some(function (usuario) {

                return (
                    (usuario.email || "")
                        .trim()
                        .toLowerCase() === emailNormalizado
                );
            });


        if (correoExiste) {

            alert(
                "Este correo ya está registrado. Utiliza otro correo."
            );

            return;
        }


        // =====================================================
        // VERIFICAR DUI DUPLICADO
        // =====================================================

        if (duiNormalizado !== "") {

            const duiExiste =
                usuarios.some(function (usuario) {

                    const duiRegistrado =
                        (usuario.DUI || "")
                            .replace(/[\s-]/g, "");

                    return duiRegistrado === duiNormalizado;
                });


            if (duiExiste) {

                alert(
                    "Este DUI ya está registrado. No puedes realizar otro registro con este DUI."
                );

=======
        const duiNormalizado = DUI.replace(/[\s-]/g, "");
        const nitNormalizado = NIT.replace(/[\s-]/g, "");

        // Verificar si el correo ya existe
        const correoExiste = usuarios.some(function (usuario) {
            return (
                (usuario.email || "")
                    .trim()
                    .toLowerCase() === emailNormalizado
            );
        });

        if (correoExiste) {
            Swal.fire({
                icon: 'warning',
                title: 'Correo ya registrado',
                text: 'Este correo ya está registrado. Utiliza otro correo.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // VERIFICAR DUI DUPLICADO

        if (duiNormalizado !== "") {

            const duiExiste = usuarios.some(function (usuario) {

                const duiRegistrado =
                    (usuario.DUI || "")
                        .replace(/[\s-]/g, "");

                return duiRegistrado === duiNormalizado;
            });

            if (duiExiste) {
               Swal.fire({
                icon: "warning",
                title: "DUI ya registrado",
                text: "Este DUI ya está registrado. No puedes realizar otro registro con este DUI.",
                confirmButtonText: "Entendido"
                });
>>>>>>> origin/integracion-fase-2
                return;
            }
        }

<<<<<<< HEAD

        // =====================================================
        // VERIFICAR NIT DUPLICADO
        // =====================================================

        if (nitNormalizado !== "") {

            const nitExiste =
                usuarios.some(function (usuario) {

                    const nitRegistrado =
                        (usuario.NIT || "")
                            .replace(/[\s-]/g, "");

                    return nitRegistrado === nitNormalizado;
                });


            if (nitExiste) {

                alert(
                    "Este NIT ya está registrado. No puedes realizar otro registro con este NIT."
                );

=======
        // VERIFICAR NIT DUPLICADO

        if (nitNormalizado !== "") {

            const nitExiste = usuarios.some(function (usuario) {

                const nitRegistrado =
                    (usuario.NIT || "")
                        .replace(/[\s-]/g, "");

                return nitRegistrado === nitNormalizado;
            });

            if (nitExiste) {
                Swal.fire({
                icon: "warning",
                title: "NIT ya registrado",
                text: "Este NIT ya está registrado. No puedes realizar otro registro con este NIT.",
                confirmButtonText: "Entendido"
            });
>>>>>>> origin/integracion-fase-2
                return;
            }
        }

<<<<<<< HEAD

        // =====================================================
        // CREAR NUEVO USUARIO
        // =====================================================

        const nuevoUsuario = {

            curso: cursoFormacion,

            nombreCompleto: nombreCompleto,

            sexo: sexo,

            fechaNacimiento: fechaNacimiento,

            departamento: departamento,

            municipio: municipio,

            distrito: distrito,

            DUI: DUI,

            NIT: NIT,

            discapacidad: discapacidad,

            nivelEducativo: nivelEducativo,

            situacionActual: situacionActual,

            internet: internet,

            computadora: computadora,

            dominioComputadora: dominioComputadora,

            vinculacionLaboral: vinculacionLaboral,

            medioPreferido: medioPreferido,

            telefono1: telefono1,

            telefono2: telefono2,

            email: email,

            password: password,

            consentimientoInformado:
                consentimientoInformado,

            rol: "usuario"
        };


        // Agregar usuario al arreglo
        usuarios.push(nuevoUsuario);


        // Guardar usuarios en localStorage
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );


        // Confirmación
        alert(
            "Usuario registrado correctamente."
        );


        // Redirigir al login
        window.location.href =
            "login.html";

    });

});
=======
        const nuevoUsuario = {
        curso: cursoFormacion,
        nombreCompleto: nombreCompleto,
        sexo: sexo,
        fechaNacimiento: fechaNacimiento,
        departamento: departamento,
        municipio: municipio,
        distrito: distrito,
        DUI: DUI,
        NIT: NIT,
        discapacidad: discapacidad,
        nivelEducativo: nivelEducativo,
        situacionActual: situacionActual,
        internet: internet,
        computadora: computadora,
        dominioComputadora: dominioComputadora,
        vinculacionLaboral: vinculacionLaboral,
        medioPreferido: medioPreferido,
        telefono1: telefono1,
        telefono2: telefono2,
        email: email,
        password: password,
        consentimientoInformado: consentimientoInformado,
        rol: "usuario"
        };

        usuarios.push(nuevoUsuario);

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu registro se ha completado correctamente.",
        confirmButtonText: "Continuar"
        });

        window.location.href = "login.html";
    });

});

// Validación de campos del formulario de registro

document.addEventListener("DOMContentLoaded", function () {
    const camposDocumento = [
        {
            id: "DUI",
            mensaje: "El DUI debe tener 8 dígitos, un guion y un dígito final. Ejemplo: 01234567-8."
        },
        {
            id: "NIT",
            mensaje: "El NIT debe tener el formato 0123-456789-1203-4."
        },
        {
            id: "password",
            mensaje: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número."
        }
    ];

    camposDocumento.forEach(function (campo) {
        const input = document.getElementById(campo.id);

        if (!input) return;

        input.addEventListener("blur", function () {
            if (!input.value.trim()) {
                return;
            }

            if (!input.checkValidity()) {
                Swal.fire({
                    icon: "warning",
                    title: "Revisa este campo",
                    text: campo.mensaje,
                    confirmButtonText: "Entendido"
                    }).then(() => {
                    input.focus();
                });
            }
        });
    });
    const campoFechaNacimiento = document.getElementById("nacimiento");

if (campoFechaNacimiento) {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    const fechaActual = `${anio}-${mes}-${dia}`;

    campoFechaNacimiento.max = fechaActual;

    campoFechaNacimiento.addEventListener("change", function () {
        if (this.value && this.value > fechaActual) {
            Swal.fire({
                icon: "warning",
                title: "Fecha inválida",
                text: "La fecha de nacimiento no puede ser posterior al día de hoy.",
                confirmButtonText: "Entendido"
            });
            this.value = "";
            this.focus();
        }
    });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const selectorCurso = document.getElementById('curso');

    // Si esta página no tiene selector de cursos, no hacer nada.
    if (!selectorCurso) return;

    let cursosGuardados = [];

    try {
        cursosGuardados = JSON.parse(
            localStorage.getItem('cursos') || '[]'
        );
    } catch (error) {
        console.error('No se pudieron cargar los cursos:', error);
        return;
    }

    // Si todavía no hay cursos guardados, conservar las opciones actuales.
    if (!Array.isArray(cursosGuardados) || cursosGuardados.length === 0) {
        return;
    }

    // Conservar la opción inicial del formulario.
    selectorCurso.innerHTML = '';

    const opcionInicial = document.createElement('option');
    opcionInicial.value = '';
    opcionInicial.textContent =
        'Selecciona el curso de formación que te interesa';
    opcionInicial.disabled = true;
    opcionInicial.selected = true;

    selectorCurso.appendChild(opcionInicial);

    // Cargar los cursos administrados desde el panel.
    cursosGuardados.forEach(curso => {
        const nombreCurso =
            typeof curso === 'string' ? curso : curso.nombre;

        if (!nombreCurso) return;

        const opcion = document.createElement('option');
        opcion.value = nombreCurso;
        opcion.textContent = nombreCurso;

        selectorCurso.appendChild(opcion);
    });
});
>>>>>>> origin/integracion-fase-2
