// Referencias a instancias globales de Chart.js para permitir su actualización
let chartFlujoInstance = null;
let chartEstadosInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    //Protege la vista solo para administradores / evaluadores
    if (typeof protegerVista === 'function') {
        protegerVista(['administrador', 'superadministrador']);
    }

    //Carga las métricas, tabla y gráficas con datos reales
    cargarDashboardReal();
});

function cargarDashboardReal() {
    // Obtener la lista de usuarios desde localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Filtrar únicamente a los participantes/aspirantes (rol: "usuario")
    const aspirantes = usuarios.filter(u => u.rol === 'usuario');

    // -------------------------------------------------------------
    //CÁLCULO DE KPIs REALES
    // -------------------------------------------------------------
    const total = aspirantes.length;
    const revision = aspirantes.filter(a => a.estado === 'En revisión').length;
    const entrevistados = aspirantes.filter(a => a.estado === 'Entrevistado').length;
    const seleccionados = aspirantes.filter(a => a.estado === 'Aprobado' || a.estado === 'Seleccionado').length;
    const rechazados = aspirantes.filter(a => a.estado === 'Rechazado').length;

    // Actualizar badges en el DOM
    if (document.getElementById('kpi-total')) document.getElementById('kpi-total').innerText = total;
    if (document.getElementById('kpi-revision')) document.getElementById('kpi-revision').innerText = revision;
    if (document.getElementById('kpi-entrevistados')) document.getElementById('kpi-entrevistados').innerText = entrevistados;
    if (document.getElementById('kpi-seleccionados')) document.getElementById('kpi-seleccionados').innerText = seleccionados;
    if (document.getElementById('kpi-rechazados')) document.getElementById('kpi-rechazados').innerText = rechazados;

    // -------------------------------------------------------------
    // TABLA DE SOLICITUDES
    // -------------------------------------------------------------
    const tbody = document.getElementById('tablaSolicitudesBody');
    if (tbody) {
        tbody.innerHTML = '';

        if (aspirantes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        No hay aspirantes registrados actualmente en el sistema.
                    </td>
                </tr>`;
        } else {
            aspirantes.forEach(asp => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="fw-semibold">${asp.nombre || 'Sin nombre'}</td>
                    <td>${asp.cursoInteres || 'General'}</td>
                    <td><span class="status status-${(asp.estado || 'postulado').toLowerCase().replace(' ', '')}">${asp.estado || 'Postulado'}</span></td>
                    <td>
                        <small class="text-muted">
                            CV: ${asp.cvAdjuntado ? 'Adjunto' : 'Pendiente'} | 
                            Vídeo: ${asp.videoAdjuntado ? 'Adjunto' : 'Pendiente'}
                        </small>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="evaluarAspirante('${asp.id}')">
                            Evaluar
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    }

    // -------------------------------------------------------------
    //GRÁFICAS DE CHART.JS CON DATOS DINÁMICOS
    // -------------------------------------------------------------
    renderizarGraficasReales(aspirantes, total, revision, entrevistados, seleccionados, rechazados);
}

function renderizarGraficasReales(aspirantes, total, revision, entrevistados, seleccionados, rechazados) {
    // 1. Gráfica 1: Flujo de Solicitudes por Mes (se calcula analizando la fechaRegistro de cada aspirante)
    const ctxFlujo = document.getElementById('flujoSolicitudes');
    if (ctxFlujo) {
        // Agrupar registros reales por mes (Enero a Diciembre)
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const conteoPorMes = new Array(12).fill(0);

        aspirantes.forEach(asp => {
            if (asp.fechaRegistro) {
                const fecha = new Date(asp.fechaRegistro);
                const mesIndex = fecha.getMonth(); // 0 = Ene, 11 = Dic
                if (mesIndex >= 0 && mesIndex < 12) {
                    conteoPorMes[mesIndex]++;
                }
            } else {
                // Si no tiene fecha especificada, se contabiliza en el mes actual
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
                    label: 'Postulaciones registradas',
                    data: conteoPorMes,
                    borderColor: '#0d5cab',
                    backgroundColor: 'rgba(13, 92, 171, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 } // Solo números enteros
                    }
                }
            }
        });
    }

    //Gráfica 2: Distribución por Estados
    const ctxEstados = document.getElementById('estadosAspirantes');
    if (ctxEstados) {
        // Si no hay registros aún, se contabiliza 0 en todo
        const postuladosSolo = aspirantes.filter(a => a.estado === 'Postulado' || !a.estado).length;

        if (chartEstadosInstance) chartEstadosInstance.destroy();

        chartEstadosInstance = new Chart(ctxEstados, {
            type: 'doughnut',
            data: {
                labels: ['En revisión', 'Entrevistados', 'Seleccionados', 'Rechazados'],
                datasets: [{
                    data: [revision, entrevistados, seleccionados, rechazados],
                    backgroundColor: ['#6b7280', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function evaluarAspirante(id) {
    alert(`Evaluación rápida para el aspirante ID: ${id}`);
}