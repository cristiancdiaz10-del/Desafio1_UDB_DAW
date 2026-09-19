// ==========================================
// 1. LÓGICA DE GESTIÓN DE CONVOCATORIAS
// ==========================================
let convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [
    {
        id: 1,
        curso: "Análisis de datos con herramientas de IA",
        fechaInicio: "2026-10-01",
        fechaCierre: "2026-10-25",
        plazas: 30,
        estado: "Activa"
    },
    {
        id: 2,
        curso: "Lenguajes de programación: JavaScript y C#",
        fechaInicio: "2026-11-05",
        fechaCierre: "2026-11-30",
        plazas: 25,
        estado: "Próximamente"
    }
];

const formConvocatoria = document.getElementById('formConvocatoria');
const tablaConvocatorias = document.getElementById('tablaConvocatorias');
const modalTituloConvocatoria = document.getElementById('modalTituloConvocatoria');
const convocatoriaIdInput = document.getElementById('convocatoriaId');
const cursoSelect = document.getElementById('cursoSelect');
const fechaInicioInput = document.getElementById('fechaInicio');
const fechaCierreInput = document.getElementById('fechaCierre');
const numPlazasInput = document.getElementById('numPlazas');
const estadoSelect = document.getElementById('estadoSelect');

let modalConvocatoriaElement = document.getElementById('modalConvocatoria');
let modalConvocatoriaBootstrap = null;

// ==========================================
// 2. LÓGICA DE GESTIÓN DE CURSOS
// ==========================================
let cursos = JSON.parse(localStorage.getItem('cursos')) || [
    {
        id: 1,
        nombre: "Análisis de datos con herramientas de IA",
        descripcion: "Capacitación avanzada en modelos predictivos y análisis estadístico enfocado en toma de decisiones."
    },
    {
        id: 2,
        nombre: "Lenguajes de programación: JavaScript y C#",
        descripcion: "Fundamentos de lógica, desarrollo frontend interactivo y backend robusto orientado a objetos."
    }
];

const formCurso = document.getElementById('formCurso');
const contenedorCursos = document.getElementById('contenedorCursos');
const modalCursoTitulo = document.getElementById('modalCursoTitulo');
const cursoIdInput = document.getElementById('cursoId');
const nombreCursoInput = document.getElementById('nombreCurso');
const descCursoInput = document.getElementById('descCurso');

let modalCursoElement = document.getElementById('modalCurso');
let modalCursoBootstrap = null;

// ==========================================
// INICIALIZACIÓN GLOBAL AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar modales de Bootstrap
    if (modalConvocatoriaElement) {
        modalConvocatoriaBootstrap = new bootstrap.Modal(modalConvocatoriaElement);
    }
    if (modalCursoElement) {
        modalCursoBootstrap = new bootstrap.Modal(modalCursoElement);
    }

    // Renderizar ambas secciones
    renderizarTablaConvocatorias();
    renderizarCursos();
});

