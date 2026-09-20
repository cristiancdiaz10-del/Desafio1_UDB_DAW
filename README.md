# Desafio1_UDB_DAW
ETAPA 2 - ENTREGA PARCIAL HTML/CSS/JS DEL PROYECTO DE CÁTEDRA:
PROTALENTO - PLATAFORMA PARA LA EVALUACIÓN Y SELECCIÓN DE ASPIRANTES A FORMACIÓN TÉCNICA DE LA AGENCIA INTERNACIONAL DE DESARROLLO LOCAL

INTEGRANTES DE EQUIPO A:
CAMPOS DÍAZ, CRISTIAN ALEXANDER CD261570
CHÁVEZ MENDOZA, LUIS ALBERTO CM250419
MEJÍA RIVERA, MANUEL DE JESUS MR260122
RAMÍREZ ROMERO, CÉSAR ELISEO RR261314
TINO ANAYA, CRYSTEL DANIELA TA261223

## Descripción técnica de la aplicación

La aplicación web desarrollada tiene como finalidad gestionar el proceso de registro, evaluación y selección de aspirantes a cursos de formación técnica. El sistema permite administrar usuarios, convocatorias y cursos, así como controlar las diferentes etapas del proceso de evaluación de los aspirantes.

### 1. Tecnologías utilizadas

La aplicación está desarrollada utilizando tecnologías web del lado del cliente:

* **HTML5:** utilizado para estructurar las diferentes interfaces y formularios de la aplicación.
* **CSS3:** utilizado para definir la presentación visual, distribución, estilos, colores y adaptación de los elementos de la interfaz.
* **JavaScript:** utilizado para implementar la lógica de negocio, validaciones, autenticación simulada, manejo de sesiones, interacción con formularios, actualización dinámica de información y gestión del flujo de evaluación.
* **Bootstrap:** utilizado como apoyo para el diseño de interfaces, componentes, formularios, botones, modales, tablas y diseño responsivo.
* **Bootstrap Icons:** utilizado para incorporar iconografía en diferentes elementos de la interfaz.
* **Chart.js:** utilizado para generar las gráficas estadísticas del panel de administración.
* **localStorage:** utilizado como mecanismo de almacenamiento persistente en el navegador para usuarios, sesiones, convocatorias, cursos, evaluaciones y estados del proceso.
* **IndexedDB:** utilizado para almacenar determinados archivos asociados al proceso del aspirante, como documentos curriculares.
* **API externa:** se consume un archivo JSON externo que contiene información geográfica de El Salvador para cargar dinámicamente los departamentos, municipios y distritos en el formulario de registro.

### 2. Arquitectura general

La aplicación utiliza una arquitectura basada en páginas HTML independientes, complementadas por archivos JavaScript que contienen la lógica correspondiente a cada módulo.

La lógica se encuentra separada de la estructura HTML mediante archivos `.js`, permitiendo que cada módulo tenga responsabilidades específicas. Entre los principales componentes se encuentran:

* **autenticaciones:** gestión del inicio y cierre de sesión y control de acceso según el rol.
* **validaciones:** captura y validación de la información personal y académica.
* **portal-aspirante:** consulta del estado del proceso y gestión de entregas correspondientes a las etapas.
* **panel-control:** visualización de indicadores, estadísticas y listado de aspirantes.
* **scriptConvocatorias:** administración de cursos y convocatorias.
* **aspirante:** selección de aspirantes, registro de criterios de evaluación, programación y resultados.
* **perfil-candidato:** consulta de información y avance del aspirante durante las etapas de selección.

### 3. Gestión de usuarios y roles

El sistema implementa un mecanismo de autenticación simulado mediante `localStorage`. Los usuarios se almacenan en una colección denominada `usuarios`, donde cada registro contiene información de identificación, credenciales y rol.

Se contemplan principalmente los siguientes roles:

* **Usuario:** corresponde al aspirante que se registra en la plataforma y consulta el estado de su proceso.
* **Administrador:** tiene acceso a las funciones administrativas y de gestión del proceso.
* **Superadministrador:** cuenta con acceso administrativo ampliado.

