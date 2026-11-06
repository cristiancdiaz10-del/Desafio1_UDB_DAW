 function TablaAspirantes({ aspirantes, onEvaluar, onDescargarPDF }) {
  return (
    <div className="table-responsive">
      <table className="requests-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Curso</th>
            <th>Estado</th>
            <th>Documentos</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {aspirantes.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-muted py-4">
                No se encontraron aspirantes con los filtros aplicados.
              </td>
            </tr>
          ) : (
            aspirantes.map((aspirante, index) => (
              <tr key={aspirante.id || aspirante.email || index}>
                <td className="fw-semibold">
                  {aspirante.nombreCompleto ||
                    aspirante.nombre ||
                    "Sin nombre"}
                </td>

                <td>
                  {aspirante.cursoInteres ||
                    aspirante.curso ||
                    "General"}
                </td>

                <td>
                  <span className="status">
                    {aspirante.estado || "Postulado"}
                  </span>
                </td>

                <td>
                  <small className="text-muted">
                    CV: {aspirante.cvAdjuntado ? "Adjunto" : "Pendiente"}
                    {" | "}
                    Vídeo: {aspirante.videoAdjuntado ? "Adjunto" : "Pendiente"}
                  </small>
                </td>

                <td>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEvaluar(aspirante)}
                    >
                      Evaluar
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={() => onDescargarPDF(aspirante)}
                    >
                      <i className="bi bi-file-earmark-pdf"></i> PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaAspirantes;