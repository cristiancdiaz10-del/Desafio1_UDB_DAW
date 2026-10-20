// Utilidades globales de SweetAlert2 para ProTalento

function mostrarExito(titulo = "Operación realizada", texto = "") {
  return Swal.fire({
    icon: "success",
    title: titulo,
    text: texto,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#198754"
  });
}

function mostrarError(titulo = "Ocurrió un error", texto = "") {
  return Swal.fire({
    icon: "error",
    title: titulo,
    text: texto,
    confirmButtonText: "Entendido",
    confirmButtonColor: "#dc3545"
  });
}

function confirmarEliminacion(elemento = "este registro") {
  return Swal.fire({
    title: "¿Eliminar registro?",
    text: `Se eliminará ${elemento}. Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d"
  }).then((resultado) => resultado.isConfirmed);
}

function confirmarAprobacion(aspirante = "este aspirante") {
  return Swal.fire({
    title: "¿Aprobar aspirante?",
    text: `Se aprobará a ${aspirante}.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, aprobar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#198754",
    cancelButtonColor: "#6c757d"
  }).then((resultado) => resultado.isConfirmed);
}

function confirmarRechazo(aspirante = "este aspirante") {
  return Swal.fire({
    title: "¿Rechazar aspirante?",
    text: `Se rechazará a ${aspirante}.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, rechazar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d"
  }).then((resultado) => resultado.isConfirmed);
}

window.mostrarExito = mostrarExito;
window.mostrarError = mostrarError;
window.confirmarEliminacion = confirmarEliminacion;
window.confirmarAprobacion = confirmarAprobacion;
window.confirmarRechazo = confirmarRechazo;