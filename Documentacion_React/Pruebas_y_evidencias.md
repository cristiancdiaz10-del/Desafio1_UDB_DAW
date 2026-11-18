# ProTalento Plan de pruebas y evidencias

Base revisada: `integracion-fase-2`, commit `6d8fc88`. Responsable de registro: César Ramírez. Fecha de ejecución y navegador: completar al probar. Usar una sesión de navegador dedicada con datos ficticios; no borrar el almacenamiento habitual del equipo.

## Criterios de registro

Estados admitidos: pendiente, aprobado, fallido y bloqueado. Anotar resultado observado, fecha, responsable y evidencia. Revisar código no equivale a aprobar el caso. Actualización: compilación aprobada mediante evidencia aportada por el usuario; pruebas manuales confirmadas durante la revisión. Las filas no actualizadas siguen pendientes.

## Preparación

1. Actualizar la rama personal con `git fetch origin` y `git merge origin/integracion-fase-2`.
2. Entrar en `daw-react`, instalar con `npm ci` y registrar `node -v` y `npm -v`.
3. Ejecutar `npm run build`, `npm run lint` y `npm run dev`; conservar salidas y códigos de finalización. Distinguir errores de compilación de observaciones de estilo.
4. Abrir una sesión dedicada; crear un curso y una convocatoria con fechas coherentes para disponer de datos de prueba.
5. Preparar un PDF pequeño, un video compatible y archivos que excedan los límites admitidos.

## Matriz funcional

| ID | Caso y pasos | Resultado esperado | Estado |
|---|---|---|---|
| P01 | Abrir inicio, login y registro | Las tres rutas públicas muestran contenido sin errores | Parcial: registro y login comprobados |
| P02 | Abrir `/PanelControl` sin sesión | Redirección a `/Login` | Aprobado en InPrivate |
| P03 | Iniciar sesión administrativa y luego cerrar | Acceso al panel; después del cierre las rutas privadas piden sesión | Pendiente |
| P04 | Introducir credenciales incorrectas | Mensaje de error sin crear sesión válida | Pendiente |
| P05 | Con sesión de aspirante abrir convocatorias | Redirección al portal del aspirante | Aprobado por confirmación del usuario |
| P06 | Abrir registro con conexión | Carga de departamentos y finalización del estado de espera | Aprobado con captura |
| P07 | Seleccionar departamento, municipio y distrito; cambiar departamento | Opciones coherentes y limpieza de selecciones dependientes | Aprobado por captura y confirmación |
| P08 | Bloquear solo la petición geográfica y recargar registro | Aviso de error y selector geográfico bloqueado; sin caída de pantalla | Aprobado; recuperación confirmada |
| P09 | Simular HTTP 500 y luego JSON sin departamentos | Ambos fallos se informan y termina el indicador de carga | Pendiente en interfaz; probado en servicio simulado |
| P10 | Enviar registro válido de prueba | Registro guardado y posibilidad de iniciar sesión como aspirante | Aprobado por confirmación y listado |
| P11 | Repetir correo y documento; enviar contraseña o identificación inválida | Rechazo de cada entrada según la regla implementada | Pendiente |
| P12 | Cambiar nacimiento entre mayor y menor de edad | Campo de documento correspondiente y validación coherente | Pendiente |
| P13 | Crear, editar y eliminar curso no asociado | Tabla y persistencia reflejan las operaciones confirmadas | Parcial: creación confirmada; eliminación pendiente |
| P14 | Crear convocatoria con fechas invertidas y luego válidas | Rechazo del rango inválido; guardado del válido | Parcial: guardado y restricción del calendario confirmados |
| P15 | Intentar eliminar un curso usado | Aplicación respeta su regla de relación y comunica el resultado | Pendiente |
| P16 | Buscar aspirante y combinar filtros de curso y estado | Tabla coherente; al limpiar se restaura la colección | Aprobado por confirmación del usuario |
| P17 | Comparar indicadores y gráficas con los registros | Totales de la colección general correctos | Observado; equivalencia Aprobado/Seleccionado por validar |
| P18 | Exportar resultados filtrados a CSV y Excel | Archivos abiertos y filas coincidentes con la tabla filtrada | Parcial: ambos abren; CSV contrastado en captura; filtro exportado pendiente |
| P19 | Descargar perfil PDF de un aspirante | Documento legible con datos del aspirante elegido | Aprobado mediante revisión del PDF generado |
| P20 | Abrir perfil, guardar calificación y programación; recargar | Evaluación y fecha se recuperan sin mezclarse con otro aspirante | Aprobado: calificaciones, comentarios y fecha persistentes |
| P21 | Avanzar etapas y registrar resultado final | Portal y perfil reflejan el estado del mismo expediente | Pendiente |
| P22 | Subir CV y video válidos y recargar | Archivos recuperables y estado de entrega persistente | Parcial: entrega registrada; consulta administrativa fallida |
| P23 | Seleccionar formato o tamaño no permitido | Aviso claro; no se sustituye una entrega válida por un archivo inválido | Pendiente |
| P24 | Cancelar una eliminación y un cierre de sesión | Datos y sesión se conservan | Pendiente |
| P25 | Actualizar datos desde otra pestaña y desde el botón del panel | Panel refleja cambios conforme al mecanismo de actualización | Pendiente |
| P26 | Abrir ruta inexistente y recargar una ruta válida | Redirección definida; documentar si el alojamiento admite rutas SPA | Pendiente |
| P27 | Repetir registro, evaluación y archivos en la versión migrada | Se conservan las funciones del avance anterior en el mismo entorno de prueba | Pendiente |

