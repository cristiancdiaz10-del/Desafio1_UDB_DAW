
import Swal from "sweetalert2";

/**
 * Muestra una notificación de operación exitosa.
 */
export function mostrarExito(
  titulo = "Operación realizada",
  texto = ""
) {
  return Swal.fire({
    icon: "success",
    title: titulo,
    text: texto,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#198754"
  });
}

/**
 * Muestra una notificación de error.
 */
export function mostrarError(
  titulo = "Ocurrió un error",
  texto = ""
) {
  return Swal.fire({
    icon: "error",
    title: titulo,
    text: texto,
    confirmButtonText: "Entendido",
    confirmButtonColor: "#dc3545"
  });
}

/**
 * Solicita confirmación antes de eliminar un registro.
 * Retorna true si el usuario confirma; false en caso contrario.
 */
export async function confirmarEliminacion(
  elemento = "este registro"
) {
  const resultado = await Swal.fire({
    title: "¿Eliminar registro?",
    text: `Se eliminará ${elemento}. Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d"
  });

  return resultado.isConfirmed;
}

/**
 * Solicita confirmación para aprobar un aspirante.
 */
export async function confirmarAprobacion(
  aspirante = "este aspirante"
) {
  const resultado = await Swal.fire({
    title: "¿Aprobar aspirante?",
    text: `Se aprobará a ${aspirante}.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, aprobar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#198754",
    cancelButtonColor: "#6c757d"
  });

  return resultado.isConfirmed;
}

/**
 * Solicita confirmación para rechazar un aspirante.
 */
export async function confirmarRechazo(
  aspirante = "este aspirante"
) {
  const resultado = await Swal.fire({
    title: "¿Rechazar aspirante?",
    text: `Se rechazará a ${aspirante}.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, rechazar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d"
  });

  return resultado.isConfirmed;
}