// ------------------------------------------
// FUNCIONES DE CONVOCATORIAS
// ------------------------------------------
function renderizarTablaConvocatorias() {
    if (!tablaConvocatorias) return;
    tablaConvocatorias.innerHTML = '';

    if (convocatorias.length === 0) {
        tablaConvocatorias.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">No hay convocatorias registradas</td>
            </tr>
        `;
        return;
    }

    convocatorias.forEach((conv) => {
        let badgeClass = 'badge-activa';
        if (conv.estado === 'Cerrada') badgeClass = 'badge-cerrada';
        if (conv.estado === 'Próximamente') badgeClass = 'badge-proximamente';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="fw-semibold">${conv.curso}</td>
            <td><small class="text-muted">Del ${conv.fechaInicio} al ${conv.fechaCierre}</small></td>
            <td>${conv.plazas} plazas</td>
            <td><span class="${badgeClass}">${conv.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEdicionConvocatoria(${conv.id})" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarConvocatoria(${conv.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tablaConvocatorias.appendChild(tr);
    });
}

function prepararCreacionConvocatoria() {
    if (formConvocatoria) formConvocatoria.reset();
    if (convocatoriaIdInput) convocatoriaIdInput.value = '';
    if (modalTituloConvocatoria) modalTituloConvocatoria.textContent = 'Nueva Convocatoria';
}

function prepararEdicionConvocatoria(id) {
    const conv = convocatorias.find(c => c.id === id);
    if (!conv) return;

    convocatoriaIdInput.value = conv.id;
    cursoSelect.value = conv.curso;
    fechaInicioInput.value = conv.fechaInicio;
    fechaCierreInput.value = conv.fechaCierre;
    numPlazasInput.value = conv.plazas;
    estadoSelect.value = conv.estado;

    if (modalTituloConvocatoria) modalTituloConvocatoria.textContent = 'Editar Convocatoria';
    if (modalConvocatoriaBootstrap) modalConvocatoriaBootstrap.show();
}

if (formConvocatoria) {
    formConvocatoria.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = convocatoriaIdInput.value;
        const nuevaData = {
            id: id ? parseInt(id) : Date.now(),
            curso: cursoSelect.value,
            fechaInicio: fechaInicioInput.value,
            fechaCierre: fechaCierreInput.value,
            plazas: parseInt(numPlazasInput.value),
            estado: estadoSelect.value
        };

        if (id) {
            convocatorias = convocatorias.map(c => c.id === parseInt(id) ? nuevaData : c);
        } else {
            convocatorias.push(nuevaData);
        }

        localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
        renderizarTablaConvocatorias();
        if (modalConvocatoriaBootstrap) modalConvocatoriaBootstrap.hide();
    });
}

function eliminarConvocatoria(id) {
    if (confirm('¿Estás segura de que deseas eliminar esta convocatoria?')) {
        convocatorias = convocatorias.filter(c => c.id !== id);
        localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
        renderizarTablaConvocatorias();
    }
}

// ------------------------------------------
// FUNCIONES DE CURSOS
// ------------------------------------------
function renderizarCursos() {
    if (!contenedorCursos) return;
    contenedorCursos.innerHTML = '';

    if (cursos.length === 0) {
        contenedorCursos.innerHTML = `
            <div class="col-12 text-center text-muted py-3">
                <p>No hay cursos registrados en el sistema.</p>
            </div>
        `;
        return;
    }

    cursos.forEach((curso) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="card curso-card h-100 p-3 d-flex flex-column justify-content-between">
                <div>
                    <h5 class="card-title mb-2">${curso.nombre}</h5>
                    <p class="card-text mb-3">${curso.descripcion}</p>
                </div>
                <div class="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button class="btn btn-sm btn-outline-primary" onclick="prepararEdicionCurso(${curso.id})" title="Editar curso">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarCurso(${curso.id})" title="Eliminar curso">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        contenedorCursos.appendChild(col);
    });
}

function prepararCreacionCurso() {
    if (formCurso) formCurso.reset();
    if (cursoIdInput) cursoIdInput.value = '';
    if (modalCursoTitulo) modalCursoTitulo.textContent = 'Nuevo Curso';
}

function prepararEdicionCurso(id) {
    const curso = cursos.find(c => c.id === id);
    if (!curso) return;

    cursoIdInput.value = curso.id;
    nombreCursoInput.value = curso.nombre;
    descCursoInput.value = curso.descripcion;

    if (modalCursoTitulo) modalCursoTitulo.textContent = 'Editar Curso';
    if (modalCursoBootstrap) modalCursoBootstrap.show();
}

if (formCurso) {
    formCurso.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = cursoIdInput.value;
        const nuevoCursoData = {
            id: id ? parseInt(id) : Date.now(),
            nombre: nombreCursoInput.value,
            descripcion: descCursoInput.value
        };

        if (id) {
            cursos = cursos.map(c => c.id === parseInt(id) ? nuevoCursoData : c);
        } else {
            cursos.push(nuevoCursoData);
        }

        localStorage.setItem('cursos', JSON.stringify(cursos));
        renderizarCursos();
        if (modalCursoBootstrap) modalCursoBootstrap.hide();
    });
}

function eliminarCurso(id) {
    if (confirm('¿Estás segura de que deseas eliminar este curso del sistema?')) {
        cursos = cursos.filter(c => c.id !== id);
        localStorage.setItem('cursos', JSON.stringify(cursos));
        renderizarCursos();
    }
}