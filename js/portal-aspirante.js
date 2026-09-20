//Lógica del Portal del Aspirante

document.addEventListener('DOMContentLoaded', () => {
    //Protege la vista: Solo rol 'usuario' o admins
    if (typeof protegerVista === 'function') {
        protegerVista(['usuario', 'administrador', 'superadministrador']);
    }

    //Obtener datos de la sesión activa
    const sesion = JSON.parse(localStorage.getItem('sesion'));
    if (!sesion) return;

    // Actualizar nombre en el encabezado
    const lblUsuario = document.getElementById('lbl-usuario');
    if (lblUsuario) {
        lblUsuario.innerText = `Bienvenido, ${sesion.nombre}`;
    }

    //Cargar expediente del aspirante desde localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const perfil = usuarios.find(u => u.email === sesion.email || u.id === sesion.id);

    if (perfil) {
        renderizarProgreso(perfil.etapaActual || 2);

        // Mostrar resultado final del proceso
        if (perfil.resultadoFinal) {
            const alerta = document.getElementById('alerta-portal');

            if (alerta) {
                alerta.innerText = perfil.resultadoFinal === 'Seleccionado/a'
                    ? '¡Felicidades! Has sido seleccionado/a.'
                    : 'Tu proceso ha finalizado. No has sido seleccionado/a.';

                alerta.classList.remove('d-none');
            }
        }
    }
});


// Guardar PDF en IndexedDB
function guardarPDF(email, archivo) {

    return new Promise((resolve, reject) => {

        const solicitud = indexedDB.open('ProTalentoDB', 1);

        solicitud.onupgradeneeded = (evento) => {

            const db = evento.target.result;

            if (!db.objectStoreNames.contains('curriculums')) {
                db.createObjectStore('curriculums', {
                    keyPath: 'email'
                });
            }
        };

        solicitud.onsuccess = () => {

            const db = solicitud.result;

            const transaccion =
                db.transaction('curriculums', 'readwrite');

            const store =
                transaccion.objectStore('curriculums');

            store.put({
                email: email,
                nombreArchivo: archivo.name,
                tipoArchivo: archivo.type,
                tamano: archivo.size,
                fecha: new Date().toISOString(),
                archivo: archivo
            });

            transaccion.oncomplete = () => {
                db.close();
                resolve();
            };

            transaccion.onerror = () => {
                db.close();
                reject(transaccion.error);
            };
        };

        solicitud.onerror = () => {
            reject(solicitud.error);
        };
    });
}


// Mostrar archivo PDF seleccionado
function mostrarArchivoCV(input) {

    const archivo = input.files[0];

    if (!archivo) return;

    if (archivo.type !== 'application/pdf') {

        alert('El currículum debe estar en formato PDF.');

        input.value = '';

        return;
    }

    if (archivo.size > 5 * 1024 * 1024) {

        alert('El currículum no puede superar los 5 MB.');

        input.value = '';

        return;
    }

    alert(`Archivo PDF seleccionado correctamente: ${archivo.name}`);
}


// Mostrar archivo de vídeo seleccionado
function mostrarArchivoVideo(input) {

    const archivo = input.files[0];

    if (!archivo) return;

    const nombre = archivo.name.toLowerCase();

    if (
        !nombre.endsWith('.mp4') &&
        !nombre.endsWith('.mov')
    ) {

        alert('El vídeo debe estar en formato MP4 o MOV.');

        input.value = '';

        return;
    }

    if (archivo.size > 50 * 1024 * 1024) {

        alert('El vídeo no puede superar los 50 MB.');

        input.value = '';

        return;
    }

    alert(`Archivo de vídeo seleccionado correctamente: ${archivo.name}`);
}


