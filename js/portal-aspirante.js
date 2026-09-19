// js/portal-aspirante.js - Lógica del Portal del Aspirante

document.addEventListener('DOMContentLoaded', () => {
    // 1. Proteger la vista: Solo rol 'usuario' o admins
    if (typeof protegerVista === 'function') {
        protegerVista(['usuario', 'administrador', 'superadministrador']);
    }

    // 2. Obtener datos de la sesión activa
    const sesion = JSON.parse(localStorage.getItem('sesion'));
    if (!sesion) return;

    // Actualizar nombre en el encabezado
    const lblUsuario = document.getElementById('lbl-usuario');
    if (lblUsuario) {
        lblUsuario.innerText = `Bienvenido, ${sesion.nombre}`;
    }

    // 3. Cargar expediente del aspirante desde localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const perfil = usuarios.find(u => u.email === sesion.email || u.id === sesion.id);

    if (perfil) {
        renderizarProgreso(perfil.etapaActual || 2);
    }
});

// Guardar archivos (Etapa 2 - CV y Vídeo)
function guardarEntregaEtapa2(evento, tipo) {
    if (evento) evento.preventDefault();
    const alerta = document.getElementById('alerta-portal');

    const sesion = JSON.parse(localStorage.getItem('sesion'));
    if (!sesion) return;

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(u => u.email === sesion.email || u.id === sesion.id);

    if (index !== -1) {
        if (tipo === 'cv') usuarios[index].cvAdjuntado = true;
        if (tipo === 'video') usuarios[index].videoAdjuntado = true;

        // Si adjuntó ambos, avanza a Etapa 3 (Validación)
        if (usuarios[index].cvAdjuntado && usuarios[index].videoAdjuntado) {
            usuarios[index].etapaActual = 3;
            usuarios[index].estado = 'En revisión';
            renderizarProgreso(3);
        }

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        if (alerta) {
            alerta.innerText = `¡${tipo.toUpperCase()} enviado con éxito! Tu expediente ha sido actualizado.`;
            alerta.className = "alert alert-success text-center rounded-3 mb-4 d-block";
        }
    }
}

// Renderizar el progreso en la interfaz
function renderizarProgreso(etapaActual) {
    const indicador = document.getElementById('indicador-etapa');
    if (indicador) {
        indicador.innerText = `Etapa ${etapaActual} de 6`;
    }
}