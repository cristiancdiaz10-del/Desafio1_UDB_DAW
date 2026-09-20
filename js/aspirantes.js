// Lógica de Aspirantes

document.addEventListener('DOMContentLoaded', () => {

    if (typeof protegerVista === 'function') {
        protegerVista(['administrador', 'superadministrador', 'evaluador']);
    }

    const usuarioActual =
        JSON.parse(localStorage.getItem('usuarioActual'));

    if (usuarioActual) {
        document.getElementById('lbl-admin-sidebar').innerText =
            usuarioActual.nombreCompleto;

        document.getElementById('lbl-admin-topbar').innerText =
            usuarioActual.nombreCompleto;
    }

    cargarAspirantes();

    document.getElementById('inputBuscarAspirante')
        .addEventListener('input', cargarAspirantes);
});


function cargarAspirantes() {

    const usuarios =
        JSON.parse(localStorage.getItem('usuarios')) || [];

    const texto =
        document.getElementById('inputBuscarAspirante').value
        .toLowerCase()
        .trim();

    const aspirantes = usuarios.filter(asp =>
        asp.rol === 'usuario' &&
        (
            (asp.nombreCompleto || '').toLowerCase().includes(texto) ||
            (asp.email || '').toLowerCase().includes(texto)
        )
    );

    const tbody =
        document.getElementById('tablaAspirantesBody');

    tbody.innerHTML = '';

    if (aspirantes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    No hay aspirantes registrados.
                </td>
            </tr>`;
        return;
    }

    aspirantes.forEach(asp => {

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td class="fw-semibold">
                ${asp.nombreCompleto || 'Sin nombre'}
            </td>

            <td>
                ${asp.curso || 'Sin curso'}
            </td>

            <td>
                ${asp.estado || 'Postulado'}
            </td>

            <td>
                <small class="text-muted">
                    CV: ${asp.cvAdjuntado ? 'Adjunto' : 'Pendiente'} |
                    Vídeo: ${asp.videoAdjuntado ? 'Adjunto' : 'Pendiente'}
                </small>
            </td>

            <td>
                <button
                    class="btn btn-sm btn-outline-primary"
                    onclick="evaluarAspirante('${asp.email}')">
                    Evaluar
                </button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}


function evaluarAspirante(email) {

    const usuarios =
        JSON.parse(localStorage.getItem('usuarios')) || [];

    const aspirante =
        usuarios.find(u => u.email === email);

    if (!aspirante) {
        alert('No se encontró el aspirante.');
        return;
    }

    localStorage.setItem(
        'aspiranteEvaluar',
        JSON.stringify(aspirante)
    );

    window.location.href =
        'páginas/evaluaciones.html';
}