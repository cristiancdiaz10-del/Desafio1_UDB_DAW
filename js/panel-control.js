 // Referencias a instancias globales de Chart.js para permitir su actualización
let chartFlujoInstance = null;
let chartEstadosInstance = null;

// Variables globales para los filtros activos
let filtroEstadoActual = 'todos';
let filtroCursoActual = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    // Proteger la vista: Solo permite el acceso a Administradores o Evaluadores
    if (typeof protegerVista === 'function') {
        protegerVista(['administrador', 'superadministrador', 'evaluador']);
    }

    // Obtener datos de la sesión activa
    const sesion = JSON.parse(localStorage.getItem('sesion'));
    if (!sesion) return;

    // Actualizar el nombre en la barra superior (Topbar) y lateral
    const lblAdmin = document.getElementById('lbl-admin-topbar') || document.getElementById('lbl-usuario');
    if (lblAdmin) lblAdmin.innerText = sesion.nombre; 

    const lblSidebar = document.getElementById('lbl-admin-sidebar');
    if (lblSidebar) lblSidebar.innerText = sesion.nombre;

    // Cargar los cursos reales del localStorage en el selector desplegable
    poblarSelectorCursosDinamico();

    // Cargar dashboard inicial
    cargarDashboardReal();

    // 1. Buscador de aspirantes en tiempo real
    const buscador = document.getElementById('inputBuscarAspirante');
    if (buscador) {
        buscador.addEventListener('input', () => {
            cargarDashboardReal(buscador.value, filtroEstadoActual, filtroCursoActual);
        });
    }

    // 2. Filtro avanzado por Curso Técnico
    const selectCurso = document.getElementById('filtroCurso');
    if (selectCurso) {
        selectCurso.addEventListener('change', (e) => {
            filtroCursoActual = e.target.value;
            const textoBusqueda = buscador ? buscador.value : '';
            cargarDashboardReal(textoBusqueda, filtroEstadoActual, filtroCursoActual);
        });
    }

   
});

// Extraer automáticamente los cursos únicos de los aspirantes en localStorage
function poblarSelectorCursosDinamico() {
    const selectCurso = document.getElementById('filtroCurso');
    if (!selectCurso) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const aspirantes = usuarios.filter(u => u.rol === 'usuario');

    // Obtener cursos sin duplicados
    const cursosUnicos = new Set();
    aspirantes.forEach(asp => {
        const curso = asp.cursoInteres || asp.curso;
        if (curso && typeof curso === 'string' && curso.trim() !== '') {
            cursosUnicos.add(curso.trim());
        }
    });

    // Resetear manteniendo únicamente la opción por defecto
    selectCurso.innerHTML = '<option value="todos">Todos los cursos</option>';

    // Agregar dinámicamente cada curso detectado
    cursosUnicos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso;
        option.textContent = curso;
        selectCurso.appendChild(option);
    });
}

function cargarDashboardReal(busqueda = '', filtroEstado = 'todos', filtroCurso = 'todos') {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const aspirantes = usuarios.filter(u => u.rol === 'usuario');

    // CÁLCULO DE KPIs REALES
    const total = aspirantes.length;
    const revision = aspirantes.filter(a => a.estado === 'En revisión').length;
    const entrevistados = aspirantes.filter(a => a.estado === 'Entrevistado').length;
    const seleccionados = aspirantes.filter(a => a.estado === 'Aprobado' || a.estado === 'Seleccionado').length;
    const rechazados = aspirantes.filter(a => a.estado === 'Rechazado').length;

    if (document.getElementById('kpi-total')) document.getElementById('kpi-total').innerText = total;
    if (document.getElementById('kpi-revision')) document.getElementById('kpi-revision').innerText = revision;
    if (document.getElementById('kpi-entrevistados')) document.getElementById('kpi-entrevistados').innerText = entrevistados;
    if (document.getElementById('kpi-seleccionados')) document.getElementById('kpi-seleccionados').innerText = seleccionados;
    if (document.getElementById('kpi-rechazados')) document.getElementById('kpi-rechazados').innerText = rechazados;

    // TABLA DE SOLICITUDES (Triple Filtrado)
    const tbody = document.getElementById('tablaSolicitudesBody');

    if (tbody) {
        tbody.innerHTML = '';
        const texto = busqueda.toLowerCase().trim();

        const aspirantesFiltrados = aspirantes.filter(asp => {
            const cumpleTexto = (
                (asp.nombreCompleto || asp.nombre || '').toLowerCase().includes(texto) ||
                (asp.email || '').toLowerCase().includes(texto)
            );

            const estadoAsp = asp.estado || 'Postulado';
            let cumpleEstado = true;
            if (filtroEstado !== 'todos') {
                if (filtroEstado === 'Seleccionados') {
                    cumpleEstado = (estadoAsp === 'Aprobado' || estadoAsp === 'Seleccionado');
                } else {
                    cumpleEstado = (estadoAsp === filtroEstado);
                }
            }

            const cursoAsp = (asp.cursoInteres || asp.curso || 'General').trim();
            let cumpleCurso = true;
            if (filtroCurso !== 'todos') {
                cumpleCurso = (cursoAsp.toLowerCase() === filtroCurso.toLowerCase());
            }

            return cumpleTexto && cumpleEstado && cumpleCurso;
        });

        if (aspirantesFiltrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        No se encontraron aspirantes con los filtros aplicados.
                    </td>
                </tr>`;
        } else {
            aspirantesFiltrados.forEach(asp => {
                const tr = document.createElement('tr');
                const cursoFinal = asp.cursoInteres || asp.curso || 'General';

                tr.innerHTML = `
                    <td class="fw-semibold">${asp.nombre || asp.nombreCompleto || 'Sin nombre'}</td>
                    <td>${cursoFinal}</td>
                    <td><span class="status status-${(asp.estado || 'postulado').toLowerCase().replace(' ', '')}">${asp.estado || 'Postulado'}</span></td>
                    <td>
                        <small class="text-muted">
                            CV: ${asp.cvAdjuntado ? 'Adjunto' : 'Pendiente'} | 
                            Vídeo: ${asp.videoAdjuntado ? 'Adjunto' : 'Pendiente'}
                        </small>
                    </td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="evaluarAspirante('${asp.email}')">
                                Evaluar
                            </button>
                            <!-- Botón integrado de PDF que conecta con el módulo jsPDF de tu compañero -->
                            <button class="btn btn-sm btn-outline-success d-flex align-items-center gap-1" onclick="descargarPDF('${asp.email}')" title="Descargar PDF">
                                <i class="bi bi-file-earmark-pdf"></i> PDF
                            </button>
                        </div>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        }
    }

    renderizarGraficasReales(aspirantes, total, revision, entrevistados, seleccionados, rechazados);
}

function renderizarGraficasReales(aspirantes, total, revision, entrevistados, seleccionados, rechazados) {
    // 1. Gráfica de Flujo por Mes
    const ctxFlujo = document.getElementById('flujoSolicitudes');

    if (ctxFlujo) {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const conteoPorMes = new Array(12).fill(0);

        aspirantes.forEach(asp => {
            if (asp.fechaRegistro) {
                const fecha = new Date(asp.fechaRegistro);
                const mesIndex = fecha.getMonth();

                if (mesIndex >= 0 && mesIndex < 12) {
                    conteoPorMes[mesIndex]++;
                }
            } else {
                const mesActual = new Date().getMonth();
                conteoPorMes[mesActual]++;
            }
        });

        if (chartFlujoInstance) chartFlujoInstance.destroy();

        chartFlujoInstance = new Chart(ctxFlujo, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Postulaciones',
                    data: conteoPorMes,
                    borderColor: '#0d5cab',
                    backgroundColor: 'rgba(13, 92, 171, 0.1)',
                    borderWidth: 2.5,
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: '#0d5cab',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1000 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: 12 },
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.parsed.y} aspirantes registrados`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    // 2. Gráfica de Estados (Dona Interactiva)
    const ctxEstados = document.getElementById('estadosAspirantes');

    if (ctxEstados) {
        if (chartEstadosInstance) chartEstadosInstance.destroy();

        chartEstadosInstance = new Chart(ctxEstados, {
            type: 'doughnut',
            data: {
                labels: ['En revisión', 'Entrevistados', 'Seleccionados', 'Rechazados'],
                datasets: [{
                    data: [revision, entrevistados, seleccionados, rechazados],
                    backgroundColor: ['#6b7280', '#f59e0b', '#3b82f6', '#10b981'],
                    borderWidth: 2,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1000 },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 14,
                            font: { size: 12, weight: '500' }
                        },
                        onClick: function(e, legendItem, legend) {
                            const index = legendItem.index;
                            const labelClicked = legend.chart.data.labels[index];
                            
                            if (filtroEstadoActual === labelClicked) {
                                filtroEstadoActual = 'todos';
                            } else {
                                filtroEstadoActual = labelClicked;
                            }

                            const buscador = document.getElementById('inputBuscarAspirante');
                            const textoBusqueda = buscador ? buscador.value : '';
                            
                            cargarDashboardReal(textoBusqueda, filtroEstadoActual, filtroCursoActual);
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: 12 },
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed;
                                const totalDataset = context.dataset.data.reduce((a, b) => a + b, 0);
                                const porcentaje = totalDataset > 0 ? ((valor / totalDataset) * 100).toFixed(1) : 0;
                                return ` ${context.label}: ${valor} aspirantes (${porcentaje}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Función auxiliar para exportar CSV por si se requiere externamente, manteniendo tu lógica
function exportarCSVParticipantes() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const aspirantes = usuarios.filter(u => u.rol === 'usuario');

    if (aspirantes.length === 0) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('Aviso', 'No hay aspirantes registrados para exportar.', 'warning');
        } else {
            alert('No hay aspirantes registrados para exportar.');
        }
        return;
    }

    let csvContent = "Nombre,Correo,Curso,Estado\n";
    aspirantes.forEach(asp => {
        const nombre = `"${asp.nombre || asp.nombreCompleto || 'Sin nombre'}"`;
        const correo = `"${asp.email || ''}"`;
        const curso = `"${asp.cursoInteres || asp.curso || 'General'}"`;
        const estado = `"${asp.estado || 'Postulado'}"`;
        csvContent += `${nombre},${correo},${curso},${estado}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte_participantes_protalento.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function evaluarAspirante(email) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const aspirante = usuarios.find(u => u.email === email);

    if (!aspirante) {
        alert('No se encontró el aspirante.');
        return;
    }

    localStorage.setItem('aspiranteEvaluar', JSON.stringify(aspirante));
    window.location.href = 'páginas/evaluaciones.html';
}