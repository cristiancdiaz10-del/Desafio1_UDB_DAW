# Documentación del segundo avance de ProTalento

Aporte de César Ramírez: investigación técnica, pruebas, evidencias y preparación del video. Código base revisado: `6d8fc88` de `integracion-fase-2`. Las pruebas manuales y la compilación se documentaron con resultados y capturas aportados durante la revisión.

## Archivos

- [Documento técnico PDF](ProTalento_documento_tecnico.pdf).
- [Fuente editable del documento](ProTalento_documento_tecnico.md).
- [Matriz de pruebas y evidencias](Pruebas_y_evidencias.md).
- [Resultados de doce pruebas de servicios](Resultados_servicios.md).
- [Guion del video de 13 minutos y 30 segundos](Guion_video.md).
- [Capturas de las pruebas](evidencias/).
- [Incidencias pendientes para la siguiente fase](Incidencias_pendientes.md).

## Validación

La compilación `npm.cmd run build`, ejecutada dentro de `daw-react`, finalizó correctamente con 254 módulos transformados. Se registró una advertencia por el tamaño del JavaScript principal. La matriz distingue las pruebas confirmadas de las parciales y pendientes; no todos los casos planificados se ejecutaron.

Para repetir las pruebas de servicios desde la raíz del repositorio:

```bash
node documentacion/pruebas/verificar-servicios.mjs
```

Estas pruebas utilizan almacenamiento en memoria y respuestas de red simuladas. No sustituyen las pruebas de navegador, IndexedDB o disponibilidad de la fuente geográfica. El comando actualiza `Resultados_servicios.md`.

## Pendientes de entrega

- Grabar y revisar el video siguiendo el guion; duración máxima de 15 minutos.
- Incorporar su enlace cuando exista y verificar acceso sin sesión.
- Integrar esta carpeta a la rama que entregará el grupo.
- Adjuntar en Aula Digital el PDF y los enlaces de GitHub y del video.

La apertura del CV y la reproducción del video desde el perfil administrativo quedan documentadas para la siguiente fase. No se presentan como funciones completas.
