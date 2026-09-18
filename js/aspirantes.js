// aspirantes.js - Lógica del Portal del Aspirante (Unidad 2 - DAW)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Proteger la vista: Solo rol 'aspirante' (o admins para pruebas)
    protegerVista(['aspirante', 'admin', 'superadmin']);

    // 2. Obtener datos de la sesión activa
    const sesion = obtenerSesion();
    if (!sesion) return;

    // Actualizar nombre en el encabezado
    const lblUsuario = document.getElementById('lbl-usuario');
    if (lblUsuario) {
        lblUsuario.innerText = `Bienvenido, ${sesion.nombre}`;
    }

    // 3. Cargar expediente del aspirante desde localStorage
    const aspirantes = JSON.parse(localStorage.getItem('aspirantes_protalento')) || [];
    const perfil = aspirantes.find(a => a.id === sesion.id || a.correo === sesion.correo);

    if (perfil) {
        renderizarProgreso(perfil.etapaActual || 2);
    }
});

// Función para simular el envío de archivos (Etapa 2 - CV y Vídeo)
function guardarEntregaEtapa2(evento, tipo) {
    evento.preventDefault();
    const alerta = document.getElementById('alerta-portal');

    const sesion = obtenerSesion();
    let aspirantes = JSON.parse(localStorage.getItem('aspirantes_protalento')) || [];
    
    // Buscar y actualizar estado
    const index = aspirantes.findIndex(a => a.id === sesion.id || a.correo === sesion.correo);
    if (index !== -1) {
        if (tipo === 'cv') aspirantes[index].cvAdjuntado = true;
        if (tipo === 'video') aspirantes[index].videoAdjuntado = true;
        
        // Si adjuntó ambos, avanza a la etapa 3 (Validación)
        if (aspirantes[index].cvAdjuntado && aspirantes[index].videoAdjuntado) {
            aspirantes[index].etapaActual = 3;
            renderizarProgreso(3);
        }

        localStorage.setItem('aspirantes_protalento', JSON.stringify(aspirantes));

        if (alerta) {
            alerta.innerText = `¡${tipo.toUpperCase()} enviado con éxito! Tu expediente ha sido actualizado.`;
            alerta.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-green-100 text-green-800 block text-center shadow-sm";
        }
    }
}

// Actualización visual de los pasos de progreso
function renderizarProgreso(etapaActual) {
    const indicador = document.getElementById('indicador-etapa');
    if (indicador) {
        indicador.innerText = `Etapa ${etapaActual} de 6`;
    }
}