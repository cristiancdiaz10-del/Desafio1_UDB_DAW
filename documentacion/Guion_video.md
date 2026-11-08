# ProTalento Guion para la demostración

Duración objetivo: 13 minutos y 30 segundos. Margen restante: 1 minuto y 30 segundos. Guion actualizado con las pruebas manuales realizadas. No hace falta asignar narradores en el documento: César puede narrar la demostración o el equipo puede repartir los bloques. Ensayar una vez con cronómetro.

## Preparación

Ejecutar React desde `daw-react` y mantener abierta su terminal. Usar el aspirante jose paz y el curso redes, ya disponibles en la ventana habitual. Tener a mano su contraseña sin mostrarla ni decirla en voz alta. Preparar pestañas con registro, panel, aspirantes, convocatorias y perfil; usar la misma sesión del navegador. Una ventana InPrivate sirve únicamente para comprobar el acceso sin sesión: no comparte los usuarios locales de la ventana habitual.

Abrir el PDF técnico actualizado, la ficha PDF del aspirante y los reportes CSV y Excel. Tener listos `App.jsx`, `PanelControl.jsx`, `RegistroAspirantes.jsx` y `utilidades_js/validaciones.js` en VS Code. Abrir allí la carpeta de ProTalento para que la grabación no muestre el proyecto ajeno de GYMELITE. Verificar que la petición geográfica esté desbloqueada antes de empezar.

Hacer una grabación de prueba de 20 segundos: comprobar micrófono y legibilidad, reproducirla y después iniciar la toma completa. Evitar mostrar conversaciones, contraseñas o archivos ajenos al proyecto. No borrar los datos de prueba existentes. Si CV y video no se corrigen antes de grabar, mantener la explicación de sus limitaciones en este guion.

## 00 00 a 00 40 Presentación

Pantalla: inicio de ProTalento.

Narración: «Presentamos el segundo avance de ProTalento, una plataforma para gestionar el registro, la evaluación y la selección de aspirantes a formación técnica. En esta entrega mostramos la migración a React, la organización de componentes y el consumo de información geográfica externa».

## 00 40 a 02 00 Arquitectura

Pantalla: estructura de `daw-react/src`, `App.jsx` y componentes del panel.

Narración: «La versión anterior utilizaba páginas HTML independientes. La aplicación actual se monta desde main.jsx y define sus rutas en App.jsx. Las páginas contienen la presentación; los servicios agrupan operaciones de datos. El panel está dividido en indicadores, filtros, tabla y gráficas. RutaProtegida comprueba la sesión y los roles para decidir qué pantalla mostrar».

Acción: señalar archivos concretos, sin recorrer todo el código.

## 02 00 a 04 15 Registro y datos externos

Pantalla: registro con datos ficticios y selección territorial.

Narración: «El registro consulta un recurso JSON externo de El Salvador. La función obtenerDomicilio verifica la respuesta HTTP y la colección de departamentos. Al elegir un departamento se actualizan los municipios, y al elegir un municipio se actualizan los distritos. Si cambia la selección superior, se limpian los campos dependientes».

Acción: seleccionar los tres niveles y cambiar departamento. Mostrar la petición de red si aporta claridad. Enseñar brevemente el error de carga bloqueando solo esa petición; restaurar la conexión y recargar al terminar.

Narración: «El componente distingue la carga del error y muestra el resultado en pantalla. Estos datos forman parte del domicilio del aspirante; están integrados al proceso de registro».

## 04 15 a 05 20 Sesiones y roles

Pantalla: login y una ruta protegida.

Acción: en InPrivate, abrir `/PanelControl` sin sesión y mostrar la redirección a Login. Volver a la ventana habitual, iniciar sesión como jose paz y abrir `/Convocatorias`: mostrar la redirección al portal del aspirante. Después volver a la cuenta administrativa para continuar.

Narración: «La aplicación distingue aspirantes y usuarios administrativos. El prototipo conserva la sesión en el navegador. El control de rutas organiza el acceso a la interfaz; una versión de producción requeriría validación también en un servidor».

## 05 20 a 07 20 Estado y componentes del panel

Pantalla: panel con datos comprobados y luego fragmento de `PanelControl.jsx`.

Acción: mostrar al aspirante en la tabla. Buscar `NoExiste` y limpiar la búsqueda. Seleccionar No seleccionados y luego Limpiar filtros. Mostrar brevemente los estados y las propiedades de los componentes en `PanelControl.jsx`. No afirmar que Aprobado equivale a selección final: esa correspondencia del indicador debe revisarse con el equipo.

Narración: «PanelControl mantiene la búsqueda y los filtros con useState. Comparte datos y funciones con los componentes hijos mediante propiedades. La tabla recibe el resultado filtrado, mientras los indicadores y las gráficas representan el conjunto general. useMemo conserva el cálculo del filtrado mientras no cambian sus dependencias».

