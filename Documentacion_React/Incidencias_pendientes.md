# Incidencias pendientes para la siguiente fase

Detectadas mediante pruebas manuales en la versión React con el aspirante de demostración jose paz. El equipo indicó que ambas se atenderán en la siguiente fase. La causa técnica requiere revisión; el texto de un aviso no demuestra dónde se encuentra el defecto.

## I01 Apertura del CV desde el perfil administrativo

Pasos: iniciar sesión como aspirante, adjuntar un PDF válido, enviar y comprobar CV enviado. Luego iniciar sesión administrativa, abrir el perfil del mismo aspirante y pulsar Ver CV.

Resultado observado: aparece CV registrado y el aviso de que no se almacena la ruta para abrirlo. No se abre el documento.

Resultado esperado: recuperar el archivo correspondiente al aspirante desde el almacenamiento implementado y permitir su consulta. Si falta el archivo, mostrar un aviso específico.

Evidencia: [captura del aviso](evidencias/cv_incidencia.png).

Criterio de cierre: abrir el PDF correcto desde el perfil administrativo, también después de recargar y cambiar de sesión dentro del mismo origen y navegador. Comprobar que otro aspirante no reciba el documento equivocado y que un adjunto ausente se informe correctamente.

## I02 Reproducción del video desde el perfil administrativo

Pasos: adjuntar y enviar un video admitido desde el portal del aspirante. Con la cuenta administrativa, abrir su perfil y pulsar Reproducir video.

Resultado observado: aparece Vídeo registrado y el aviso de que no se almacena la ruta para abrirlo. No se reproduce el archivo.

Resultado esperado: recuperar el video del aspirante y permitir su reproducción o informar un error concreto de formato o ausencia de archivo.

Evidencia: [captura del aviso](evidencias/video_incidencia.png).

Criterio de cierre: reproducir el archivo correcto después de recargar y cambiar de sesión. Verificar asignación al aspirante y tratamiento de archivos ausentes o incompatibles.

## Revisión sugerida

El portal implementa almacenamiento de archivos en IndexedDB. Revisar la conexión del perfil con ese servicio antes de atribuir el problema a una ruta faltante. Las confirmaciones de entrega y las banderas de adjunto no garantizan que la consulta administrativa funcione.

## Observaciones adicionales

- El panel cuenta Aprobado como Seleccionado aunque el expediente muestra etapa 3. Validar con el equipo la correspondencia de estados.
- Vite advierte sobre el tamaño del JavaScript principal. La compilación termina correctamente; optimización pendiente.