// Guardar archivos (Etapa 2 - CV y Vídeo)
async function guardarEntregaEtapa2(evento, tipo) {

    if (evento) evento.preventDefault();

    const alerta = document.getElementById('alerta-portal');

    const sesion = JSON.parse(localStorage.getItem('sesion'));
    if (!sesion) return;

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(u => u.email === sesion.email || u.id === sesion.id);

    if (index !== -1) {

        // Guardar CV
        if (tipo === 'cv') {

            const inputCV =
                document.getElementById('inputCV');

            const archivo =
                inputCV ? inputCV.files[0] : null;

            if (!archivo) {

                alert(
                    'Debes seleccionar tu currículum en PDF antes de enviarlo.'
                );

                return;
            }

            if (archivo.type !== 'application/pdf') {

                alert(
                    'El currículum debe estar en formato PDF.'
                );

                return;
            }

            if (archivo.size > 5 * 1024 * 1024) {

                alert(
                    'El currículum no puede superar los 5 MB.'
                );

                return;
            }

            try {

                await guardarPDF(
                    sesion.email,
                    archivo
                );

            } catch (error) {

                console.error(
                    'Error al guardar el PDF:',
                    error
                );

                alert(
                    'No se pudo guardar el currículum.'
                );

                return;
            }

            usuarios[index].cvAdjuntado = true;
        }


        // Guardar vídeo
        if (tipo === 'video') {

            const inputVideo =
                document.getElementById('inputVideo');

            const archivo =
                inputVideo ? inputVideo.files[0] : null;

            if (!archivo) {

                alert(
                    'Debes seleccionar un vídeo antes de enviarlo.'
                );

                return;
            }

            const nombre =
                archivo.name.toLowerCase();

            if (
                !nombre.endsWith('.mp4') &&
                !nombre.endsWith('.mov')
            ) {

                alert(
                    'El vídeo debe estar en formato MP4 o MOV.'
                );

                return;
            }

            if (archivo.size > 50 * 1024 * 1024) {

                alert(
                    'El vídeo no puede superar los 50 MB.'
                );

                return;
            }

            usuarios[index].videoAdjuntado = true;
        }


        // Si adjuntó ambos, avanza a Etapa 3 (Validación)
        if (usuarios[index].cvAdjuntado && usuarios[index].videoAdjuntado) {
            usuarios[index].etapaActual = 2;
            usuarios[index].estado = 'En revisión';
            renderizarProgreso(2);
        }


        localStorage.setItem(
            'usuarios',
            JSON.stringify(usuarios)
        );


        if (alerta) {
            alerta.innerText = `¡${tipo.toUpperCase()} enviado con éxito! Tu expediente ha sido actualizado.`;
            alerta.className = "alert alert-success text-center rounded-3 mb-4 d-block";
        }
    }
}


// Renderizar el progreso en la interfaz
function renderizarProgreso(etapaActual) {

    // Mantener indicador de MAIN
    const indicador = document.getElementById('indicador-etapa');

    if (indicador) {
        indicador.innerText = `Etapa ${etapaActual} de 6`;
    }


    // Actualizar los pasos visuales
    const pasos = document.querySelectorAll('.step-badge');

    pasos.forEach((paso, index) => {

        const numeroEtapa = index + 1;
        const contenedor = paso.parentElement;
        const etiqueta = contenedor.querySelector('.badge');

        // Etapas completadas
        if (numeroEtapa < etapaActual) {

            paso.className =
                'step-badge bg-primary text-white mx-auto shadow-sm';

            paso.innerText = '✓';

            if (etiqueta) {
                etiqueta.className =
                    'badge bg-primary mt-2 rounded-pill px-3 py-1';

                etiqueta.innerText =
                    obtenerNombreEtapa(numeroEtapa);
            }
        }

        // Etapa actual
        else if (numeroEtapa === etapaActual) {

            paso.className =
                'step-badge bg-white border border-primary text-primary mx-auto shadow-sm';

            paso.innerText = numeroEtapa;

            if (etiqueta) {
                etiqueta.className =
                    'badge bg-primary mt-2 rounded-pill px-3 py-1';

                etiqueta.innerText =
                    obtenerNombreEtapa(numeroEtapa);
            }
        }

        // Etapas pendientes
        else {

            paso.className =
                'step-badge bg-secondary-subtle text-secondary mx-auto';

            paso.innerText = numeroEtapa;

            if (etiqueta) {
                etiqueta.className =
                    'badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1';

                etiqueta.innerText =
                    obtenerNombreEtapa(numeroEtapa);
            }
        }
    });


    // Actualizar línea de progreso
    const lineaProgreso =
        document.getElementById('linea-progreso');

    if (lineaProgreso) {

        const porcentaje =
            ((etapaActual - 1) / 5) * 100;

        lineaProgreso.style.width =
            `${porcentaje}%`;
    }
}


// Obtener nombre de cada etapa
function obtenerNombreEtapa(numeroEtapa) {

    const etapas = [
        'Registro',
        'Envío CV y Vídeo',
        'Validación',
        'Entrevista Virtual',
        'Pruebas Psicométricas',
        'Prueba Técnica'
    ];

    return etapas[numeroEtapa - 1];
}