## 07 20 a 08 40 Cursos y convocatorias

Pantalla: convocatorias.

Acción: editar la convocatoria de redes y cambiar las plazas a un valor positivo distinto del actual; guardar y recargar. Abrir de nuevo la edición para mostrar que el calendario impide elegir un cierre anterior al inicio. Cancelar esa segunda edición. No hace falta crear otro curso ni eliminar el que usa el aspirante.

Narración: «Este módulo conserva la gestión de cursos y convocatorias. Los formularios actualizan el estado y los servicios realizan las operaciones de persistencia. Verificamos que los datos se recuperen al recargar».

## 08 40 a 10 30 Evaluación y portal

Pantalla: perfil de un candidato y portal del mismo aspirante.

Acción: mostrar las tres calificaciones de 4 estrellas, promedio 4.00/5, observaciones y fecha guardados. Recargar y seleccionar al mismo aspirante para mostrar su recuperación. Mostrar el portal con CV y video enviados. Luego, en el perfil administrativo, mostrar brevemente los avisos de Ver CV y Reproducir video, si siguen presentes.

Narración: «La evaluación queda asociada al aspirante. Comprobamos que calificaciones, observaciones y fecha se conservan al recargar. El portal registra la entrega de CV y video y utiliza IndexedDB para los archivos. Detectamos dos limitaciones en el perfil administrativo: reconoce los adjuntos, pero todavía no permite abrir el CV ni reproducir el video. La consulta de archivos queda pendiente de corrección y nueva prueba».

## 10 30 a 11 30 Exportaciones

Pantalla: tabla filtrada y archivos generados.

Acción: desde Aspirantes descargar CSV y Excel y mostrar que ambos abren. En CSV señalar jose paz, redes, Aprobado y los indicadores de documentos. El estado documental debe coincidir con el momento de la exportación; generar reportes nuevos si cambió. Desde el panel descargar la ficha PDF y abrirla.

Narración: «Se verificaron las descargas CSV y Excel y su apertura. El reporte CSV organiza los datos en columnas. La ficha PDF corresponde al aspirante elegido e incluye información personal, domicilio, curso, estado y documentos registrados. Esta ficha administrativa es distinta del CV adjunto».

## 11 30 a 12 40 Pruebas y resultados

Pantalla: matriz completada y capturas reales.

Acción: mostrar la matriz y el resultado de compilación ya obtenido. No es necesario repetir la instalación durante el video.

Narración: «Las pruebas manuales comprobaron registro, búsqueda, filtros, persistencia de evaluación, programación, exportaciones, edición de convocatorias y restricciones de acceso. En la API probamos carga, dependencia entre selecciones, error y recuperación. Además pasaron doce pruebas de lógica con almacenamiento en memoria y red simulada; estas se distinguen de las pruebas del navegador. La compilación de producción terminó correctamente con 254 módulos transformados. Vite advirtió sobre el tamaño del archivo JavaScript principal, lo que queda como mejora de optimización. La matriz distingue resultados confirmados, pruebas parciales e incidencias pendientes».

## 12 40 a 13 30 Conclusión y entregables

Pantalla: repositorio y documento técnico.

Narración: «ProTalento incorpora React con rutas, componentes y manejo de estado, e integra datos geográficos externos en el registro. El documento técnico explica la implementación y presenta evidencia de las pruebas. Las prioridades pendientes son completar la consulta administrativa de adjuntos, revisar la correspondencia de estados y optimizar el tamaño de la aplicación. La entrega incluye el repositorio, el enlace de este video y el PDF con referencias».

## Control de grabación

- Confirmar que la narración coincide con lo que aparece en pantalla.
- Mantener textos y cursor legibles y audio comprensible.
- Detener la grabación antes de los 15 minutos.
- Reproducir el archivo completo antes de compartirlo.
- Probar el enlace sin depender de la sesión de quien lo subió.
- Actualizar la matriz y el PDF si la versión grabada cambia.

## Orden de trabajo para grabar

1. Preparar pestañas y archivos según la sección Preparación.
2. Ensayar los bloques una vez; reservar las explicaciones más largas para arquitectura, estado y API.
3. Grabar la prueba de audio y pantalla de 20 segundos.
4. Grabar siguiendo los tiempos del guion. Si se hace por segmentos, unirlos en el mismo orden y comprobar la duración final.
5. Reproducir el video completo: comprobar sonido, texto, transiciones y coincidencia entre narración y resultados.
6. Guardar el archivo final en MP4 y subirlo al servicio que acuerde el grupo. La guía exige un enlace, no un proveedor particular.
7. Abrir el enlace en InPrivate y comprobar que el docente pueda reproducirlo sin solicitar acceso.
8. Entregar en Aula Digital el enlace de GitHub, el enlace del video y el PDF. El video sigue pendiente hasta que esté grabado y su enlace verificado.
