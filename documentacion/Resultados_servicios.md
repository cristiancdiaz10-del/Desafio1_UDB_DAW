# ProTalento Resultados de pruebas de servicios

Base: commit `6d8fc88`. Ejecución en Node.js con almacenamiento en memoria y respuestas de red simuladas. Estas pruebas no validan la interfaz, IndexedDB ni la disponibilidad real del servicio externo.

| ID | Comprobación | Resultado |
|---|---|---|
| S01 | Rechazar fecha inexistente y fecha futura | Aprobado |
| S02 | Validar estructura de DUI y NIT | Aprobado |
| S03 | Exigir complejidad de contraseña | Aprobado |
| S04 | Normalizar correo y documento | Aprobado |
| S05 | Crear cuentas iniciales sin duplicarlas | Aprobado |
| S06 | Rechazar contraseña incorrecta | Aprobado |
| S07 | Crear sesión administrativa y comprobar rol | Aprobado |
| S08 | Cerrar sesión | Aprobado |
| S09 | Aceptar respuesta geográfica válida simulada | Aprobado |
| S10 | Rechazar error HTTP simulado | Aprobado |
| S11 | Rechazar formato geográfico inválido simulado | Aprobado |
| S12 | Propagar fallo de red simulado | Aprobado |

Este archivo solo informa pruebas de servicios. Consultar Pruebas_y_evidencias.md para la compilación y las pruebas manuales del navegador.