Al iniciar sesión, el sistema verifica el correo electrónico y la contraseña almacenados y, según el rol del usuario, redirige a la interfaz correspondiente.

La sesión activa se almacena mediante la clave `sesion` en `localStorage`. Las diferentes páginas verifican esta información para impedir el acceso a usuarios que no tengan el rol requerido.

### 4. Registro y validación de aspirantes

El formulario de registro permite almacenar información personal, académica, territorial y de contacto del aspirante.

Entre los datos registrados se encuentran:

* Nombre completo.
* Curso seleccionado.
* Sexo.
* Fecha de nacimiento.
* Departamento, municipio y distrito de residencia.
* DUI y NIT.
* Discapacidad.
* Nivel educativo.
* Situación actual.
* Acceso a Internet y computadora.
* Dominio de computadora.
* Vinculación laboral.
* Medio de contacto preferido.
* Números telefónicos.
* Correo electrónico.
* Contraseña.
* Consentimiento informado.

Antes de guardar la información se realizan diferentes validaciones. El formulario utiliza validaciones HTML mediante campos `required` y validaciones adicionales mediante JavaScript.

También se realizan comprobaciones para evitar registros duplicados utilizando documentos de identificación como DUI y NIT, normalizando previamente los valores para ignorar espacios y guiones.

Una vez validado el formulario, el nuevo aspirante se almacena en `localStorage` con el rol `usuario`.

### 5. Consumo de API para información geográfica

El formulario de registro utiliza una fuente de datos externa en formato JSON para obtener la división territorial de El Salvador.

La información se carga mediante `fetch()` y posteriormente se utiliza para llenar dinámicamente los campos:

**Departamento → Municipio → Distrito**

Los valores disponibles en los campos dependientes se actualizan según la selección realizada en el nivel anterior. Esto evita que el usuario tenga que escribir manualmente la información territorial y permite mantener una estructura de datos consistente.

### 6. Panel de administración

El panel de control permite visualizar información general sobre los aspirantes registrados.

Los principales indicadores calculados dinámicamente incluyen:

* Total de aspirantes.
* Aspirantes en revisión.
* Aspirantes entrevistados.
* Aspirantes seleccionados o aprobados.
* Aspirantes rechazados.

La información se obtiene directamente de los registros almacenados en `localStorage`.

El panel también incorpora un mecanismo de búsqueda que permite filtrar los aspirantes utilizando su nombre o correo electrónico.

### 7. Visualización estadística

Para facilitar la interpretación de la información, el panel utiliza **Chart.js** para generar representaciones gráficas.

Se incluye una gráfica de flujo de postulaciones que contabiliza los registros por mes y una gráfica de distribución de estados de los aspirantes.

Las gráficas se generan dinámicamente a partir de los datos almacenados en el navegador, por lo que su información cambia conforme se registran y actualizan aspirantes.

### 8. Gestión de cursos y convocatorias

El módulo de convocatorias permite administrar los cursos y las convocatorias disponibles.

Para los cursos se pueden registrar:

* Nombre.
* Descripción.

Para las convocatorias se gestionan:

* Curso asociado.
* Fecha de inicio.
* Fecha de cierre.
* Número de plazas.
* Estado de la convocatoria.

La información se almacena en `localStorage` mediante las colecciones `cursos` y `convocatorias`.

Los cursos registrados se cargan automáticamente en el selector utilizado para crear o editar convocatorias, manteniendo la relación entre ambos módulos.

### 9. Proceso de evaluación

El módulo de evaluación permite seleccionar un aspirante y consultar su información personal, académica y de contacto.

Desde el panel de control, al seleccionar la opción **Evaluar**, el sistema guarda temporalmente la información del aspirante seleccionado mediante la clave `aspiranteEvaluar` y posteriormente abre la interfaz de evaluación.

El módulo de evaluación permite valorar diferentes criterios mediante una escala de estrellas:

* Habilidades.
* Calidad del vídeo.
* Perfil académico.

A partir de estos valores se calcula un promedio de evaluación sobre una escala de 5 puntos.

También se pueden registrar observaciones y programar una fecha para la evaluación.

