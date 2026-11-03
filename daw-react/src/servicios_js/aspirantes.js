// Lógica de Aspirantes

document.addEventListener('DOMContentLoaded', () => {

    // Proteger la vista para los roles autorizados.
    if (typeof protegerVista === 'function') {
        const accesoPermitido = protegerVista([
            'administrador',
            'superadministrador',
            'evaluador'
        ]);

        if (!accesoPermitido) return;
    }

    // Obtener los datos de la sesión activa.
    let sesion;

    try {
        sesion = JSON.parse(localStorage.getItem('sesion'));
    } catch (error) {
        sesion = null;
    }

    if (!sesion) return;

    // Mostrar el nombre del usuario en los encabezados.
    const nombreUsuario =
        sesion.nombreCompleto || sesion.nombre || 'Usuario';

    const lblAdminSidebar =
        document.getElementById('lbl-admin-sidebar');

    const lblAdminTopbar =
        document.getElementById('lbl-admin-topbar');

    const lblUsuario =
        document.getElementById('lbl-usuario');

    if (lblAdminSidebar) {
        lblAdminSidebar.innerText = nombreUsuario;
    }

    if (lblAdminTopbar || lblUsuario) {
        (lblAdminTopbar || lblUsuario).innerText = nombreUsuario;
    }

    // Cargar la tabla y activar el buscador.
    cargarAspirantes();

    const inputBuscar =
        document.getElementById('inputBuscarAspirante');

    if (inputBuscar) {
        inputBuscar.addEventListener('input', cargarAspirantes);
    }
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
    
    // 2. Redirigir a la vista de evaluaciones
    window.location.href = "perfil-candidato.html";
}

// Función auxiliar para exportar CSV por si se requiere externamente
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
// Función auxiliar para exportar XLSX por si se requiere externamente.
    function exportarExcelParticipantes() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const aspirantes = usuarios.filter(u => u.rol === 'usuario');

    if (aspirantes.length === 0) {
        alert('No hay aspirantes registrados para exportar.');
        return;
    }

    const datos = aspirantes.map(asp => ({
        Nombre: asp.nombreCompleto || asp.nombre || 'Sin nombre',
        Correo: asp.email || '',
        Curso: asp.cursoInteres || asp.curso || 'General',
        Estado: asp.estado || 'Postulado',
        CV: asp.cvAdjuntado ? 'Adjunto' : 'Pendiente',
        Video: asp.videoAdjuntado ? 'Adjunto' : 'Pendiente'
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, 'Aspirantes');

    XLSX.writeFile(libro, 'reporte_aspirantes_protalento.xlsx');
}