Para P09 se necesita una sustitución controlada de la respuesta en un entorno de pruebas. No modificar el servicio externo. Si no se dispone de ese mecanismo, marcar el caso como pendiente y describir el límite.

## Registro de ejecución

Copiar este registro por cada caso:

- ID:
- Commit y fecha:
- Responsable y navegador:
- Datos de prueba:
- Resultado observado:
- Estado:
- Archivo de evidencia:
- Incidencia y corrección, si aplica:

## Capturas para el informe

| Figura | Archivo sugerido | Evidencia |
|---|---|---|
| 1 | `01_estructura_react.png` | Árbol de páginas, componentes y servicios |
| 2 | `02_registro_domicilio.png` | Departamento, municipio y distrito relacionados |
| 3 | `03_error_api.png` | Mensaje de error por fallo de la petición |
| 4 | `04_panel_indicadores.png` | Panel con registros y totales comprobados |
| 5 | `05_panel_filtrado.png` | Filtro y resultados visibles |
| 6 | `06_convocatoria.png` | Curso y convocatoria guardados |
| 7 | `07_evaluacion.png` | Evaluación persistida |
| 8 | `08_portal_archivos.png` | Entrega y avance del aspirante |

Las capturas deben proceder de la aplicación ejecutada. Añadir pie de figura con caso de prueba, resultado y explicación; no usar maquetas como prueba de funcionamiento.

## Verificación de la entrega

- [ ] Rama y commit finales identificados.
- [ ] Instalación y compilación comprobadas.
- [ ] API y módulos principales probados.
- [ ] Resultados reales incorporados a la matriz.
- [ ] PDF con citas, referencias APA 7 y capturas legibles.
- [ ] Portada completada y revisada por el equipo.
- [ ] Repositorio accesible para el docente.
- [ ] Video reproducible por enlace y duración máxima de 15 minutos.
- [ ] Enlaces de GitHub y video más PDF preparados para Aula Digital.
- [ ] Fecha límite comprobada: 8 de noviembre de 2026 a las 11:50 p. m.

## Incidencias confirmadas

I01: Ver CV reconoce el adjunto pero no abre el PDF. I02: Reproducir video reconoce el adjunto pero no reproduce el archivo. No se consideran aprobadas por el hecho de que el portal confirme su entrega.

Compilación: Vite 8.3.6, 254 módulos, construcción terminada. Advertencia de fragmento JavaScript superior a 500 kB; optimización pendiente.
