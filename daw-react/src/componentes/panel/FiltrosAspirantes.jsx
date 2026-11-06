function FiltrosAspirantes({
  aspirantes,
  filtroCurso,
  setFiltroCurso,
  filtroEstado,
  setFiltroEstado,
}) {
  const cursos = [
    ...new Set(
      aspirantes
        .map((a) => a.cursoInteres || a.curso)
        .filter((curso) => typeof curso === "string" && curso.trim())
        .map((curso) => curso.trim())
    ),
  ].sort();

  return (
    <div className="d-flex flex-wrap align-items-center gap-3">
      <div className="d-flex align-items-center gap-2">
        <label htmlFor="filtroCurso" className="form-label mb-0">
          Curso:
        </label>

        <select
          id="filtroCurso"
          className="form-select form-select-sm"
          style={{ width: "190px" }}
          value={filtroCurso}
          onChange={(e) => setFiltroCurso(e.target.value)}
        >
          <option value="todos">Todos los cursos</option>

          {cursos.map((curso) => (
            <option key={curso} value={curso}>
              {curso}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex align-items-center gap-2">
        <label htmlFor="filtroEstado" className="form-label mb-0">
          Estado:
        </label>

        <select
          id="filtroEstado"
          className="form-select form-select-sm"
          style={{ width: "190px" }}
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="Postulado">Postulados</option>
          <option value="En revisión">En revisión</option>
          <option value="Entrevistados">Entrevistados</option>
          <option value="Seleccionados">Seleccionados</option>
          <option value="No seleccionados">No seleccionados</option>
        </select>
      </div>
    </div>
  );
}

export default FiltrosAspirantes;