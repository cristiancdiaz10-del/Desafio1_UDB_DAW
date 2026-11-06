 function Indicadores({ aspirantes }) {
  const estados = aspirantes.map((a) =>
    (a.estado || "Postulado").trim().toLowerCase()
  );

  const contar = (opciones) =>
    estados.filter((estado) => opciones.includes(estado)).length;

  const indicadores = [
    {
      titulo: "Total Postulados",
      valor: aspirantes.length,
      id: "kpi-total",
    },
    {
      titulo: "En Revisión",
      valor: contar(["en revisión", "en revision"]),
      id: "kpi-revision",
    },
    {
      titulo: "Entrevistados",
      valor: contar(["entrevistado", "en entrevista"]),
      id: "kpi-entrevistados",
    },
    {
      titulo: "Seleccionados",
      valor: contar(["aprobado", "seleccionado", "seleccionado/a"]),
      id: "kpi-seleccionados",
    },
    {
      titulo: "No seleccionados",
      valor: contar(["rechazado", "no seleccionado", "no seleccionado/a"]),
      id: "kpi-rechazados",
    },
  ];

  return (
    <section className="kpi-grid">
      {indicadores.map((indicador) => (
        <article className="kpi-card" key={indicador.id}>
          <h3>{indicador.titulo}</h3>
          <p className="kpi-number" id={indicador.id}>
            {indicador.valor}
          </p>
        </article>
      ))}
    </section>
  );
}

export default Indicadores;