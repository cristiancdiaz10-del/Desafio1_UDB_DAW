import { useMemo } from "react";
import { obtenerIndicadores } from "../../servicios_js/panel-control.js";

function Indicadores({ aspirantes = [] }) {
  const datos = useMemo(
    () => obtenerIndicadores(aspirantes),
    [aspirantes]
  );

  const indicadores = [
    {
      titulo: "Total Postulados",
      valor: datos.total,
      id: "kpi-total",
    },
    {
      titulo: "En Revisión",
      valor: datos.revision,
      id: "kpi-revision",
    },
    {
      titulo: "Entrevistados",
      valor: datos.entrevistados,
      id: "kpi-entrevistados",
    },
    {
      titulo: "Seleccionados",
      valor: datos.seleccionados,
      id: "kpi-seleccionados",
    },
    {
      titulo: "No seleccionados",
      valor: datos.rechazados,
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