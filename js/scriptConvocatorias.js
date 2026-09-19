//Gestión de Convocatorias y Cursos

//ESTADO INICIAL
let convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [
    { id: 1, curso: "Análisis de datos con herramientas de IA", fechaInicio: "2026-10-01", fechaCierre: "2026-10-25", plazas: 30, estado: "Activa" },
    { id: 2, curso: "Lenguajes de programación: JavaScript y C#", fechaInicio: "2026-11-05", fechaCierre: "2026-11-30", plazas: 25, estado: "Próximamente" }
];

let cursos = JSON.parse(localStorage.getItem('cursos')) || [
    { id: 1, nombre: "Análisis de datos con herramientas de IA", descripcion: "Capacitación avanzada en modelos predictivos y análisis estadístico enfocado en toma de decisiones." },
    { id: 2, nombre: "Lenguajes de programación: JavaScript y C#", descripcion: "Fundamentos de lógica, desarrollo frontend interactivo y backend robusto orientado a objetos." }
];

// Instancias de Modales Bootstrap
let modalConvocatoriaBS = null;
let modalCursoBS = null;

//INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // Proteger vista para evaluadores/admins si existe la función
    if (typeof protegerVista === 'function') {
        protegerVista(['administrador', 'superadministrador']);
    }

    // Inicializar instancias de los modales de Bootstrap
    const elemModalConv = document.getElementById('modalConvocatoria');
    if (elemModalConv) {
        modalConvocatoriaBS = new bootstrap.Modal(elemModalConv, { backdrop: 'static' });
    }

    const elemModalCurso = document.getElementById('modalCurso');
    if (elemModalCurso) {
        modalCursoBS = new bootstrap.Modal(elemModalCurso, { backdrop: 'static' });
    }

    // Escuchar eventos de guardado (Submit de formularios)
    configurarFormularios();

    // Renderizar vistas
    renderizarTablaConvocatorias();
    renderizarCursos();
});

//LÓGICA DE CONVOCATORIAS
function renderizarTablaConvocatorias() {
    const tabla = document.getElementById('tablaConvocatorias');
    if (!tabla) return;
    tabla.innerHTML = '';

    if (convocatorias.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay convocatorias registradas</td></tr>`;
        return;
    }

    convocatorias.forEach(conv => {
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
                <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEdicionConvocatoria(${conv.id})"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarConvocatoria(${conv.id})"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tabla.appendChild(tr);
    });
}

function prepararCreacionConvocatoria() {
    const form = document.getElementById('formConvocatoria');
    if (form) form.reset();
    document.getElementById('convocatoriaId').value = '';
    document.getElementById('modalTituloConvocatoria').textContent = 'Nueva Convocatoria';
    
    if (modalConvocatoriaBS) modalConvocatoriaBS.show();
}

function prepararEdicionConvocatoria(id) {
    const conv = convocatorias.find(c => c.id === id);
    if (!conv) return;

    document.getElementById('convocatoriaId').value = conv.id;
    document.getElementById('cursoSelect').value = conv.curso;
    document.getElementById('fechaInicio').value = conv.fechaInicio;
    document.getElementById('fechaCierre').value = conv.fechaCierre;
    document.getElementById('numPlazas').value = conv.plazas;
    document.getElementById('estadoSelect').value = conv.estado;

    document.getElementById('modalTituloConvocatoria').textContent = 'Editar Convocatoria';
    if (modalConvocatoriaBS) modalConvocatoriaBS.show();
}

function eliminarConvocatoria(id) {
    if (confirm('¿Deseas eliminar esta convocatoria?')) {
        convocatorias = convocatorias.filter(c => c.id !== id);
        localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
        renderizarTablaConvocatorias();
    }
}

//LÓGICA DE CURSOS
function renderizarCursos() {
    const contenedor = document.getElementById('contenedorCursos');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (cursos.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center text-muted py-3"><p>No hay cursos registrados en el sistema.</p></div>`;
        return;
    }

    cursos.forEach(curso => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="card curso-card h-100 p-3 d-flex flex-column justify-content-between">
                <div>
                    <h5 class="card-title mb-2">${curso.nombre}</h5>
                    <p class="card-text mb-3">${curso.descripcion}</p>
                </div>
                <div class="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button class="btn btn-sm btn-outline-primary" onclick="prepararEdicionCurso(${curso.id})"><i class="bi bi-pencil-square"></i> Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarCurso(${curso.id})"><i class="bi bi-trash"></i> Eliminar</button>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
}

function prepararCreacionCurso() {
    const form = document.getElementById('formCurso');
    if (form) form.reset();
    document.getElementById('cursoId').value = '';
    document.getElementById('modalCursoTitulo').textContent = 'Nuevo Curso';

    if (modalCursoBS) modalCursoBS.show();
}

function prepararEdicionCurso(id) {
    const curso = cursos.find(c => c.id === id);
    if (!curso) return;

    document.getElementById('cursoId').value = curso.id;
    document.getElementById('nombreCurso').value = curso.nombre;
    document.getElementById('descCurso').value = curso.descripcion;

    document.getElementById('modalCursoTitulo').textContent = 'Editar Curso';
    if (modalCursoBS) modalCursoBS.show();
}

function eliminarCurso(id) {
    if (confirm('¿Deseas eliminar este curso?')) {
        cursos = cursos.filter(c => c.id !== id);
        localStorage.setItem('cursos', JSON.stringify(cursos));
        renderizarCursos();
    }
}

//SUBMIT DE FORMULARIOS
function configurarFormularios() {
    const formConv = document.getElementById('formConvocatoria');
    if (formConv) {
        formConv.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('convocatoriaId').value;
            const nuevaData = {
                id: id ? parseInt(id) : Date.now(),
                curso: document.getElementById('cursoSelect').value,
                fechaInicio: document.getElementById('fechaInicio').value,
                fechaCierre: document.getElementById('fechaCierre').value,
                plazas: parseInt(document.getElementById('numPlazas').value),
                estado: document.getElementById('estadoSelect').value
            };

            if (id) {
                convocatorias = convocatorias.map(c => c.id === parseInt(id) ? nuevaData : c);
            } else {
                convocatorias.push(nuevaData);
            }

            localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
            renderizarTablaConvocatorias();
            if (modalConvocatoriaBS) modalConvocatoriaBS.hide();
        });
    }

    const formCur = document.getElementById('formCurso');
    if (formCur) {
        formCur.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('cursoId').value;
            const nuevoCurso = {
                id: id ? parseInt(id) : Date.now(),
                nombre: document.getElementById('nombreCurso').value,
                descripcion: document.getElementById('descCurso').value
            };

            if (id) {
                cursos = cursos.map(c => c.id === parseInt(id) ? nuevoCurso : c);
            } else {
                cursos.push(nuevoCurso);
            }

            localStorage.setItem('cursos', JSON.stringify(cursos));
            renderizarCursos();
            if (modalCursoBS) modalCursoBS.hide();
        });
    }
}