Las evaluaciones se almacenan en `localStorage` mediante la colección `evaluaciones`, asociando cada evaluación con el correo electrónico del aspirante.

### 10. Seguimiento de etapas

El sistema implementa un flujo de etapas para representar el avance del aspirante dentro del proceso de selección.

Las etapas contempladas son:

1. Registro.
2. CV y vídeo.
3. Validación.
4. Entrevista.
5. Psicométricas.
6. Técnica.

El avance se registra mediante propiedades como `etapaActual` y `estado` dentro del registro del aspirante.

Desde el módulo administrativo se pueden marcar determinadas etapas como completadas, permitiendo avanzar al aspirante hacia la siguiente fase.

### 11. Gestión de documentos y archivos

El portal del aspirante permite realizar entregas asociadas a determinadas etapas del proceso.

Para el currículum se implementa almacenamiento mediante **IndexedDB**, utilizando una base de datos denominada `ProTalentoDB` y un almacén denominado `curriculums`.

También se realizan validaciones sobre los archivos antes de almacenarlos. Por ejemplo, se controla el tamaño máximo permitido para el documento curricular y para el vídeo, además del formato permitido para el vídeo.

Una vez realizadas las entregas correspondientes, el sistema actualiza el estado del aspirante y puede avanzar a la siguiente etapa del proceso.

### 12. Resultado final

En la etapa técnica, el personal autorizado puede registrar el resultado final del proceso.

Se contemplan dos resultados:

* **Seleccionado**
* **No seleccionado**

El resultado se almacena en el registro correspondiente del aspirante mediante la propiedad `resultadoFinal`, acompañada de la actualización de su `estado`.

Posteriormente, el portal del aspirante puede consultar este resultado y mostrarlo al usuario.

### 13. Persistencia de datos

Debido a que la aplicación corresponde a un prototipo académico ejecutado principalmente en el navegador, la persistencia de información se realiza mediante mecanismos de almacenamiento del lado del cliente.

Se utilizan principalmente:

**localStorage**

Para almacenar información estructurada y de configuración, entre ella:

* Usuarios.
* Sesión activa.
* Convocatorias.
* Cursos.
* Evaluaciones.
* Programaciones de evaluación.
* Estado y avance de los aspirantes.
* Resultado final.

**IndexedDB**

Para almacenar información relacionada con archivos y documentos que requieren un mecanismo de almacenamiento más apropiado que `localStorage`.

Esta implementación permite mantener los datos durante diferentes sesiones en el mismo navegador, aunque no constituye una arquitectura de persistencia centralizada para múltiples usuarios.

### 14. Flujo general de funcionamiento

El flujo principal de la aplicación puede representarse de la siguiente manera:

**Registro del aspirante**

→ Validación de datos

→ Almacenamiento del usuario

→ Inicio de sesión

→ Acceso al portal del aspirante

→ Entrega de CV y vídeo

→ Validación

→ Evaluación

→ Entrevista

→ Evaluación psicométrica

→ Evaluación técnica

→ Resultado final

→ Consulta del resultado por parte del aspirante.

Paralelamente, el personal administrativo puede acceder al panel de control para consultar aspirantes, gestionar cursos y convocatorias, realizar evaluaciones y actualizar el avance de los candidatos.

### 15. Consideraciones técnicas

La aplicación corresponde a un **prototipo funcional de carácter académico**, por lo que la autenticación y persistencia de datos se realizan del lado del cliente.

El uso de `localStorage` permite simular el funcionamiento de una base de datos y de un sistema de sesiones durante la etapa de desarrollo, pero en un entorno de producción sería necesario sustituir este mecanismo por una arquitectura cliente-servidor con una base de datos y un sistema de autenticación seguro.

De igual manera, las contraseñas actualmente se almacenan en el navegador como parte del prototipo. En una implementación productiva deberían gestionarse mediante un servidor, utilizando almacenamiento seguro y técnicas de hash de contraseñas.

Por tanto, la implementación actual está orientada a demostrar la funcionalidad, navegación, lógica de negocio y flujo de trabajo del sistema dentro del contexto de la asignatura.